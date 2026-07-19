"use client";

import React from "react";
import {
  LayoutDashboard,
  ShoppingBag,
  ReceiptText,
  BadgeCent,
  Sprout,
  BarChart3,
  TrendingUp,
  Leaf,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useSidebar } from "@/hooks/use-sidebar";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const menuItems = [
  { name: "Dashboard", icon: LayoutDashboard, active: true, href: "#" },
  { name: "Produk", icon: ShoppingBag, active: false, href: "#" },
  { name: "Pesanan", icon: ReceiptText, active: false, href: "#" },
  { name: "Transaksi", icon: BadgeCent, active: false, href: "#" },
  { name: "Data Panen", icon: Sprout, active: false, href: "#" },
  { name: "Laporan", icon: BarChart3, active: false, href: "#" },
  { name: "Insight", icon: TrendingUp, active: false, href: "#" },
];

export default function Sidebar() {
  const { isOpen, toggle } = useSidebar();

  return (
    <aside
      className={cn(
        "relative bg-[#023d2a] text-white flex flex-col min-h-screen transition-all duration-300 ease-in-out shrink-0",
        isOpen ? "w-64" : "w-16"
      )}
    >
      <div
        className={cn(
          "flex items-center border-b border-[#05573d] transition-all duration-300",
          isOpen ? "p-6 gap-3" : "p-4 justify-center"
        )}
      >
        <div className="p-2 bg-emerald-800 rounded-full text-emerald-400 shrink-0">
          <Leaf className="w-5 h-5" />
        </div>
        {isOpen && (
          <span className="text-xl font-bold tracking-wide whitespace-nowrap overflow-hidden">
            Harvesta
          </span>
        )}
      </div>

      <Button
        variant="ghost"
        size="icon"
        onClick={toggle}
        className="absolute -right-3.5 top-6 z-10 w-7 h-7 rounded-full bg-[#023d2a] border border-[#05573d] text-emerald-300 hover:bg-[#05573d] hover:text-white shadow-md"
        aria-label={isOpen ? "Collapse sidebar" : "Expand sidebar"}
      >
        {isOpen ? (
          <ChevronLeft className="w-3.5 h-3.5" />
        ) : (
          <ChevronRight className="w-3.5 h-3.5" />
        )}
      </Button>

      {/* Nav */}
      <nav className={cn("flex-1 py-5 space-y-1", isOpen ? "px-3" : "px-2")}>
        {menuItems.map((item) => {
          const Icon = item.icon;

          const linkClass = cn(
            "flex items-center gap-3 rounded-xl transition-all duration-200 text-sm font-medium w-full",
            isOpen ? "px-3 py-2.5" : "px-0 py-2.5 justify-center",
            item.active
              ? "bg-[#4e7565] text-white shadow-md shadow-[#023d2a]/50"
              : "text-emerald-100/70 hover:bg-[#05573d] hover:text-white"
          );

          if (!isOpen) {
            return (
              <Tooltip key={item.name}>
                <TooltipTrigger
                  render={
                    <a href={item.href} className={linkClass}>
                      <Icon className="w-5 h-5 shrink-0" />
                    </a>
                  }
                />
                <TooltipContent side="right" className="bg-[#023d2a] text-white border-[#05573d]">
                  {item.name}
                </TooltipContent>
              </Tooltip>
            );
          }

          return (
            <a key={item.name} href={item.href} className={linkClass}>
              <Icon className="w-5 h-5 shrink-0" />
              <span className="whitespace-nowrap overflow-hidden">{item.name}</span>
            </a>
          );
        })}
      </nav>

      <Separator className="bg-[#05573d]" />

      <div className={cn("py-4", isOpen ? "px-4" : "px-2 flex justify-center")}>
        {isOpen ? (
          <p className="text-emerald-100/40 text-xs text-center">
            Harvesta Admin v1.0
          </p>
        ) : (
          <Leaf className="w-4 h-4 text-emerald-100/30" />
        )}
      </div>
    </aside>
  );
}