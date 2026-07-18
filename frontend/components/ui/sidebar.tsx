import React from "react";
import { 
  LayoutDashboard, 
  ShoppingBag, 
  ReceiptText, 
  BadgeCent, 
  Sprout, 
  BarChart3, 
  TrendingUp,
  Leaf
} from "lucide-react";

export default function Sidebar() {
  const menuItems = [
    { name: "Dashboard", icon: LayoutDashboard, active: true },
    { name: "Produk", icon: ShoppingBag, active: false },
    { name: "Pesanan", icon: ReceiptText, active: false },
    { name: "Transaksi", icon: BadgeCent, active: false },
    { name: "Data Panen", icon: Sprout, active: false },
    { name: "Laporan", icon: BarChart3, active: false },
    { name: "Insight", icon: TrendingUp, active: false },
  ];

  return (
    <aside className="w-64 bg-[#023d2a] text-white flex flex-col min-h-screen">
      <div className="p-8 flex flex-col items-center justify-center border-b border-[#05573d]">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-emerald-800 rounded-full text-emerald-400">
            <Leaf className="w-8 h-8" />
          </div>
          <span className="text-2xl font-bold tracking-wide">Harvesta</span>
        </div>
      </div>

      <nav className="flex-1 px-4 py-6 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <a
              key={item.name}
              href="#"
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 text-sm font-medium ${
                item.active
                  ? "bg-[#4e7565] text-white shadow-md shadow-[#023d2a]/50"
                  : "text-emerald-100/70 hover:bg-[#05573d] hover:text-white"
              }`}
            >
              <Icon className="w-5 h-5" />
              <span>{item.name}</span>
            </a>
          );
        })}
      </nav>
    </aside>
  );
}