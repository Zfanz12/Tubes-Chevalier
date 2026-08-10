"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  ArrowUpRight,
  Users,
  ChevronRight,
  X,
  Package,
  Calendar,
  CreditCard,
  UserCheck,
  Loader2,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { TestToastButton } from "@/components/ui/test-toast-button";
import { showToast } from "@/lib/custom-toast";
import { getTransaksi, formatRupiah, formatTanggal, mapMetodePembayaran, type ApiTransaksi } from "@/lib/api";
import { useAuthStore } from "@/lib/useAuthStore";

// ── Stat Cards Data ─────────────────────────────────────────────
const statCards7d = [
  {
    label: "Penjualan Hari Ini",
    value: "Rp 750.000",
    change: "+15%",
    trend: "up",
    note: "Naik dari hari sebelumnya",
    dark: true,
  },
  {
    label: "Pembeli Hari Ini",
    value: "27",
    icon: <Users className="w-6 h-6 text-gray-800" />,
    change: "+12%",
    trend: "up",
    note: "Naik dari hari sebelumnya",
    dark: false,
  },
  {
    label: "Keuntungan Hari Ini",
    value: "Rp 50.000",
    change: "+15%",
    trend: "up",
    note: "Naik dari hari sebelumnya",
    dark: false,
  },
];

const statCards30d = [
  {
    label: "Penjualan 30 Hari",
    value: "Rp 22.500.000",
    change: "+28%",
    trend: "up",
    note: "Naik dari bulan lalu",
    dark: true,
  },
  {
    label: "Pembeli 30 Hari",
    value: "840",
    icon: <Users className="w-6 h-6 text-gray-800" />,
    change: "+18%",
    trend: "up",
    note: "Naik dari bulan lalu",
    dark: false,
  },
  {
    label: "Keuntungan 30 Hari",
    value: "Rp 1.850.000",
    change: "+22%",
    trend: "up",
    note: "Naik dari bulan lalu",
    dark: false,
  },
];

// ── Order Status ────────────────────────────────────────────
const orderStatuses = [
  { label: "Menunggu", count: 2, color: "border-l-red-500 bg-red-50/60 border-red-100", textColor: "text-red-700" },
  { label: "Disiapkan", count: 29, color: "border-l-amber-500 bg-amber-50/60 border-amber-100", textColor: "text-amber-700" },
  { label: "Dalam Perjalanan", count: 109, color: "border-l-blue-500 bg-blue-50/60 border-blue-100", textColor: "text-blue-700" },
  { label: "Selesai", count: 273, color: "border-l-emerald-500 bg-emerald-50/60 border-emerald-100", textColor: "text-emerald-700" },
];

// ── Low Stock ───────────────────────────────────────────────
const lowStockItems = [
  { name: "Kangkung", amount: "2 kg", bg: "bg-red-50 border-red-100 text-red-700", badge: "border-red-200 text-red-700 bg-white" },
  { name: "Sawi Putih", amount: "3 kg", bg: "bg-amber-50 border-amber-100 text-amber-700", badge: "border-amber-200 text-amber-700 bg-white" },
  { name: "Wortel", amount: "5 kg", bg: "bg-emerald-50/60 border-emerald-200 text-emerald-700", badge: "border-emerald-200 text-emerald-700 bg-white" },
  { name: "Tomat", amount: "7 kg", bg: "bg-emerald-50/60 border-emerald-200 text-emerald-700", badge: "border-emerald-200 text-emerald-700 bg-white" },
];

// ── Harvest Items ───────────────────────────────────────────
const initialHarvestItems = [
  { name: "Bayam", selected: true },
  { name: "Kangkung", selected: true },
  { name: "Sawi Putih", selected: false },
  { name: "Wortel", selected: true },
  { name: "Tomat", selected: false },
  { name: "Pak Choy", selected: false },
  { name: "Brokoli", selected: false },
];

// ── Transactions (sekarang diambil dari API) ──────────────────────────────────
interface DashboardTx {
  id: string;
  date: string;
  customer: string;
  method: string;
  total: string;
  status: "Menunggu" | "Disiapkan" | "Sedang Dikirim" | "Selesai";
  items: { name: string; qty: string; price: string }[];
}

function mapToDashboardTx(t: ApiTransaksi): DashboardTx {
  const statusMap: Record<string, DashboardTx["status"]> = {
    pending: "Menunggu",
    processing: "Disiapkan",
    shipped: "Sedang Dikirim",
    completed: "Selesai",
  };
  return {
    id: t.kode_transaksi || `#${t.id}`,
    date: formatTanggal(t.created_at),
    customer: t.user?.name ?? t.petani?.nama ?? "—",
    method: mapMetodePembayaran(t.metode_pembayaran),
    total: formatRupiah(t.total_harga),
    status: statusMap[t.status_pesanan] ?? "Menunggu",
    items: t.items?.map((item) => ({
      name: item.produk?.nama_barang ?? `Produk #${item.produk_id}`,
      qty: `${item.jumlah} kg`,
      price: formatRupiah(item.harga_satuan * item.jumlah),
    })) ?? [],
  };
}

const statusBadgeClass: Record<string, string> = {
  Menunggu: "bg-red-50 text-red-600 border-red-200",
  Disiapkan: "bg-amber-50 text-amber-700 border-amber-200",
  "Sedang Dikirim": "bg-blue-50 text-blue-600 border-blue-200",
  Selesai: "bg-emerald-50 text-emerald-700 border-emerald-200",
};

export default function DashboardPage() {
  const token = useAuthStore((s) => s.token);
  const [range, setRange] = useState<"7d" | "30d">("7d");
  const [harvestItems, setHarvestItems] = useState(initialHarvestItems);
  const [selectedTx, setSelectedTx] = useState<DashboardTx | null>(null);
  const [recentTransactions, setRecentTransactions] = useState<DashboardTx[]>([]);
  const [txLoading, setTxLoading] = useState(true);

  const fetchRecentTx = useCallback(async () => {
    if (!token) { setTxLoading(false); return; }
    try {
      const data = await getTransaksi(token);
      setRecentTransactions(data.slice(0, 4).map(mapToDashboardTx));
    } catch {
      // Silently fail — tabel tetap kosong
    } finally {
      setTxLoading(false);
    }
  }, [token]);

  useEffect(() => { fetchRecentTx(); }, [fetchRecentTx]);

  const currentStatCards = range === "7d" ? statCards7d : statCards30d;

  const toggleHarvest = (name: string) => {
    setHarvestItems((prev) =>
      prev.map((item) => {
        if (item.name === name) {
          const nextSelected = !item.selected;
          showToast(
            nextSelected
              ? `${name} ditandai siap panen hari ini`
              : `${name} dihapus dari daftar panen hari ini`,
            "success"
          );
          return { ...item, selected: nextSelected };
        }
        return item;
      })
    );
  };

  return (
    <div className="w-full space-y-6">
      {/* ── Top Stat Cards — Design match with transaksi/page.tsx ── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {currentStatCards.map((card) =>
          card.dark ? (
            /* Card 1: Penjualan (Dark Green Card with Arc Gradient SVG) */
            <div
              key={card.label}
              className="bg-[#1B4332] text-white rounded-2xl p-6 shadow-[0_4px_20px_rgba(3,59,42,0.06)] border border-[#06543c] ring-1 ring-black/5 relative overflow-hidden flex flex-col items-center justify-between text-center min-h-[155px]"
            >
              <div className="absolute -top-16 -right-16 w-80 h-80 pointer-events-none opacity-45 overflow-hidden">
                <svg className="w-full h-full" viewBox="0 0 320 320" fill="none">
                  <circle cx="250" cy="60" r="280" fill="url(#dashArcGrad1)" opacity="0.35" />
                  <circle cx="250" cy="60" r="210" fill="url(#dashArcGrad2)" opacity="0.45" />
                  <circle cx="250" cy="60" r="140" fill="url(#dashArcGrad3)" opacity="0.55" />
                  <circle cx="250" cy="60" r="80" fill="url(#dashArcGrad4)" opacity="0.65" />
                  <circle cx="250" cy="60" r="40" fill="url(#dashArcGrad4)" opacity="1" />
                  <defs>
                    <linearGradient id="dashArcGrad1" x1="320" y1="0" x2="0" y2="320" gradientUnits="userSpaceOnUse">
                      <stop offset="0%" stopColor="#2d6a4f" stopOpacity="0.85" />
                      <stop offset="100%" stopColor="#1B4332" stopOpacity="0" />
                    </linearGradient>
                    <linearGradient id="dashArcGrad2" x1="320" y1="0" x2="0" y2="320" gradientUnits="userSpaceOnUse">
                      <stop offset="0%" stopColor="#40916c" stopOpacity="0.9" />
                      <stop offset="100%" stopColor="#1B4332" stopOpacity="0" />
                    </linearGradient>
                    <linearGradient id="dashArcGrad3" x1="320" y1="0" x2="0" y2="320" gradientUnits="userSpaceOnUse">
                      <stop offset="0%" stopColor="#52b788" stopOpacity="0.95" />
                      <stop offset="100%" stopColor="#1B4332" stopOpacity="0" />
                    </linearGradient>
                    <linearGradient id="dashArcGrad4" x1="320" y1="0" x2="0" y2="320" gradientUnits="userSpaceOnUse">
                      <stop offset="0%" stopColor="#74c69d" stopOpacity="0.95" />
                      <stop offset="100%" stopColor="#1B4332" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>

              <div className="relative z-10">
                <span className="text-emerald-100/90 text-sm font-medium block drop-shadow-xs">
                  {card.label}
                </span>
                <p className="text-3xl font-extrabold tracking-tight text-white mt-2 drop-shadow-xs">
                  {card.value}
                </p>
              </div>

              <div className="mt-4 flex items-center justify-center gap-2 relative z-10">
                <span className="inline-flex items-center gap-1 bg-white/15 backdrop-blur-xs text-emerald-200 text-xs font-semibold px-2.5 py-1 rounded-full border border-white/20 shadow-2xs">
                  <ArrowUpRight className="w-3.5 h-3.5" />
                  {card.change}
                </span>
                <span className="text-xs text-emerald-100/80 font-medium">
                  {card.note}
                </span>
              </div>
            </div>
          ) : (
            /* Card 2 & 3: White Cards match with transaksi/page.tsx */
            <div
              key={card.label}
              className="bg-white text-gray-900 rounded-2xl p-6 shadow-[0_4px_20px_rgba(3,59,42,0.06)] border border-emerald-300 ring-1 ring-black/5 flex flex-col items-center justify-between text-center min-h-[155px]"
            >
              <div>
                <span className="text-gray-500 text-sm font-medium block">
                  {card.label}
                </span>
                <div className="flex items-center justify-center gap-2 mt-2">
                  <p className="text-3xl font-extrabold text-gray-900 tracking-tight">
                    {card.value}
                  </p>
                  {card.icon}
                </div>
              </div>

              <div className="mt-4 flex items-center justify-center gap-2">
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-600 border border-emerald-100">
                  <ArrowUpRight className="w-3.5 h-3.5" />
                  {card.change}
                </span>
                <span className="text-xs text-gray-400">
                  {card.note}
                </span>
              </div>
            </div>
          )
        )}
      </div>

      {/* ── Chart & Order Status ── */}
      <div className="grid gap-5 lg:grid-cols-3">
        {/* Grafik Penjualan */}
        <div className="bg-white rounded-2xl p-6 shadow-[0_4px_20px_rgba(3,59,42,0.06)] border border-emerald-300 ring-1 ring-black/5 lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-gray-800">
              Grafik Penjualan
            </h2>
            <div className="bg-[#eefcf4] p-1.5 rounded-full border border-[#c6f0d8] inline-flex items-center gap-1.5">
              <button
                onClick={() => setRange("30d")}
                className={`px-4 py-1.5 text-xs rounded-full transition cursor-pointer ${
                  range === "30d"
                    ? "font-bold bg-[#1B4332] text-white shadow-2xs"
                    : "font-semibold text-gray-500 hover:text-gray-900"
                }`}
              >
                30 hari
              </button>
              <button
                onClick={() => setRange("7d")}
                className={`px-4 py-1.5 text-xs rounded-full transition cursor-pointer ${
                  range === "7d"
                    ? "font-bold bg-[#1B4332] text-white shadow-2xs"
                    : "font-semibold text-gray-500 hover:text-gray-900"
                }`}
              >
                7 hari
              </button>
            </div>
          </div>

          <div className="h-56 w-full relative pt-2">
            <svg viewBox="0 0 500 200" className="w-full h-full">
              <defs>
                <linearGradient id="dashChartGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#1B4332" stopOpacity="0.2" />
                  <stop offset="100%" stopColor="#1B4332" stopOpacity="0" />
                </linearGradient>
              </defs>
              <line x1="30" y1="20" x2="470" y2="20" stroke="#f1f5f9" strokeWidth="1" />
              <line x1="30" y1="60" x2="470" y2="60" stroke="#f1f5f9" strokeWidth="1" />
              <line x1="30" y1="100" x2="470" y2="100" stroke="#f1f5f9" strokeWidth="1" />
              <line x1="30" y1="140" x2="470" y2="140" stroke="#f1f5f9" strokeWidth="1" />
              <line x1="30" y1="180" x2="470" y2="180" stroke="#e2e8f0" strokeWidth="1.5" />
              {range === "7d" ? (
                <>
                  <path
                    d="M 30 160 C 80 140, 120 130, 170 140 C 220 150, 270 110, 320 110 C 370 110, 420 135, 470 120 L 470 180 L 30 180 Z"
                    fill="url(#dashChartGradient)"
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
                    fill="url(#dashChartGradient)"
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
              {range === "7d"
                ? ["Sen", "Sel", "Rab", "Kam", "Jum", "Sab", "Min"].map((d) => <span key={d}>{d}</span>)
                : ["Minggu 1", "Minggu 2", "Minggu 3", "Minggu 4"].map((d) => <span key={d}>{d}</span>)}
            </div>
          </div>
        </div>

        {/* Status Pesanan */}
        <div className="bg-white rounded-2xl p-6 shadow-[0_4px_20px_rgba(3,59,42,0.06)] border border-emerald-300 ring-1 ring-black/5 space-y-4">
          <h2 className="text-base font-bold text-gray-800">
            Status Pesanan
          </h2>
          <div className="space-y-3 pt-1">
            {orderStatuses.map((s) => (
              <div
                key={s.label}
                className={`flex items-center justify-between p-3.5 rounded-xl border border-l-4 ${s.color}`}
              >
                <span className={`font-semibold text-xs ${s.textColor}`}>{s.label}</span>
                <span className={`text-xl font-bold ${s.textColor}`}>{s.count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Stock Alert & Harvest ── */}
      <div className="grid gap-5 md:grid-cols-2">
        {/* Stok Hampir Habis */}
        <div className="bg-white rounded-2xl p-6 shadow-[0_4px_20px_rgba(3,59,42,0.06)] border border-emerald-300 ring-1 ring-black/5 space-y-4">
          <h2 className="text-base font-bold text-gray-800">
            Stok Hampir Habis
          </h2>
          <div className="space-y-2.5 pt-1">
            {lowStockItems.map((item) => (
              <div
                key={item.name}
                className={`flex items-center justify-between p-3.5 rounded-xl border ${item.bg}`}
              >
                <span className="font-semibold text-xs text-gray-800">
                  {item.name}
                </span>
                <span className={`inline-flex items-center justify-center border rounded-full px-3.5 py-0.5 text-xs font-bold ${item.badge}`}>
                  {item.amount}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Panen Hari Ini */}
        <div className="bg-white rounded-2xl p-6 shadow-[0_4px_20px_rgba(3,59,42,0.06)] border border-emerald-300 ring-1 ring-black/5 space-y-4">
          <h2 className="text-base font-bold text-gray-800">
            Panen Hari Ini
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 pt-1">
            {harvestItems.map((veg) => (
              <button
                key={veg.name}
                onClick={() => toggleHarvest(veg.name)}
                className={`transition-all text-xs font-medium py-3 px-3.5 rounded-xl text-center cursor-pointer border ${
                  veg.selected
                    ? "bg-[#1B4332] text-white border-[#1B4332] shadow-xs font-bold"
                    : "bg-gray-50 hover:bg-emerald-50 border-gray-100 hover:border-emerald-200 text-gray-700 hover:text-emerald-800"
                }`}
              >
                {veg.name}
              </button>
            ))}
          </div>
        </div>
      </div>

        {/* ── Recent Transactions Table ── */}
      <div className="bg-white rounded-2xl p-6 shadow-[0_4px_20px_rgba(3,59,42,0.06)] border border-emerald-300 ring-1 ring-black/5 space-y-5">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-gray-800">
            Transaksi Terbaru
          </h2>
          <Link
            href="/transaksi"
            className="text-[#1B4332] hover:text-[#032e21] font-bold text-xs inline-flex items-center gap-1 px-3 py-1.5 rounded-full hover:bg-emerald-50 transition"
          >
            Lihat semua
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        {txLoading ? (
          <div className="flex items-center justify-center py-10 gap-2 text-gray-400">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span className="text-xs font-medium">Memuat transaksi...</span>
          </div>
        ) : recentTransactions.length === 0 ? (
          <p className="text-center text-xs text-gray-400 py-8">Belum ada transaksi.</p>
        ) : (
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
                <th className="py-3.5 px-3 text-center pr-2">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
              {recentTransactions.map((tx, i) => (
                <tr key={i} className="hover:bg-gray-50/60 transition-colors">
                  <td className="py-4 px-3 font-medium text-gray-700 text-xs">{tx.id}</td>
                  <td className="py-4 px-3 text-center text-gray-600 text-xs">{tx.date}</td>
                  <td className="py-4 px-3 font-semibold text-gray-800 text-xs">{tx.customer}</td>
                  <td className="py-4 px-3 text-center font-medium text-gray-700 text-xs">{tx.method}</td>
                  <td className="py-4 px-3 text-center font-medium text-gray-900 text-xs">{tx.total}</td>
                  <td className="py-4 px-3 text-center">
                    <span className={`inline-flex items-center justify-center border rounded-full px-4 py-1 text-xs font-semibold ${statusBadgeClass[tx.status]}`}>
                      {tx.status}
                    </span>
                  </td>
                  <td className="py-4 px-3 text-center pr-2">
                    <button
                      onClick={() => setSelectedTx(tx)}
                      className="bg-[#1B4332] hover:bg-[#05543c] text-white rounded-full px-5 py-2 text-xs font-semibold transition cursor-pointer shadow-2xs"
                    >
                      Lihat detail
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        )}
      </div>

      {/* ── Transaction Detail Modal — Matching standard clean white modal design ── */}
      {selectedTx && (
        <Dialog open={!!selectedTx} onOpenChange={(open) => !open && setSelectedTx(null)}>
          <DialogContent className="sm:max-w-lg bg-white rounded-2xl p-6 shadow-2xl border border-gray-100">
            <DialogHeader className="pb-3 border-b border-gray-100">
              <DialogTitle className="text-lg font-bold text-gray-900">
                Detail Transaksi {selectedTx.id}
              </DialogTitle>
              <DialogDescription className="text-xs text-gray-500">
                Informasi rincian pesanan dan status transaksi
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-5 py-3 text-xs">
              <div className="grid grid-cols-2 gap-4 bg-emerald-50/40 p-4 rounded-xl border border-emerald-100">
                <div>
                  <span className="text-gray-400 block mb-1">Pelanggan</span>
                  <span className="font-semibold text-gray-900 text-sm">{selectedTx.customer}</span>
                </div>
                <div>
                  <span className="text-gray-400 block mb-1">Tanggal</span>
                  <span className="font-semibold text-gray-900 text-sm">{selectedTx.date}</span>
                </div>
                <div>
                  <span className="text-gray-400 block mb-1">Metode Pembayaran</span>
                  <span className="font-semibold text-gray-900 text-sm">{selectedTx.method}</span>
                </div>
                <div>
                  <span className="text-gray-400 block mb-1">Status</span>
                  <span className={`inline-flex items-center border rounded-full px-3 py-1 text-xs font-semibold ${statusBadgeClass[selectedTx.status]}`}>
                    {selectedTx.status}
                  </span>
                </div>
              </div>

              <div>
                <h4 className="font-bold text-gray-700 uppercase tracking-wider mb-2.5">Item Pembelian</h4>
                <div className="space-y-2.5">
                  {selectedTx.items.map((item, idx) => (
                    <div key={idx} className="flex justify-between items-center text-xs border-b border-gray-50 pb-2.5">
                      <div>
                        <p className="font-semibold text-gray-800">{item.name}</p>
                        <p className="text-gray-400">Qty: {item.qty}</p>
                      </div>
                      <span className="font-bold text-gray-900">{item.price}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-between items-center pt-3 border-t border-gray-100">
                <span className="font-bold text-gray-700 text-sm">Total Pembayaran</span>
                <span className="text-lg font-extrabold text-[#1B4332]">{selectedTx.total}</span>
              </div>
            </div>

            <DialogFooter className="pt-3">
              <Button
                onClick={() => setSelectedTx(null)}
                className="w-full bg-[#1B4332] hover:bg-[#032e21] text-white rounded-xl h-10 text-xs font-semibold cursor-pointer shadow-xs"
              >
                Tutup
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Floating test toast button */}
      <TestToastButton />
    </div>
  );
}
