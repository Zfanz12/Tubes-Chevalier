"use client";

import React, { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Loader2, LogOut, Settings, User } from "lucide-react";
import { showToast } from "@/lib/custom-toast";
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
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/lib/useAuthStore";
import { apiFetch } from "@/lib/api";



const pageTitles: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/produk": "Produk",
  "/pesanan": "Pesanan",
  "/transaksi": "Transaksi",
  "/data-panen": "Data Panen",
  "/chat": "Chat",
  "/feedback": "Feedback",
  "/insight": "Insight",
  "/profile": "Profil Saya",
};

export default function Topbar() {
  const pathname = usePathname();
  const router = useRouter();
  const isProfile = pathname === "/profile";
  const title = pageTitles[pathname] || "Dashboard";

  // ── Auth state dari store (versi kita) ─────────────────────────────────
  const user = useAuthStore((state) => state.user);
  const token = useAuthStore((state) => state.token);
  const clearAuth = useAuthStore((state) => state.clearAuth);

  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // ── Reactive date pakai useEffect (versi teman — lebih aman untuk SSR) ─
  const [currentDate, setCurrentDate] = useState<string>("");
  React.useEffect(() => {
    const formatted = new Date().toLocaleDateString("id-ID", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });
    setCurrentDate(formatted);
  }, []);

  const getInitials = (name: string) =>
    name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await apiFetch("/logout", {
        method: "POST",
        token: token ?? undefined,
      });
    } catch {
      // Tetap lanjutkan logout meski API gagal
    } finally {
      clearAuth();
      showToast("Berhasil keluar, Sampai jumpa lagi!", "hello");
      router.push("/login");
      setIsLoggingOut(false);
    }
  };

  return (
    <>
      <header 
        className={`bg-[#1B4332] text-white ml-8 px-8 rounded-bl-[36px] flex items-start justify-between shrink-0 shadow-sm relative overflow-hidden transition-all duration-500 ease-in-out transform origin-top ${
          isProfile 
            ? "-translate-y-full opacity-0 max-h-0 py-0 border-none shadow-none pointer-events-none mb-0" 
            : "translate-y-0 opacity-100 max-h-48 pt-4 pb-4"
        }`}
      >
        {/* Low Poly Geometric Background (versi teman) */}
        <div className="absolute inset-0 pointer-events-none opacity-15">
          <svg
            className="w-full h-full object-cover"
            viewBox="0 0 1000 120"
            preserveAspectRatio="none"
          >
            <polygon points="0,0 250,0 150,80" fill="#2d5746" opacity="0.7" />
            <polygon points="250,0 500,0 400,100" fill="#40916c" opacity="0.5" />
            <polygon points="500,0 750,0 650,70" fill="#52b788" opacity="0.4" />
            <polygon points="750,0 1000,0 850,120" fill="#74c69d" opacity="0.3" />
            <polygon points="0,0 150,80 0,120" fill="#1b4332" opacity="0.8" />
            <polygon points="150,80 400,100 250,120 0,120" fill="#2d5746" opacity="0.6" />
            <polygon points="400,100 650,70 550,120 250,120" fill="#40916c" opacity="0.4" />
            <polygon points="650,70 850,120 1000,120 550,120" fill="#52b788" opacity="0.3" />
          </svg>
        </div>

        {/* Date & Page Title */}
        <div className="relative z-10">
          <span className="text-emerald-100/80 text-sm   font-medium block mb-1 capitalize drop-shadow-xs">
            {currentDate || "Memuat tanggal..."}
          </span>
          <h1 className="text-2xl font-bold tracking-tight text-white font-sans drop-shadow-xs">
            {title}
          </h1>
        </div>

        {/* User Dropdown */}
        <div className="flex items-center gap-3 relative z-10">
          <DropdownMenu>
            <DropdownMenuTrigger
              render={(props) => (
                <button
                  {...props}
                  className="flex items-center gap-2.5 bg-[#4c7766]/80 hover:bg-[#588774] transition px-3.5 py-1.5 rounded-full text-white cursor-pointer outline-none shadow-xs border border-emerald-600/30"
                >
                  <Avatar className="w-8 h-8 ring-1 ring-white/30">
                    <AvatarImage src={user?.avatar || ""} alt={user?.name ?? "User"} />
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
                    {/* <span className="text-xs text-muted-foreground">
                      {user?.email ?? ""}
                    </span> */}
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="my-2" />
                <DropdownMenuItem onClick={() => router.push("/profile")}>
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

      {/* Logout Confirmation Dialog (Matches Figma precisely) */}
      <Dialog open={showLogoutDialog} onOpenChange={setShowLogoutDialog}>
        <DialogContent className="sm:max-w-md bg-white rounded-3xl p-6 shadow-2xl border border-gray-100 text-center flex flex-col items-center">
          <div className="w-16 h-16 bg-[#fdd8d8] rounded-full flex items-center justify-center border-[1.5px] border-red-500 mb-3">
            {/* Custom Logout SVG resembling figma */}
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M15 4H5C4.44772 4 4 4.44772 4 5V19C4 19.5523 4.44772 20 5 20H15" stroke="#ff0000" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M11 12H20M20 12L16 8M20 12L16 16" stroke="#ff0000" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <DialogTitle className="text-lg font-bold text-gray-900 mb-1">Keluar dari Akun?</DialogTitle>
          <DialogDescription className="text-sm text-gray-500 mb-4 font-medium leading-relaxed max-w-[340px]">
            Tindakan ini akan membuat Anda keluar dari Harvesta
          </DialogDescription>
          
          <div className="flex w-full gap-3">
            <Button 
              variant="outline" 
              onClick={() => setShowLogoutDialog(false)}
              disabled={isLoggingOut}
              className="flex-1 rounded-xl h-11 bg-[#e2e2e2] border-transparent hover:bg-[#d1d1d1] text-gray-500 font-bold text-sm"
            >
              Batal
            </Button>
            <Button 
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="flex-1 rounded-xl h-11 bg-[#f00000] hover:bg-[#d00000] text-white font-bold text-sm"
            >
              {isLoggingOut ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : "Keluar"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
