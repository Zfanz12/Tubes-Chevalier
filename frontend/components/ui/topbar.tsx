import React from "react";
import { User } from "lucide-react";

export default function Topbar() {
  return (
    <header className="h-20 bg-[#05402e] text-white flex items-center justify-between px-8 shadow-sm">
      <div>
        <span className="text-emerald-100/90 text-sm font-medium">Rabu, 15 April 2026</span>
      </div>

      <div className="flex items-center gap-3 bg-[#e8faf4]/20 hover:bg-[#e8faf4]/30 transition px-4 py-1.5 rounded-full border border-emerald-600/30 cursor-pointer">
        <div className="w-8 h-8 rounded-full overflow-hidden bg-emerald-700 flex items-center justify-center text-emerald-200">
          <User className="w-4 h-4" />
        </div>
        <span className="text-sm font-medium text-emerald-50">Ahmad Tahalu</span>
      </div>
    </header>
  );
}
