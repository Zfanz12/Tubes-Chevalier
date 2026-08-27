"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowUpRight,
  ArrowDownRight,
  Users,
  ShoppingBag,
  TrendingUp,
  ChevronRight,
  AlertTriangle,
  PackageCheck,
  Leaf,
  InboxIcon,
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
import {
  getTransaksi,
  getProdukPetani,
  formatRupiah,
  formatTanggal,
  mapMetodePembayaran,
  type ApiTransaksi,
  type ApiProduk,
} from "@/lib/api";
import { useAuthStore } from "@/lib/useAuthStore";

// ── Types ──────────────────────────────────────────────────────
interface DashboardTx {
  id: string;
  date: string;
  rawDate: Date | null;
  customer: string;
  method: string;
  total: string;
  rawTotal: number;
  status: "Menunggu" | "Disiapkan" | "Sedang Dikirim" | "Selesai";
  items: { name: string; qty: string; price: string }[];
}

interface StatCard {
  label: string;
  value: string;
  change: string;
  trend: "up" | "down" | "neutral";
  note: string;
  icon?: React.ReactNode;
}

interface OrderStatusCount {
  label: string;
  count: number;
  bg: string;
  barColor: string;
  textColor: string;
  statusKey: string;
}

interface LowStockItem {
  name: string;
  amount: string;
  stok: number;
  bg: string;
  badge: string;
}

interface HarvestItem {
  id: number;
  name: string;
  selected: boolean;
}

// ── Helpers ────────────────────────────────────────────────────

const STATUS_MAP: Record<string, DashboardTx["status"]> = {
  pending: "Menunggu",
  processing: "Disiapkan",
  shipped: "Sedang Dikirim",
  completed: "Selesai",
};

const statusBadgeClass: Record<string, string> = {
  Menunggu: "bg-red-50 text-red-600 border-red-200",
  Disiapkan: "bg-amber-50 text-amber-700 border-amber-200",
  "Sedang Dikirim": "bg-blue-50 text-blue-600 border-blue-200",
  Selesai: "bg-emerald-50 text-emerald-700 border-emerald-200",
};

function mapToDashboardTx(t: ApiTransaksi): DashboardTx {
  const rawDate = t.created_at ? new Date(t.created_at) : null;
  const numTotal = typeof t.total_harga === "number" ? t.total_harga : parseFloat(String(t.total_harga)) || 0;
  return {
    id: t.kode_transaksi || `#${t.id}`,
    date: t.created_at ? formatTanggal(t.created_at) : "—",
    rawDate: rawDate && !isNaN(rawDate.getTime()) ? rawDate : null,
    customer: t.user?.name ?? t.petani?.nama ?? "Pelanggan",
    method: mapMetodePembayaran(t.metode_pembayaran),
    total: formatRupiah(numTotal),
    rawTotal: numTotal,
    status: STATUS_MAP[t.status_pesanan] ?? "Menunggu",
    items:
      t.items?.map((item) => {
        const itemHarga = typeof item.harga_satuan === "number" ? item.harga_satuan : parseFloat(String(item.harga_satuan)) || 0;
        const itemJumlah = typeof item.jumlah === "number" ? item.jumlah : parseFloat(String(item.jumlah)) || 1;
        return {
          name: item.produk?.nama_barang ?? `Produk #${item.produk_id}`,
          qty: `${itemJumlah} kg`,
          price: formatRupiah(itemHarga * itemJumlah),
        };
      }) ?? [],
  };
}

function isToday(d: Date): boolean {
  const now = new Date();
  return (
    d.getFullYear() === now.getFullYear() &&
    d.getMonth() === now.getMonth() &&
    d.getDate() === now.getDate()
  );
}

function isWithinLast30Days(d: Date): boolean {
  const now = new Date();
  const cutoff = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  return d >= cutoff;
}

function percentChange(current: number, previous: number): string {
  if (previous === 0) return current > 0 ? "+100%" : "0%";
  const pct = ((current - previous) / previous) * 100;
  return (pct >= 0 ? "+" : "") + pct.toFixed(0) + "%";
}

function getLowStockStyle(stok: number): { bg: string; badge: string } {
  if (stok <= 2)
    return {
      bg: "bg-red-50 border-red-100 text-red-700",
      badge: "border-red-200 text-red-700 bg-white",
    };
  if (stok <= 5)
    return {
      bg: "bg-amber-50 border-amber-100 text-amber-700",
      badge: "border-amber-200 text-amber-700 bg-white",
    };
  return {
    bg: "bg-emerald-50/60 border-emerald-200 text-emerald-700",
    badge: "border-emerald-200 text-emerald-700 bg-white",
  };
}

// ── Order Status Config ─────────────────────────────────────────
const ORDER_STATUS_CONFIG = [
  {
    label: "Menunggu",
    bg: "bg-red-50/60 border-red-100",
    barColor: "bg-red-500",
    textColor: "text-red-700",
    statusKey: "pending",
  },
  {
    label: "Disiapkan",
    bg: "bg-amber-50/60 border-amber-100",
    barColor: "bg-amber-500",
    textColor: "text-amber-700",
    statusKey: "processing",
  },
  {
    label: "Dalam Perjalanan",
    bg: "bg-blue-50/60 border-blue-100",
    barColor: "bg-blue-500",
    textColor: "text-blue-700",
    statusKey: "shipped",
  },
  {
    label: "Selesai",
    bg: "bg-emerald-50/60 border-emerald-100",
    barColor: "bg-emerald-500",
    textColor: "text-emerald-700",
    statusKey: "completed",
  },
];

// ── Empty State Component ───────────────────────────────────────
function EmptyState({
  icon: Icon,
  message,
  sub,
}: {
  icon: React.ElementType;
  message: string;
  sub?: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-8 gap-2 text-center">
      <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center mb-1">
        <Icon className="w-5 h-5 text-gray-400" />
      </div>
      <p className="text-sm font-semibold text-gray-500">{message}</p>
      {sub && <p className="text-xs text-gray-400">{sub}</p>}
    </div>
  );
}

// ── Main Component ─────────────────────────────────────────────
export default function DashboardPage() {
  const router = useRouter();
  const token = useAuthStore((s) => s.token);
  const user = useAuthStore((s) => s.user);

  const [range, setRange] = useState<"7d" | "30d">("7d");
  const [selectedTx, setSelectedTx] = useState<DashboardTx | null>(null);
  const [hoveredPoint, setHoveredPoint] = useState<{
    day: string;
    val: string;
    x: number;
    y: number;
  } | null>(null);

  // Data state
  const [allTransactions, setAllTransactions] = useState<DashboardTx[]>([]);
  const [produks, setProduks] = useState<ApiProduk[]>([]);
  const [harvestItems, setHarvestItems] = useState<HarvestItem[]>([]);

  // Loading state
  const [txLoading, setTxLoading] = useState(true);
  const [produkLoading, setProdukLoading] = useState(true);

  // ── Fetch Data ──────────────────────────────────────────────
  const fetchData = useCallback(async () => {
    if (!token) {
      setTxLoading(false);
      setProdukLoading(false);
      return;
    }

    // Fetch transactions
    setTxLoading(true);
    try {
      const data = await getTransaksi(token);
      if (Array.isArray(data)) {
        setAllTransactions(data.map(mapToDashboardTx));
      } else {
        setAllTransactions([]);
      }
    } catch {
      setAllTransactions([]);
    } finally {
      setTxLoading(false);
    }

    // Fetch products (for low stock + harvest checklist)
    setProdukLoading(true);
    try {
      const prods = await getProdukPetani(token, user?.id, user?.name);
      if (Array.isArray(prods)) {
        setProduks(prods);
        setHarvestItems(
          prods.map((p) => ({ id: p.id, name: p.nama_barang, selected: false }))
        );
      } else {
        setProduks([]);
        setHarvestItems([]);
      }
    } catch {
      setProduks([]);
      setHarvestItems([]);
    } finally {
      setProdukLoading(false);
    }
  }, [token, user?.id, user?.name]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // ── Computed: Stat Cards ────────────────────────────────────
  const statCards = useMemo((): StatCard[] => {
    const todayTx = allTransactions.filter(
      (tx) => tx.rawDate && isToday(tx.rawDate)
    );
    const last30Tx = allTransactions.filter(
      (tx) => tx.rawDate && isWithinLast30Days(tx.rawDate)
    );

    // 7d window = today only for the "today" cards (simplified)
    const penjualanToday = todayTx.reduce((s, t) => s + t.rawTotal, 0);
    const pembeliToday = todayTx.length;

    const penjualan30d = last30Tx.reduce((s, t) => s + t.rawTotal, 0);
    const pembeli30d = last30Tx.length;

    // Previous period comparison (yesterday for today, 30-60d ago for 30d)
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayTx = allTransactions.filter((tx) => {
      if (!tx.rawDate) return false;
      const d = tx.rawDate;
      return (
        d.getFullYear() === yesterday.getFullYear() &&
        d.getMonth() === yesterday.getMonth() &&
        d.getDate() === yesterday.getDate()
      );
    });
    const penjualanYesterday = yesterdayTx.reduce((s, t) => s + t.rawTotal, 0);
    const pembeliYesterday = yesterdayTx.length;

    const prev30Start = new Date(Date.now() - 60 * 24 * 60 * 60 * 1000);
    const prev30End = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const prev30Tx = allTransactions.filter((tx) => {
      if (!tx.rawDate) return false;
      return tx.rawDate >= prev30Start && tx.rawDate <= prev30End;
    });
    const penjualanPrev30 = prev30Tx.reduce((s, t) => s + t.rawTotal, 0);
    const pembeliPrev30 = prev30Tx.length;

    if (range === "7d") {
      const changeP = percentChange(penjualanToday, penjualanYesterday);
      const changeB = percentChange(pembeliToday, pembeliYesterday);
      const trendP: "up" | "down" | "neutral" =
        penjualanToday >= penjualanYesterday ? "up" : "down";
      const trendB: "up" | "down" | "neutral" =
        pembeliToday >= pembeliYesterday ? "up" : "down";

      return [
        {
          label: "Penjualan Hari Ini",
          value: formatRupiah(penjualanToday),
          change: changeP,
          trend: trendP,
          note: trendP === "up" ? "Naik dari hari sebelumnya" : "Turun dari hari sebelumnya",
        },
        {
          label: "Pembeli Hari Ini",
          value: String(pembeliToday),
          icon: <Users className="w-6 h-6 text-gray-800" />,
          change: changeB,
          trend: trendB,
          note: trendB === "up" ? "Naik dari hari sebelumnya" : "Turun dari hari sebelumnya",
        },
        {
          label: "Total Transaksi Hari Ini",
          value: String(todayTx.length),
          icon: <ShoppingBag className="w-6 h-6 text-gray-800" />,
          change: changeB,
          trend: trendB,
          note: "Jumlah pesanan masuk hari ini",
        },
      ];
    } else {
      const changeP = percentChange(penjualan30d, penjualanPrev30);
      const changeB = percentChange(pembeli30d, pembeliPrev30);
      const trendP: "up" | "down" | "neutral" =
        penjualan30d >= penjualanPrev30 ? "up" : "down";
      const trendB: "up" | "down" | "neutral" =
        pembeli30d >= pembeliPrev30 ? "up" : "down";

      return [
        {
          label: "Penjualan 30 Hari",
          value: formatRupiah(penjualan30d),
          change: changeP,
          trend: trendP,
          note: trendP === "up" ? "Naik dari bulan lalu" : "Turun dari bulan lalu",
        },
        {
          label: "Pembeli 30 Hari",
          value: String(pembeli30d),
          icon: <Users className="w-6 h-6 text-gray-800" />,
          change: changeB,
          trend: trendB,
          note: trendB === "up" ? "Naik dari bulan lalu" : "Turun dari bulan lalu",
        },
        {
          label: "Total Transaksi 30 Hari",
          value: String(last30Tx.length),
          icon: <ShoppingBag className="w-6 h-6 text-gray-800" />,
          change: changeB,
          trend: trendB,
          note: "Jumlah pesanan dalam 30 hari",
        },
      ];
    }
  }, [allTransactions, range]);

  // ── Computed: Order Status Counts ───────────────────────────
  const orderStatuses = useMemo((): OrderStatusCount[] => {
    const counts: Record<string, number> = {
      pending: 0,
      processing: 0,
      shipped: 0,
      completed: 0,
    };
    allTransactions.forEach((tx) => {
      const reverseMap: Record<DashboardTx["status"], string> = {
        Menunggu: "pending",
        Disiapkan: "processing",
        "Sedang Dikirim": "shipped",
        Selesai: "completed",
      };
      const key = reverseMap[tx.status];
      if (key && key in counts) counts[key]++;
    });

    return ORDER_STATUS_CONFIG.map((cfg) => ({
      ...cfg,
      count: counts[cfg.statusKey] ?? 0,
    }));
  }, [allTransactions]);

  // ── Computed: Low Stock Items ───────────────────────────────
  const lowStockItems = useMemo((): LowStockItem[] => {
    return produks
      .map((p) => {
        const numStok = typeof p.stok === "number" ? p.stok : parseFloat(String(p.stok)) || 0;
        const stokFormatted = Number.isInteger(numStok) ? numStok.toString() : numStok.toFixed(2).replace(/\.?0+$/, "");
        return {
          name: p.nama_barang,
          amount: `${stokFormatted} kg`,
          stok: numStok,
          ...getLowStockStyle(numStok),
        };
      })
      .filter((p) => p.stok <= 10)
      .sort((a, b) => a.stok - b.stok);
  }, [produks]);

  // ── Computed: Recent Transactions (top 4) ───────────────────
  const recentTransactions = useMemo(() => {
    return allTransactions.slice(0, 4);
  }, [allTransactions]);

  // ── Computed: Chart ─────────────────────────────────────────
  const dynamicChart = useMemo(() => {
    const days7 = ["Sen", "Sel", "Rab", "Kam", "Jum", "Sab", "Min"];
    const weeks30 = ["Minggu 1", "Minggu 2", "Minggu 3", "Minggu 4"];
    const labels = range === "7d" ? days7 : weeks30;
    const totals: number[] = new Array(labels.length).fill(0);

    allTransactions.forEach((tx) => {
      if (!tx.rawDate || isNaN(tx.rawDate.getTime())) return;
      const d = tx.rawDate;
      const amount = typeof tx.rawTotal === "number" && !isNaN(tx.rawTotal) ? tx.rawTotal : 0;
      if (range === "7d") {
        const jsDay = d.getDay(); // 0=Sun
        const idx = jsDay === 0 ? 6 : jsDay - 1; // Mon=0…Sun=6
        if (idx >= 0 && idx < 7) totals[idx] += amount;
      } else {
        let wIdx = Math.floor((d.getDate() - 1) / 7);
        if (wIdx > 3) wIdx = 3;
        totals[wIdx] += amount;
      }
    });

    const maxVal = Math.max(...totals, 1);
    const yMin = 30;
    const yMax = 160;
    const step = (470 - 30) / Math.max(labels.length - 1, 1);

    const points = labels.map((day, i) => {
      const x = 30 + i * step;
      const rawVal = totals[i] || 0;
      const yRatio = maxVal > 0 ? rawVal / maxVal : 0;
      const y = yMax - yRatio * (yMax - yMin);
      const safeX = Number.isFinite(x) ? x : 30;
      const safeY = Number.isFinite(y) ? y : yMax;
      return { day, val: formatRupiah(rawVal), x: safeX, y: safeY };
    });

    let pathD = points.length > 0 ? `M ${points[0].x} ${points[0].y}` : "M 30 160";
    for (let i = 1; i < points.length; i++) {
      const prev = points[i - 1];
      const curr = points[i];
      const cx = prev.x + (curr.x - prev.x) / 2;
      pathD += ` C ${cx} ${prev.y}, ${cx} ${curr.y}, ${curr.x} ${curr.y}`;
    }
    const lastX = points[points.length - 1]?.x ?? 470;
    const firstX = points[0]?.x ?? 30;
    const areaD = `${pathD} L ${lastX} 180 L ${firstX} 180 Z`;

    const hasData = totals.some((v) => v > 0);

    return { points, pathD, areaD, labels, hasData };
  }, [allTransactions, range]);

  // ── Toggle Harvest ──────────────────────────────────────────
  const toggleHarvest = (id: number) => {
    setHarvestItems((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const nextSelected = !item.selected;
          showToast(
            nextSelected
              ? `${item.name} ditandai siap panen hari ini`
              : `${item.name} dihapus dari daftar panen hari ini`,
            "success"
          );
          return { ...item, selected: nextSelected };
        }
        return item;
      })
    );
  };

  const isLoading = txLoading || produkLoading;

  // ── Render ──────────────────────────────────────────────────
  return (
    <div className="w-full space-y-6">
      {/* ── Stat Cards ── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {isLoading
          ? [0, 1, 2].map((i) => (
              <div
                key={i}
                className={`rounded-2xl p-6 min-h-[155px] flex flex-col justify-between ${
                  i === 0 ? "bg-[#1B4332]" : "bg-white border border-emerald-300"
                }`}
              >
                <Skeleton className={`h-4 w-32 mx-auto ${i === 0 ? "bg-white/20" : ""}`} />
                <Skeleton className={`h-9 w-40 mx-auto ${i === 0 ? "bg-white/20" : ""}`} />
                <Skeleton className={`h-4 w-28 mx-auto ${i === 0 ? "bg-white/20" : ""}`} />
              </div>
            ))
          : statCards.map((card, idx) =>
              idx === 0 ? (
                <div
                  key={card.label}
                  className="bg-[#1B4332] text-white rounded-2xl p-6 shadow-sm flex flex-col justify-between items-center text-center relative overflow-hidden min-h-[155px]"
                >
                  {/* Decorative circles */}
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
                      {card.trend === "up" ? (
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      ) : (
                        <ArrowDownRight className="w-3.5 h-3.5" />
                      )}
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
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold border ${
                        card.trend === "up"
                          ? "bg-emerald-50 text-emerald-600 border-emerald-100"
                          : "bg-red-50 text-red-600 border-red-100"
                      }`}
                    >
                      {card.trend === "up" ? (
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      ) : (
                        <ArrowDownRight className="w-3.5 h-3.5" />
                      )}
                      {card.change}
                    </span>
                    <span className="text-xs text-gray-400">{card.note}</span>
                  </div>
                </div>
              )
            )}
      </div>

      {/* ── Chart + Order Status ── */}
      <div className="grid gap-5 lg:grid-cols-3">
        {/* Grafik Penjualan */}
        <div className="bg-white rounded-2xl p-6 shadow-[0_4px_20px_rgba(3,59,42,0.06)] border border-emerald-300 ring-1 ring-black/5 lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-gray-800">Grafik Penjualan</h2>
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

          {txLoading ? (
            <div className="h-56 w-full flex items-end gap-2 px-2 pb-6">
              {[40, 70, 55, 90, 65, 80, 50].map((h, i) => (
                <Skeleton key={i} className="flex-1 rounded-lg" style={{ height: `${h}%` }} />
              ))}
            </div>
          ) : !dynamicChart.hasData ? (
            <div className="h-56 flex items-center justify-center">
              <EmptyState
                icon={TrendingUp}
                message="Belum ada data penjualan"
                sub="Data akan muncul setelah ada transaksi"
              />
            </div>
          ) : (
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
                <path
                  d={dynamicChart.pathD}
                  fill="none"
                  stroke="#1B4332"
                  strokeWidth="3"
                  strokeLinecap="round"
                />

                {dynamicChart.points.map((pt, i) => (
                  <g key={i} className="cursor-pointer group">
                    <circle
                      cx={pt.x}
                      cy={pt.y}
                      r="6"
                      fill="#1B4332"
                      stroke="white"
                      strokeWidth="2.5"
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
          )}
        </div>

        {/* Status Pesanan */}
        <div className="bg-white rounded-2xl p-6 shadow-[0_4px_20px_rgba(3,59,42,0.06)] border border-emerald-300 ring-1 ring-black/5 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-gray-800">Status Pesanan</h2>
            <Link href="/pesanan" className="text-xs font-semibold text-[#1B4332] hover:underline">
              Lihat pesanan
            </Link>
          </div>

          {txLoading ? (
            <div className="space-y-3 pt-1">
              {[0, 1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-12 w-full rounded-xl" />
              ))}
            </div>
          ) : allTransactions.length === 0 ? (
            <EmptyState
              icon={ShoppingBag}
              message="Belum ada pesanan"
              sub="Status akan muncul setelah ada transaksi masuk"
            />
          ) : (
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
          )}
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

          {produkLoading ? (
            <div className="space-y-2.5 pt-1">
              {[0, 1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-12 w-full rounded-xl" />
              ))}
            </div>
          ) : lowStockItems.length === 0 ? (
            <EmptyState
              icon={PackageCheck}
              message="Semua stok aman 🎉"
              sub="Tidak ada produk dengan stok di bawah 10 kg"
            />
          ) : (
            <div className="space-y-2.5 pt-1">
              {lowStockItems.map((item) => (
                <Link
                  key={item.name}
                  href="/produk"
                  className={`flex items-center justify-between p-3.5 rounded-xl border ${item.bg} hover:opacity-90 transition cursor-pointer`}
                >
                  <span className="font-semibold text-xs text-gray-800">{item.name}</span>
                  <span
                    className={`inline-flex items-center justify-center border rounded-full px-3.5 py-0.5 text-xs font-bold ${item.badge}`}
                  >
                    {item.amount}
                  </span>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Panen Hari Ini */}
        <div className="bg-white rounded-2xl p-6 shadow-[0_4px_20px_rgba(3,59,42,0.06)] border border-emerald-300 ring-1 ring-black/5 space-y-4">
          <h2 className="text-base font-bold text-gray-800">Panen Hari Ini</h2>

          {produkLoading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 pt-1">
              {[0, 1, 2, 3, 4, 5].map((i) => (
                <Skeleton key={i} className="h-11 w-full rounded-xl" />
              ))}
            </div>
          ) : harvestItems.length === 0 ? (
            <EmptyState
              icon={Leaf}
              message="Belum ada produk terdaftar"
              sub="Tambahkan produk terlebih dahulu di halaman Produk"
            />
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 pt-1">
              {harvestItems.map((veg) => (
                <button
                  key={veg.id}
                  onClick={() => toggleHarvest(veg.id)}
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
          )}
        </div>
      </div>

      {/* ── Recent Transactions ── */}
      <div className="bg-white rounded-2xl p-6 shadow-[0_4px_20px_rgba(3,59,42,0.06)] border border-emerald-300 ring-1 ring-black/5 space-y-5">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-gray-800">Transaksi Terbaru</h2>
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
              <Skeleton key={i} className="h-12 w-full rounded-xl" />
            ))}
          </div>
        ) : recentTransactions.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 gap-3 text-center">
            <div className="w-14 h-14 rounded-full bg-emerald-50 flex items-center justify-center">
              <InboxIcon className="w-7 h-7 text-emerald-300" />
            </div>
            <p className="text-sm font-semibold text-gray-500">Belum ada transaksi</p>
            <p className="text-xs text-gray-400 max-w-xs">
              Transaksi dari pembeli akan muncul di sini setelah ada pesanan masuk.
            </p>
          </div>
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
                      <span
                        className={`inline-flex items-center justify-center border rounded-full px-4 py-1 text-xs font-semibold ${
                          statusBadgeClass[tx.status] ?? "bg-gray-50 text-gray-600 border-gray-200"
                        }`}
                      >
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
                  <span
                    className={`inline-flex items-center border rounded-full px-3 py-1 text-xs font-semibold ${
                      statusBadgeClass[selectedTx.status] ?? "bg-gray-50 text-gray-600 border-gray-200"
                    }`}
                  >
                    {selectedTx.status}
                  </span>
                </div>
              </div>

              <div>
                <h4 className="font-bold text-gray-700 uppercase tracking-wider mb-2.5">
                  Item Pembelian
                </h4>
                <div className="space-y-2.5">
                  {selectedTx.items && selectedTx.items.length > 0 ? (
                    selectedTx.items.map((item, idx) => (
                      <div
                        key={idx}
                        className="flex justify-between items-center text-xs border-b border-gray-50 pb-2.5"
                      >
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
