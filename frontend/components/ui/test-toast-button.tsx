"use client";

import { Button } from "@/components/ui/button";
import { showToast } from "@/lib/custom-toast";


export function TestToastButton() {
  const handleTest = () => {
    showToast("ini toast error....", "error");
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
