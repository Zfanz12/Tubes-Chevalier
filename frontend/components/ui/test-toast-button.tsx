"use client";

import { toast } from "sonner";
import { Button } from "@/components/ui/button";


export function TestToastButton() {
  const handleTest = () => {
    toast.custom(
      (t) => (
        <div className="flex items-center gap-3 bg-white rounded-xl shadow-lg px-4 border border-gray-100 min-w-[300px] max-w-[360px]" style={{ paddingTop: 0, paddingBottom: 0 }}>
          <img
            src="/gif_success.gif"
            alt="success"
            style={{ width: 64, height: "auto", objectFit: "contain", flexShrink: 0, display: "block" }}
          />
          <p className="flex-1 text-sm font-semibold text-gray-800">Berhasil mengirim balasan</p>
        </div>
      ),
      { duration: 2500, className: "!bg-transparent !shadow-none !border-0 !p-0" }
    );
  };

  return (
    <Button
      onClick={handleTest}
      className="fixed bottom-6 right-6 z-50 bg-[#1B4332] hover:bg-[#08261C] text-white rounded-full px-5 py-2.5 shadow-lg text-sm font-semibold flex items-center gap-2 transition-all"
    >
      <span className="text-base">👋</span>
      Test Toast
    </Button>
  );
}
