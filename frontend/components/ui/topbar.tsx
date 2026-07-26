"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { LogOut, Settings, User } from "lucide-react";
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
  const title = pageTitles[pathname] || "Produk";

  return (
    <header className="bg-[#1B4332] text-white ml-8 px-8 pt-6 pb-6 rounded-bl-[36px] flex items-start justify-between shrink-0 shadow-sm transition-all duration-300">
      <div>
        <span className="text-emerald-100/80 text-sm font-medium block mb-1">
          Rabu, 15 April 2026
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
                  <AvatarImage
                    src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80"
                    alt="Ahmad Tahalu"
                  />
                  <AvatarFallback className="bg-emerald-800 text-emerald-200 text-xs font-semibold">
                    AT
                  </AvatarFallback>
                </Avatar>

                <span className="text-sm font-semibold text-white tracking-wide">
                  Ahmad Tahalu
                </span>
              </button>
            )}
          />

          <DropdownMenuContent align="end" className="w-52 mt-1">
            <DropdownMenuGroup>
              <DropdownMenuLabel>
                <div className="flex flex-col">
                  <span className="font-semibold text-sm">
                    Ahmad Tahalu
                  </span>
                  <span className="text-xs text-muted-foreground">
                    admin@harvesta.id
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

            <DropdownMenuItem variant="destructive">
              <LogOut className="w-4 h-4" />
              Keluar
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
