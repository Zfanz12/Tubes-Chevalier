"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowUpRight,
  Users,
  ChevronRight,
  Loader2,
  AlertTriangle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
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
  { label: "Menunggu", count: 2, bg: "bg-red-50/60 border-red-100", barColor: "bg-red-500", textColor: "text-red-700", statusKey: "pending" },
  { label: "Disiapkan", count: 29, bg: "bg-amber-50/60 border-amber-100", barColor: "bg-amber-500", textColor: "text-amber-700", statusKey: "processing" },
  { label: "Dalam Perjalanan", count: 109, bg: "bg-blue-50/60 border-blue-100", barColor: "bg-blue-500", textColor: "text-blue-700", statusKey: "shipped" },
  { label: "Selesai", count: 273, bg: "bg-emerald-50/60 border-emerald-100", barColor: "bg-emerald-500", textColor: "text-emerald-700", statusKey: "completed" },
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

// ── Fallback Transactions for standalone / API offline mode ─
interface DashboardTx {
  id: string;
  date: string;
  customer: string;
  method: string;
  total: string;
  rawTotal: number;
  status: "Menunggu" | "Disiapkan" | "Sedang Dikirim" | "Selesai";
  items: { name: string; qty: string; price: string }[];
}

const MOCK_TRANSACTIONS: DashboardTx[] = [
  {
    id: "TRX-88219",
    date: "12 Agt 2026, 14:20",
    customer: "Budi Santoso",
    method: "Transfer Bank (BCA)",
    total: "Rp 150.000",
    rawTotal: 150000,
    status: "Disiapkan",
    items: [
      { name: "Bayam Organik", qty: "3 kg", price: "Rp 45.000" },
      { name: "Wortel Segar", qty: "5 kg", price: "Rp 105.000" },
    ],
  },
  {
    id: "TRX-88218",
    date: "12 Agt 2026, 11:05",
    customer: "Siti Rahmawati",
    method: "E-Wallet (QRIS)",
    total: "Rp 85.000",
    rawTotal: 85000,
    status: "Sedang Dikirim",
    items: [{ name: "Kangkung Hidroponik", qty: "5 kg", price: "Rp 85.000" }],
  },
  {
    id: "TRX-88217",
    date: "11 Agt 2026, 16:45",
    customer: "Ahmad Dahlan",
    method: "COD",
    total: "Rp 210.000",
    rawTotal: 210000,
    status: "Selesai",
    items: [
      { name: "Sawi Putih", qty: "4 kg", price: "Rp 60.000" },
      { name: "Tomat Merah", qty: "10 kg", price: "Rp 150.000" },
    ],
  },
  {
    id: "TRX-88216",
    date: "11 Agt 2026, 09:30",
    customer: "Dewi Lestari",
    method: "Transfer Bank (Mandiri)",
    total: "Rp 95.000",
    rawTotal: 95000,
    status: "Menunggu",
    items: [{ name: "Pak Choy", qty: "5 kg", price: "Rp 95.000" }],
  },
];

function mapToDashboardTx(t: ApiTransaksi): DashboardTx {
  const statusMap: Record<string, DashboardTx["status"]> = {
    pending: "Menunggu",
    processing: "Disiapkan",
    shipped: "Sedang Dikirim",
    completed: "Selesai",
  };
  return {
    id: t.kode_transaksi || `#${t.id}`,
    date: t.created_at ? formatTanggal(t.created_at) : "—",
    customer: t.user?.name ?? t.petani?.nama ?? "Pelanggan",
    method: mapMetodePembayaran(t.metode_pembayaran),
    total: formatRupiah(t.total_harga ?? 0),
    rawTotal: t.total_harga ?? 0,
    status: statusMap[t.status_pesanan] ?? "Menunggu",
    items: t.items?.map((item) => ({
      name: item.produk?.nama_barang ?? `Produk #${item.produk_id}`,
      qty: `${item.jumlah ?? 1} kg`,
      price: formatRupiah((item.harga_satuan ?? 0) * (item.jumlah ?? 1)),
    })) ?? [],
  };
}

const statusBadgeClass: Record<string, string> = {
  Menunggu: "bg-red-50 text-red-600 border-red-200",
  Disiapkan: "bg-amber-50 text-amber-700 border-amber-200",
  "Sedang Dikirim": "bg-blue-50 text-blue-600 border-blue-200",
  Selesai: "bg-emerald-50 text-emerald-700 border-emerald-200",
};

// ── Chart Points Data ──────────────────────────────────────────
const CHART_POINTS_7D = [
  { day: "Sen", val: "Rp 500.000", x: 30, y: 160 },
  { day: "Sel", val: "Rp 650.000", x: 170, y: 140 },
  { day: "Rab", val: "Rp 850.000", x: 320, y: 110 },
  { day: "Kam", val: "Rp 720.000", x: 420, y: 125 },
  { day: "Jum", val: "Rp 750.000", x: 470, y: 120 },
];

const CHART_POINTS_30D = [
  { day: "Minggu 1", val: "Rp 4.200.000", x: 30, y: 150 },
  { day: "Minggu 2", val: "Rp 5.800.000", x: 160, y: 90 },
  { day: "Minggu 3", val: "Rp 5.100.000", x: 310, y: 100 },
  { day: "Minggu 4", val: "Rp 7.400.000", x: 470, y: 50 },
];

export default function DashboardPage() {
  const router = useRouter();
  const token = useAuthStore((s) => s.token);
  const [range, setRange] = useState<"7d" | "30d">("7d");
  const [harvestItems, setHarvestItems] = useState(initialHarvestItems);
  const [selectedTx, setSelectedTx] = useState<DashboardTx | null>(null);
  const [recentTransactions, setRecentTransactions] = useState<DashboardTx[]>(MOCK_TRANSACTIONS);
  const [txLoading, setTxLoading] = useState(true);
  const [hoveredPoint, setHoveredPoint] = useState<{ day: string; val: string; x: number; y: number } | null>(null);

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

  const fetchRecentTx = useCallback(async () => {
    if (!token) {
      setRecentTransactions(MOCK_TRANSACTIONS);
      setTxLoading(false);
      return;
    }
    try {
      const data = await getTransaksi(token);
      if (Array.isArray(data) && data.length > 0) {
        setRecentTransactions(data.slice(0, 4).map(mapToDashboardTx));
      } else {
        setRecentTransactions(MOCK_TRANSACTIONS);
      }
    } catch {
      setRecentTransactions(MOCK_TRANSACTIONS);
    } finally {
      setTxLoading(false);
    }
  }, [token]);

function parseTxDate(dateStr: string): Date | null {
  if (!dateStr) return null;
  if (dateStr.includes("/")) {
    const [d, m, y] = dateStr.split("/").map(Number);
    if (d && m && y) return new Date(y, m - 1, d);
  }
  const parsed = new Date(dateStr);
  if (!isNaN(parsed.getTime())) return parsed;

  const monthMap: Record<string, number> = {
    Jan: 0, Feb: 1, Mar: 2, Apr: 3, Mei: 4, Jun: 5,
    Jul: 6, Agt: 7, Sep: 8, Okt: 9, Nov: 10, Des: 11
  };
  const parts = dateStr.replace(",", "").split(" ");
  if (parts.length >= 3) {
    const day = parseInt(parts[0], 10);
    const mStr = parts[1];
    const year = parseInt(parts[2], 10);
    if (day && monthMap[mStr] !== undefined && year) {
      return new Date(year, monthMap[mStr], day);
    }
  }
  return null;
}

  // Compute dynamic chart data from real API transactions
  const dynamicChart = useMemo(() => {
    const days7 = ["Sen", "Sel", "Rab", "Kam", "Jum", "Sab", "Min"];
    const weeks30 = ["Minggu 1", "Minggu 2", "Minggu 3", "Minggu 4"];
    const labels = range === "7d" ? days7 : weeks30;
    const totals: number[] = new Array(labels.length).fill(0);

    recentTransactions.forEach((tx) => {
      const d = parseTxDate(tx.date);
      if (d) {
        if (range === "7d") {
          const jsDay = d.getDay();
          const idx = jsDay === 0 ? 6 : jsDay - 1;
          if (idx >= 0 && idx < 7) totals[idx] += tx.rawTotal;
        } else {
          let wIdx = Math.floor((d.getDate() - 1) / 7);
          if (wIdx > 3) wIdx = 3;
          totals[wIdx] += tx.rawTotal;
        }
      }
    });

    const maxVal = Math.max(...totals, 100000);
    const yMin = 30;
    const yMax = 160;
    const step = (470 - 30) / (labels.length - 1);

    const points = labels.map((day, i) => {
      const x = 30 + i * step;
      const rawVal = totals[i];
      const y = yMax - (rawVal / maxVal) * (yMax - yMin);
      return { day, val: formatRupiah(rawVal), x, y };
    });

    let pathD = `M ${points[0].x} ${points[0].y}`;
    for (let i = 1; i < points.length; i++) {
      const prev = points[i - 1];
      const curr = points[i];
      const cx = prev.x + (curr.x - prev.x) / 2;
      pathD += ` C ${cx} ${prev.y}, ${cx} ${curr.y}, ${curr.x} ${curr.y}`;
    }
    const areaD = `${pathD} L ${points[points.length - 1].x} 180 L ${points[0].x} 180 Z`;

    return { points, pathD, areaD, labels };
  }, [recentTransactions, range]);

  useEffect(() => {
    fetchRecentTx();
  }, [fetchRecentTx]);

  const currentStatCards = range === "7d" ? statCards7d : statCards30d;

  return (
    <div className="w-full space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {currentStatCards.map((card, idx) =>
          idx === 0 ? (
            <div
              key={card.label}
              className="bg-[#1B4332] text-white rounded-2xl p-6 shadow-sm flex flex-col justify-between items-center text-center relative overflow-hidden min-h-[155px]"
            >
              <div className="absolute -bottom-10 -right-10 w-44 h-44 pointer-events-none opacity-40">
                <svg viewBox="0 0 200 200" fill="none" className="w-full h-full">
                  <circle cx="160" cy="160" r="140" fill="url(#dashArcGrad1)" />
                  <circle cx="160" cy="160" r="100" fill="url(#dashArcGrad2)" />
                  <circle cx="160" cy="160" r="60" fill="url(#dashArcGrad3)" />
                  <defs>
                    <linearGradient id="dashArcGrad1" x1="320" y1="0" x2="0" y2="320" gradientUnits="userSpaceOnUse">
                      <stop offset="0%" stopColor="#2d6a4f" stopOpacity="0.8" />
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
                  </defs>
                </svg>
              </div>

              <div className="relative z-10 space-y-1">
                <span className="text-emerald-100/90 text-sm font-medium block">
                  {card.label}
                </span>
                <p className="text-3xl font-extrabold tracking-tight text-white">
                  {card.value}
                </p>
              </div>

              <div className="mt-4 flex items-center justify-center gap-2 relative z-10">
                <span className="inline-flex items-center gap-1 bg-white/15 backdrop-blur-xs text-emerald-200 text-xs font-semibold px-2.5 py-1 rounded-full border border-white/20">
                  <ArrowUpRight className="w-3.5 h-3.5" />
                  {card.change}
                </span>
                <span className="text-xs text-emerald-100/80 font-medium">
                  {card.note}
                </span>
              </div>
            </div>
          ) : (
            <div
              key={card.label}
              className="bg-white text-gray-900 rounded-2xl p-6 shadow-[0_4px_20px_rgba(3,59,42,0.06)] border border-emerald-300 ring-1 ring-black/5 flex flex-col justify-between items-center text-center min-h-[155px]"
            >
              <div className="space-y-1">
                <span className="text-gray-500 text-sm font-medium block">
                  {card.label}
                </span>
                <p className="text-3xl font-extrabold text-gray-900 tracking-tight">
                  {card.value}
                </p>
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

      <div className="grid gap-5 lg:grid-cols-3">
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
            <svg viewBox="0 0 500 200" className="w-full h-full overflow-visible">
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
              
              <path d={dynamicChart.areaD} fill="url(#dashChartGradient)" />
              <path d={dynamicChart.pathD} fill="none" stroke="#1B4332" strokeWidth="3" strokeLinecap="round" />

              {dynamicChart.points.map((pt, i) => (
                <g key={i} className="cursor-pointer group">
                  <circle
                    cx={pt.x}
                    cy={pt.y}
                    r="6"
                    fill="#1B4332"
                    stroke="white"
                    strokeWidth="2.5"
                    className="transition-transform duration-200 group-hover:r-8"
                    onMouseEnter={() => setHoveredPoint(pt)}
                    onMouseLeave={() => setHoveredPoint(null)}
                  />
                </g>
              ))}
            </svg>

            {hoveredPoint && (
              <div
                className="absolute bg-gray-900 text-white text-[11px] font-bold px-2.5 py-1 rounded-lg shadow-lg pointer-events-none -translate-x-1/2 -translate-y-full mb-2 border border-gray-700 transition-all duration-150"
                style={{
                  left: `${(hoveredPoint.x / 500) * 100}%`,
                  top: `${(hoveredPoint.y / 200) * 100}%`,
                }}
              >
                {hoveredPoint.day}: {hoveredPoint.val}
              </div>
            )}

            <div className="flex justify-between text-[11px] text-gray-400 font-semibold px-6 mt-2">
              {dynamicChart.labels.map((d) => (
                <span key={d}>{d}</span>
              ))}
            </div>
          </div>
        </div>

        {/* Status Pesanan */}
        <div className="bg-white rounded-2xl p-6 shadow-[0_4px_20px_rgba(3,59,42,0.06)] border border-emerald-300 ring-1 ring-black/5 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-gray-800">
              Status Pesanan
            </h2>
            <Link href="/pesanan" className="text-xs font-semibold text-[#1B4332] hover:underline">
              Lihat pesanan
            </Link>
          </div>
          <div className="space-y-3 pt-1">
            {orderStatuses.map((s) => (
              <div
                key={s.label}
                onClick={() => router.push("/pesanan")}
                className={`relative overflow-hidden flex items-center justify-between p-3.5 pl-5 rounded-xl border ${s.bg} cursor-pointer hover:shadow-xs transition-all`}
              >
                <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${s.barColor}`} />
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
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-gray-800 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-500" />
              Stok Hampir Habis
            </h2>
            <Link href="/produk" className="text-xs font-semibold text-[#1B4332] hover:underline">
              Kelola stok
            </Link>
          </div>
          <div className="space-y-2.5 pt-1">
            {lowStockItems.map((item) => (
              <Link
                key={item.name}
                href="/produk"
                className={`flex items-center justify-between p-3.5 rounded-xl border ${item.bg} hover:opacity-90 transition cursor-pointer`}
              >
                <span className="font-semibold text-xs text-gray-800">
                  {item.name}
                </span>
                <span className={`inline-flex items-center justify-center border rounded-full px-3.5 py-0.5 text-xs font-bold ${item.badge}`}>
                  {item.amount}
                </span>
              </Link>
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
          <div className="space-y-3 py-2">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="animate-shimmer h-12 w-full rounded-xl" />
            ))}
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
                      <span className={`inline-flex items-center justify-center border rounded-full px-4 py-1 text-xs font-semibold ${statusBadgeClass[tx.status] ?? "bg-gray-50 text-gray-600 border-gray-200"}`}>
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

      {/* ── Transaction Detail Modal ── */}
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
                  <span className={`inline-flex items-center border rounded-full px-3 py-1 text-xs font-semibold ${statusBadgeClass[selectedTx.status] ?? "bg-gray-50 text-gray-600 border-gray-200"}`}>
                    {selectedTx.status}
                  </span>
                </div>
              </div>

              <div>
                <h4 className="font-bold text-gray-700 uppercase tracking-wider mb-2.5">Item Pembelian</h4>
                <div className="space-y-2.5">
                  {selectedTx.items && selectedTx.items.length > 0 ? (
                    selectedTx.items.map((item, idx) => (
                      <div key={idx} className="flex justify-between items-center text-xs border-b border-gray-50 pb-2.5">
                        <div>
                          <p className="font-semibold text-gray-800">{item.name}</p>
                          <p className="text-gray-400">Qty: {item.qty}</p>
                        </div>
                        <span className="font-bold text-gray-900">{item.price}</span>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-400 italic">Tidak ada rincian item.</p>
                  )}
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
    </div>
  );
}
