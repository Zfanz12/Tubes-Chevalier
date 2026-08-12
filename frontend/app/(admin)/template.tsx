"use client";

import React, { useState, useEffect } from "react";
import { usePathname } from "next/navigation";

// A reusable shimmer component for the "wave" animation
const SkeletonWave = ({ className }: { className?: string }) => (
  <div className={`animate-shimmer rounded-lg ${className || ""}`} />
);

// ── 1. Dashboard Skeleton (1:1 Match) ───────────────────────────
const DashboardSkeleton = () => (
  <div className="w-full space-y-6 p-4 lg:p-6">
    {/* Top 3 Stat Cards */}
    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 min-h-[155px] flex flex-col justify-between items-center">
        <SkeletonWave className="h-4 w-32" />
        <SkeletonWave className="h-8 w-40 mt-2" />
        <SkeletonWave className="h-6 w-48 mt-4 rounded-full" />
      </div>
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 min-h-[155px] flex flex-col justify-between items-center">
        <SkeletonWave className="h-4 w-32" />
        <SkeletonWave className="h-8 w-24 mt-2" />
        <SkeletonWave className="h-6 w-48 mt-4 rounded-full" />
      </div>
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 min-h-[155px] flex flex-col justify-between items-center">
        <SkeletonWave className="h-4 w-32" />
        <SkeletonWave className="h-8 w-36 mt-2" />
        <SkeletonWave className="h-6 w-48 mt-4 rounded-full" />
      </div>
    </div>

    {/* Chart & Order Status */}
    <div className="grid gap-5 lg:grid-cols-3">
      {/* Chart */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 lg:col-span-2 space-y-4">
        <div className="flex items-center justify-between">
          <SkeletonWave className="h-6 w-36" />
          <SkeletonWave className="h-8 w-32 rounded-full" />
        </div>
        <SkeletonWave className="h-56 w-full rounded-xl" />
      </div>
      {/* Status Pesanan */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 space-y-4">
        <div className="flex items-center justify-between">
          <SkeletonWave className="h-6 w-32" />
          <SkeletonWave className="h-4 w-20" />
        </div>
        <div className="space-y-3 pt-1">
          {[1, 2, 3, 4].map((i) => (
            <SkeletonWave key={i} className="h-12 w-full rounded-xl" />
          ))}
        </div>
      </div>
    </div>

    {/* Stock Alert & Harvest */}
    <div className="grid gap-5 md:grid-cols-2">
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 space-y-4">
        <div className="flex items-center justify-between">
          <SkeletonWave className="h-6 w-36" />
          <SkeletonWave className="h-4 w-20" />
        </div>
        <div className="space-y-2.5 pt-1">
          {[1, 2, 3, 4].map((i) => (
            <SkeletonWave key={i} className="h-11 w-full rounded-xl" />
          ))}
        </div>
      </div>
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 space-y-4">
        <SkeletonWave className="h-6 w-32" />
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 pt-1">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <SkeletonWave key={i} className="h-10 w-full rounded-xl" />
          ))}
        </div>
      </div>
    </div>

    {/* Recent Transactions Table */}
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 space-y-5">
      <div className="flex items-center justify-between">
        <SkeletonWave className="h-6 w-40" />
        <SkeletonWave className="h-6 w-24 rounded-full" />
      </div>
      <div className="space-y-3">
        <SkeletonWave className="h-10 w-full rounded-lg" />
        {[1, 2, 3, 4].map((i) => (
          <SkeletonWave key={i} className="h-14 w-full rounded-xl" />
        ))}
      </div>
    </div>
  </div>
);

// ── 2. Produk Skeleton (1:1 Match) ──────────────────────────────
const ProdukSkeleton = () => (
  <div className="w-full space-y-6 p-4 lg:p-6">
    {/* 4 Stat Cards */}
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex items-center gap-4">
          <SkeletonWave className="w-12 h-12 rounded-xl shrink-0" />
          <div className="space-y-2 flex-1">
            <SkeletonWave className="h-3 w-20" />
            <SkeletonWave className="h-6 w-24" />
          </div>
        </div>
      ))}
    </div>

    {/* Table Control Card */}
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 space-y-5">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <SkeletonWave className="h-10 w-full sm:w-80 rounded-full" />
        <SkeletonWave className="h-10 w-full sm:w-36 rounded-full" />
      </div>
      <div className="space-y-3">
        <SkeletonWave className="h-10 w-full rounded-lg" />
        {[1, 2, 3, 4, 5].map((i) => (
          <SkeletonWave key={i} className="h-16 w-full rounded-xl" />
        ))}
      </div>
    </div>
  </div>
);

// ── 3. Pesanan Skeleton (1:1 Match) ─────────────────────────────
const PesananSkeleton = () => (
  <div className="w-full space-y-6 p-4 lg:p-6">
    {/* 4 Stat Cards */}
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex flex-col gap-3">
          <div className="flex items-center gap-3">
            <SkeletonWave className="w-10 h-10 rounded-xl shrink-0" />
            <div className="space-y-2">
              <SkeletonWave className="h-3 w-20" />
              <SkeletonWave className="h-6 w-12" />
            </div>
          </div>
          <SkeletonWave className="h-6 w-3/4 rounded-full mt-2" />
        </div>
      ))}
    </div>

    {/* Main Table Card */}
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 space-y-5">
      {/* Control Header */}
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4">
        {/* Left: Search + Status Pills */}
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full xl:w-auto">
          <SkeletonWave className="h-10 w-full sm:w-64 rounded-full shrink-0" />
          <div className="flex gap-2 overflow-x-auto w-full">
            {[1, 2, 3, 4].map((i) => (
              <SkeletonWave key={i} className="h-8 w-20 rounded-full shrink-0" />
            ))}
          </div>
        </div>
        {/* Right: Time Pills + Add Button */}
        <div className="flex items-center gap-3 shrink-0">
          <SkeletonWave className="h-8 w-16 rounded-full" />
          <SkeletonWave className="h-8 w-16 rounded-full" />
          <SkeletonWave className="h-10 w-32 rounded-full" />
        </div>
      </div>
      
      {/* Table Rows */}
      <div className="space-y-3">
        <SkeletonWave className="h-10 w-full rounded-lg" />
        {[1, 2, 3, 4, 5].map((i) => (
          <SkeletonWave key={i} className="h-16 w-full rounded-xl" />
        ))}
      </div>
      
      {/* Pagination */}
      <div className="flex justify-end gap-2 pt-2">
        <SkeletonWave className="h-8 w-24 rounded-full" />
        <SkeletonWave className="h-8 w-8 rounded-full" />
        <SkeletonWave className="h-8 w-8 rounded-full" />
        <SkeletonWave className="h-8 w-24 rounded-full" />
      </div>
    </div>
  </div>
);

// ── 4. Transaksi Skeleton (1:1 Match) ───────────────────────────
const TransaksiSkeleton = () => (
  <div className="w-full space-y-6 p-4 lg:p-6">
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
      {[1, 2, 3].map((i) => (
        <div key={i} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 space-y-3">
          <SkeletonWave className="h-4 w-32" />
          <SkeletonWave className="h-8 w-40" />
        </div>
      ))}
    </div>
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 space-y-5">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <SkeletonWave className="h-10 w-full sm:w-72 rounded-full" />
        <SkeletonWave className="h-10 w-full sm:w-48 rounded-xl" />
      </div>
      <div className="space-y-3">
        <SkeletonWave className="h-10 w-full rounded-lg" />
        {[1, 2, 3, 4, 5].map((i) => (
          <SkeletonWave key={i} className="h-14 w-full rounded-xl" />
        ))}
      </div>
    </div>
  </div>
);

// ── 5. Insight Skeleton (1:1 Match) ─────────────────────────────
const InsightSkeleton = () => (
  <div className="w-full space-y-6 p-4 lg:p-6">
    {/* 3 Top Large Cards */}
    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
      {[1, 2, 3].map((i) => (
        <div key={i} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col justify-between h-[200px]">
          <div className="space-y-4">
            <div className="flex justify-between items-start">
              <SkeletonWave className="w-8 h-8 rounded-lg shrink-0" />
              <SkeletonWave className="h-6 w-16 rounded-full" />
            </div>
            <SkeletonWave className="h-6 w-40" />
            <SkeletonWave className="h-4 w-full" />
            <SkeletonWave className="h-4 w-3/4" />
          </div>
          <SkeletonWave className="h-8 w-28 rounded-full" />
        </div>
      ))}
    </div>

    {/* Section Header */}
    <div className="flex flex-col sm:flex-row justify-between items-end sm:items-center gap-4 mt-8">
      <div className="space-y-2 w-full sm:w-auto">
        <SkeletonWave className="h-6 w-32" />
        <SkeletonWave className="h-4 w-48" />
      </div>
      <SkeletonWave className="h-10 w-full sm:w-64 rounded-full" />
    </div>

    {/* Filter Pills */}
    <div className="flex gap-2 overflow-x-auto w-full pb-2">
      {[1, 2, 3, 4, 5].map((i) => (
        <SkeletonWave key={i} className="h-9 w-24 rounded-full shrink-0" />
      ))}
    </div>

    {/* 3 Article Cards */}
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
      {[1, 2, 3].map((i) => (
        <div key={i} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden h-[380px] flex flex-col">
          {/* Image Placeholder */}
          <SkeletonWave className="h-[200px] w-full rounded-none" />
          {/* Content */}
          <div className="p-5 flex-1 space-y-3">
            <SkeletonWave className="h-6 w-full" />
            <SkeletonWave className="h-6 w-3/4" />
            <div className="space-y-2 pt-2">
              <SkeletonWave className="h-4 w-full" />
              <SkeletonWave className="h-4 w-full" />
              <SkeletonWave className="h-4 w-4/5" />
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

// ── 6. Profile Skeleton (1:1 Match) ─────────────────────────────
const ProfileSkeleton = () => (
  <div className="w-full p-4 lg:p-6 space-y-6">
    <div className="flex flex-col lg:flex-row gap-6">
      <div className="w-full lg:w-64 space-y-2">
        {[1, 2, 3].map((i) => (
          <SkeletonWave key={i} className="h-11 w-full rounded-xl" />
        ))}
      </div>
      <div className="flex-1 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-6">
        <div className="flex items-center gap-6 border-b border-gray-100 pb-6">
          <SkeletonWave className="w-24 h-24 rounded-full shrink-0" />
          <div className="space-y-3 flex-1">
            <SkeletonWave className="h-6 w-48" />
            <SkeletonWave className="h-4 w-32" />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="space-y-2">
              <SkeletonWave className="h-4 w-28" />
              <SkeletonWave className="h-11 w-full rounded-xl" />
            </div>
          ))}
        </div>
        <SkeletonWave className="h-11 w-36 rounded-xl mt-4" />
      </div>
    </div>
  </div>
);

// ── 7. Data Panen Skeleton (1:1 Match) ──────────────────────────
const DataPanenSkeleton = () => (
  <div className="w-full space-y-6 p-4 lg:p-6">
    {/* 2 Top Buttons */}
    <div className="flex items-center gap-3">
      <SkeletonWave className="h-10 w-40 rounded-full" />
      <SkeletonWave className="h-10 w-40 rounded-full" />
    </div>

    {/* Title */}
    <SkeletonWave className="h-6 w-56" />

    {/* 3 Cards */}
    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
      {[1, 2, 3].map((i) => (
        <div key={i} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex flex-col justify-between h-40">
          <div>
            <div className="flex justify-between items-start">
              <SkeletonWave className="h-5 w-40" />
              <SkeletonWave className="h-6 w-24 rounded-full" />
            </div>
            <SkeletonWave className="h-4 w-32 mt-2" />
          </div>
          <div className="flex justify-between items-end mt-4">
            <SkeletonWave className="h-4 w-28" />
            <SkeletonWave className="h-8 w-24 rounded-full" />
          </div>
        </div>
      ))}
    </div>

    {/* Main Table Card */}
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 space-y-5">
      {/* Control Header */}
      <div className="flex flex-col sm:flex-row items-center gap-4">
        <SkeletonWave className="h-10 w-full sm:w-64 rounded-full shrink-0" />
        <div className="flex gap-2 overflow-x-auto w-full">
          {[1, 2, 3, 4].map((i) => (
            <SkeletonWave key={i} className="h-8 w-28 rounded-full shrink-0" />
          ))}
        </div>
      </div>
      
      {/* Table Rows */}
      <div className="space-y-3">
        <SkeletonWave className="h-10 w-full rounded-lg" />
        {[1, 2, 3, 4, 5].map((i) => (
          <SkeletonWave key={i} className="h-16 w-full rounded-xl" />
        ))}
      </div>
      
      {/* Pagination */}
      <div className="flex justify-end gap-2 pt-2">
        <SkeletonWave className="h-8 w-24 rounded-full" />
        <SkeletonWave className="h-8 w-8 rounded-full" />
        <SkeletonWave className="h-8 w-24 rounded-full" />
      </div>
    </div>
  </div>
);

// ── 8. Feedback Skeleton (1:1 Match) ────────────────────────────
const FeedbackSkeleton = () => (
  <div className="w-full space-y-6 p-4 lg:p-6">
    {/* 4 Stat Cards */}
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex flex-col justify-center h-[120px] space-y-3">
          <div className="flex items-center gap-4">
            <SkeletonWave className="w-10 h-10 rounded-xl shrink-0" />
            <div className="space-y-2">
              <SkeletonWave className="h-3 w-20" />
              <SkeletonWave className="h-6 w-12" />
            </div>
          </div>
          <SkeletonWave className="h-3 w-32" />
        </div>
      ))}
    </div>

    {/* Main Area */}
    <div className="space-y-5">
      {/* Filters & Badge */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="flex gap-3 overflow-x-auto w-full sm:w-auto">
          <SkeletonWave className="h-4 w-20 shrink-0 mt-3" />
          {[1, 2, 3, 4].map((i) => (
            <SkeletonWave key={i} className="h-10 w-32 rounded-full shrink-0" />
          ))}
        </div>
        <SkeletonWave className="h-10 w-40 rounded-full shrink-0" />
      </div>

      {/* Feedback List */}
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 space-y-4 relative">
            <div className="flex justify-between items-start">
              <div className="flex items-start gap-4">
                <SkeletonWave className="w-10 h-10 rounded-full shrink-0" />
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <SkeletonWave className="h-5 w-32" />
                    <SkeletonWave className="h-5 w-16 rounded-full" />
                  </div>
                  <SkeletonWave className="h-3 w-24" />
                  <SkeletonWave className="h-3 w-40" />
                </div>
              </div>
              <SkeletonWave className="h-3 w-20" />
            </div>
            
            <div className="pl-14 space-y-2">
              <SkeletonWave className="h-4 w-full" />
              <SkeletonWave className="h-4 w-3/4" />
            </div>

            {/* Balas button */}
            <div className="flex justify-end pt-2">
              <SkeletonWave className="h-8 w-24 rounded-full" />
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

// ── 9. Chat Skeleton (1:1 Match) ────────────────────────────────
const ChatSkeleton = () => (
  <div className="w-full h-[calc(100vh-160px)] min-h-[500px] grid grid-cols-1 lg:grid-cols-3 gap-5 p-4 lg:p-6">
    <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm flex flex-col space-y-4">
      <SkeletonWave className="h-10 w-full rounded-full" />
      <SkeletonWave className="h-8 w-24 rounded-full" />
      <div className="space-y-3 mt-4">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="flex gap-3 items-center">
            <SkeletonWave className="w-11 h-11 rounded-full shrink-0" />
            <div className="space-y-2 flex-1">
              <SkeletonWave className="h-4 w-3/4" />
              <SkeletonWave className="h-3 w-1/2" />
            </div>
          </div>
        ))}
      </div>
    </div>
    <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm lg:col-span-2 hidden lg:flex flex-col">
      <div className="flex items-center gap-3 border-b border-gray-100 pb-4 mb-4">
        <SkeletonWave className="w-10 h-10 rounded-full shrink-0" />
        <div className="space-y-2 flex-1">
          <SkeletonWave className="h-4 w-32" />
          <SkeletonWave className="h-3 w-16" />
        </div>
      </div>
      <div className="flex-1 space-y-6">
        <SkeletonWave className="h-16 w-1/2 rounded-2xl rounded-tl-sm" />
        <SkeletonWave className="h-16 w-1/2 rounded-2xl rounded-tr-sm self-end ml-auto" />
        <SkeletonWave className="h-16 w-1/3 rounded-2xl rounded-tl-sm" />
      </div>
      <div className="mt-4 flex gap-3">
        <SkeletonWave className="h-12 flex-1 rounded-full" />
        <SkeletonWave className="w-12 h-12 rounded-full shrink-0" />
      </div>
    </div>
  </div>
);

function getSkeletonForPath(pathname: string) {
  if (pathname.includes("/dashboard")) return <DashboardSkeleton />;
  if (pathname.includes("/produk")) return <ProdukSkeleton />;
  if (pathname.includes("/pesanan")) return <PesananSkeleton />;
  if (pathname.includes("/transaksi")) return <TransaksiSkeleton />;
  if (pathname.includes("/insight")) return <InsightSkeleton />;
  if (pathname.includes("/profile")) return <ProfileSkeleton />;
  if (pathname.includes("/data-panen")) return <DataPanenSkeleton />;
  if (pathname.includes("/feedback")) return <FeedbackSkeleton />;
  if (pathname.includes("/chat")) return <ChatSkeleton />;
  return <DashboardSkeleton />;
}

export default function AdminTemplate({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);
  const [fadeOut, setFadeOut] = useState(false);
  const pathname = usePathname() || "";

  useEffect(() => {
    setLoading(true);
    setFadeOut(false);

    // 0.3s fake skeleton load, then start fade out
    const fadeTimer = setTimeout(() => {
      setFadeOut(true);
    }, 300);

    // Completely unmount skeleton after 0.3s fade out animation (total 600ms)
    const removeTimer = setTimeout(() => {
      setLoading(false);
    }, 600);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(removeTimer);
    };
  }, [pathname]);

  return (
    <div className="relative w-full h-full min-h-screen">
      {loading && (
        <div
          className={`absolute inset-0 z-50 bg-[#f8faf9] transition-opacity duration-300 pointer-events-none ${
            fadeOut ? "opacity-0" : "opacity-100"
          }`}
        >
          {getSkeletonForPath(pathname)}
        </div>
      )}
      <div
        className={`w-full h-full transition-opacity duration-300 ${
          loading && !fadeOut ? "opacity-0" : "opacity-100"
        }`}
      >
        {children}
      </div>
    </div>
  );
}
