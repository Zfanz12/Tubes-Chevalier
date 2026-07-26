"use client";

import React from "react";
import {
  Hourglass,
  PackageCheck,
  Truck,
  CheckCircle2,
  Search,
  Plus,
  ArrowUpRight,
} from "lucide-react";

interface OrderItem {
  id: string;
  customer: string;
  date: string;
  total: string;
  status: "Menunggu" | "Diproses" | "Dikirim" | "Selesai";
}

const orderData: OrderItem[] = [
  {
    id: "INV-12345",
    customer: "Reza Rahardian",
    date: "12/02/2026",
    total: "Rp 130.000",
    status: "Menunggu",
  },
  {
    id: "INV-12345",
    customer: "Reza Rahardian",
    date: "12/02/2026",
    total: "Rp 130.000",
    status: "Menunggu",
  },
  {
    id: "INV-12345",
    customer: "Reza Rahardian",
    date: "12/02/2026",
    total: "Rp 20.000",
    status: "Diproses",
  },
  {
    id: "INV-12345",
    customer: "Reza Rahardian",
    date: "12/02/2026",
    total: "Rp 30.000",
    status: "Diproses",
  },
  {
    id: "INV-12345",
    customer: "Reza Rahardian",
    date: "12/02/2026",
    total: "Rp 130.000",
    status: "Dikirim",
  },
  {
    id: "INV-12345",
    customer: "Reza Rahardian",
    date: "12/02/2026",
    total: "Rp 130.000",
    status: "Selesai",
  },
  {
    id: "INV-12345",
    customer: "Reza Rahardian",
    date: "12/02/2026",
    total: "Rp 130.000",
    status: "Dikirim",
  },
];

export default function PesananPage() {
  return (
    <div className="w-full space-y-6">
      {/* ── Stat Cards ───────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Card 1: Menunggu */}
        <div className="bg-white rounded-2xl p-5 shadow-[0_4px_20px_rgba(3,59,42,0.06)] border border-emerald-300 ring-1 ring-black/5 space-y-3">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-red-50 border border-red-200 text-red-500 flex items-center justify-center shrink-0">
              <Hourglass className="w-6 h-6" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-1">
                <span className="text-sm font-medium text-gray-500">Menunggu</span>
                <span className="bg-[#d40005] text-white text-xs font-semibold px-3 py-1 rounded-full shadow-2xs">
                  Urgent
                </span>
              </div>
              <p className="text-2xl font-bold text-gray-900 tracking-tight">24</p>
            </div>
          </div>
          <div className="flex items-center gap-2 pt-0.5">
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-600 border border-emerald-100 shrink-0">
              <ArrowUpRight className="w-3.5 h-3.5" />
              12%
            </span>
            <span className="text-xs text-gray-400 truncate">Naik dari hari sebelumnya</span>
          </div>
        </div>

        {/* Card 2: Diproses */}
        <div className="bg-white rounded-2xl p-5 shadow-[0_4px_20px_rgba(3,59,42,0.06)] border border-emerald-300 ring-1 ring-black/5 space-y-3">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center shrink-0">
              <PackageCheck className="w-6 h-6" />
            </div>
            <div className="flex-1 min-w-0">
              <span className="text-sm font-medium text-gray-500 block">Diproses</span>
              <p className="text-2xl font-bold text-gray-900 tracking-tight">89</p>
            </div>
          </div>
          <div className="flex items-center gap-2 pt-0.5">
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-600 border border-emerald-100 shrink-0">
              <ArrowUpRight className="w-3.5 h-3.5" />
              12%
            </span>
            <span className="text-xs text-gray-400 truncate">Naik dari hari sebelumnya</span>
          </div>
        </div>

        {/* Card 3: Dikirim */}
        <div className="bg-white rounded-2xl p-5 shadow-[0_4px_20px_rgba(3,59,42,0.06)] border border-emerald-300 ring-1 ring-black/5 space-y-3">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-200 text-blue-600 flex items-center justify-center shrink-0">
              <Truck className="w-6 h-6" />
            </div>
            <div className="flex-1 min-w-0">
              <span className="text-sm font-medium text-gray-500 block">Dikirim</span>
              <p className="text-2xl font-bold text-gray-900 tracking-tight">156</p>
            </div>
          </div>
          <div className="flex items-center gap-2 pt-0.5">
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-600 border border-emerald-100 shrink-0">
              <ArrowUpRight className="w-3.5 h-3.5" />
              12%
            </span>
            <span className="text-xs text-gray-400 truncate">Naik dari hari sebelumnya</span>
          </div>
        </div>

        {/* Card 4: Selesai */}
        <div className="bg-white rounded-2xl p-5 shadow-[0_4px_20px_rgba(3,59,42,0.06)] border border-emerald-300 ring-1 ring-black/5 space-y-3">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div className="flex-1 min-w-0">
              <span className="text-sm font-medium text-gray-500 block">Selesai</span>
              <p className="text-2xl font-bold text-gray-900 tracking-tight">1240</p>
            </div>
          </div>
          <div className="flex items-center gap-2 pt-0.5">
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-600 border border-emerald-100 shrink-0">
              <ArrowUpRight className="w-3.5 h-3.5" />
              12%
            </span>
            <span className="text-xs text-gray-400 truncate">Naik dari hari sebelumnya</span>
          </div>
        </div>
      </div>

      {/* ── Main Order Table Card ───────────────────────────────── */}
      <div className="bg-white rounded-2xl p-6 shadow-[0_4px_20px_rgba(3,59,42,0.06)] border border-emerald-300 ring-1 ring-black/5 space-y-5">
        {/* Table Controls (Search, Date Filter & Add Button) */}
        <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
          {/* Search Bar */}
          <div className="relative w-full lg:w-80">
            <input
              type="text"
              placeholder="Cari pesanan"
              className="w-full bg-[#f3f4f6] text-sm text-gray-800 placeholder:text-gray-400 rounded-full pl-4 pr-10 py-2.5 outline-none focus:ring-2 focus:ring-[#1B4332]/20 transition"
            />
            <Search className="w-4 h-4 text-gray-700 absolute right-3.5 top-1/2 -translate-y-1/2" />
          </div>

          <div className="flex flex-wrap items-center justify-between sm:justify-end w-full lg:w-auto gap-4">
            {/* Time Filter Pills */}
            <div className="bg-[#eefcf4] p-1 rounded-full border border-[#c6f0d8] inline-flex items-center gap-1">
              <button className="px-4 py-1 text-xs font-bold bg-[#1B4332] text-white rounded-full shadow-2xs transition cursor-pointer">
                Semua
              </button>
              <button className="px-3.5 py-1 text-xs font-semibold text-gray-500 hover:text-gray-900 rounded-full transition cursor-pointer">
                7 hari
              </button>
              <button className="px-3.5 py-1 text-xs font-semibold text-gray-500 hover:text-gray-900 rounded-full transition cursor-pointer">
                30 hari
              </button>
            </div>

            {/* Add Order Button */}
            <button className="bg-[#1B4332] hover:bg-[#05543c] text-white text-xs font-semibold rounded-full px-5 py-2.5 transition flex items-center justify-center gap-1.5 shadow-xs cursor-pointer">
              <Plus className="w-4 h-4" />
              Catat Pesanan
            </button>
          </div>
        </div>

        {/* Orders Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-100 text-gray-500 text-xs font-semibold">
                <th className="py-3.5 px-3">Order ID</th>
                <th className="py-3.5 px-3">Customer</th>
                <th className="py-3.5 px-3 text-center">Tanggal</th>
                <th className="py-3.5 px-3 text-center">Total Harga</th>
                <th className="py-3.5 px-3 text-center">Status</th>
                <th className="py-3.5 px-3 text-center"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
              {orderData.map((item, index) => (
                <tr
                  key={index}
                  className="hover:bg-gray-50/60 transition-colors"
                >
                  {/* Order ID */}
                  <td className="py-4 px-3 font-medium text-gray-700 text-xs">
                    {item.id}
                  </td>

                  {/* Customer */}
                  <td className="py-4 px-3 font-semibold text-gray-800 text-xs">
                    {item.customer}
                  </td>

                  {/* Tanggal */}
                  <td className="py-4 px-3 text-center text-gray-600 text-xs">
                    {item.date}
                  </td>

                  {/* Total Harga */}
                  <td className="py-4 px-3 text-center font-medium text-gray-900 text-xs">
                    {item.total}
                  </td>

                  {/* Status */}
                  <td className="py-4 px-3 text-center">
                    {item.status === "Menunggu" && (
                      <span className="inline-flex items-center justify-center bg-red-50 text-red-600 border border-red-200 rounded-full px-4 py-1.5 text-xs font-semibold">
                        Menunggu
                      </span>
                    )}
                    {item.status === "Diproses" && (
                      <span className="inline-flex items-center justify-center bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full px-4 py-1.5 text-xs font-semibold">
                        Diproses
                      </span>
                    )}
                    {item.status === "Dikirim" && (
                      <span className="inline-flex items-center justify-center bg-blue-50 text-blue-600 border border-blue-200 rounded-full px-4 py-1.5 text-xs font-semibold">
                        Dikirim
                      </span>
                    )}
                    {item.status === "Selesai" && (
                      <span className="inline-flex items-center justify-center bg-teal-50 text-teal-700 border border-teal-200 rounded-full px-4 py-1.5 text-xs font-semibold">
                        Selesai
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
