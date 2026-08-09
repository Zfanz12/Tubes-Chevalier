"use client";

import React, { useState, useMemo, useEffect } from "react";
import { Search, ArrowUpRight, Users } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";

interface TransactionItem {
  id: string;
  date: string;
  customer: string;
  method: string;
  total: string;
  status: "Gagal" | "Berhasil" | "Pending" | "Expired";
  items?: { name: string; qty: string; price: string }[];
}

// Helper: parse DD/MM/YYYY → Date object
function parseDDMMYYYY(dateStr: string): Date | null {
  const parts = dateStr.split("/");
  if (parts.length !== 3) return null;
  const [day, month, year] = parts.map(Number);
  if (!day || !month || !year) return null;
  return new Date(year, month - 1, day);
}

// Reference "today" for filtering (consistent within a session)
const REFERENCE_TODAY = new Date();

function isWithinDays(dateStr: string, days: number): boolean {
  const parsed = parseDDMMYYYY(dateStr);
  if (!parsed) return true; // jika format salah, tetap tampilkan
  const diffMs = REFERENCE_TODAY.getTime() - parsed.getTime();
  return diffMs >= 0 && diffMs <= days * 24 * 60 * 60 * 1000;
}

const initialTransactions: TransactionItem[] = [
  {
    id: "INV-12345",
    date: "12/02/2026",
    customer: "Reza Rahardian",
    method: "VA Mandiri",
    total: "Rp 130.000",
    status: "Gagal",
    items: [{ name: "Kangkung Fresh", qty: "10 kg", price: "Rp 130.000" }],
  },
  {
    id: "INV-12346",
    date: "12/02/2026",
    customer: "Reza Rahardian",
    method: "VA BCA",
    total: "Rp 130.000",
    status: "Gagal",
    items: [{ name: "Sawi Putih", qty: "8 kg", price: "Rp 130.000" }],
  },
  {
    id: "INV-12347",
    date: "12/02/2026",
    customer: "Reza Rahardian",
    method: "VA BRI",
    total: "Rp 20.000",
    status: "Berhasil",
    items: [{ name: "Bayam Organik", qty: "2 kg", price: "Rp 20.000" }],
  },
  {
    id: "INV-12348",
    date: "12/02/2026",
    customer: "Reza Rahardian",
    method: "VA BNI",
    total: "Rp 30.000",
    status: "Berhasil",
    items: [{ name: "Tomat Segar", qty: "3 kg", price: "Rp 30.000" }],
  },
  {
    id: "INV-12349",
    date: "12/02/2026",
    customer: "Reza Rahardian",
    method: "QRIS",
    total: "Rp 130.000",
    status: "Pending",
    items: [{ name: "Cabai Rawit", qty: "3 kg", price: "Rp 130.000" }],
  },
  {
    id: "INV-12350",
    date: "12/02/2026",
    customer: "Reza Rahardian",
    method: "QRIS",
    total: "Rp 130.000",
    status: "Expired",
    items: [{ name: "Brokoli Hijau", qty: "4 kg", price: "Rp 130.000" }],
  },
  {
    id: "INV-12351",
    date: "12/02/2026",
    customer: "Reza Rahardian",
    method: "QRIS",
    total: "Rp 130.000",
    status: "Pending",
    items: [{ name: "Wortel Manis", qty: "7 kg", price: "Rp 130.000" }],
  },
  {
    id: "INV-12352",
    date: "13/02/2026",
    customer: "Andika Wijaya",
    method: "Transfer Bank",
    total: "Rp 250.000",
    status: "Berhasil",
    items: [{ name: "Pak Choy", qty: "10 kg", price: "Rp 250.000" }],
  },
];

const statusBadgeClass: Record<string, string> = {
  Gagal: "bg-red-50 text-red-600 border-red-200",
  Berhasil: "bg-emerald-50 text-emerald-700 border-emerald-200",
  Pending: "bg-amber-50 text-amber-700 border-amber-200",
  Expired: "bg-gray-100 text-gray-600 border-gray-300",
};

export default function TransaksiPage() {
  const [topTimeFilter, setTopTimeFilter] = useState<"Semua" | "Hari Ini" | "Bulan Ini" | "Tahun Ini">("Semua");
  const [searchQuery, setSearchQuery] = useState("");
  const [tableTimeFilter, setTableTimeFilter] = useState<"Semua" | "7 hari" | "30 hari">("Semua");
  const [selectedTx, setSelectedTx] = useState<TransactionItem | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 5;

  // L-01 FIX: Proper date-based filtering using parseDDMMYYYY
  const filteredData = useMemo(() => {
    return initialTransactions.filter((item) => {
      const matchSearch =
        item.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.method.toLowerCase().includes(searchQuery.toLowerCase());

      if (!matchSearch) return false;

      if (tableTimeFilter === "7 hari") {
        return isWithinDays(item.date, 7);
      }
      if (tableTimeFilter === "30 hari") {
        return isWithinDays(item.date, 30);
      }
      return true;
    });
  }, [searchQuery, tableTimeFilter]);

  const totalPages = Math.ceil(filteredData.length / itemsPerPage) || 1;

  // Pagination out-of-bounds safety check
  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredData.slice(start, start + itemsPerPage);
  }, [filteredData, currentPage]);

  // D-11 FIX: Hitung persentase metode pembayaran dari data aktual
  const paymentMethodStats = useMemo(() => {
    const counts: Record<string, number> = {};
    initialTransactions.forEach((tx) => {
      const method = tx.method.startsWith("VA ") ? tx.method : tx.method;
      counts[method] = (counts[method] || 0) + 1;
    });
    const total = initialTransactions.length;
    const entries = Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 6);

    return entries.map(([label, count]) => ({
      label,
      short: label.replace("VA ", "").replace("Transfer Bank", "Transfer"),
      val: Math.round((count / total) * 100),
    }));
  }, []);

  // L-03 FIX: Stat card values — "Semua" harus lebih besar dari subset mana pun
  const statCardValues = useMemo(() => {
    switch (topTimeFilter) {
      case "Hari Ini":
        return { pendapatan: "Rp 750.000", pembeli: "27", keuntungan: "Rp 50.000", pctPendapatan: "+15%", pctPembeli: "+12%", pctKeuntungan: "+15%" };
      case "Bulan Ini":
        return { pendapatan: "Rp 22.500.000", pembeli: "840", keuntungan: "Rp 1.850.000", pctPendapatan: "+28%", pctPembeli: "+18%", pctKeuntungan: "+22%" };
      case "Tahun Ini":
        return { pendapatan: "Rp 180.000.000", pembeli: "6.420", keuntungan: "Rp 14.200.000", pctPendapatan: "+32%", pctPembeli: "+24%", pctKeuntungan: "+30%" };
      default: // "Semua"
        return { pendapatan: "Rp 245.000.000", pembeli: "8.750", keuntungan: "Rp 18.400.000", pctPendapatan: "+35%", pctPembeli: "+28%", pctKeuntungan: "+33%" };
    }
  }, [topTimeFilter]);

  // L-12 FIX: chartRange sinkron dengan topTimeFilter
  const chartRange = topTimeFilter === "Bulan Ini" || topTimeFilter === "Tahun Ini" || topTimeFilter === "Semua" ? "30d" : "7d";

  return (
    <div className="w-full space-y-6">
      {/* ── Top Time Range Filters ───────────────────────────────── */}
      <div>
        <div className="bg-[#eefcf4] p-1.5 rounded-full border border-[#c6f0d8] inline-flex items-center gap-1.5">
          {(["Semua", "Hari Ini", "Bulan Ini", "Tahun Ini"] as const).map((filter) => (
            <button
              key={filter}
              onClick={() => setTopTimeFilter(filter)}
              className={`px-4.5 py-1.5 text-xs rounded-full transition cursor-pointer ${
                topTimeFilter === filter
                  ? "font-bold bg-[#1B4332] text-white shadow-2xs"
                  : "font-semibold text-gray-500 hover:text-gray-900"
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      {/* ── Top 3 Stat Cards ─────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Card 1: Total Pendapatan */}
        <div className="bg-[#1B4332] text-white rounded-2xl p-6 shadow-[0_4px_20px_rgba(3,59,42,0.06)] border border-[#06543c] ring-1 ring-black/5 relative overflow-hidden flex flex-col items-center justify-between text-center min-h-[155px]">
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
              Total Pendapatan ({topTimeFilter})
            </span>
            <p className="text-3xl font-extrabold tracking-tight text-white mt-2 drop-shadow-xs">
              {statCardValues.pendapatan}
            </p>
          </div>

          <div className="mt-4 flex items-center justify-center gap-2 relative z-10">
            <span className="inline-flex items-center gap-1 bg-white/15 backdrop-blur-xs text-emerald-200 text-xs font-semibold px-2.5 py-1 rounded-full border border-white/20 shadow-2xs">
              <ArrowUpRight className="w-3.5 h-3.5" />
              {statCardValues.pctPendapatan}
            </span>
            <span className="text-xs text-emerald-100/80 font-medium">
              Naik dari periode sebelumnya
            </span>
          </div>
        </div>

        {/* Card 2: Total Pembeli */}
        <div className="bg-white text-gray-900 rounded-2xl p-6 shadow-[0_4px_20px_rgba(3,59,42,0.06)] border border-emerald-300 ring-1 ring-black/5 flex flex-col items-center justify-between text-center min-h-[155px]">
          <div>
            <span className="text-gray-500 text-sm font-medium block">
              Total Pembeli ({topTimeFilter})
            </span>
            <div className="flex items-center justify-center gap-2 mt-2">
              <p className="text-3xl font-extrabold text-gray-900 tracking-tight">
                {statCardValues.pembeli}
              </p>
              <Users className="w-6 h-6 text-gray-800" />
            </div>
          </div>

          <div className="mt-4 flex items-center justify-center gap-2">
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-600 border border-emerald-100">
              <ArrowUpRight className="w-3.5 h-3.5" />
              {statCardValues.pctPembeli}
            </span>
            <span className="text-xs text-gray-400">
              Naik dari periode sebelumnya
            </span>
          </div>
        </div>

        {/* Card 3: Total Keuntungan */}
        <div className="bg-white text-gray-900 rounded-2xl p-6 shadow-[0_4px_20px_rgba(3,59,42,0.06)] border border-emerald-300 ring-1 ring-black/5 flex flex-col items-center justify-between text-center min-h-[155px]">
          <div>
            <span className="text-gray-500 text-sm font-medium block">
              Total Keuntungan ({topTimeFilter})
            </span>
            <p className="text-3xl font-extrabold text-gray-900 tracking-tight mt-2">
              {statCardValues.keuntungan}
            </p>
          </div>

          <div className="mt-4 flex items-center justify-center gap-2">
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-600 border border-emerald-100">
              <ArrowUpRight className="w-3.5 h-3.5" />
              {statCardValues.pctKeuntungan}
            </span>
            <span className="text-xs text-gray-400">
              Naik dari periode sebelumnya
            </span>
          </div>
        </div>
      </div>

      {/* ── Middle Section: Sales Chart & Payment Methods ──────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Grafik Penjualan — L-12 FIX: chartRange otomatis sinkron dengan topTimeFilter */}
        <Card className="bg-white rounded-2xl border border-emerald-300 ring-1 ring-black/5 shadow-[0_4px_20px_rgba(3,59,42,0.06)] lg:col-span-2">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base font-bold text-gray-800">
                Grafik Penjualan
              </CardTitle>
              <span className="text-xs font-semibold text-gray-400">
                {chartRange === "7d" ? "7 hari terakhir" : "30 hari terakhir"}
              </span>
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
                {chartRange === "7d" ? (
                  <>
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
                    {[
                      [30, 160],
                      [170, 140],
                      [320, 110],
                      [420, 125],
                      [470, 120],
                    ].map(([x, y], i) => (
                      <circle key={i} cx={x} cy={y} r="4" fill="#1B4332" stroke="white" strokeWidth="2" />
                    ))}
                  </>
                ) : (
                  <>
                    <path
                      d="M 30 150 C 70 100, 110 160, 160 90 C 210 130, 260 70, 310 100 C 360 60, 410 90, 470 50 L 470 180 L 30 180 Z"
                      fill="url(#transaksiChartGradient)"
                    />
                    <path
                      d="M 30 150 C 70 100, 110 160, 160 90 C 210 130, 260 70, 310 100 C 360 60, 410 90, 470 50"
                      fill="none"
                      stroke="#1B4332"
                      strokeWidth="3"
                      strokeLinecap="round"
                    />
                    {[
                      [30, 150],
                      [90, 130],
                      [160, 90],
                      [235, 110],
                      [310, 100],
                      [385, 75],
                      [470, 50],
                    ].map(([x, y], i) => (
                      <circle key={i} cx={x} cy={y} r="4" fill="#1B4332" stroke="white" strokeWidth="2" />
                    ))}
                  </>
                )}
              </svg>
              <div className="flex justify-between text-[11px] text-gray-400 font-semibold px-6 mt-2">
                {chartRange === "7d"
                  ? ["Sen", "Sel", "Rab", "Kam", "Jum", "Sab", "Min"].map((d) => <span key={d}>{d}</span>)
                  : ["Minggu 1", "Minggu 2", "Minggu 3", "Minggu 4"].map((d) => <span key={d}>{d}</span>)}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Payment Methods — D-11 FIX: dihitung dari data aktual */}
        <div className="bg-white rounded-2xl p-6 shadow-[0_4px_20px_rgba(3,59,42,0.06)] border border-emerald-300 ring-1 ring-black/5 flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-gray-900">
              Metode Pembayaran
            </h2>
          </div>

          <div className="h-56 flex items-end justify-between gap-2 pt-4 pb-1 px-1">
            {paymentMethodStats.map((bar, idx) => (
              <div
                key={idx}
                className="flex-1 flex flex-col items-center h-full justify-end group cursor-pointer"
              >
                <span className="text-[10px] font-bold text-emerald-800 mb-1.5 opacity-90 group-hover:scale-110 transition-transform">
                  {bar.val}%
                </span>
                <div className="w-full max-w-[28px] bg-emerald-50 rounded-t-lg overflow-hidden flex items-end h-40 border border-emerald-100/60">
                  <div
                    className="w-full bg-[#1B4332] rounded-t-lg group-hover:bg-[#05543c] transition-all duration-500 shadow-xs"
                    style={{ height: `${bar.val}%` }}
                  />
                </div>
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
        {/* Table Controls */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative w-full sm:w-80">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Cari log transaksi..."
              className="w-full bg-[#f3f4f6] text-sm text-gray-800 placeholder:text-gray-400 rounded-full pl-4 pr-10 py-2.5 outline-none focus:ring-2 focus:ring-[#1B4332]/20 transition"
            />
            <Search className="w-4 h-4 text-gray-700 absolute right-3.5 top-1/2 -translate-y-1/2" />
          </div>

          <div className="bg-[#eefcf4] p-1.5 rounded-full border border-[#c6f0d8] inline-flex items-center gap-1.5 shrink-0">
            {(["Semua", "7 hari", "30 hari"] as const).map((filter) => (
              <button
                key={filter}
                onClick={() => {
                  setTableTimeFilter(filter);
                  setCurrentPage(1);
                }}
                className={`px-4 py-1.5 text-xs rounded-full transition cursor-pointer ${
                  tableTimeFilter === filter
                    ? "font-bold bg-[#1B4332] text-white shadow-2xs"
                    : "font-semibold text-gray-500 hover:text-gray-900"
                }`}
              >
                {filter}
              </button>
            ))}
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
              {paginatedData.length > 0 ? (
                paginatedData.map((item, index) => (
                  <tr key={index} className="hover:bg-gray-50/60 transition-colors">
                    <td className="py-4 px-3 font-medium text-gray-700 text-xs">{item.id}</td>
                    <td className="py-4 px-3 text-center text-gray-600 text-xs">{item.date}</td>
                    <td className="py-4 px-3 font-semibold text-gray-800 text-xs">{item.customer}</td>
                    <td className="py-4 px-3 text-center font-medium text-gray-700 text-xs">{item.method}</td>
                    <td className="py-4 px-3 text-center font-medium text-gray-900 text-xs">{item.total}</td>
                    <td className="py-4 px-3 text-center">
                      <span className={`inline-flex items-center justify-center border rounded-full px-4 py-1 text-xs font-semibold ${statusBadgeClass[item.status]}`}>
                        {item.status}
                      </span>
                    </td>
                    <td className="py-4 px-3 text-center pr-2">
                      <button
                        onClick={() => setSelectedTx(item)}
                        className="bg-[#1B4332] hover:bg-[#05543c] text-white rounded-full px-5 py-2 text-xs font-semibold transition cursor-pointer shadow-2xs"
                      >
                        Lihat detail
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-gray-400 text-xs font-medium">
                    Tidak ada log transaksi yang ditemukan.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* D-04 FIX: Standardized pagination style — D-08 FIX: Indonesian labels */}
        <div className="pt-2 flex items-center justify-end gap-3 text-xs">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            className="bg-[#1B4332] hover:bg-[#05543c] disabled:opacity-40 text-white rounded-full px-4.5 py-2 font-medium transition cursor-pointer shadow-xs"
          >
            Sebelumnya
          </button>
          <div className="flex items-center gap-2 font-medium">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
              <span
                key={pageNum}
                onClick={() => setCurrentPage(pageNum)}
                className={`w-7 h-7 flex items-center justify-center rounded-full cursor-pointer transition ${
                  currentPage === pageNum
                    ? "bg-[#1B4332] text-white font-bold"
                    : "text-gray-500 hover:bg-gray-100"
                }`}
              >
                {pageNum}
              </span>
            ))}
          </div>
          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            className="bg-[#1B4332] hover:bg-[#05543c] disabled:opacity-40 text-white rounded-full px-4.5 py-2 font-medium transition cursor-pointer shadow-xs"
          >
            Selanjutnya
          </button>
        </div>
      </div>

      {/* ── Transaction Detail Modal — D-01 FIX: colored status badge ── */}
      {selectedTx && (
        <Dialog open={!!selectedTx} onOpenChange={(open) => !open && setSelectedTx(null)}>
          <DialogContent className="sm:max-w-lg bg-white rounded-2xl p-6 shadow-2xl border border-emerald-100">
            <DialogHeader className="pb-4 border-b border-gray-100">
              <DialogTitle className="text-lg font-bold text-gray-900">
                Detail Transaksi {selectedTx.id}
              </DialogTitle>
              <DialogDescription className="text-xs text-gray-500">
                Rincian transaksi dan metode pembayaran
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-5 py-3">
              <div className="grid grid-cols-2 gap-4 text-xs bg-emerald-50/40 p-4 rounded-xl border border-emerald-100">
                <div>
                  <span className="text-gray-400 block mb-1">Pelanggan</span>
                  <span className="font-semibold text-gray-900 text-sm">{selectedTx.customer}</span>
                </div>
                <div>
                  <span className="text-gray-400 block mb-1">Tanggal</span>
                  <span className="font-semibold text-gray-900 text-sm">{selectedTx.date}</span>
                </div>
                <div>
                  <span className="text-gray-400 block mb-1">Metode Bayar</span>
                  <span className="font-semibold text-gray-900 text-sm">{selectedTx.method}</span>
                </div>
                <div>
                  <span className="text-gray-400 block mb-1">Status</span>
                  <span className={`inline-flex items-center border rounded-full px-3 py-1 text-xs font-semibold ${statusBadgeClass[selectedTx.status]}`}>
                    {selectedTx.status}
                  </span>
                </div>
              </div>

              {selectedTx.items && selectedTx.items.length > 0 && (
                <div>
                  <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-3">
                    Item Pembelian
                  </h4>
                  <div className="space-y-2.5">
                    {selectedTx.items.map((item, idx) => (
                      <div key={idx} className="flex justify-between items-center text-sm border-b border-gray-50 pb-2.5">
                        <div>
                          <p className="font-semibold text-gray-800">{item.name}</p>
                          <p className="text-xs text-gray-400">Qty: {item.qty}</p>
                        </div>
                        <span className="font-bold text-gray-900">{item.price}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex justify-between items-center pt-3 border-t border-gray-100">
                <span className="font-bold text-gray-700 text-sm">Total Pembayaran</span>
                <span className="text-lg font-extrabold text-[#1B4332]">{selectedTx.total}</span>
              </div>
            </div>

            <DialogFooter className="pt-3">
              <Button
                onClick={() => setSelectedTx(null)}
                className="w-full bg-[#1B4332] hover:bg-[#032e21] text-white rounded-xl h-10 text-sm font-semibold cursor-pointer shadow-sm"
              >
                Tutup
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
