"use client";

import React from "react";
import { Search, ArrowUpRight, Users } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface TransactionItem {
  id: string;
  date: string;
  customer: string;
  method: string;
  total: string;
  status: "Gagal" | "Berhasil" | "Pending" | "Expired";
}

const transactionData: TransactionItem[] = [
  {
    id: "INV-12345",
    date: "12/02/2026",
    customer: "Reza Rahardian",
    method: "VA Mandiri",
    total: "Rp 130.000",
    status: "Gagal",
  },
  {
    id: "INV-12345",
    date: "12/02/2026",
    customer: "Reza Rahardian",
    method: "VA BCA",
    total: "Rp 130.000",
    status: "Gagal",
  },
  {
    id: "INV-12345",
    date: "12/02/2026",
    customer: "Reza Rahardian",
    method: "VA BRI",
    total: "Rp 20.000",
    status: "Berhasil",
  },
  {
    id: "INV-12345",
    date: "12/02/2026",
    customer: "Reza Rahardian",
    method: "VA BNI",
    total: "Rp 30.000",
    status: "Berhasil",
  },
  {
    id: "INV-12345",
    date: "12/02/2026",
    customer: "Reza Rahardian",
    method: "QRIS",
    total: "Rp 130.000",
    status: "Pending",
  },
  {
    id: "INV-12345",
    date: "12/02/2026",
    customer: "Reza Rahardian",
    method: "QRIS",
    total: "Rp 130.000",
    status: "Expired",
  },
  {
    id: "INV-12345",
    date: "12/02/2026",
    customer: "Reza Rahardian",
    method: "QRIS",
    total: "Rp 130.000",
    status: "Pending",
  },
];

const paymentMethods = [
  { name: "QRIS (Digital Wallet)", percentage: 42 },
  { name: "Virtual Account Mandiri", percentage: 42 },
  { name: "Virtual Account BCA", percentage: 42 },
  { name: "Virtual Account BNI", percentage: 42 },
  { name: "Virtual Account BRI", percentage: 42 },
  { name: "Metode Lainnya", percentage: 42 },
];

export default function TransaksiPage() {
  return (
    <div className="w-full space-y-6">
      {/* ── Top Time Range Filters ───────────────────────────────── */}
      <div>
        <div className="bg-[#eefcf4] p-1 rounded-full border border-[#c6f0d8] inline-flex items-center gap-1">
          <button className="px-4 py-1.5 text-xs font-bold bg-[#1B4332] text-white rounded-full shadow-2xs transition cursor-pointer">
            Semua
          </button>
          <button className="px-3.5 py-1.5 text-xs font-semibold text-gray-500 hover:text-gray-900 rounded-full transition cursor-pointer">
            Hari Ini
          </button>
          <button className="px-3.5 py-1.5 text-xs font-semibold text-gray-500 hover:text-gray-900 rounded-full transition cursor-pointer">
            Bulan Ini
          </button>
          <button className="px-3.5 py-1.5 text-xs font-semibold text-gray-500 hover:text-gray-900 rounded-full transition cursor-pointer">
            Tahun Ini
          </button>
        </div>
      </div>

      {/* ── Top 3 Stat Cards (Centered) ─────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Card 1: Total Pendapatan (Dark Green Card - Concentric Curved Waves Overlay) */}
        <div className="bg-[#1B4332] text-white rounded-2xl p-6 shadow-[0_4px_20px_rgba(3,59,42,0.06)] border border-[#06543c] ring-1 ring-black/5 relative overflow-hidden flex flex-col items-center justify-between text-center min-h-[155px]">
          {/* Top-Right Smooth Concentric Arc Wave Overlay */}
          <div className="absolute -top-16 -right-16 w-80 h-80 pointer-events-none opacity-45 overflow-hidden">
            <svg className="w-full h-full" viewBox="0 0 320 320" fill="none">
              <circle cx="250" cy="60" r="280" fill="url(#arcGrad1)" opacity="0.35" />
              <circle cx="250" cy="60" r="210" fill="url(#arcGrad2)" opacity="0.45" />
              <circle cx="250" cy="60" r="140" fill="url(#arcGrad3)" opacity="0.55" />
              <circle cx="250" cy="60" r="80" fill="url(#arcGrad4)" opacity="0.65" />
              <circle cx="250" cy="60" r="40" fill="url(#arcGrad4)" opacity="1" />
              <defs>
                <linearGradient id="arcGrad1" x1="320" y1="0" x2="0" y2="320" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stopColor="#2d6a4f" stopOpacity="0.85" />
                  <stop offset="100%" stopColor="#1B4332" stopOpacity="0" />
                </linearGradient>
                <linearGradient id="arcGrad2" x1="320" y1="0" x2="0" y2="320" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stopColor="#40916c" stopOpacity="0.9" />
                  <stop offset="100%" stopColor="#1B4332" stopOpacity="0" />
                </linearGradient>
                <linearGradient id="arcGrad3" x1="320" y1="0" x2="0" y2="320" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stopColor="#52b788" stopOpacity="0.95" />
                  <stop offset="100%" stopColor="#1B4332" stopOpacity="0" />
                </linearGradient>
                <linearGradient id="arcGrad4" x1="320" y1="0" x2="0" y2="320" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stopColor="#74c69d" stopOpacity="0.95" />
                  <stop offset="100%" stopColor="#1B4332" stopOpacity="0" />
                </linearGradient>
              </defs>
            </svg>
          </div>

          <div className="relative z-10">
            <span className="text-emerald-100/90 text-sm font-medium block drop-shadow-xs">
              Total Pendapatan
            </span>
            <p className="text-3xl font-extrabold tracking-tight text-white mt-2 drop-shadow-xs">
              Rp 750.000
            </p>
          </div>

          <div className="mt-4 flex items-center justify-center gap-2 relative z-10">
            <span className="inline-flex items-center gap-1 bg-white/15 backdrop-blur-xs text-emerald-200 text-xs font-semibold px-2.5 py-1 rounded-full border border-white/20 shadow-2xs">
              <ArrowUpRight className="w-3.5 h-3.5" />
              15%
            </span>
            <span className="text-xs text-emerald-100/80 font-medium">
              Naik dari Bulan sebelumnya
            </span>
          </div>
        </div>

        {/* Card 2: Total Pembeli (Centered) */}
        <div className="bg-white text-gray-900 rounded-2xl p-6 shadow-[0_4px_20px_rgba(3,59,42,0.06)] border border-emerald-300 ring-1 ring-black/5 flex flex-col items-center justify-between text-center min-h-[155px]">
          <div>
            <span className="text-gray-500 text-sm font-medium block">
              Total Pembeli
            </span>
            <div className="flex items-center justify-center gap-2 mt-2">
              <p className="text-3xl font-extrabold text-gray-900 tracking-tight">
                27
              </p>
              <Users className="w-6 h-6 text-gray-800" />
            </div>
          </div>

          <div className="mt-4 flex items-center justify-center gap-2">
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-600 border border-emerald-100">
              <ArrowUpRight className="w-3.5 h-3.5" />
              12%
            </span>
            <span className="text-xs text-gray-400">
              Naik dari bulan sebelumnya
            </span>
          </div>
        </div>

        {/* Card 3: Total Keuntungan (Centered) */}
        <div className="bg-white text-gray-900 rounded-2xl p-6 shadow-[0_4px_20px_rgba(3,59,42,0.06)] border border-emerald-300 ring-1 ring-black/5 flex flex-col items-center justify-between text-center min-h-[155px]">
          <div>
            <span className="text-gray-500 text-sm font-medium block">
              Total Keuntungan
            </span>
            <p className="text-3xl font-extrabold text-gray-900 tracking-tight mt-2">
              Rp 50.000
            </p>
          </div>

          <div className="mt-4 flex items-center justify-center gap-2">
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-600 border border-emerald-100">
              <ArrowUpRight className="w-3.5 h-3.5" />
              15%
            </span>
            <span className="text-xs text-gray-400">
              Naik dari bulan sebelumnya
            </span>
          </div>
        </div>
      </div>

      {/* ── Middle Section: Sales Chart & Payment Methods ──────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Grafik Penjualan (Exact Dashboard Component) */}
        <Card className="bg-white rounded-2xl border border-emerald-300 ring-1 ring-black/5 shadow-[0_4px_20px_rgba(3,59,42,0.06)] lg:col-span-2">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base font-bold text-gray-800">
                Grafik Penjualan
              </CardTitle>
              <div className="bg-[#eefcf4] p-1 rounded-full border border-[#c6f0d8] inline-flex items-center gap-1">
                <button className="px-3.5 py-1 text-xs font-semibold text-gray-500 hover:text-gray-900 rounded-full transition cursor-pointer">
                  30 hari
                </button>
                <button className="px-4 py-1 text-xs font-bold bg-[#1B4332] text-white rounded-full shadow-2xs transition cursor-pointer">
                  7 hari
                </button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-2 pb-6 px-6">
            <div className="h-56 w-full relative">
              <svg viewBox="0 0 500 200" className="w-full h-full">
                <defs>
                  <linearGradient id="transaksiChartGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#1B4332" stopOpacity="0.2" />
                    <stop offset="100%" stopColor="#1B4332" stopOpacity="0" />
                  </linearGradient>
                </defs>
                <line x1="30" y1="20" x2="470" y2="20" stroke="#f1f5f9" strokeWidth="1" />
                <line x1="30" y1="60" x2="470" y2="60" stroke="#f1f5f9" strokeWidth="1" />
                <line x1="30" y1="100" x2="470" y2="100" stroke="#f1f5f9" strokeWidth="1" />
                <line x1="30" y1="140" x2="470" y2="140" stroke="#f1f5f9" strokeWidth="1" />
                <line x1="30" y1="180" x2="470" y2="180" stroke="#e2e8f0" strokeWidth="1.5" />
                <path
                  d="M 30 160 C 80 140, 120 130, 170 140 C 220 150, 270 110, 320 110 C 370 110, 420 135, 470 120 L 470 180 L 30 180 Z"
                  fill="url(#transaksiChartGradient)"
                />
                <path
                  d="M 30 160 C 80 140, 120 130, 170 140 C 220 150, 270 110, 320 110 C 370 110, 420 135, 470 120"
                  fill="none"
                  stroke="#1B4332"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
                {/* Data points */}
                {[
                  [30, 160], [170, 140], [320, 110], [420, 125], [470, 120]
                ].map(([x, y], i) => (
                  <circle key={i} cx={x} cy={y} r="4" fill="#1B4332" stroke="white" strokeWidth="2" />
                ))}
              </svg>
              <div className="flex justify-between text-[11px] text-gray-400 font-semibold px-6 mt-2">
                {["Sen", "Sel", "Rab", "Kam", "Jum", "Sab", "Min"].map((d) => (
                  <span key={d}>{d}</span>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Payment Methods (Bar Graph Chart) */}
        <div className="bg-white rounded-2xl p-6 shadow-[0_4px_20px_rgba(3,59,42,0.06)] border border-emerald-300 ring-1 ring-black/5 flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-gray-900">
              Metode Pembayaran
            </h2>
          </div>

          {/* Bar Graph Visual Container */}
          <div className="h-56 flex items-end justify-between gap-2 pt-4 pb-1 px-1">
            {[
              { label: "QRIS", short: "QRIS", val: 85 },
              { label: "VA Mandiri", short: "Mandiri", val: 65 },
              { label: "VA BCA", short: "BCA", val: 75 },
              { label: "VA BNI", short: "BNI", val: 50 },
              { label: "VA BRI", short: "BRI", val: 60 },
              { label: "Lainnya", short: "Lainnya", val: 35 },
            ].map((bar, idx) => (
              <div
                key={idx}
                className="flex-1 flex flex-col items-center h-full justify-end group cursor-pointer"
              >
                {/* Value tooltip label on hover / top */}
                <span className="text-[10px] font-bold text-emerald-800 mb-1.5 opacity-90 group-hover:scale-110 transition-transform">
                  {bar.val}%
                </span>
                {/* Bar track and fill */}
                <div className="w-full max-w-[28px] bg-emerald-50 rounded-t-lg overflow-hidden flex items-end h-40 border border-emerald-100/60">
                  <div
                    className="w-full bg-[#1B4332] rounded-t-lg group-hover:bg-[#05543c] transition-all duration-500 shadow-xs"
                    style={{ height: `${bar.val}%` }}
                  />
                </div>
                {/* X-axis method label */}
                <span
                  className="text-[10px] font-semibold text-gray-500 text-center mt-2.5 truncate w-full block"
                  title={bar.label}
                >
                  {bar.short}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Transaction Log Table ───────────────────────────────── */}
      <div className="bg-white rounded-2xl p-6 shadow-[0_4px_20px_rgba(3,59,42,0.06)] border border-emerald-300 ring-1 ring-black/5 space-y-5">
        {/* Table Controls (Search & Date Filter) */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Search Bar */}
          <div className="relative w-full sm:w-80">
            <input
              type="text"
              placeholder="Cari log transaksi"
              className="w-full bg-[#f3f4f6] text-sm text-gray-800 placeholder:text-gray-400 rounded-full pl-4 pr-10 py-2.5 outline-none focus:ring-2 focus:ring-[#1B4332]/20 transition"
            />
            <Search className="w-4 h-4 text-gray-700 absolute right-3.5 top-1/2 -translate-y-1/2" />
          </div>

          {/* Time Filter Pills */}
          <div className="bg-[#eefcf4] p-1 rounded-full border border-[#c6f0d8] inline-flex items-center gap-1 shrink-0">
            <button className="px-4 py-1.5 text-xs font-bold bg-[#1B4332] text-white rounded-full shadow-2xs transition cursor-pointer">
              Semua
            </button>
            <button className="px-3.5 py-1.5 text-xs font-semibold text-gray-500 hover:text-gray-900 rounded-full transition cursor-pointer">
              7 hari
            </button>
            <button className="px-3.5 py-1.5 text-xs font-semibold text-gray-500 hover:text-gray-900 rounded-full transition cursor-pointer">
              30 hari
            </button>
          </div>
        </div>

        {/* Transactions Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-100 text-gray-500 text-xs font-semibold">
                <th className="py-3.5 px-3">ID Transaksi</th>
                <th className="py-3.5 px-3 text-center">Tanggal</th>
                <th className="py-3.5 px-3">Customer</th>
                <th className="py-3.5 px-3 text-center">Metode Pembayaran</th>
                <th className="py-3.5 px-3 text-center">Total Harga</th>
                <th className="py-3.5 px-3 text-center">Status</th>
                <th className="py-3.5 px-3 text-center"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
              {transactionData.map((item, index) => (
                <tr
                  key={index}
                  className="hover:bg-gray-50/60 transition-colors"
                >
                  {/* ID Transaksi */}
                  <td className="py-4 px-3 font-medium text-gray-700 text-xs">
                    {item.id}
                  </td>

                  {/* Tanggal */}
                  <td className="py-4 px-3 text-center text-gray-600 text-xs">
                    {item.date}
                  </td>

                  {/* Customer */}
                  <td className="py-4 px-3 font-semibold text-gray-800 text-xs">
                    {item.customer}
                  </td>

                  {/* Metode Pembayaran */}
                  <td className="py-4 px-3 text-center font-medium text-gray-700 text-xs">
                    {item.method}
                  </td>

                  {/* Total Harga */}
                  <td className="py-4 px-3 text-center font-medium text-gray-900 text-xs">
                    {item.total}
                  </td>

                  {/* Status */}
                  <td className="py-4 px-3 text-center">
                    {item.status === "Gagal" && (
                      <span className="inline-flex items-center justify-center bg-red-50 text-red-600 border border-red-200 rounded-full px-4 py-1.5 text-xs font-semibold">
                        Gagal
                      </span>
                    )}
                    {item.status === "Berhasil" && (
                      <span className="inline-flex items-center justify-center bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full px-4 py-1.5 text-xs font-semibold">
                        Berhasil
                      </span>
                    )}
                    {item.status === "Pending" && (
                      <span className="inline-flex items-center justify-center bg-amber-50 text-amber-700 border border-amber-200 rounded-full px-4 py-1.5 text-xs font-semibold">
                        Pending
                      </span>
                    )}
                    {item.status === "Expired" && (
                      <span className="inline-flex items-center justify-center bg-gray-100 text-gray-600 border border-gray-300 rounded-full px-4 py-1.5 text-xs font-semibold">
                        Expired
                      </span>
                    )}
                  </td>

                  {/* Action */}
                  <td className="py-4 px-3 text-center pr-2">
                    <button className="bg-[#1B4332] hover:bg-[#05543c] text-white rounded-full px-4.5 py-1.5 text-xs font-semibold transition cursor-pointer shadow-2xs">
                      Lihat detail
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="pt-2 flex items-center justify-end gap-3 text-xs">
          <button className="bg-[#1B4332] hover:bg-[#05543c] text-white rounded-full px-4 py-1.5 font-medium transition cursor-pointer shadow-xs">
            Previous
          </button>
          <div className="flex items-center gap-2 font-medium">
            <span className="w-6 h-6 flex items-center justify-center font-bold text-gray-900 border-b-2 border-[#1B4332]">
              1
            </span>
            <span className="w-6 h-6 flex items-center justify-center text-gray-500 hover:text-gray-900 cursor-pointer">
              2
            </span>
            <span className="w-6 h-6 flex items-center justify-center text-gray-500 hover:text-gray-900 cursor-pointer">
              3
            </span>
            <span className="w-6 h-6 flex items-center justify-center text-gray-500 hover:text-gray-900 cursor-pointer">
              4
            </span>
            <span className="w-6 h-6 flex items-center justify-center text-gray-500 hover:text-gray-900 cursor-pointer">
              5
            </span>
          </div>
          <button className="bg-[#1B4332] hover:bg-[#05543c] text-white rounded-full px-4 py-1.5 font-medium transition cursor-pointer shadow-xs">
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
