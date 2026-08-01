"use client";

import React, { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Loader2, LogOut, Settings, User } from "lucide-react";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useAuthStore } from "@/lib/useAuthStore";
import { apiFetch } from "@/lib/api";

const WaveIcon = () => (
  <span className="animate-wave text-xl leading-none">👋</span>
);

const pageTitles: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/produk": "Produk",
  "/pesanan": "Pesanan",
  "/transaksi": "Transaksi",
  "/data-panen": "Data Panen",
  "/chat": "Chat",
  "/feedback": "Feedback",
  "/insight": "Insight",
};

export default function Topbar() {
  const pathname = usePathname();
  const router = useRouter();
  const title = pageTitles[pathname] || "Dashboard";

  const user = useAuthStore((state) => state.user);
  const token = useAuthStore((state) => state.token);
  const clearAuth = useAuthStore((state) => state.clearAuth);

  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // Get initials for avatar fallback
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      // Panggil API logout untuk revoke token
      await apiFetch("/logout", {
        method: "POST",
        token: token ?? undefined,
      });
    } catch {
      // Tetap lanjutkan logout meski API gagal
    } finally {
      clearAuth();
      toast.success("Berhasil keluar, Sampai jumpa lagi!", {
        icon: <WaveIcon />,
        duration: 3000,
      });
      router.push("/login");
      setIsLoggingOut(false);
    }
  };

  // Format current date in Indonesian
  const today = new Date();
  const formattedDate = today.toLocaleDateString("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <>
      <header className="bg-[#1B4332] text-white ml-8 px-8 pt-6 pb-6 rounded-bl-[36px] flex items-start justify-between shrink-0 shadow-sm transition-all duration-300">
        <div>
          <span className="text-emerald-100/80 text-sm font-medium block mb-1 capitalize">
            {formattedDate}
          </span>
          <h1 className="text-3xl font-bold tracking-tight text-white font-sans">
            {title}
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <DropdownMenu>
            <DropdownMenuTrigger
              render={(props) => (
                <button
                  {...props}
                  className="flex items-center gap-2.5 bg-[#4c7766]/80 hover:bg-[#588774] transition px-3.5 py-1.5 rounded-full text-white cursor-pointer outline-none shadow-xs border border-emerald-600/30"
                >
                  <Avatar className="w-8 h-8 ring-1 ring-white/30">
                    <AvatarImage src="" alt={user?.name ?? "User"} />
                    <AvatarFallback className="bg-emerald-800 text-emerald-200 text-xs font-semibold">
                      {user ? getInitials(user.name) : "??"}
                    </AvatarFallback>
                  </Avatar>

                  <span className="text-sm font-semibold text-white tracking-wide">
                    {user?.name ?? "User"}
                  </span>
                </button>
              )}
            />

            <DropdownMenuContent align="end" className="w-52 mt-1">
              <DropdownMenuGroup>
                <DropdownMenuLabel>
                  <div className="flex flex-col">
                    <span className="font-semibold text-sm">
                      {user?.name ?? "User"}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {user?.email ?? ""}
                    </span>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="my-2" />
                <DropdownMenuItem>
                  <User className="w-4 h-4" />
                  Profil Saya
                </DropdownMenuItem>

                <DropdownMenuItem>
                  <Settings className="w-4 h-4" />
                  Pengaturan
                </DropdownMenuItem>
              </DropdownMenuGroup>

              <DropdownMenuSeparator />

              <DropdownMenuItem
                variant="destructive"
                onClick={() => setTimeout(() => setShowLogoutDialog(true), 100)}
              >
                <LogOut className="w-4 h-4" />
                Keluar
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      {/* Logout Confirmation Dialog */}
      <AlertDialog open={showLogoutDialog} onOpenChange={setShowLogoutDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Konfirmasi Keluar</AlertDialogTitle>
            <AlertDialogDescription>
              Apakah kamu yakin ingin keluar dari akun ini? Kamu perlu login kembali untuk mengakses dashboard.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isLoggingOut}>
              Batal
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="bg-red-600 hover:bg-red-700"
            >
              {isLoggingOut ? "Keluar..." : "Ya, Keluar"}
              {isLoggingOut && <Loader2 className="w-4 h-4 animate-spin" />}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
