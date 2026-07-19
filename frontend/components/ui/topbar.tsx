"use client";

import React from "react";
import { Bell, LogOut, Settings, User, Menu } from "lucide-react";
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
import { Button } from "@/components/ui/button";
import { useSidebar } from "@/hooks/use-sidebar";

function getFormattedDate() {
  const now = new Date();
  return now.toLocaleDateString("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default function Topbar() {
  const { toggle } = useSidebar();
  const dateStr = getFormattedDate();

  return (
    <header className="h-16 bg-[#05402e] text-white flex items-center justify-between px-4 shadow-sm shrink-0">
      <div className="flex items-center gap-2">
        <span className="text-emerald-100/80 text-sm font-medium hidden sm:block">
          {dateStr}
        </span>
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          className="text-emerald-100/80 hover:bg-emerald-800/50 hover:text-white relative"
          aria-label="Notifications"
        >
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full ring-2 ring-[#05402e]" />
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger
            render={(props) => (
              <button
                {...props}
                className="flex items-center gap-2.5 bg-[#e8faf4]/15 hover:bg-[#e8faf4]/25 transition px-3 py-1.5 rounded-full border border-emerald-600/30 cursor-pointer outline-none"
              >
                <Avatar className="w-7 h-7">
                  <AvatarImage src="" alt="Ahmad Tahalu" />
                  <AvatarFallback className="bg-emerald-700 text-emerald-200 text-xs font-semibold">
                    AT
                  </AvatarFallback>
                </Avatar>

                <span className="hidden sm:block text-sm font-medium text-emerald-50">
                  Ahmad Tahalu
                </span>
              </button>
            )}
          />

          <DropdownMenuContent align="end" className="w-52">

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
