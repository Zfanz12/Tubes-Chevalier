import React from "react";
import { 
  ArrowUpRight, 
  Users, 
  TrendingUp, 
  ShoppingBag, 
  ChevronRight,
  TrendingDown
} from "lucide-react";

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      {/* Top Cards Row */}
      <div className="grid gap-6 md:grid-cols-3">
        {/* Card 1: Penjualan Hari Ini */}
        <div className="bg-[#05402e] text-white rounded-2xl p-6 shadow-sm relative overflow-hidden flex flex-col justify-between min-h-[140px]">
          <div>
            <p className="text-emerald-100/80 text-sm font-medium">Penjualan Hari Ini</p>
            <h3 className="text-3xl font-bold mt-2">Rp 750.000,00</h3>
          </div>
          <div className="mt-4 flex items-center gap-2">
            <span className="inline-flex items-center gap-1 bg-[#10b981]/20 text-[#10b981] px-2.5 py-1 rounded-full text-xs font-semibold">
              <ArrowUpRight className="w-3.5 h-3.5" />
              15%
            </span>
            <span className="text-emerald-100/60 text-xs">Naik dari hari sebelumnya</span>
          </div>
        </div>

        {/* Card 2: Pembeli Hari Ini */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-emerald-100 flex flex-col justify-between min-h-[140px]">
          <div>
            <p className="text-gray-500 text-sm font-medium">Pembeli Hari Ini</p>
            <div className="flex items-center gap-2 mt-2">
              <h3 className="text-3xl font-bold text-gray-900">27</h3>
              <Users className="w-6 h-6 text-gray-400" />
            </div>
          </div>
          <div className="mt-4 flex items-center gap-2">
            <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-600 px-2.5 py-1 rounded-full text-xs font-semibold border border-emerald-100">
              <ArrowUpRight className="w-3.5 h-3.5" />
              12%
            </span>
            <span className="text-gray-400 text-xs">Naik dari hari sebelumnya</span>
          </div>
        </div>

        {/* Card 3: Keuntungan Hari Ini */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-emerald-100 flex flex-col justify-between min-h-[140px]">
          <div>
            <p className="text-gray-500 text-sm font-medium">Keuntungan Hari Ini</p>
            <h3 className="text-3xl font-bold mt-2 text-gray-900">Rp 50.000,00</h3>
          </div>
          <div className="mt-4 flex items-center gap-2">
            <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-600 px-2.5 py-1 rounded-full text-xs font-semibold border border-emerald-100">
              <ArrowUpRight className="w-3.5 h-3.5" />
              15%
            </span>
            <span className="text-gray-400 text-xs">Naik dari hari sebelumnya</span>
          </div>
        </div>
      </div>

      {/* Middle Row: Chart & Order Status */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Grafik Penjualan */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-emerald-100 lg:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <h4 className="text-gray-800 font-bold text-base">Grafik Penjualan</h4>
            <div className="flex gap-2 bg-emerald-50/50 p-1 rounded-full border border-emerald-100">
              <button className="px-4 py-1.5 rounded-full text-xs font-medium text-gray-500 hover:text-emerald-700 transition">30 hari</button>
              <button className="px-4 py-1.5 rounded-full text-xs font-semibold bg-[#05402e] text-white shadow-sm transition">7 hari</button>
            </div>
          </div>
          
          {/* Beautiful SVG Line Chart */}
          <div className="h-64 w-full relative">
            <svg viewBox="0 0 500 200" className="w-full h-full">
              <defs>
                <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#05402e" stopOpacity="0.2" />
                  <stop offset="100%" stopColor="#05402e" stopOpacity="0" />
                </linearGradient>
              </defs>
              {/* Grid Lines */}
              <line x1="0" y1="20" x2="500" y2="20" stroke="#f1f5f9" strokeWidth="1" />
              <line x1="0" y1="60" x2="500" y2="60" stroke="#f1f5f9" strokeWidth="1" />
              <line x1="0" y1="100" x2="500" y2="100" stroke="#f1f5f9" strokeWidth="1" />
              <line x1="0" y1="140" x2="500" y2="140" stroke="#f1f5f9" strokeWidth="1" />
              <line x1="0" y1="180" x2="500" y2="180" stroke="#e2e8f0" strokeWidth="1.5" />

              {/* Area path */}
              <path 
                d="M 10 160 C 60 140, 100 130, 150 140 C 200 150, 250 110, 300 110 C 350 110, 400 135, 450 120 C 475 110, 490 125, 500 125 L 500 180 L 10 180 Z" 
                fill="url(#chartGradient)" 
              />

              {/* Line path */}
              <path 
                d="M 10 160 C 60 140, 100 130, 150 140 C 200 150, 250 110, 300 110 C 350 110, 400 135, 450 120 C 475 110, 490 125, 500 125" 
                fill="none" 
                stroke="#05402e" 
                strokeWidth="3" 
                strokeLinecap="round"
              />
            </svg>
            <div className="flex justify-between text-[11px] text-gray-400 font-semibold px-2 mt-2">
              <span>Sen</span>
              <span>Sel</span>
              <span>Rab</span>
              <span>Kam</span>
              <span>Jum</span>
              <span>Sab</span>
              <span>Min</span>
            </div>
          </div>
        </div>

        {/* Status Pesanan */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-emerald-100 flex flex-col">
          <h4 className="text-gray-800 font-bold text-base mb-6">Status Pesanan</h4>
          <div className="space-y-4 flex-1 flex flex-col justify-between">
            {/* Menunggu */}
            <div className="flex items-center justify-between p-4 bg-red-50 rounded-xl border border-red-100 border-l-4 border-l-red-500">
              <span className="text-red-700 font-semibold text-sm">Menunggu</span>
              <span className="text-2xl font-bold text-red-700">2</span>
            </div>
            {/* Diproses */}
            <div className="flex items-center justify-between p-4 bg-orange-50 rounded-xl border border-orange-100 border-l-4 border-l-orange-500">
              <span className="text-orange-700 font-semibold text-sm">Diproses</span>
              <span className="text-2xl font-bold text-orange-700">29</span>
            </div>
            {/* Dikirim */}
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100 border-l-4 border-l-gray-400">
              <span className="text-gray-600 font-semibold text-sm">Dikirim</span>
              <span className="text-2xl font-bold text-gray-600">109</span>
            </div>
            {/* Selesai */}
            <div className="flex items-center justify-between p-4 bg-emerald-50 rounded-xl border border-emerald-100 border-l-4 border-l-emerald-500">
              <span className="text-emerald-700 font-semibold text-sm">Selesai</span>
              <span className="text-2xl font-bold text-emerald-700">273</span>
            </div>
          </div>
        </div>
      </div>

      {/* Third Row: Stock Alert & Harvest Today */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Stok Hampir Habis */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-emerald-100">
          <h4 className="text-gray-800 font-bold text-base mb-6">Stok Hampir Habis</h4>
          <div className="space-y-3">
            {/* Kangkung */}
            <div className="flex items-center justify-between p-3.5 bg-red-50 rounded-xl border border-red-100">
              <span className="text-red-700 font-medium text-sm">Kangkung</span>
              <span className="text-red-700 font-bold text-sm">2 kg</span>
            </div>
            {/* Sawi Putih */}
            <div className="flex items-center justify-between p-3.5 bg-gray-50 rounded-xl border border-gray-100">
              <span className="text-gray-700 font-medium text-sm">Sawi Putih</span>
              <span className="text-gray-700 font-bold text-sm">3 kg</span>
            </div>
            {/* Wortel */}
            <div className="flex items-center justify-between p-3.5 bg-emerald-50 rounded-xl border border-emerald-100">
              <span className="text-emerald-700 font-medium text-sm">Wortel</span>
              <span className="text-emerald-700 font-bold text-sm">5 kg</span>
            </div>
            {/* Tomat */}
            <div className="flex items-center justify-between p-3.5 bg-emerald-50/50 rounded-xl border border-emerald-100/50">
              <span className="text-emerald-600 font-medium text-sm">Tomat</span>
              <span className="text-emerald-600 font-bold text-sm">7 kg</span>
            </div>
          </div>
        </div>

        {/* Panen Hari Ini */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-emerald-100">
          <h4 className="text-gray-800 font-bold text-base mb-6">Panen Hari Ini</h4>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {[
              "Bayam",
              "Kangkung",
              "Sawi Putih",
              "Wortel",
              "Tomat",
              "Pak Choy",
              "Brokoli",
            ].map((veg) => (
              <div 
                key={veg}
                className="bg-gray-50 hover:bg-emerald-50 border border-gray-100 hover:border-emerald-200 transition text-gray-700 hover:text-emerald-800 text-sm font-medium py-3 px-4 rounded-xl text-center cursor-pointer"
              >
                {veg}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Fourth Row: Recent Transactions */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-emerald-100 overflow-hidden">
        <h4 className="text-gray-800 font-bold text-base mb-6">Transaksi Terbaru</h4>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="border-b border-gray-100 text-gray-400 font-semibold">
                <th className="pb-3 font-semibold">ID Transaksi</th>
                <th className="pb-3 font-semibold">Tanggal</th>
                <th className="pb-3 font-semibold">Customer</th>
                <th className="pb-3 font-semibold">Total Harga</th>
                <th className="pb-3 font-semibold">Status</th>
                <th className="pb-3 text-right font-semibold"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {/* Row 1 */}
              <tr className="text-gray-700">
                <td className="py-4 font-semibold">INV-12345</td>
                <td className="py-4">12/02/2026</td>
                <td className="py-4">Reza Rahardian</td>
                <td className="py-4 font-medium">Rp 130.000,00</td>
                <td className="py-4">
                  <span className="inline-flex items-center bg-red-50 text-red-700 border border-red-200 px-3 py-1 rounded-full text-xs font-semibold">
                    Menunggu
                  </span>
                </td>
                <td className="py-4 text-right">
                  <button className="bg-[#05402e] hover:bg-[#032e21] text-white text-xs font-semibold px-4 py-2 rounded-xl transition">
                    Lihat detail
                  </button>
                </td>
              </tr>
              {/* Row 2 */}
              <tr className="text-gray-700">
                <td className="py-4 font-semibold">#RM-2123</td>
                <td className="py-4">13/02/2026</td>
                <td className="py-4">A***a Y****a</td>
                <td className="py-4 font-medium">Rp 130.000,00</td>
                <td className="py-4">
                  <span className="inline-flex items-center bg-orange-50 text-orange-700 border border-orange-200 px-3 py-1 rounded-full text-xs font-semibold">
                    Diproses
                  </span>
                </td>
                <td className="py-4 text-right">
                  <button className="bg-[#05402e] hover:bg-[#032e21] text-white text-xs font-semibold px-4 py-2 rounded-xl transition">
                    Lihat detail
                  </button>
                </td>
              </tr>
              {/* Row 3 */}
              <tr className="text-gray-700">
                <td className="py-4 font-semibold">INV-12345</td>
                <td className="py-4">12/02/2026</td>
                <td className="py-4">Reza Rahardian</td>
                <td className="py-4 font-medium">Rp 130.000,00</td>
                <td className="py-4">
                  <span className="inline-flex items-center bg-gray-50 text-gray-600 border border-gray-200 px-3 py-1 rounded-full text-xs font-semibold">
                    Dikirim
                  </span>
                </td>
                <td className="py-4 text-right">
                  <button className="bg-[#05402e] hover:bg-[#032e21] text-white text-xs font-semibold px-4 py-2 rounded-xl transition">
                    Lihat detail
                  </button>
                </td>
              </tr>
              {/* Row 4 */}
              <tr className="text-gray-700">
                <td className="py-4 font-semibold">#RM-2123</td>
                <td className="py-4">13/02/2026</td>
                <td className="py-4">A***a Y****a</td>
                <td className="py-4 font-medium">Rp 130.000,00</td>
                <td className="py-4">
                  <span className="inline-flex items-center bg-emerald-50 text-emerald-700 border border-emerald-200 px-3 py-1 rounded-full text-xs font-semibold">
                    Selesai
                  </span>
                </td>
                <td className="py-4 text-right">
                  <button className="bg-[#05402e] hover:bg-[#032e21] text-white text-xs font-semibold px-4 py-2 rounded-xl transition">
                    Lihat detail
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="mt-6 text-center">
          <a href="#" className="text-[#05402e] hover:text-[#032e21] font-bold text-sm hover:underline">
            Lihat semua transaksi
          </a>
        </div>
      </div>
    </div>
  );
}
