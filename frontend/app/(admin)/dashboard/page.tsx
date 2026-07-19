import React from "react";
import {
  ArrowUpRight,
  Users,
  TrendingUp,
  ChevronRight,
  TrendingDown,
  BadgeDollarSign,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

// ── Stat Cards ─────────────────────────────────────────────
const statCards = [
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
    icon: <Users className="w-6 h-6 text-gray-400" />,
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

// ── Order Status ────────────────────────────────────────────
const orderStatuses = [
  { label: "Menunggu", count: 2, color: "border-l-red-500 bg-red-50 border-red-100", textColor: "text-red-700" },
  { label: "Diproses", count: 29, color: "border-l-orange-500 bg-orange-50 border-orange-100", textColor: "text-orange-700" },
  { label: "Dikirim", count: 109, color: "border-l-gray-400 bg-gray-50 border-gray-100", textColor: "text-gray-600" },
  { label: "Selesai", count: 273, color: "border-l-emerald-500 bg-emerald-50 border-emerald-100", textColor: "text-emerald-700" },
];

// ── Low Stock ───────────────────────────────────────────────
const lowStockItems = [
  { name: "Kangkung", amount: "2 kg", variant: "destructive" as const },
  { name: "Sawi Putih", amount: "3 kg", variant: "secondary" as const },
  { name: "Wortel", amount: "5 kg", variant: "outline" as const },
  { name: "Tomat", amount: "7 kg", variant: "outline" as const },
];

// ── Harvest Items ───────────────────────────────────────────
const harvestItems = ["Bayam", "Kangkung", "Sawi Putih", "Wortel", "Tomat", "Pak Choy", "Brokoli"];

// ── Transactions ────────────────────────────────────────────
const transactions = [
  { id: "INV-12345", date: "12/02/2026", customer: "Reza Rahardian", total: "Rp 130.000", status: "Menunggu" },
  { id: "#RM-2123", date: "13/02/2026", customer: "A***a Y****a", total: "Rp 130.000", status: "Diproses" },
  { id: "INV-12346", date: "12/02/2026", customer: "Reza Rahardian", total: "Rp 130.000", status: "Dikirim" },
  { id: "#RM-2124", date: "13/02/2026", customer: "A***a Y****a", total: "Rp 130.000", status: "Selesai" },
];

const statusBadgeClass: Record<string, string> = {
  Menunggu: "bg-red-50 text-red-700 border-red-200 hover:bg-red-50",
  Diproses: "bg-orange-50 text-orange-700 border-orange-200 hover:bg-orange-50",
  Dikirim: "bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-50",
  Selesai: "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-50",
};

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      {/* ── Page Header ── */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500 text-sm mt-0.5">Selamat datang kembali, Ahmad! Berikut ringkasan hari ini.</p>
      </div>

      {/* ── Stat Cards ── */}
      <div className="grid gap-5 md:grid-cols-3">
        {statCards.map((card) => (
          <Card
            key={card.label}
            className={`border-0 shadow-sm min-h-[140px] ${
              card.dark
                ? "bg-[#05402e] text-white"
                : "bg-white border border-emerald-100"
            }`}
          >
            <CardHeader className="pb-2">
              <CardTitle
                className={`text-sm font-medium ${
                  card.dark ? "text-emerald-100/80" : "text-gray-500"
                }`}
              >
                {card.label}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <p
                  className={`text-3xl font-bold ${
                    card.dark ? "text-white" : "text-gray-900"
                  }`}
                >
                  {card.value}
                </p>
                {card.icon}
              </div>
              <div className="mt-3 flex items-center gap-2">
                <span
                  className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${
                    card.dark
                      ? "bg-[#10b981]/20 text-[#10b981]"
                      : "bg-emerald-50 text-emerald-600 border border-emerald-100"
                  }`}
                >
                  {card.trend === "up" ? (
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  ) : (
                    <TrendingDown className="w-3.5 h-3.5" />
                  )}
                  {card.change}
                </span>
                <span
                  className={`text-xs ${
                    card.dark ? "text-emerald-100/60" : "text-gray-400"
                  }`}
                >
                  {card.note}
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* ── Chart & Order Status ── */}
      <div className="grid gap-5 lg:grid-cols-3">
        {/* Grafik Penjualan */}
        <Card className="bg-white border border-emerald-100 shadow-sm lg:col-span-2">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base font-bold text-gray-800">
                Grafik Penjualan
              </CardTitle>
              <div className="flex gap-1 bg-emerald-50/50 p-1 rounded-full border border-emerald-100">
                <Button
                  variant="ghost"
                  size="sm"
                  className="px-3 h-7 rounded-full text-xs font-medium text-gray-500 hover:text-emerald-700"
                >
                  30 hari
                </Button>
                <Button
                  size="sm"
                  className="px-3 h-7 rounded-full text-xs font-semibold bg-[#05402e] text-white hover:bg-[#032e21] shadow-sm"
                >
                  7 hari
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-56 w-full relative">
              <svg viewBox="0 0 500 200" className="w-full h-full">
                <defs>
                  <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#05402e" stopOpacity="0.2" />
                    <stop offset="100%" stopColor="#05402e" stopOpacity="0" />
                  </linearGradient>
                </defs>
                <line x1="0" y1="20" x2="500" y2="20" stroke="#f1f5f9" strokeWidth="1" />
                <line x1="0" y1="60" x2="500" y2="60" stroke="#f1f5f9" strokeWidth="1" />
                <line x1="0" y1="100" x2="500" y2="100" stroke="#f1f5f9" strokeWidth="1" />
                <line x1="0" y1="140" x2="500" y2="140" stroke="#f1f5f9" strokeWidth="1" />
                <line x1="0" y1="180" x2="500" y2="180" stroke="#e2e8f0" strokeWidth="1.5" />
                <path
                  d="M 10 160 C 60 140, 100 130, 150 140 C 200 150, 250 110, 300 110 C 350 110, 400 135, 450 120 C 475 110, 490 125, 500 125 L 500 180 L 10 180 Z"
                  fill="url(#chartGradient)"
                />
                <path
                  d="M 10 160 C 60 140, 100 130, 150 140 C 200 150, 250 110, 300 110 C 350 110, 400 135, 450 120 C 475 110, 490 125, 500 125"
                  fill="none"
                  stroke="#05402e"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
                {/* Data points */}
                {[
                  [10, 160], [150, 140], [300, 110], [450, 120], [500, 125]
                ].map(([x, y], i) => (
                  <circle key={i} cx={x} cy={y} r="4" fill="#05402e" stroke="white" strokeWidth="2" />
                ))}
              </svg>
              <div className="flex justify-between text-[11px] text-gray-400 font-semibold px-2 mt-1">
                {["Sen", "Sel", "Rab", "Kam", "Jum", "Sab", "Min"].map((d) => (
                  <span key={d}>{d}</span>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Status Pesanan */}
        <Card className="bg-white border border-emerald-100 shadow-sm">
          <CardHeader className="pb-4">
            <CardTitle className="text-base font-bold text-gray-800">
              Status Pesanan
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {orderStatuses.map((s) => (
                <div
                  key={s.label}
                  className={`flex items-center justify-between p-3.5 rounded-xl border border-l-4 ${s.color}`}
                >
                  <span className={`font-semibold text-sm ${s.textColor}`}>{s.label}</span>
                  <span className={`text-2xl font-bold ${s.textColor}`}>{s.count}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ── Stock Alert & Harvest ── */}
      <div className="grid gap-5 md:grid-cols-2">
        {/* Stok Hampir Habis */}
        <Card className="bg-white border border-emerald-100 shadow-sm">
          <CardHeader className="pb-4">
            <CardTitle className="text-base font-bold text-gray-800">
              Stok Hampir Habis
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2.5">
              {lowStockItems.map((item) => (
                <div
                  key={item.name}
                  className={`flex items-center justify-between p-3.5 rounded-xl ${
                    item.name === "Kangkung"
                      ? "bg-red-50 border border-red-100"
                      : item.name === "Sawi Putih"
                      ? "bg-gray-50 border border-gray-100"
                      : "bg-emerald-50/60 border border-emerald-100/60"
                  }`}
                >
                  <span
                    className={`font-medium text-sm ${
                      item.name === "Kangkung"
                        ? "text-red-700"
                        : item.name === "Sawi Putih"
                        ? "text-gray-700"
                        : "text-emerald-700"
                    }`}
                  >
                    {item.name}
                  </span>
                  <Badge
                    variant="outline"
                    className={`font-bold text-sm ${
                      item.name === "Kangkung"
                        ? "border-red-200 text-red-700 bg-white"
                        : item.name === "Sawi Putih"
                        ? "border-gray-200 text-gray-700 bg-white"
                        : "border-emerald-200 text-emerald-700 bg-white"
                    }`}
                  >
                    {item.amount}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Panen Hari Ini */}
        <Card className="bg-white border border-emerald-100 shadow-sm">
          <CardHeader className="pb-4">
            <CardTitle className="text-base font-bold text-gray-800">
              Panen Hari Ini
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {harvestItems.map((veg) => (
                <button
                  key={veg}
                  className="bg-gray-50 hover:bg-emerald-50 border border-gray-100 hover:border-emerald-200 transition-all text-gray-700 hover:text-emerald-800 text-sm font-medium py-3 px-3 rounded-xl text-center cursor-pointer"
                >
                  {veg}
                </button>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ── Recent Transactions ── */}
      <Card className="bg-white border border-emerald-100 shadow-sm overflow-hidden">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base font-bold text-gray-800">
              Transaksi Terbaru
            </CardTitle>
            <Button
              variant="link"
              className="text-[#05402e] hover:text-[#032e21] font-bold text-sm p-0 h-auto"
            >
              Lihat semua
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/50">
                  <th className="pb-3 pt-3 px-6 text-gray-400 font-semibold">ID Transaksi</th>
                  <th className="pb-3 pt-3 px-3 text-gray-400 font-semibold">Tanggal</th>
                  <th className="pb-3 pt-3 px-3 text-gray-400 font-semibold">Customer</th>
                  <th className="pb-3 pt-3 px-3 text-gray-400 font-semibold">Total Harga</th>
                  <th className="pb-3 pt-3 px-3 text-gray-400 font-semibold">Status</th>
                  <th className="pb-3 pt-3 px-6 text-gray-400 font-semibold text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {transactions.map((tx, i) => (
                  <tr key={i} className="text-gray-700 hover:bg-gray-50/50 transition-colors">
                    <td className="py-4 px-6 font-semibold">{tx.id}</td>
                    <td className="py-4 px-3 text-gray-500">{tx.date}</td>
                    <td className="py-4 px-3">{tx.customer}</td>
                    <td className="py-4 px-3 font-medium">{tx.total}</td>
                    <td className="py-4 px-3">
                      <Badge
                        variant="outline"
                        className={`text-xs font-semibold ${statusBadgeClass[tx.status]}`}
                      >
                        {tx.status}
                      </Badge>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <Button
                        size="sm"
                        className="bg-[#05402e] hover:bg-[#032e21] text-white text-xs font-semibold rounded-xl h-8"
                      >
                        Lihat detail
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
