"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutGrid,
  Sprout,
  ShoppingCart,
  CreditCard,
  ClipboardList,
  MessageCircle,
  Undo2,
  Lightbulb,
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
  { name: "Dashboard", icon: LayoutGrid, href: "/dashboard" },
  { name: "Produk", icon: Sprout, href: "/produk" },
  { name: "Pesanan", icon: ShoppingCart, href: "/pesanan", badge: "2" },
  { name: "Transaksi", icon: CreditCard, href: "/transaksi" },
  { name: "Data Panen", icon: ClipboardList, href: "/data-panen" },
  { name: "Chat", icon: MessageCircle, href: "/chat" },
  { name: "Feedback", icon: Undo2, href: "/feedback" },
  { name: "Insight", icon: Lightbulb, href: "/insight" },
];

export default function Sidebar() {
  const { isOpen, toggle } = useSidebar();
  const pathname = usePathname();

  return (
    <aside
      className={cn(
        "relative bg-[#1B4332] text-white flex flex-col min-h-screen transition-all duration-300 ease-in-out shrink-0 z-40",
        isOpen ? "w-60" : "w-16"
      )}
    >
      {/* Brand Header */}
      <div className="relative min-h-[140px] w-full overflow-hidden flex items-center justify-center pt-6 pb-6">
        {/* Full Logo (Expanded Mode) */}
        <div
          className={cn(
            "absolute inset-0 flex items-center justify-center px-4 transition-all duration-300 ease-in-out",
            isOpen
              ? "opacity-100 scale-100 pointer-events-auto delay-100"
              : "opacity-0 scale-90 pointer-events-none delay-0"
          )}
        >
          <Image
            src="/logo-harvesta.png"
            alt="Harvesta Logo"
            width={160}
            height={62}
            style={{ width: "auto" }}
            className="object-contain h-[80px] mt-4 mb-4"
            priority
          />
        </div>

        {/* Minimized Logo (Collapsed Mode) */}
        <div
          className={cn(
            "absolute inset-0 flex items-center justify-center transition-all duration-300 ease-in-out",
            !isOpen
              ? "opacity-100 scale-100 pointer-events-auto delay-150"
              : "opacity-0 scale-75 pointer-events-none delay-0"
          )}
        >
          <Image
            src="/logo-harvesta-mimized.png"
            alt="Harvesta Icon"
            width={44}
            height={44}
            className="object-contain h-11 w-11 mt-4 mb-4"
            priority
          />
        </div>
      </div>

      {/* Collapse / Expand Toggle Button */}
      <Button
        variant="ghost"
        size="icon"
        onClick={toggle}
        className="absolute -right-3.5 top-7 z-50 w-7 h-7 rounded-full bg-[#1B4332] border border-[#06543c] text-emerald-300 hover:bg-[#05573d] hover:text-white shadow-md cursor-pointer transition-transform duration-300"
        aria-label={isOpen ? "Collapse sidebar" : "Expand sidebar"}
      >
        {isOpen ? (
          <ChevronLeft className="w-3.5 h-3.5" />
        ) : (
          <ChevronRight className="w-3.5 h-3.5" />
        )}
      </Button>

      {/* Nav Items */}
      <nav className="flex-1 py-3 px-2 space-y-1.5 overflow-hidden">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            pathname === item.href ||
            (item.href === "/produk" && pathname?.startsWith("/produk"));

          const linkContent = (
            <Link
              href={item.href}
              className={cn(
                "flex items-center rounded-lg transition-all duration-300 ease-in-out text-sm font-medium w-full relative h-12 overflow-hidden",
                isOpen ? "px-3.5 justify-start" : "px-0 justify-center",
                isActive
                  ? "bg-[#658d7c] text-white"
                  : "text-emerald-100/90 hover:bg-[#2d5746] hover:text-white"
              )}
            >
              {/* Icon Container with relative position for collapsed badge */}
              <div className="relative flex items-center justify-center shrink-0">
                <Icon
                  className={cn(
                    "w-5 h-5 shrink-0 transition-all duration-300",
                    isActive ? "fill-current" : "fill-none"
                  )}
                />

                {/* Collapsed Badge (Overlaid on top-right of Icon to prevent cropping) */}
                {!isOpen && item.badge && (
                  <span
                    className={cn(
                      "absolute -top-1.5 -right-2 bg-red-600 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center border-2 shadow-sm z-20 transition-all duration-300",
                      isActive ? "border-[#658d7c]" : "border-[#1B4332]"
                    )}
                  >
                    {item.badge}
                  </span>
                )}
              </div>

              {/* Text Label with Smooth Opacity & Width Transition */}
              <span
                className={cn(
                  "whitespace-nowrap transition-all duration-300 ease-in-out overflow-hidden flex-1",
                  isOpen
                    ? "opacity-100 max-w-xs ml-3"
                    : "opacity-0 max-w-0 ml-0 pointer-events-none"
                )}
              >
                {item.name}
              </span>

              {/* Expanded Badge */}
              {isOpen && item.badge && (
                <span className="bg-red-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center shrink-0 ml-2 transition-all duration-300 ease-in-out">
                  {item.badge}
                </span>
              )}
            </Link>
          );

          return <React.Fragment key={item.name}>{linkContent}</React.Fragment>;
        })}
      </nav>

      <Separator className="bg-[#06543c]/50" />

      {/* Footer Version Info */}
      <div className="py-4 px-2 flex justify-center items-center h-12 transition-all duration-300 ease-in-out">
        <p
          className={cn(
            "text-emerald-100/40 text-xs text-center whitespace-nowrap transition-all duration-300 ease-in-out overflow-hidden",
            isOpen ? "opacity-100 max-w-full" : "opacity-0 max-w-0"
          )}
        >
          Harvesta Admin v1.0
        </p>
      </div>
    </aside>
  );
}