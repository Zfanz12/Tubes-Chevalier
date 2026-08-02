import React from "react";
import Image from "next/image";
import {
  Package,
  Sprout,
  AlertTriangle,
  LayoutGrid,
  Search,
  Plus,
} from "lucide-react";

interface Product {
  id: number;
  name: string;
  category: string;
  stock: string;
  price: string;
  unit: string;
  status: "Tersedia" | "Habis" | "Menipis";
  image: string;
}

const productsData: Product[] = [
  {
    id: 1,
    name: "Bayam Hijau Segar",
    category: "Bayam",
    stock: "45 kg",
    price: "Rp12.500",
    unit: "/ikat",
    status: "Tersedia",
    image: "https://images.unsplash.com/photo-1576045057995-568f588f82fb?auto=format&fit=crop&w=120&q=80",
  },
  {
    id: 2,
    name: "Tomat Mantep",
    category: "Tomat",
    stock: "34 kg",
    price: "Rp11.500",
    unit: "/gram",
    status: "Tersedia",
    image: "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=120&q=80",
  },
  {
    id: 3,
    name: "Wortel Lokal",
    category: "Wortel",
    stock: "-",
    price: "Rp6.500",
    unit: "/gram",
    status: "Habis",
    image: "https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?auto=format&fit=crop&w=120&q=80",
  },
  {
    id: 4,
    name: "Pak Choy Gokil",
    category: "Pak Choy",
    stock: "120 kg",
    price: "Rp3.500",
    unit: "/gram",
    status: "Tersedia",
    image: "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=120&q=80",
  },
  {
    id: 5,
    name: "Kangkung Mantep",
    category: "Kangkung",
    stock: "1 kg",
    price: "Rp4.500",
    unit: "/ikat",
    status: "Menipis",
    image: "https://images.unsplash.com/photo-1576045057995-568f588f82fb?auto=format&fit=crop&w=120&q=80",
  },
  {
    id: 6,
    name: "Wortel Lokal",
    category: "Wortel",
    stock: "-",
    price: "Rp6.500",
    unit: "/gram",
    status: "Habis",
    image: "https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?auto=format&fit=crop&w=120&q=80",
  },
  {
    id: 7,
    name: "Pak Choy Gokil",
    category: "Pak Choy",
    stock: "120 kg",
    price: "Rp3.500",
    unit: "/gram",
    status: "Tersedia",
    image: "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=120&q=80",
  },
];

export default function ProdukPage() {
  return (
    <div className="space-y-6 w-full pb-10">
      {/* ── Stat Cards ───────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Card 1: Total Produk */}
        <div className="bg-white rounded-2xl p-5 shadow-[0_4px_20px_rgba(3,59,42,0.06)] border border-emerald-300 ring-1 ring-black/5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-[#d5ebe1] border border-[#9dc5b5] text-[#1B4332] flex items-center justify-center shrink-0">
            <Package className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-medium text-gray-500 mb-0.5">Total Produk</p>
            <p className="text-xl font-bold text-gray-900 tracking-tight">
              12 <span className="font-bold text-gray-900">Item</span>
            </p>
          </div>
        </div>

        {/* Card 2: Produk Aktif */}
        <div className="bg-white rounded-2xl p-5 shadow-[0_4px_20px_rgba(3,59,42,0.06)] border border-emerald-300 ring-1 ring-black/5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-[#dcf5e7] border border-[#a7f3d0] text-emerald-600 flex items-center justify-center shrink-0">
            <Sprout className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-medium text-gray-500 mb-0.5">Produk Aktif</p>
            <p className="text-xl font-bold text-gray-900 tracking-tight">
              8 <span className="font-bold text-gray-900">Item</span>
            </p>
          </div>
        </div>

        {/* Card 3: Stok Tipis */}
        <div className="bg-white rounded-2xl p-5 shadow-[0_4px_20px_rgba(3,59,42,0.06)] border border-emerald-300 ring-1 ring-black/5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-[#fde2e2] border border-[#fca5a5] text-red-500 flex items-center justify-center shrink-0">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-medium text-gray-500 mb-0.5">Stok Tipis</p>
            <p className="text-xl font-bold text-red-600 tracking-tight">
              2 <span className="font-bold text-gray-900">Item</span>
            </p>
          </div>
        </div>

        {/* Card 4: Kategori */}
        <div className="bg-white rounded-2xl p-5 shadow-[0_4px_20px_rgba(3,59,42,0.06)] border border-emerald-300 ring-1 ring-black/5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-[#dbeafe] border border-[#bfdbfe] text-blue-600 flex items-center justify-center shrink-0">
            <LayoutGrid className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-medium text-gray-500 mb-0.5">Kategori</p>
            <p className="text-xl font-bold text-gray-900 tracking-tight">
              5 <span className="font-bold text-gray-900">Item</span>
            </p>
          </div>
        </div>
      </div>

      {/* ── Main Product Table Card ─────────────────────────────── */}
      <div className="bg-white rounded-2xl p-6 shadow-[0_4px_20px_rgba(3,59,42,0.06)] border border-emerald-300 ring-1 ring-black/5 space-y-5">
        {/* Table Controls (Search & Add) */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Search Bar */}
          <div className="relative w-full sm:w-80">
            <input
              type="text"
              placeholder="Cari pesanan"
              className="w-full bg-[#f3f4f6] text-sm text-gray-800 placeholder:text-gray-400 rounded-full pl-4 pr-10 py-2.5 outline-none focus:ring-2 focus:ring-[#1B4332]/20 transition"
            />
            <Search className="w-4 h-4 text-gray-700 absolute right-3.5 top-1/2 -translate-y-1/2" />
          </div>

          {/* Add Product Button */}
          <button className="w-full sm:w-auto bg-[#1B4332] hover:bg-[#05543c] text-white text-xs font-semibold rounded-full px-5 py-2.5 transition flex items-center justify-center gap-1.5 shadow-xs cursor-pointer">
            <Plus className="w-4 h-4" />
            Tambah Produk
          </button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-100 text-xs font-semibold text-gray-500">
                <th className="pb-3 pt-2 pl-2">Produk</th>
                <th className="pb-3 pt-2 text-center">Kategori</th>
                <th className="pb-3 pt-2 text-center">Stok</th>
                <th className="pb-3 pt-2 text-center">Harga</th>
                <th className="pb-3 pt-2 text-center">Status</th>
                <th className="pb-3 pt-2 text-center pr-2">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
              {productsData.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50/50 transition">
                  {/* Produk (Thumbnail + Name) */}
                  <td className="py-3.5 pl-2">
                    <div className="flex items-center gap-3">
                      <div className="relative w-10 h-10 rounded-lg overflow-hidden shrink-0 bg-gray-100 border border-gray-100">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <span className="font-medium text-gray-800 text-sm">
                        {item.name}
                      </span>
                    </div>
                  </td>

                  {/* Kategori */}
                  <td className="py-3.5 text-center">
                    <span className="inline-flex items-center justify-center bg-[#e8f8f0] text-[#2d6a4f] border border-[#b7e4c7] rounded-full px-4 py-1.5 text-xs font-semibold">
                      {item.category}
                    </span>
                  </td>

                  {/* Stok */}
                  <td className="py-3.5 text-center font-medium text-gray-700 text-xs">
                    {item.stock}
                  </td>

                  {/* Harga */}
                  <td className="py-3.5 text-center text-xs">
                    <span className="font-bold text-gray-900">{item.price}</span>
                    <span className="text-gray-400 font-normal">{item.unit}</span>
                  </td>

                  {/* Status */}
                  <td className="py-3.5 text-center">
                    {item.status === "Tersedia" && (
                      <span className="inline-flex items-center justify-center bg-[#b7e4c7] text-[#1B4332] border border-[#74c69d] rounded-full px-4 py-1.5 text-xs font-bold">
                        Tersedia
                      </span>
                    )}
                    {item.status === "Habis" && (
                      <span className="inline-flex items-center justify-center bg-gray-100 text-gray-500 border border-gray-300 rounded-full px-4 py-1.5 text-xs font-semibold">
                        Habis
                      </span>
                    )}
                    {item.status === "Menipis" && (
                      <span className="inline-flex items-center justify-center bg-[#fef9c3] text-[#854d0e] border border-[#fef08a] rounded-full px-4 py-1.5 text-xs font-semibold">
                        Menipis
                      </span>
                    )}
                  </td>

                  {/* Aksi */}
                  <td className="py-3.5 text-center pr-2">
                    <div className="flex items-center justify-center gap-2">
                      <button className="bg-[#1B4332] hover:bg-[#05543c] text-white rounded-full px-4.5 py-1.5 text-xs font-semibold transition cursor-pointer shadow-2xs">
                        Edit
                      </button>
                      <button className="bg-[#ef4444] hover:bg-[#dc2626] text-white rounded-full px-4 py-1.5 text-xs font-semibold transition cursor-pointer shadow-2xs">
                        Hapus
                      </button>
                    </div>
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
            <span className="font-bold text-gray-900 border-b-2 border-gray-900 px-0.5 cursor-pointer">
              1
            </span>
            <span className="text-gray-500 hover:text-gray-800 px-0.5 cursor-pointer">
              2
            </span>
            <span className="text-gray-500 hover:text-gray-800 px-0.5 cursor-pointer">
              3
            </span>
            <span className="text-gray-500 hover:text-gray-800 px-0.5 cursor-pointer">
              4
            </span>
            <span className="text-gray-500 hover:text-gray-800 px-0.5 cursor-pointer">
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
