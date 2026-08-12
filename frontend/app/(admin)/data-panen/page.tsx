"use client";

import React, { useState, useMemo, useEffect } from "react";
import { Search, Plus, X, Sprout, Calendar, Clock } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { showToast } from "@/lib/custom-toast";

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
  kategori?: string;
  jumlahBibit?: string;
}

// MVP: 27 SKU komoditas fast-moving yang diizinkan
const KOMODITAS_CATALOG: { name: string; category: string }[] = [
  { name: "Bayam Hijau", category: "Bayam" },
  { name: "Bayam Merah", category: "Bayam" },
  { name: "Kangkung", category: "Kangkung" },
  { name: "Sawi Hijau", category: "Sawi" },
  { name: "Sawi Putih", category: "Sawi" },
  { name: "Pak Choy", category: "Pak Choy" },
  { name: "Selada Keriting", category: "Selada" },
  { name: "Selada Romaine", category: "Selada" },
  { name: "Tomat Merah", category: "Tomat" },
  { name: "Tomat Cherry", category: "Tomat" },
  { name: "Cabai Merah Besar", category: "Cabai" },
  { name: "Cabai Rawit", category: "Cabai" },
  { name: "Cabai Keriting", category: "Cabai" },
  { name: "Wortel", category: "Wortel" },
  { name: "Brokoli", category: "Brokoli" },
  { name: "Kembang Kol", category: "Kembang Kol" },
  { name: "Buncis", category: "Buncis" },
  { name: "Terong Ungu", category: "Terong" },
  { name: "Timun", category: "Timun" },
  { name: "Labu Siam", category: "Labu" },
  { name: "Daun Bawang", category: "Bumbu Dapur" },
  { name: "Seledri", category: "Bumbu Dapur" },
  { name: "Jahe", category: "Rempah" },
  { name: "Kunyit", category: "Rempah" },
  { name: "Lengkuas", category: "Rempah" },
  { name: "Pepaya", category: "Buah" },
  { name: "Pisang", category: "Buah" },
];

// ── Initial Data ──────────────────────────────────────────────────────────────────

const dummyPanenAkanDatang: PanenAkanDatang[] = [
  {
    id: 1,
    name: "Kangkung Hydroponik",
    targetBerat: "12 kg",
    tanggal: "29 Juli 2026",
    umur: 27,
    hariLagi: 2,
    status: "siap",
    kategori: "Kangkung",
    jumlahBibit: "200 bibit",
  },
  {
    id: 2,
    name: "Bayam Hijau Segar",
    targetBerat: "45 kg",
    tanggal: "31 Juli 2026",
    umur: 30,
    hariLagi: 4,
    status: "siap",
    kategori: "Bayam",
    jumlahBibit: "300 bibit",
  },
  {
    id: 3,
    name: "Tomat Merah Super",
    targetBerat: "34 kg",
    tanggal: "2 Agustus 2026",
    umur: 25,
    hariLagi: 6,
    status: "siap",
    kategori: "Tomat",
    jumlahBibit: "150 bibit",
  },
];

let nextPanenId = 100;
let nextUpcomingId = 50;

const initialProducts: Product[] = [
  {
    id: 1,
    name: "Kangkung Organik",
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
    name: "Tomat Merah Super",
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
    totalberat: "30 kg",
    estimasiBerat: "30 kg",
    selisih: "0 kg",
    tanggal: "13/10/2026",
    tanggalTanam: "10/07/2026",
    estimasiWaktuTanam: "80 Hari",
    jumlahBibit: "300 bibit",
    status: "sesuai",
    image: "https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?auto=format&fit=crop&w=120&q=80",
  },
  {
    id: 5,
    name: "Pak Choy Hijau",
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
];

function getStatusLabel(status: Product["status"]) {
  if (status === "diatas") return "Melebihi Estimasi";
  if (status === "sesuai") return "Sesuai Estimasi";
  return "Dibawah Estimasi";
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
      <span className="text-sm text-gray-500">{label}</span>
      <span className="text-sm font-semibold text-gray-900 text-right">{value}</span>
    </div>
  );
}

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
      <DialogContent className="sm:max-w-lg bg-white rounded-2xl p-6 shadow-2xl border border-gray-100">
        <DialogHeader className="pb-3 border-b border-gray-100">
          <DialogTitle className="text-lg font-bold text-gray-900">
            Riwayat Panen
          </DialogTitle>
          <DialogDescription className="text-xs text-gray-500">
            Informasi rincian hasil panen komoditas
          </DialogDescription>
        </DialogHeader>

        <div className="py-3 text-xs space-y-1">
          <DetailRow label="Nama Tanaman" value={product.name} />
          <DetailRow label="Kategori" value={product.kategori} />
          <DetailRow label="Jenis Tanaman" value={product.jenisTanaman} />
          <DetailRow label="Tanggal Tanam" value={product.tanggalTanam} />
          <DetailRow label="Estimasi Waktu Tanam" value={product.estimasiWaktuTanam} />
          <DetailRow label="Tanggal Panen" value={product.tanggal} />
          <DetailRow label="Jumlah Bibit" value={product.jumlahBibit} />
          <DetailRow label="Estimasi Berat" value={product.estimasiBerat} />
          <DetailRow label="Berat Total" value={product.totalberat} />
          <DetailRow label="Status Hasil Panen" value={getStatusLabel(product.status)} />
        </div>

        <DialogFooter className="pt-3">
          <Button
            onClick={() => onOpenChange(false)}
            className="w-full bg-[#1B4332] hover:bg-[#032e21] text-white rounded-xl h-10 text-xs font-semibold cursor-pointer shadow-xs"
          >
            Tutup
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default function DataPanenPage() {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [upcomingCrops, setUpcomingCrops] = useState<PanenAkanDatang[]>(dummyPanenAkanDatang);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"Semua Status" | "Sesuai Estimasi" | "Melebihi Estimasi" | "Dibawah Estimasi">("Semua Status");
  const [currentPage, setCurrentPage] = useState(1);
  const [failedImages, setFailedImages] = useState<Record<number, boolean>>({});

  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const [selectedUpcoming, setSelectedUpcoming] = useState<PanenAkanDatang | null>(null);

  const [isAddTanamOpen, setIsAddTanamOpen] = useState(false);
  const [newTanam, setNewTanam] = useState({
    name: "",
    kategori: "Sayuran",
    tanggalTanam: "",
    jumlahBibit: "",
    estimasiBerat: "",
    estimasiWaktuTanam: "",
  });

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [newPanen, setNewPanen] = useState({
    name: "",
    kategori: "",
    jenisTanaman: "Sayuran Organik",
    totalberat: "",
    estimasiBerat: "",
    tanggal: new Date().toLocaleDateString("id-ID"),
    tanggalTanam: "",
    estimasiWaktuTanam: "30 Hari",
    jumlahBibit: "100 bibit",
  });

  const itemsPerPage = 5;

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchSearch =
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.kategori.toLowerCase().includes(searchQuery.toLowerCase());
      if (!matchSearch) return false;

      if (statusFilter === "Sesuai Estimasi") return p.status === "sesuai";
      if (statusFilter === "Melebihi Estimasi") return p.status === "diatas";
      if (statusFilter === "Dibawah Estimasi") return p.status === "dibawah";
      return true;
    });
  }, [products, searchQuery, statusFilter]);

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage) || 1;

  // Pagination out-of-bounds safety check
  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredProducts.slice(start, start + itemsPerPage);
  }, [filteredProducts, currentPage]);

  const handleLihatDetail = (product: Product) => {
    setSelectedProduct(product);
    setDialogOpen(true);
  };

  const handleAddTanamSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTanam.name.trim()) {
      showToast("Nama tanaman tidak boleh kosong!", "error");
      return;
    }
    nextUpcomingId++;
    const newCrop: PanenAkanDatang = {
      id: nextUpcomingId,
      name: newTanam.name.trim(),
      targetBerat: `${newTanam.estimasiBerat || "20"} kg`,
      tanggal: newTanam.tanggalTanam || new Date().toLocaleDateString("id-ID"),
      umur: 1,
      hariLagi: parseInt(newTanam.estimasiWaktuTanam) || 30,
      status: "proses",
      kategori: newTanam.kategori,
      jumlahBibit: newTanam.jumlahBibit ? `${newTanam.jumlahBibit} bibit` : "100 bibit",
    };

    setUpcomingCrops((prev) => [newCrop, ...prev]);
    showToast(`Data tanam "${newTanam.name}" berhasil dicatat!`, "success");
    setIsAddTanamOpen(false);
    setNewTanam({
      name: "",
      kategori: "Sayuran",
      tanggalTanam: "",
      jumlahBibit: "",
      estimasiBerat: "",
      estimasiWaktuTanam: "",
    });
  };

  const handlePanenSekarang = (upcomingItem: PanenAkanDatang) => {
    nextPanenId++;
    const targetNum = parseFloat(upcomingItem.targetBerat) || 20;

    const newHarvest: Product = {
      id: nextPanenId,
      name: upcomingItem.name,
      kategori: upcomingItem.kategori || "Sayuran",
      jenisTanaman: "Sayuran Organik",
      totalberat: `${targetNum} kg`,
      estimasiBerat: `${targetNum} kg`,
      selisih: "0 kg",
      tanggal: new Date().toLocaleDateString("id-ID"),
      tanggalTanam: upcomingItem.tanggal,
      estimasiWaktuTanam: `${upcomingItem.umur} Hari`,
      jumlahBibit: upcomingItem.jumlahBibit || "200 bibit",
      status: "sesuai",
      image: "https://images.unsplash.com/photo-1576045057995-568f588f82fb?auto=format&fit=crop&w=120&q=80",
    };

    setProducts((prev) => [newHarvest, ...prev]);
    setUpcomingCrops((prev) => prev.filter((item) => item.id !== upcomingItem.id));
    setSelectedUpcoming(null);
    showToast(`Panen berhasil dicatat! "${upcomingItem.name}" ditambahkan ke riwayat panen`, "success");
  };

  const handleAddPanenSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedName = newPanen.name.trim();
    const realBerat = parseFloat(newPanen.totalberat);
    const estBerat = parseFloat(newPanen.estimasiBerat) || realBerat;

    if (!trimmedName) {
      showToast("Nama tanaman tidak boleh kosong!", "error");
      return;
    }
    if (isNaN(realBerat) || realBerat <= 0) {
      showToast("Total berat panen harus berupa angka valid lebih dari 0!", "error");
      return;
    }

    const diff = Math.round((realBerat - estBerat) * 100) / 100;

    let status: Product["status"] = "sesuai";
    if (diff > 0.5) status = "diatas";
    else if (diff < -0.5) status = "dibawah";

    nextPanenId++;
    const item: Product = {
      id: nextPanenId,
      name: trimmedName,
      kategori: newPanen.kategori.trim() || trimmedName,
      jenisTanaman: newPanen.jenisTanaman,
      totalberat: `${realBerat} kg`,
      estimasiBerat: `${estBerat} kg`,
      selisih: `${diff >= 0 ? "+" : ""}${diff} kg`,
      tanggal: newPanen.tanggal,
      tanggalTanam: newPanen.tanggalTanam || "01/08/2026",
      estimasiWaktuTanam: newPanen.estimasiWaktuTanam,
      jumlahBibit: newPanen.jumlahBibit,
      status,
      image: "https://images.unsplash.com/photo-1576045057995-568f588f82fb?auto=format&fit=crop&w=120&q=80",
    };

    setProducts([item, ...products]);
    setIsAddOpen(false);
    showToast(`Data panen "${item.name}" berhasil ditambahkan!`, "success");

    setNewPanen({
      name: "",
      kategori: "",
      jenisTanaman: "Sayuran Organik",
      totalberat: "",
      estimasiBerat: "",
      tanggal: "",
      tanggalTanam: "",
      estimasiWaktuTanam: "30 Hari",
      jumlahBibit: "100 bibit",
    });
  };

  return (
    <div className="space-y-6 w-full pb-10">
      {/* ── Top Action Buttons ─────────────────────────────────────── */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => setIsAddOpen(true)}
          className="bg-[#1B4332] hover:bg-[#05543c] text-white text-xs font-semibold rounded-xl px-5 py-2.5 transition flex items-center gap-1.5 shadow-xs cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          Input Data Panen
        </button>
        <button
          onClick={() => setIsAddTanamOpen(true)}
          className="bg-white border border-[#1B4332] text-[#1B4332] hover:bg-emerald-50 text-xs font-semibold rounded-xl px-5 py-2.5 transition flex items-center gap-1.5 cursor-pointer shadow-2xs"
        >
          <Plus className="w-4 h-4" />
          Input Data Tanam
        </button>
      </div>

      {/* ── Panen yang Akan Datang Section ───────────────────────────── */}
      <div className="space-y-3">
        <h2 className="text-2xl font-bold text-[#2d6a4f] tracking-tight">Panen yang Akan Datang</h2>

        {upcomingCrops.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {upcomingCrops.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-2xl p-5 shadow-[0_4px_20px_rgba(3,59,42,0.06)] border border-emerald-300 ring-1 ring-black/5 flex flex-col justify-between space-y-4 hover:shadow-[0_6px_24px_rgba(3,59,42,0.10)] transition-all"
              >
                <div className="space-y-2">
                  {/* Top Row: Name on left, Countdown badge on right */}
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-bold text-gray-900 text-base leading-tight">
                      {item.name}
                    </h3>
                    <span className="shrink-0 bg-amber-50 text-amber-700 border border-amber-200 text-xs font-semibold rounded-full px-3 py-1 whitespace-nowrap">
                      Dipanen dalam {item.hariLagi} hari
                    </span>
                  </div>

                  {/* Middle Subtitle: Estimasi | Umur */}
                  <p className="text-sm text-gray-500 font-medium">
                    Estimasi {item.targetBerat}
                    <span className="mx-2 text-gray-300">|</span>
                    Umur {item.umur} hari
                  </p>
                </div>

                {/* Divider & Bottom Row: Date on left, Detail button on right */}
                <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
                  <span className="text-sm font-bold text-gray-800">
                    {item.tanggal}
                  </span>
                  <button
                    onClick={() => setSelectedUpcoming(item)}
                    className="bg-[#1B4332] hover:bg-[#05543c] text-white text-xs font-semibold rounded-full px-5 py-2 transition cursor-pointer shadow-2xs"
                  >
                    Lihat detail
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl p-6 border border-emerald-200 text-center text-gray-500 text-xs italic">
            Belum ada tanaman yang sedang ditanam. Klik &ldquo;Input Data Tanam&rdquo; untuk menambahkan.
          </div>
        )}
      </div>

      {/* ── Main Product Table Card ─────────────────────────────── */}
      <div className="bg-white rounded-2xl p-6 shadow-[0_4px_20px_rgba(3,59,42,0.06)] border border-emerald-300 ring-1 ring-black/5 space-y-5">
        {/* Table Controls (Search & Status Filters) */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
            {/* Search Input */}
            <div className="relative w-full sm:w-72">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                placeholder="Cari data panen..."
                className="w-full bg-[#f3f4f6] text-sm text-gray-800 placeholder:text-gray-400 rounded-full pl-4 pr-10 py-2.5 outline-none focus:ring-2 focus:ring-[#1B4332]/20 transition"
              />
              {searchQuery ? (
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery("");
                    setCurrentPage(1);
                  }}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition cursor-pointer"
                  aria-label="Bersihkan pencarian"
                >
                  <X className="w-4 h-4" />
                </button>
              ) : (
                <Search className="w-4 h-4 text-gray-700 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              )}
            </div>

            {/* Status Filter Pills (Di sebelah kanan Search) */}
            <div className="bg-gray-100 p-1 rounded-full border border-gray-200 flex items-center gap-1 overflow-x-auto max-w-full w-full sm:w-auto">
              {(["Semua Status", "Sesuai Estimasi", "Melebihi Estimasi", "Dibawah Estimasi"] as const).map((st) => (
                <button
                  key={st}
                  onClick={() => {
                    setStatusFilter(st);
                    setCurrentPage(1);
                  }}
                  className={`px-3 py-1 text-[11px] rounded-full transition whitespace-nowrap cursor-pointer ${
                    statusFilter === st
                      ? "font-bold bg-[#1B4332] text-white shadow-2xs"
                      : "font-medium text-gray-600 hover:text-gray-900"
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-100 text-xs font-semibold text-gray-500">
                <th className="pb-3.5 pt-2 pl-2 text-center">Tanggal</th>
                <th className="pb-3.5 pt-2 pl-2">Produk</th>
                <th className="pb-3.5 pt-2 text-center">Total Berat</th>
                <th className="pb-3.5 pt-2 text-center">Selisih</th>
                <th className="pb-3.5 pt-2 text-center">Status</th>
                <th className="pb-3.5 pt-2 text-center pr-2">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
              {paginatedProducts.length > 0 ? (
                paginatedProducts.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50/50 transition">
                    <td className="py-4 text-center font-medium text-gray-700 text-xs">
                      {item.tanggal}
                    </td>

                    <td className="py-4 pl-2">
                      <div className="flex items-center gap-3">
                        <div className="relative w-10 h-10 rounded-lg overflow-hidden shrink-0 bg-emerald-50 border border-emerald-100 flex items-center justify-center">
                          {!failedImages[item.id] ? (
                            /* eslint-disable-next-line @next/next/no-img-element */
                            <img
                              src={item.image}
                              alt={item.name}
                              onError={() =>
                                setFailedImages((prev) => ({ ...prev, [item.id]: true }))
                              }
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <Sprout className="w-5 h-5 text-[#1B4332]" />
                          )}
                        </div>
                        <span className="font-medium text-gray-800 text-sm">{item.name}</span>
                      </div>
                    </td>

                    <td className="py-4 text-center">
                      <span className="inline-flex items-center justify-center bg-[#e8f8f0] text-[#2d6a4f] border border-[#b7e4c7] rounded-full px-4 py-1 text-xs font-semibold">
                        {item.totalberat}
                      </span>
                    </td>

                    <td className="py-4 text-center font-medium text-gray-700 text-xs">
                      {item.selisih}
                    </td>

                    <td className="py-4 text-center">
                      {item.status === "dibawah" && (
                        <span className="inline-flex items-center justify-center bg-red-100 text-red-500 border border-red-300 rounded-full px-4 py-1 text-xs font-bold">
                          Dibawah Estimasi
                        </span>
                      )}
                      {item.status === "sesuai" && (
                        <span className="inline-flex items-center justify-center bg-blue-100 text-blue-500 border border-blue-300 rounded-full px-4 py-1 text-xs font-semibold">
                          Sesuai Estimasi
                        </span>
                      )}
                      {item.status === "diatas" && (
                        <span className="inline-flex items-center justify-center bg-green-100 text-green-500 border border-green-300 rounded-full px-4 py-1 text-xs font-semibold">
                          Diatas Estimasi
                        </span>
                      )}
                    </td>

                    <td className="py-4 text-center pr-2">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => handleLihatDetail(item)}
                          className="bg-[#1B4332] hover:bg-[#05543c] text-white rounded-full px-5 py-2 text-xs font-semibold transition cursor-pointer shadow-2xs"
                        >
                          Lihat Detail
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-gray-400 text-xs font-medium">
                    Tidak ada data panen ditemukan.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
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

      {/* ── Modal Tambah Data Panen ── */}
      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent className="sm:max-w-lg bg-white rounded-2xl p-6 shadow-2xl border border-gray-100">
          <DialogHeader className="pb-3 border-b border-gray-100">
            <DialogTitle className="text-lg font-bold text-gray-900">Catat Hasil Panen</DialogTitle>
            <DialogDescription className="text-xs text-gray-500">
              Masukkan rincian hasil panen komoditas pertanian
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleAddPanenSubmit} className="space-y-4 py-3 text-xs">
            <div className="space-y-1.5">
              <Label className="text-gray-700 font-semibold">Nama Tanaman (Komoditas)</Label>
              <select
                value={newPanen.name}
                onChange={(e) => {
                  const selected = KOMODITAS_CATALOG.find((k) => k.name === e.target.value);
                  setNewPanen({
                    ...newPanen,
                    name: e.target.value,
                    kategori: selected?.category || "",
                  });
                }}
                className="w-full h-10 bg-white border border-gray-200 rounded-xl pl-3.5 pr-10 text-xs font-medium text-gray-800 outline-none focus:ring-2 focus:ring-[#1B4332]/20 appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2220%22%20height%3D%2220%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%234b5563%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpath%20d%3D%22m6%209%206%206%206-6%22%2F%3E%3C%2Fsvg%3E')] bg-[length:16px_16px] bg-[right_14px_center] bg-no-repeat cursor-pointer"
                required
              >
                <option value="" disabled>Pilih komoditas...</option>
                {KOMODITAS_CATALOG.map((k) => (
                  <option key={k.name} value={k.name}>{k.name} — {k.category}</option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-gray-700 font-semibold">Total Berat Panen (kg)</Label>
                <Input
                  type="number"
                  min="0.1"
                  step="any"
                  placeholder="Contoh: 25"
                  value={newPanen.totalberat}
                  onChange={(e) => setNewPanen({ ...newPanen, totalberat: e.target.value })}
                  className="h-10 rounded-xl border-gray-200 focus:ring-2 focus:ring-[#1B4332]/20"
                  required
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-gray-700 font-semibold">Estimasi Berat (kg)</Label>
                <Input
                  type="number"
                  min="0"
                  step="any"
                  placeholder="Contoh: 20"
                  value={newPanen.estimasiBerat}
                  onChange={(e) => setNewPanen({ ...newPanen, estimasiBerat: e.target.value })}
                  className="h-10 rounded-xl border-gray-200 focus:ring-2 focus:ring-[#1B4332]/20"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-gray-700 font-semibold">Tanggal Panen</Label>
                <Input
                  type="date"
                  value={newPanen.tanggal}
                  onChange={(e) => setNewPanen({ ...newPanen, tanggal: e.target.value })}
                  className="h-10 rounded-xl border-gray-200 focus:ring-2 focus:ring-[#1B4332]/20"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-gray-700 font-semibold">Tanggal Tanam</Label>
                <Input
                  type="date"
                  value={newPanen.tanggalTanam}
                  onChange={(e) => setNewPanen({ ...newPanen, tanggalTanam: e.target.value })}
                  className="h-10 rounded-xl border-gray-200 focus:ring-2 focus:ring-[#1B4332]/20"
                />
              </div>
            </div>

            <DialogFooter className="pt-4 gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsAddOpen(false)}
                className="h-10 px-5 rounded-xl font-semibold cursor-pointer"
              >
                Batal
              </Button>
              <Button
                type="submit"
                className="h-10 px-6 bg-[#1B4332] hover:bg-[#032e21] text-white rounded-xl font-semibold cursor-pointer"
              >
                Simpan Panen
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* ── Modal Input Data Tanam ── */}
      <Dialog open={isAddTanamOpen} onOpenChange={setIsAddTanamOpen}>
        <DialogContent className="sm:max-w-lg bg-white rounded-2xl p-6 shadow-2xl border border-emerald-300 ring-1 ring-black/5">
          <DialogHeader className="pb-3 border-b border-gray-100 flex items-center justify-between">
            <DialogTitle className="text-base font-bold text-gray-900">Input Data Tanam</DialogTitle>
          </DialogHeader>

          <form onSubmit={handleAddTanamSubmit} className="space-y-4 py-2 text-xs">
            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <Label className="text-gray-700 font-semibold">Nama Tanaman</Label>
                <span className="text-[11px] font-semibold text-red-500">Wajib</span>
              </div>
              <Input
                placeholder="Masukkan nama tanaman"
                value={newTanam.name}
                onChange={(e) => setNewTanam({ ...newTanam, name: e.target.value })}
                className="h-10 rounded-xl border-gray-200 focus:ring-2 focus:ring-[#1B4332]/20"
                required
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <Label className="text-gray-700 font-semibold">Kategori</Label>
                <span className="text-[11px] font-semibold text-red-500">Wajib</span>
              </div>
              <select
                value={newTanam.kategori}
                onChange={(e) => setNewTanam({ ...newTanam, kategori: e.target.value })}
                className="w-full h-10 bg-white border border-gray-200 rounded-xl pl-3.5 pr-10 text-xs font-medium text-gray-800 outline-none focus:ring-2 focus:ring-[#1B4332]/20 appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2220%22%20height%3D%2220%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%234b5563%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpath%20d%3D%22m6%209%206%206%206-6%22%2F%3E%3C%2Fsvg%3E')] bg-[length:16px_16px] bg-[right_14px_center] bg-no-repeat cursor-pointer"
              >
                <option value="Sayuran">Pilih kategori sayuran</option>
                <option value="Bayam">Bayam</option>
                <option value="Wortel">Wortel</option>
                <option value="Kubis">Kubis</option>
                <option value="Tomat">Tomat</option>
                <option value="Kangkung">Kangkung</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <Label className="text-gray-700 font-semibold">Tanggal Tanam</Label>
                  <span className="text-[11px] font-semibold text-red-500">Wajib</span>
                </div>
                <Input
                  type="date"
                  value={newTanam.tanggalTanam}
                  onChange={(e) => setNewTanam({ ...newTanam, tanggalTanam: e.target.value })}
                  className="h-10 rounded-xl border-gray-200 focus:ring-2 focus:ring-[#1B4332]/20"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <Label className="text-gray-700 font-semibold">Jumlah Bibit</Label>
                  <span className="text-[11px] font-semibold text-red-500">Wajib</span>
                </div>
                <Input
                  placeholder="Jumlah bibit (contoh: 200)"
                  value={newTanam.jumlahBibit}
                  onChange={(e) => setNewTanam({ ...newTanam, jumlahBibit: e.target.value })}
                  className="h-10 rounded-xl border-gray-200 focus:ring-2 focus:ring-[#1B4332]/20"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <Label className="text-gray-700 font-semibold">Estimasi Berat</Label>
                  <span className="text-[11px] font-semibold text-red-500">Wajib</span>
                </div>
                <div className="flex items-center gap-2">
                  <Input
                    placeholder="Estimasi berat panen"
                    value={newTanam.estimasiBerat}
                    onChange={(e) => setNewTanam({ ...newTanam, estimasiBerat: e.target.value })}
                    className="h-10 rounded-xl border-gray-200 focus:ring-2 focus:ring-[#1B4332]/20"
                    required
                  />
                  <span className="text-xs font-medium text-gray-500 shrink-0">kg</span>
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <Label className="text-gray-700 font-semibold">Estimasi Waktu Tanam</Label>
                  <span className="text-[11px] font-semibold text-red-500">Wajib</span>
                </div>
                <div className="flex items-center gap-2">
                  <Input
                    placeholder="Waktu tanam"
                    value={newTanam.estimasiWaktuTanam}
                    onChange={(e) => setNewTanam({ ...newTanam, estimasiWaktuTanam: e.target.value })}
                    className="h-10 rounded-xl border-gray-200 focus:ring-2 focus:ring-[#1B4332]/20"
                    required
                  />
                  <span className="text-xs font-medium text-gray-500 shrink-0">hari</span>
                </div>
              </div>
            </div>

            <DialogFooter className="pt-4 gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsAddTanamOpen(false)}
                className="flex-1 h-10 rounded-xl font-semibold text-xs cursor-pointer"
              >
                Batal
              </Button>
              <Button
                type="submit"
                className="flex-1 h-10 bg-[#1B4332] hover:bg-[#032e21] text-white rounded-xl font-semibold text-xs cursor-pointer shadow-xs"
              >
                Catat Data Tanam
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* ── Modal Detail Panen Akan Datang ── */}
      {selectedUpcoming && (
        <Dialog open={!!selectedUpcoming} onOpenChange={(open) => !open && setSelectedUpcoming(null)}>
          <DialogContent className="sm:max-w-lg bg-white rounded-2xl p-6 shadow-2xl border border-emerald-300 ring-1 ring-black/5">
            <DialogHeader className="pb-3 border-b border-gray-100">
              <DialogTitle className="text-base font-bold text-gray-900">
                Detail Tanaman
              </DialogTitle>
            </DialogHeader>

            <div className="py-3 text-xs space-y-3">
              <div className="space-y-1.5">
                <Label className="text-gray-700 font-semibold">Nama Tanaman</Label>
                <Input value={selectedUpcoming.name} readOnly className="h-10 bg-gray-50 rounded-xl text-xs font-semibold text-gray-800" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-gray-700 font-semibold">Tanggal Tanam</Label>
                  <Input value={selectedUpcoming.tanggal} readOnly className="h-10 bg-gray-50 rounded-xl text-xs font-semibold text-gray-800" />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-gray-700 font-semibold">Jumlah Bibit</Label>
                  <Input value={selectedUpcoming.jumlahBibit || "250 bibit"} readOnly className="h-10 bg-gray-50 rounded-xl text-xs font-semibold text-gray-800" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-gray-700 font-semibold">Estimasi Berat</Label>
                  <Input value={selectedUpcoming.targetBerat} readOnly className="h-10 bg-gray-50 rounded-xl text-xs font-semibold text-gray-800" />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-gray-700 font-semibold">Estimasi Waktu Tanam</Label>
                  <Input value={`${selectedUpcoming.umur} hari`} readOnly className="h-10 bg-gray-50 rounded-xl text-xs font-semibold text-gray-800" />
                </div>
              </div>
            </div>

            <DialogFooter className="pt-3 flex flex-col gap-2">
              <Button
                onClick={() => handlePanenSekarang(selectedUpcoming)}
                className="w-full bg-[#1B4332] hover:bg-[#032e21] text-white rounded-xl h-10 text-xs font-bold cursor-pointer shadow-xs"
              >
                Panen Sekarang
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

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
