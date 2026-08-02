"use client";

import React, { useState } from "react";
import { Search, Plus, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";

// ── Types ───────────────────────────────────────────────────────────────────────

interface Product {
  id: number;
  name: string;
  kategori: string;
  jenisTanaman: string;
  totalberat: string;
  estimasiBerat: string;
  selisih: string;
  tanggal: string;
  tanggalTanam: string;
  estimasiWaktuTanam: string;
  jumlahBibit: string;
  status: "dibawah" | "sesuai" | "diatas";
  image: string;
}

interface PanenAkanDatang {
  id: number;
  name: string;
  targetBerat: string;
  tanggal: string;
  umur: number;
  hariLagi: number;
  status: string;
}

// ── Dummy Data ──────────────────────────────────────────────────────────────────

const dummyPanenAkanDatang: PanenAkanDatang[] = [
  {
    id: 1,
    name: "Kangkung Asu",
    targetBerat: "12 kg",
    tanggal: "29 Juli 2026",
    umur: 27,
    hariLagi: 2,
    status: "siap",
  },
  {
    id: 2,
    name: "Bayam Hijau Segar",
    targetBerat: "45 kg",
    tanggal: "31 Juli 2026",
    umur: 30,
    hariLagi: 4,
    status: "siap",
  },
  {
    id: 3,
    name: "Tomat Mantep",
    targetBerat: "34 kg",
    tanggal: "2 Agustus 2026",
    umur: 25,
    hariLagi: 6,
    status: "siap",
  },
];

const productsData: Product[] = [
  {
    id: 1,
    name: "Kangkung Asu",
    kategori: "Kangkung",
    jenisTanaman: "Sayuran Organik",
    totalberat: "28 kg",
    estimasiBerat: "25 kg",
    selisih: "+3 kg",
    tanggal: "07/05/2026",
    tanggalTanam: "01/02/2026",
    estimasiWaktuTanam: "90 Hari",
    jumlahBibit: "250 bibit",
    status: "diatas",
    image: "https://images.unsplash.com/photo-1576045057995-568f588f82fb?auto=format&fit=crop&w=120&q=80",
  },
  {
    id: 2,
    name: "Bayam Hijau Segar",
    kategori: "Bayam",
    jenisTanaman: "Sayuran Organik",
    totalberat: "45.7 kg",
    estimasiBerat: "47 kg",
    selisih: "-2 kg",
    tanggal: "13/10/2026",
    tanggalTanam: "10/07/2026",
    estimasiWaktuTanam: "60 Hari",
    jumlahBibit: "180 bibit",
    status: "dibawah",
    image: "https://images.unsplash.com/photo-1576045057995-568f588f82fb?auto=format&fit=crop&w=120&q=80",
  },
  {
    id: 3,
    name: "Tomat Mantep",
    kategori: "Tomat",
    jenisTanaman: "Sayuran",
    totalberat: "34.5 kg",
    estimasiBerat: "34 kg",
    selisih: "+0.5 kg",
    tanggal: "13/10/2026",
    tanggalTanam: "10/07/2026",
    estimasiWaktuTanam: "75 Hari",
    jumlahBibit: "200 bibit",
    status: "sesuai",
    image: "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=120&q=80",
  },
  {
    id: 4,
    name: "Wortel Lokal",
    kategori: "Wortel",
    jenisTanaman: "Sayuran",
    totalberat: "-",
    estimasiBerat: "30 kg",
    selisih: "-",
    tanggal: "13/10/2026",
    tanggalTanam: "10/07/2026",
    estimasiWaktuTanam: "80 Hari",
    jumlahBibit: "300 bibit",
    status: "sesuai",
    image: "https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?auto=format&fit=crop&w=120&q=80",
  },
  {
    id: 5,
    name: "Pak Choy Gokil",
    kategori: "Pak Choy",
    jenisTanaman: "Sayuran Organik",
    totalberat: "120 kg",
    estimasiBerat: "130 kg",
    selisih: "-10 kg",
    tanggal: "13/10/2026",
    tanggalTanam: "10/07/2026",
    estimasiWaktuTanam: "45 Hari",
    jumlahBibit: "500 bibit",
    status: "dibawah",
    image: "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=120&q=80",
  },
  {
    id: 6,
    name: "Kangkung Mantep",
    kategori: "Kangkung",
    jenisTanaman: "Sayuran",
    totalberat: "1 kg",
    estimasiBerat: "6 kg",
    selisih: "-5 kg",
    tanggal: "13/10/2026",
    tanggalTanam: "10/07/2026",
    estimasiWaktuTanam: "30 Hari",
    jumlahBibit: "150 bibit",
    status: "dibawah",
    image: "https://images.unsplash.com/photo-1576045057995-568f588f82fb?auto=format&fit=crop&w=120&q=80",
  },
  {
    id: 7,
    name: "Pak Choy Segar",
    kategori: "Pak Choy",
    jenisTanaman: "Sayuran Organik",
    totalberat: "120 kg",
    estimasiBerat: "110 kg",
    selisih: "+10 kg",
    tanggal: "13/10/2026",
    tanggalTanam: "10/07/2026",
    estimasiWaktuTanam: "45 Hari",
    jumlahBibit: "450 bibit",
    status: "diatas",
    image: "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=120&q=80",
  },
];

// ── Status label helper ─────────────────────────────────────────────────────────
function getStatusLabel(status: Product["status"]) {
  if (status === "diatas") return "Melebihi Estimasi";
  if (status === "sesuai") return "Sesuai Estimasi";
  return "Dibawah Estimasi";
}

// ── Detail Row Component ────────────────────────────────────────────────────────
function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
      <span className="text-sm text-gray-500">{label}</span>
      <span className="text-sm font-medium text-gray-900 text-right">{value}</span>
    </div>
  );
}

// ── Riwayat Panen Dialog ────────────────────────────────────────────────────────
function RiwayatPanenDialog({
  open,
  product,
  onOpenChange,
}: {
  open: boolean;
  product: Product | null;
  onOpenChange: (open: boolean) => void;
}) {
  if (!product) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="p-0 gap-0 overflow-hidden border border-emerald-100 shadow-2xl sm:max-w-md rounded-2xl"
      >
        {/* ── Header hijau dengan SVG pattern ── */}
        <div className="bg-[#1B4332] px-6 py-4 relative overflow-hidden">
          {/* Subtle pattern */}
          <div className="absolute inset-0 pointer-events-none opacity-10">
            <svg className="w-full h-full" viewBox="0 0 400 80" preserveAspectRatio="none">
              <polygon points="0,0 200,0 120,80" fill="#52b788" opacity="0.6" />
              <polygon points="200,0 400,0 320,80" fill="#74c69d" opacity="0.4" />
              <polygon points="0,0 120,80 0,80" fill="#40916c" opacity="0.7" />
            </svg>
          </div>
          <div className="relative z-10 flex items-center justify-between">
            <div>
              <DialogTitle className="text-white font-semibold text-base">
                Riwayat Panen
              </DialogTitle>
              <p className="text-emerald-200 text-xs mt-0.5">
                informasi riwayat panen
              </p>
            </div>
            <DialogClose
              render={
                <button className="text-emerald-300 hover:text-white transition rounded-full p-1.5 hover:bg-white/10 cursor-pointer outline-none" />
              }
            >
              <X className="w-4 h-4" />
              <span className="sr-only">Tutup</span>
            </DialogClose>
          </div>
        </div>

        {/* ── Body ── */}
        <div className="px-6 py-4">
          <DetailRow label="Nama Tanaman" value={product.name} />
          <DetailRow label="Kategori" value={product.kategori} />
          <DetailRow label="Jenis Tanaman" value={product.jenisTanaman} />
          <DetailRow label="Tanggal Tanam" value={product.tanggalTanam} />
          <DetailRow label="Estimasi Waktu Tanam" value={product.estimasiWaktuTanam} />
          <DetailRow label="Tanggal Panen" value={product.tanggal} />
          <DetailRow label="Jumlah Bibit" value={product.jumlahBibit} />
          <DetailRow label="Estimasi Berat" value={product.estimasiBerat} />
          <DetailRow label="Berat Total" value={product.totalberat} />
          <DetailRow label="Status" value={getStatusLabel(product.status)} />
        </div>
      </DialogContent>
    </Dialog>
  );
}

// ── Main Page ───────────────────────────────────────────────────────────────────
export default function DataPanenPage() {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleLihatDetail = (product: Product) => {
    setSelectedProduct(product);
    setDialogOpen(true);
  };

  return (
    <div className="space-y-6 w-full pb-10">
      {/* ── Panen Akan Datang Cards ──────────────────────────────── */}
      <span className="text-2xl font-bold text-[#2d6a4f] tracking-tight">Panen Yang Akan Datang</span>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mt-2">
        {dummyPanenAkanDatang.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-2xl p-5 border border-gray-200 shadow-sm flex flex-col gap-3"
          >
            {/* Top Row: Name + Badge */}
            <div className="flex items-start justify-between gap-2">
              <span className="font-bold text-gray-900 text-[15px] leading-tight">
                {item.name}
              </span>
              <span className="shrink-0 bg-[#fde8f0] text-[#c7145b] text-[11px] font-semibold rounded-full px-3 py-1 whitespace-nowrap">
                Dipanen dalam {item.hariLagi} hari
              </span>
            </div>

            {/* Meta: Estimasi & Umur */}
            <p className="text-sm text-gray-500">
              Estimasi {item.targetBerat}
              <span className="mx-2 text-gray-300">|</span>
              Umur {item.umur} hari
            </p>

            {/* Divider */}
            <div className="border-t border-gray-100" />

            {/* Bottom Row: Tanggal + Button */}
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-gray-700">
                {item.tanggal}
              </span>
              <button className="bg-[#1B4332] hover:bg-[#05543c] text-white text-xs font-semibold rounded-full px-4 py-2 transition cursor-pointer shadow-xs">
                Lihat detail
              </button>
            </div>
          </div>
        ))}
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
                <th className="pb-3 pt-2 pl-2">Tanggal</th>
                <th className="pb-3 pt-2 text-center">Produk</th>
                <th className="pb-3 pt-2 text-center">Total Berat</th>
                <th className="pb-3 pt-2 text-center">Selisih</th>
                <th className="pb-3 pt-2 text-center">Status</th>
                <th className="pb-3 pt-2 text-center pr-2">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
              {productsData.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50/50 transition">
                  <td className="py-3.5 text-center font-medium text-gray-700 text-xs">
                    {item.tanggal}
                  </td>
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

                  {/* Total Berat */}
                  <td className="py-3.5 text-center">
                    <span className="inline-flex items-center justify-center bg-[#e8f8f0] text-[#2d6a4f] border border-[#b7e4c7] rounded-full px-4 py-1.5 text-xs font-semibold">
                      {item.totalberat}
                    </span>
                  </td>

                  {/* Selisih */}
                  <td className="py-3.5 text-center font-medium text-gray-700 text-xs">
                    {item.selisih}
                  </td>

                  {/* Status */}
                  <td className="py-3.5 text-center">
                    {item.status === "dibawah" && (
                      <span className="inline-flex items-center justify-center bg-red-100 text-red-500 border border-red-300 rounded-full px-4 py-1.5 text-xs font-bold">
                        Dibawah Estimasi
                      </span>
                    )}
                    {item.status === "sesuai" && (
                      <span className="inline-flex items-center justify-center bg-blue-100 text-blue-500 border border-blue-300 rounded-full px-4 py-1.5 text-xs font-semibold">
                        Sesuai Estimasi
                      </span>
                    )}
                    {item.status === "diatas" && (
                      <span className="inline-flex items-center justify-center bg-green-100 text-green-500 border border-green-300 rounded-full px-4 py-1.5 text-xs font-semibold">
                        Diatas Estimasi
                      </span>
                    )}
                  </td>

                  {/* Aksi */}
                  <td className="py-3.5 text-center pr-2">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => handleLihatDetail(item)}
                        className="bg-[#1B4332] hover:bg-[#05543c] text-white rounded-full px-4 py-1.5 text-xs font-semibold transition cursor-pointer shadow-2xs"
                      >
                        Lihat Detail
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

      {/* ── Riwayat Panen Dialog ── */}
      <RiwayatPanenDialog
        open={dialogOpen}
        product={selectedProduct}
        onOpenChange={(v) => {
          setDialogOpen(v);
          if (!v) setSelectedProduct(null);
        }}
      />
    </div>
  );
}
