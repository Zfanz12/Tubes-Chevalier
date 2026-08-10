"use client";

import React, { useState, useMemo, useEffect } from "react";
import Image from "next/image";
import {
  Package,
  Sprout,
  AlertTriangle,
  LayoutGrid,
  Search,
  Plus,
  Trash2,
  Edit,
  CheckCircle2,
  Info,
  ArrowLeft,
  Loader2,
} from "lucide-react";
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
import { createProduk, updateProduk, deleteProduk } from "@/lib/api";
import { useAuthStore } from "@/lib/useAuthStore";

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

const initialProducts: Product[] = [
  {
    id: 1,
    name: "Bayam Hijau Segar",
    category: "Bayam",
    stock: "45 ikat",
    price: "Rp 12.500",
    unit: "/ikat",
    status: "Tersedia",
    image: "https://images.unsplash.com/photo-1576045057995-568f588f82fb?auto=format&fit=crop&w=120&q=80",
  },
  {
    id: 2,
    name: "Tomat Mantep",
    category: "Tomat",
    stock: "34 gram",
    price: "Rp 11.500",
    unit: "/gram",
    status: "Tersedia",
    image: "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=120&q=80",
  },
  {
    id: 3,
    name: "Wortel Lokal",
    category: "Wortel",
    stock: "0 gram",
    price: "Rp 6.500",
    unit: "/gram",
    status: "Habis",
    image: "https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?auto=format&fit=crop&w=120&q=80",
  },
  {
    id: 4,
    name: "Pak Choy Gokil",
    category: "Pak Choy",
    stock: "120 gram",
    price: "Rp 3.500",
    unit: "/gram",
    status: "Tersedia",
    image: "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=120&q=80",
  },
  {
    id: 5,
    name: "Kangkung Mantep",
    category: "Kangkung",
    stock: "1 ikat",
    price: "Rp 4.500",
    unit: "/ikat",
    status: "Menipis",
    image: "https://images.unsplash.com/photo-1576045057995-568f588f82fb?auto=format&fit=crop&w=120&q=80",
  },
  {
    id: 6,
    name: "Brokoli Organik",
    category: "Brokoli",
    stock: "15 kg",
    price: "Rp 18.500",
    unit: "/kg",
    status: "Tersedia",
    image: "https://images.unsplash.com/photo-1584270354949-c26b0d5b4a0c?auto=format&fit=crop&w=120&q=80",
  },
];

let nextProdukId = 100;

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

const PRESET_UNITS = ["/kg", "/ikat", "/gram", "/pack", "/buah", "/karung", "Custom"];

function computeStatusFromStock(stockNum: number): Product["status"] {
  if (isNaN(stockNum) || stockNum <= 0) return "Habis";
  if (stockNum <= 5) return "Menipis";
  return "Tersedia";
}

export default function ProdukPage() {
  const token = useAuthStore((s) => s.token);
  const user = useAuthStore((s) => s.user);
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [isMutating, setIsMutating] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  // View mode: "table" | "add" | "edit"
  const [viewMode, setViewMode] = useState<"table" | "add" | "edit">("table");

  // Modals
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deletingProduct, setDeletingProduct] = useState<Product | null>(null);

  // Detail Modal State
  const [selectedDetailProduct, setSelectedDetailProduct] = useState<Product | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    jenisProduk: "Sayuran Organik",
    deskripsi: "Hadirkan nutrisi terbaik untuk keluarga dengan sayur segar berkualitas premium dari petani lokal. Dikemas higienis dan disortir secara ketat.",
    stock: "",
    price: "",
    unitSelect: "/kg",
    customUnit: "",
    minimalPembelian: "1",
    statusProduk: "Aktif" as "Aktif" | "Nonaktif",
    image: "https://images.unsplash.com/photo-1576045057995-568f588f82fb?auto=format&fit=crop&w=120&q=80",
  });

  const itemsPerPage = 5;

  const filteredProducts = useMemo(() => {
    return products.filter(
      (p) =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.category.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [products, searchQuery]);

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

  const totalItems = products.length;
  const activeItems = products.filter((p) => p.status === "Tersedia").length;
  const lowStockItems = products.filter((p) => p.status === "Menipis").length;
  const categoriesCount = new Set(products.map((p) => p.category)).size;

  // Live computed status for form preview
  const liveStockNum = parseFloat(formData.stock) || 0;
  const liveComputedStatus = computeStatusFromStock(liveStockNum);

  // Defensive validation helper
  const validateForm = () => {
    const trimmedName = formData.name.trim();
    const trimmedCategory = formData.category.trim();
    const numericStock = parseFloat(formData.stock);
    const numericPrice = parseFloat(formData.price.replace(/[^\d]/g, ""));

    if (!trimmedName) {
      showToast("Nama produk tidak boleh kosong!", "error");
      return false;
    }
    if (!trimmedCategory) {
      showToast("Kategori produk tidak boleh kosong!", "error");
      return false;
    }
    if (isNaN(numericStock) || numericStock < 0) {
      showToast("Jumlah stok harus berupa angka valid (minimal 0)!", "error");
      return false;
    }
    if (isNaN(numericPrice) || numericPrice <= 0) {
      showToast("Harga produk harus berupa angka valid lebih dari 0!", "error");
      return false;
    }

    const finalUnit =
      formData.unitSelect === "Custom"
        ? formData.customUnit.trim()
          ? formData.customUnit.startsWith("/")
            ? formData.customUnit.trim()
            : `/${formData.customUnit.trim()}`
          : "/unit"
        : formData.unitSelect;

    return { trimmedName, trimmedCategory, numericStock, numericPrice, finalUnit };
  };

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validated = validateForm();
    if (!validated) return;

    const { trimmedName, trimmedCategory, numericStock, numericPrice, finalUnit } = validated;
    const computedStatus = computeStatusFromStock(numericStock);
    const formattedPrice = `Rp ${numericPrice.toLocaleString("id-ID")}`;
    const unitLabel = finalUnit.replace(/^\//, "");

    // Optimistic local update (tampil dulu sebelum API)
    nextProdukId++;
    const tempId = nextProdukId;
    const newProd: Product = {
      id: tempId,
      name: trimmedName,
      category: trimmedCategory,
      stock: `${numericStock} ${unitLabel}`,
      price: formattedPrice,
      unit: finalUnit,
      status: computedStatus,
      image: formData.image,
    };

    setProducts((prev) => [newProd, ...prev]);
    setIsAddOpen(false);
    setViewMode("table");
    resetForm();

    // Panggil API jika user adalah petani dan token tersedia
    if (token && user?.role === "petani") {
      setIsMutating(true);
      try {
        const res = await createProduk(token, {
          nama_barang: trimmedName,
          stok: numericStock,
          harga: numericPrice,
        });
        // Update ID lokal dengan ID real dari backend
        setProducts((prev) =>
          prev.map((p) => (p.id === tempId ? { ...p, id: res.data.id } : p))
        );
        showToast(`Produk "${trimmedName}" berhasil disimpan ke server!`, "success");
      } catch (err: unknown) {
        const error = err as { message?: string };
        showToast(`Produk ditambahkan lokal, gagal sinkron ke server: ${error?.message ?? "Unknown error"}`, "error");
      } finally {
        setIsMutating(false);
      }
    } else {
      showToast(`Produk "${newProd.name}" berhasil ditambahkan!`, "success");
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      category: "",
      jenisProduk: "Sayuran Organik",
      deskripsi: "Hadirkan nutrisi terbaik untuk keluarga dengan sayur segar berkualitas premium dari petani lokal.",
      stock: "",
      price: "",
      unitSelect: "/kg",
      customUnit: "",
      minimalPembelian: "1",
      statusProduk: "Aktif",
      image: "https://images.unsplash.com/photo-1576045057995-568f588f82fb?auto=format&fit=crop&w=120&q=80",
    });
  };

  const openEditModal = (p: Product) => {
    setEditingProduct(p);
    const stockVal = p.stock.replace(/[^\d.]/g, "");
    const priceVal = p.price.replace(/[^\d]/g, "");
    const isPreset = PRESET_UNITS.includes(p.unit);

    setFormData({
      name: p.name,
      category: p.category,
      jenisProduk: "Sayuran Organik",
      deskripsi: "Hadirkan nutrisi terbaik untuk keluarga dengan sayur bayam hijau segar dari Tani Gacor! Kami menyediakan bayam berkualitas premium seberat ±250 gram (1 ikat) yang dipanen dan disortir dengan ketat.",
      stock: stockVal,
      price: priceVal,
      unitSelect: isPreset ? p.unit : "Custom",
      customUnit: isPreset ? "" : p.unit,
      minimalPembelian: "2",
      statusProduk: p.status === "Habis" ? "Nonaktif" : "Aktif",
      image: p.image,
    });
    setViewMode("edit");
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;

    const validated = validateForm();
    if (!validated) return;

    const { trimmedName, trimmedCategory, numericStock, numericPrice, finalUnit } = validated;
    const computedStatus = computeStatusFromStock(numericStock);
    const formattedPrice = `Rp ${numericPrice.toLocaleString("id-ID")}`;
    const unitLabel = finalUnit.replace(/^\//, "");
    const finalStatus = formData.statusProduk === "Nonaktif" ? "Habis" : computedStatus;

    // Optimistic local update
    setProducts((prev) =>
      prev.map((item) =>
        item.id === editingProduct.id
          ? {
              ...item,
              name: trimmedName,
              category: trimmedCategory,
              stock: `${numericStock} ${unitLabel}`,
              price: formattedPrice,
              unit: finalUnit,
              status: finalStatus,
              image: formData.image,
            }
          : item
      )
    );
    setEditingProduct(null);
    setViewMode("table");
    resetForm();

    if (token && user?.role === "petani") {
      setIsMutating(true);
      try {
        await updateProduk(token, editingProduct.id, {
          nama_barang: trimmedName,
          stok: numericStock,
          harga: numericPrice,
        });
        showToast(`Produk "${trimmedName}" berhasil diperbarui di server!`, "success");
      } catch (err: unknown) {
        const error = err as { message?: string };
        showToast(`Perubahan disimpan lokal, gagal sinkron: ${error?.message ?? "Unknown error"}`, "error");
      } finally {
        setIsMutating(false);
      }
    } else {
      showToast(`Produk "${trimmedName}" berhasil diperbarui!`, "success");
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deletingProduct) return;
    const toDelete = deletingProduct;
    setProducts((prev) => prev.filter((p) => p.id !== toDelete.id));
    setDeletingProduct(null);

    if (token && user?.role === "petani") {
      try {
        await deleteProduk(token, toDelete.id);
        showToast(`Produk "${toDelete.name}" berhasil dihapus dari server!`, "success");
      } catch (err: unknown) {
        const error = err as { message?: string };
        // Rollback jika API gagal
        setProducts((prev) => [toDelete, ...prev]);
        showToast(`Gagal menghapus dari server: ${error?.message ?? "Unknown error"}`, "error");
      }
    } else {
      showToast(`Produk "${toDelete.name}" berhasil dihapus`, "success");
    }
  };

  // ── Dedicated Page View for Tambah / Edit Produk (page edit produk.png) ──
  if (viewMode === "add" || viewMode === "edit") {
    const isEdit = viewMode === "edit";
    return (
      <div className="space-y-6 w-full pb-10">
        {/* Top Header */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              setViewMode("table");
              setEditingProduct(null);
              resetForm();
            }}
            className="w-9 h-9 rounded-xl bg-white border border-gray-200 text-gray-700 flex items-center justify-center hover:bg-gray-50 transition cursor-pointer shadow-2xs"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
            {isEdit ? "Edit Produk" : "Tambah Produk"}
          </h1>
        </div>

        {/* 2-Column Grid matching page edit produk.png */}
        <form onSubmit={isEdit ? handleEditSubmit : handleAddSubmit} className="flex flex-col lg:flex-row gap-6 items-start">
          {/* Left Sidebar Card */}
          <div className="w-full lg:w-72 bg-white rounded-2xl p-5 shadow-[0_4px_20px_rgba(3,59,42,0.06)] border border-emerald-300 ring-1 ring-black/5 space-y-6 shrink-0">
            <div>
              <h3 className="font-bold text-gray-900 text-sm border-b border-gray-100 pb-3">Kelengkapan</h3>
              <div className="space-y-4 pt-4 text-xs font-medium">
                <div className="flex items-center gap-3 text-[#1B4332] font-bold">
                  <div className="w-7 h-7 rounded-full bg-emerald-100 border border-emerald-300 text-[#1B4332] flex items-center justify-center text-xs">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <span>Informasi Produk</span>
                </div>
                <div className="flex items-center gap-3 text-gray-600">
                  <div className="w-7 h-7 rounded-full bg-gray-100 text-gray-500 flex items-center justify-center text-xs font-bold">
                    2
                  </div>
                  <span>Informasi Penjualan</span>
                </div>
                <div className="flex items-center gap-3 text-gray-600">
                  <div className="w-7 h-7 rounded-full bg-gray-100 text-gray-500 flex items-center justify-center text-xs font-bold">
                    3
                  </div>
                  <span>Foto Produk</span>
                </div>
              </div>
            </div>

            {/* Status Produk Toggle Pill (Edit mode) */}
            {isEdit && (
              <div className="space-y-2 border-t border-gray-100 pt-4">
                <Label className="text-xs font-semibold text-gray-700 block">Status Produk:</Label>
                <div className="flex items-center bg-gray-100 p-1 rounded-full border border-gray-200">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, statusProduk: "Aktif" })}
                    className={`flex-1 py-1.5 text-xs font-semibold rounded-full transition cursor-pointer ${
                      formData.statusProduk === "Aktif"
                        ? "bg-[#1B4332] text-white shadow-2xs"
                        : "text-gray-500 hover:text-gray-800"
                    }`}
                  >
                    Aktif
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, statusProduk: "Nonaktif" })}
                    className={`flex-1 py-1.5 text-xs font-semibold rounded-full transition cursor-pointer ${
                      formData.statusProduk === "Nonaktif"
                        ? "bg-red-600 text-white shadow-2xs"
                        : "text-gray-500 hover:text-gray-800"
                    }`}
                  >
                    Nonaktif
                  </button>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex items-center gap-3 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setViewMode("table");
                  setEditingProduct(null);
                  resetForm();
                }}
                className="flex-1 h-10 rounded-xl font-semibold text-xs cursor-pointer"
              >
                Batal
              </Button>
              <Button
                type="submit"
                className="flex-1 h-10 bg-[#1B4332] hover:bg-[#032e21] text-white rounded-xl font-semibold text-xs cursor-pointer shadow-xs"
              >
                Simpan
              </Button>
            </div>
          </div>

          {/* Right Main Content Cards */}
          <div className="flex-1 space-y-6 w-full">
            {/* Card 1: Informasi Produk */}
            <div className="bg-white rounded-2xl p-6 shadow-[0_4px_20px_rgba(3,59,42,0.06)] border border-emerald-300 ring-1 ring-black/5 space-y-4">
              <h3 className="font-bold text-gray-900 text-sm border-b border-gray-100 pb-3">Informasi Produk</h3>

              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <Label className="text-gray-700 font-semibold text-xs">Nama Produk</Label>
                  <span className="text-[11px] font-semibold text-red-500">Wajib</span>
                </div>
                <select
                  value={formData.name}
                  onChange={(e) => {
                    const selected = KOMODITAS_CATALOG.find((k) => k.name === e.target.value);
                    setFormData({
                      ...formData,
                      name: e.target.value,
                      category: selected?.category || "",
                    });
                  }}
                  className="w-full h-10 bg-white border border-gray-200 rounded-xl pl-3.5 pr-10 text-xs font-medium text-gray-800 outline-none focus:ring-2 focus:ring-[#1B4332]/20 appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2220%22%20height%3D%2220%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%234b5563%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpath%20d%3D%22m6%209%206%206%206-6%22%2F%3E%3C%2Fsvg%3E')] bg-[length:16px_16px] bg-[right_14px_center] bg-no-repeat cursor-pointer"
                  required
                >
                  <option value="" disabled>Pilih nama produk...</option>
                  {KOMODITAS_CATALOG.map((k) => (
                    <option key={k.name} value={k.name}>{k.name}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center">
                    <Label className="text-gray-700 font-semibold text-xs">Kategori</Label>
                    <span className="text-[11px] font-semibold text-red-500">Wajib</span>
                  </div>
                  <Input
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    placeholder="Pilih kategori sayuran"
                    className="h-10 rounded-xl border-gray-200 focus:ring-2 focus:ring-[#1B4332]/20 text-xs"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <div className="flex justify-between items-center">
                    <Label className="text-gray-700 font-semibold text-xs">Jenis Produk</Label>
                    <span className="text-[11px] font-semibold text-red-500">Wajib</span>
                  </div>
                  <div className="flex items-center gap-4 pt-2 text-xs">
                    <label className="flex items-center gap-2 cursor-pointer text-gray-700 font-medium">
                      <input
                        type="radio"
                        name="jenisProduk"
                        value="Sayuran Organik"
                        checked={formData.jenisProduk === "Sayuran Organik"}
                        onChange={(e) => setFormData({ ...formData, jenisProduk: e.target.value })}
                        className="accent-[#1B4332]"
                      />
                      Sayuran Organik
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer text-gray-700 font-medium">
                      <input
                        type="radio"
                        name="jenisProduk"
                        value="Sayuran Non Organik"
                        checked={formData.jenisProduk === "Sayuran Non Organik"}
                        onChange={(e) => setFormData({ ...formData, jenisProduk: e.target.value })}
                        className="accent-[#1B4332]"
                      />
                      Sayuran Non Organik
                    </label>
                  </div>
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <Label className="text-gray-700 font-semibold text-xs">Deskripsi</Label>
                  <span className="text-[11px] font-semibold text-red-500">Wajib</span>
                </div>
                <textarea
                  rows={4}
                  value={formData.deskripsi}
                  onChange={(e) => setFormData({ ...formData, deskripsi: e.target.value })}
                  placeholder="Tuliskan deskripsi produk..."
                  className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#1B4332]/20 outline-none text-xs text-gray-800"
                  required
                />
              </div>
            </div>

            {/* Card 2: Informasi Penjualan */}
            <div className="bg-white rounded-2xl p-6 shadow-[0_4px_20px_rgba(3,59,42,0.06)] border border-emerald-300 ring-1 ring-black/5 space-y-4">
              <h3 className="font-bold text-gray-900 text-sm border-b border-gray-100 pb-3">Informasi Penjualan</h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center">
                    <Label className="text-gray-700 font-semibold text-xs">Harga (Rp)</Label>
                    <span className="text-[11px] font-semibold text-red-500">Wajib</span>
                  </div>
                  <Input
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    placeholder="Masukkan harga"
                    className="h-10 rounded-xl border-gray-200 focus:ring-2 focus:ring-[#1B4332]/20 text-xs"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <div className="flex justify-between items-center">
                    <Label className="text-gray-700 font-semibold text-xs">Satuan</Label>
                    <span className="text-[11px] font-semibold text-red-500">Wajib</span>
                  </div>
                  <select
                    value={formData.unitSelect}
                    onChange={(e) => setFormData({ ...formData, unitSelect: e.target.value })}
                    className="w-full h-10 bg-white border border-gray-200 rounded-xl pl-3.5 pr-10 text-xs font-medium text-gray-800 outline-none focus:ring-2 focus:ring-[#1B4332]/20 appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2220%22%20height%3D%2220%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%234b5563%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpath%20d%3D%22m6%209%206%206%206-6%22%2F%3E%3C%2Fsvg%3E')] bg-[length:16px_16px] bg-[right_14px_center] bg-no-repeat cursor-pointer"
                  >
                    <option value="Ikat">Ikat</option>
                    <option value="Gram">Gram</option>
                    <option value="Kilogram">Kilogram</option>
                    <option value="/kg">/kg</option>
                    <option value="/ikat">/ikat</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center">
                    <Label className="text-gray-700 font-semibold text-xs">Minimal Pembelian</Label>
                    <span className="text-[11px] font-semibold text-red-500">Wajib</span>
                  </div>
                  <Input
                    type="number"
                    value={formData.minimalPembelian}
                    onChange={(e) => setFormData({ ...formData, minimalPembelian: e.target.value })}
                    placeholder="Masukkan jumlah minimal"
                    className="h-10 rounded-xl border-gray-200 focus:ring-2 focus:ring-[#1B4332]/20 text-xs"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <div className="flex justify-between items-center">
                    <Label className="text-gray-700 font-semibold text-xs">Jumlah Stok</Label>
                    <span className="text-[11px] font-semibold text-red-500">Wajib</span>
                  </div>
                  <Input
                    type="number"
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                    placeholder="Masukkan jumlah stok"
                    className="h-10 rounded-xl border-gray-200 focus:ring-2 focus:ring-[#1B4332]/20 text-xs"
                    required
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input type="checkbox" id="aturMinPage" defaultChecked className="accent-[#1B4332] rounded" />
                <label htmlFor="aturMinPage" className="text-xs font-semibold text-gray-700 cursor-pointer">
                  Atur minimal pembelian
                </label>
              </div>
            </div>

            {/* Card 3: Foto Produk */}
            <div className="bg-white rounded-2xl p-6 shadow-[0_4px_20px_rgba(3,59,42,0.06)] border border-emerald-300 ring-1 ring-black/5 space-y-4">
              <h3 className="font-bold text-gray-900 text-sm border-b border-gray-100 pb-3">Foto Produk</h3>
              <div className="border-2 border-dashed border-emerald-200 bg-emerald-50/40 rounded-2xl p-6 text-center space-y-2">
                <div className="w-12 h-12 rounded-xl bg-white border border-emerald-200 text-[#1B4332] flex items-center justify-center mx-auto shadow-2xs">
                  <Package className="w-6 h-6" />
                </div>
                <p className="text-xs font-semibold text-gray-800">Unggah Foto Produk Panen</p>
                <p className="text-[11px] text-gray-400">PNG, JPG, JPEG hingga 5MB</p>
              </div>
            </div>
          </div>
        </form>
      </div>
    );
  }

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
              {totalItems} <span className="font-bold text-gray-900">Item</span>
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
              {activeItems} <span className="font-bold text-gray-900">Item</span>
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
              {lowStockItems} <span className="font-bold text-gray-900">Item</span>
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
              {categoriesCount} <span className="font-bold text-gray-900">Kategori</span>
            </p>
          </div>
        </div>
      </div>

      {/* ── Main Product Table Card ─────────────────────────────── */}
      <div className="bg-white rounded-2xl p-6 shadow-[0_4px_20px_rgba(3,59,42,0.06)] border border-emerald-300 ring-1 ring-black/5 space-y-5">
        {/* Table Controls (Search & Add) */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative w-full sm:w-80">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Cari produk..."
              className="w-full bg-[#f3f4f6] text-sm text-gray-800 placeholder:text-gray-400 rounded-full pl-4 pr-10 py-2.5 outline-none focus:ring-2 focus:ring-[#1B4332]/20 transition"
            />
            <Search className="w-4 h-4 text-gray-700 absolute right-3.5 top-1/2 -translate-y-1/2" />
          </div>

          <button
            onClick={() => {
              resetForm();
              setViewMode("add");
            }}
            className="w-full sm:w-auto bg-[#1B4332] hover:bg-[#05543c] text-white text-xs font-semibold rounded-full px-5 py-2.5 transition flex items-center justify-center gap-1.5 shadow-xs cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            Tambah Produk
          </button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-100 text-xs font-semibold text-gray-500">
                <th className="pb-3.5 pt-2 pl-2">Produk</th>
                <th className="pb-3.5 pt-2 text-center">Kategori</th>
                <th className="pb-3.5 pt-2 text-center">Stok</th>
                <th className="pb-3.5 pt-2 text-center">Harga</th>
                <th className="pb-3.5 pt-2 text-center">Status</th>
                <th className="pb-3.5 pt-2 text-center pr-2">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
              {paginatedProducts.length > 0 ? (
                paginatedProducts.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50/50 transition">
                    <td className="py-4 pl-2">
                      <div className="flex items-center gap-3">
                        <div className="relative w-10 h-10 rounded-lg overflow-hidden shrink-0 bg-gray-100 border border-gray-100">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <span className="font-medium text-gray-800 text-sm">{item.name}</span>
                      </div>
                    </td>

                    <td className="py-4 text-center">
                      <span className="inline-flex items-center justify-center bg-[#e8f8f0] text-[#2d6a4f] border border-[#b7e4c7] rounded-full px-4 py-1 text-xs font-semibold">
                        {item.category}
                      </span>
                    </td>

                    <td className="py-4 text-center font-medium text-gray-700 text-xs">
                      {item.stock}
                    </td>

                    <td className="py-4 text-center text-xs">
                      <span className="font-bold text-gray-900">{item.price}</span>
                      <span className="text-gray-400 font-normal ml-0.5">{item.unit}</span>
                    </td>

                    <td className="py-4 text-center">
                      {item.status === "Tersedia" && (
                        <span className="inline-flex items-center justify-center bg-[#b7e4c7] text-[#1B4332] border border-[#74c69d] rounded-full px-4 py-1 text-xs font-bold">
                          Tersedia
                        </span>
                      )}
                      {item.status === "Habis" && (
                        <span className="inline-flex items-center justify-center bg-gray-100 text-gray-500 border border-gray-300 rounded-full px-4 py-1 text-xs font-semibold">
                          Habis
                        </span>
                      )}
                      {item.status === "Menipis" && (
                        <span className="inline-flex items-center justify-center bg-[#fef9c3] text-[#854d0e] border border-[#fef08a] rounded-full px-4 py-1 text-xs font-semibold">
                          Menipis
                        </span>
                      )}
                    </td>

                    <td className="py-4 text-right pr-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openEditModal(item)}
                          className="bg-[#5ec250] hover:bg-[#4cb03f] text-white rounded-full px-4 py-1.5 text-xs font-semibold transition cursor-pointer shadow-2xs"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => setDeletingProduct(item)}
                          className="bg-[#e60000] hover:bg-[#cc0000] text-white rounded-full px-4 py-1.5 text-xs font-semibold transition cursor-pointer shadow-2xs"
                        >
                          Hapus
                        </button>
                        <button
                          onClick={() => setSelectedDetailProduct(item)}
                          className="bg-[#1B4332] hover:bg-[#05543c] text-white rounded-full px-4.5 py-1.5 text-xs font-semibold transition cursor-pointer shadow-2xs"
                        >
                          Lihat detail
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-gray-400 text-xs font-medium">
                    Tidak ada produk yang sesuai dengan pencarian.
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

      {/* ── Modal Tambah Produk ── */}
      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent className="sm:max-w-lg bg-white rounded-2xl p-6 shadow-2xl border border-gray-100">
          <DialogHeader className="pb-3 border-b border-gray-100">
            <DialogTitle className="text-lg font-bold text-gray-900">Tambah Produk Baru</DialogTitle>
            <DialogDescription className="text-xs text-gray-500">
              Masukkan detail produk panen baru ke dalam katalog
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleAddSubmit} className="space-y-4 py-3 text-xs">
            {/* MVP: Nama Produk dari katalog 27 SKU */}
            <div className="space-y-1.5">
              <Label className="text-gray-700 font-semibold">Nama Produk (Komoditas)</Label>
              <select
                value={formData.name}
                onChange={(e) => {
                  const selected = KOMODITAS_CATALOG.find((k) => k.name === e.target.value);
                  setFormData({
                    ...formData,
                    name: e.target.value,
                    category: selected?.category || "",
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
                <Label className="text-gray-700 font-semibold">Kategori</Label>
                <Input
                  value={formData.category}
                  readOnly
                  placeholder="Otomatis dari komoditas"
                  className="h-10 rounded-xl border-gray-200 bg-gray-50 text-gray-500 cursor-not-allowed"
                />
              </div>

              {/* Strict Numeric Stock Field */}
              <div className="space-y-1.5">
                <Label className="text-gray-700 font-semibold">Jumlah Stok (Angka)</Label>
                <Input
                  type="number"
                  min="0"
                  step="1"
                  placeholder="Contoh: 25"
                  value={formData.stock}
                  onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                  className="h-10 rounded-xl border-gray-200 focus:ring-2 focus:ring-[#1B4332]/20"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* Strict Numeric Price Field */}
              <div className="space-y-1.5">
                <Label className="text-gray-700 font-semibold">Harga (Rp)</Label>
                <Input
                  type="number"
                  min="1"
                  step="100"
                  placeholder="Contoh: 12000"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  className="h-10 rounded-xl border-gray-200 focus:ring-2 focus:ring-[#1B4332]/20"
                  required
                />
              </div>

              {/* Dropdown Satuan Unit */}
              <div className="space-y-1.5">
                <Label className="text-gray-700 font-semibold">Satuan Unit</Label>
                <select
                  value={formData.unitSelect}
                  onChange={(e) => setFormData({ ...formData, unitSelect: e.target.value })}
                  className="w-full h-10 bg-white border border-gray-200 rounded-xl pl-3.5 pr-10 text-xs font-medium text-gray-800 outline-none focus:ring-2 focus:ring-[#1B4332]/20 appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2220%22%20height%3D%2220%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%234b5563%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpath%20d%3D%22m6%209%206%206%206-6%22%2F%3E%3C%2Fsvg%3E')] bg-[length:16px_16px] bg-[right_14px_center] bg-no-repeat cursor-pointer"
                >
                  {PRESET_UNITS.map((u) => (
                    <option key={u} value={u}>
                      {u}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Custom Unit Input if "Custom" selected */}
            {formData.unitSelect === "Custom" && (
              <div className="space-y-1.5">
                <Label className="text-gray-700 font-semibold">Tulis Satuan Custom</Label>
                <Input
                  placeholder="Contoh: /keranjang atau /ikat-besar"
                  value={formData.customUnit}
                  onChange={(e) => setFormData({ ...formData, customUnit: e.target.value })}
                  className="h-10 rounded-xl border-gray-200 focus:ring-2 focus:ring-[#1B4332]/20"
                  required
                />
              </div>
            )}

            {/* Live Readonly Status Badge Indicator */}
            <div className="border border-emerald-200/80 bg-emerald-50/40 rounded-xl p-3.5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Info className="w-4 h-4 text-emerald-700" />
                <span className="text-xs font-semibold text-gray-700">Status Terhitung Otomatis:</span>
              </div>
              <div>
                {liveComputedStatus === "Tersedia" && (
                  <span className="inline-flex items-center justify-center bg-[#b7e4c7] text-[#1B4332] border border-[#74c69d] rounded-full px-3.5 py-0.5 text-xs font-bold">
                    Tersedia (Stok &gt; 5)
                  </span>
                )}
                {liveComputedStatus === "Menipis" && (
                  <span className="inline-flex items-center justify-center bg-[#fef9c3] text-[#854d0e] border border-[#fef08a] rounded-full px-3.5 py-0.5 text-xs font-bold">
                    Menipis (Stok ≤ 5)
                  </span>
                )}
                {liveComputedStatus === "Habis" && (
                  <span className="inline-flex items-center justify-center bg-gray-100 text-gray-600 border border-gray-300 rounded-full px-3.5 py-0.5 text-xs font-bold">
                    Habis (Stok 0)
                  </span>
                )}
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
                Simpan Produk
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* ── Modal Edit Produk ── */}
      {editingProduct && (
        <Dialog open={!!editingProduct} onOpenChange={(open) => !open && setEditingProduct(null)}>
          <DialogContent className="sm:max-w-lg bg-white rounded-2xl p-6 shadow-2xl border border-gray-100">
            <DialogHeader className="pb-3 border-b border-gray-100">
              <DialogTitle className="text-lg font-bold text-gray-900">Edit Produk</DialogTitle>
              <DialogDescription className="text-xs text-gray-500">
                Ubah rincian informasi produk
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleEditSubmit} className="space-y-4 py-3 text-xs">
              {/* MVP: Nama Produk dari katalog 27 SKU */}
              <div className="space-y-1.5">
                <Label className="text-gray-700 font-semibold">Nama Produk (Komoditas)</Label>
                <select
                  value={formData.name}
                  onChange={(e) => {
                    const selected = KOMODITAS_CATALOG.find((k) => k.name === e.target.value);
                    setFormData({
                      ...formData,
                      name: e.target.value,
                      category: selected?.category || "",
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
                  <Label className="text-gray-700 font-semibold">Kategori</Label>
                  <Input
                    value={formData.category}
                    readOnly
                    placeholder="Otomatis dari komoditas"
                    className="h-10 rounded-xl border-gray-200 bg-gray-50 text-gray-500 cursor-not-allowed"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-gray-700 font-semibold">Jumlah Stok (Angka)</Label>
                  <Input
                    type="number"
                    min="0"
                    step="1"
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                    className="h-10 rounded-xl border-gray-200 focus:ring-2 focus:ring-[#1B4332]/20"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-gray-700 font-semibold">Harga (Rp)</Label>
                  <Input
                    type="number"
                    min="1"
                    step="100"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="h-10 rounded-xl border-gray-200 focus:ring-2 focus:ring-[#1B4332]/20"
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-gray-700 font-semibold">Satuan Unit</Label>
                  <select
                    value={formData.unitSelect}
                    onChange={(e) => setFormData({ ...formData, unitSelect: e.target.value })}
                    className="w-full h-10 bg-white border border-gray-200 rounded-xl pl-3.5 pr-10 text-xs font-medium text-gray-800 outline-none focus:ring-2 focus:ring-[#1B4332]/20 appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2220%22%20height%3D%2220%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%234b5563%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpath%20d%3D%22m6%209%206%206%206-6%22%2F%3E%3C%2Fsvg%3E')] bg-[length:16px_16px] bg-[right_14px_center] bg-no-repeat cursor-pointer"
                  >
                    {PRESET_UNITS.map((u) => (
                      <option key={u} value={u}>
                        {u}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {formData.unitSelect === "Custom" && (
                <div className="space-y-1.5">
                  <Label className="text-gray-700 font-semibold">Tulis Satuan Custom</Label>
                  <Input
                    placeholder="Contoh: /keranjang atau /ikat-besar"
                    value={formData.customUnit}
                    onChange={(e) => setFormData({ ...formData, customUnit: e.target.value })}
                    className="h-10 rounded-xl border-gray-200 focus:ring-2 focus:ring-[#1B4332]/20"
                    required
                  />
                </div>
              )}

              {/* Live Readonly Status Badge Indicator */}
              <div className="border border-emerald-200/80 bg-emerald-50/40 rounded-xl p-3.5 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Info className="w-4 h-4 text-emerald-700" />
                  <span className="text-xs font-semibold text-gray-700">Status Terhitung Otomatis:</span>
                </div>
                <div>
                  {liveComputedStatus === "Tersedia" && (
                    <span className="inline-flex items-center justify-center bg-[#b7e4c7] text-[#1B4332] border border-[#74c69d] rounded-full px-3.5 py-0.5 text-xs font-bold">
                      Tersedia (Stok &gt; 5)
                    </span>
                  )}
                  {liveComputedStatus === "Menipis" && (
                    <span className="inline-flex items-center justify-center bg-[#fef9c3] text-[#854d0e] border border-[#fef08a] rounded-full px-3.5 py-0.5 text-xs font-bold">
                      Menipis (Stok ≤ 5)
                    </span>
                  )}
                  {liveComputedStatus === "Habis" && (
                    <span className="inline-flex items-center justify-center bg-gray-100 text-gray-600 border border-gray-300 rounded-full px-3.5 py-0.5 text-xs font-bold">
                      Habis (Stok 0)
                    </span>
                  )}
                </div>
              </div>

              <DialogFooter className="pt-4 gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setEditingProduct(null)}
                  className="h-10 px-5 rounded-xl font-semibold cursor-pointer"
                >
                  Batal
                </Button>
                <Button
                  type="submit"
                  className="h-10 px-6 bg-[#1B4332] hover:bg-[#032e21] text-white rounded-xl font-semibold cursor-pointer"
                >
                  Simpan Perubahan
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      )}

      {/* ── Dialog Popup Konfirmasi Hapus Produk (dialog menu hapus produk.png) ── */}
      {deletingProduct && (
        <Dialog open={!!deletingProduct} onOpenChange={(open) => !open && setDeletingProduct(null)}>
          <DialogContent className="sm:max-w-xs bg-white rounded-2xl p-6 shadow-2xl border border-gray-100 text-center">
            <div className="w-14 h-14 rounded-full bg-red-100/80 border border-red-300 text-red-600 flex items-center justify-center mx-auto mb-3">
              <Trash2 className="w-7 h-7" />
            </div>

            <DialogTitle className="text-base font-bold text-gray-900 text-center">
              Hapus Produk?
            </DialogTitle>
            <p className="text-xs text-gray-500 text-center mt-1 leading-relaxed">
              Apakah Anda yakin ingin menghapus <span className="font-bold text-gray-800">{deletingProduct.name}</span> dari daftar produk?
            </p>

            <div className="flex items-center gap-3 pt-5">
              <Button
                variant="secondary"
                onClick={() => setDeletingProduct(null)}
                className="flex-1 h-10 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold text-xs rounded-xl cursor-pointer"
              >
                Batal
              </Button>
              <Button
                onClick={handleDeleteConfirm}
                className="flex-1 h-10 bg-red-600 hover:bg-red-700 text-white font-semibold text-xs rounded-xl shadow-xs cursor-pointer"
              >
                Hapus
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
      {/* ── Modal Detail Produk (overlay detail produk.png) ── */}
      {selectedDetailProduct && (
        <Dialog open={!!selectedDetailProduct} onOpenChange={(open) => !open && setSelectedDetailProduct(null)}>
          <DialogContent className="sm:max-w-lg bg-white rounded-2xl p-6 shadow-2xl border border-emerald-300 ring-1 ring-black/5">
            <DialogHeader className="border-b border-gray-100 pb-3">
              <DialogTitle className="text-base font-bold text-gray-900">Detail Produk</DialogTitle>
            </DialogHeader>

            <div className="space-y-4 pt-2 text-xs">
              <h4 className="font-bold text-gray-900 text-xs">Informasi Produk</h4>

              <div className="space-y-2.5">
                <div className="flex justify-between items-center py-1">
                  <span className="text-gray-500 font-medium">Nama Produk</span>
                  <span className="font-bold text-gray-900">{selectedDetailProduct.name}</span>
                </div>
                <div className="flex justify-between items-center py-1">
                  <span className="text-gray-500 font-medium">Kategori</span>
                  <span className="font-bold text-gray-900">{selectedDetailProduct.category}</span>
                </div>
                <div className="flex justify-between items-center py-1">
                  <span className="text-gray-500 font-medium">Jenis Produk</span>
                  <span className="font-bold text-gray-900">Sayuran Organik</span>
                </div>
                <div className="space-y-1.5 pt-2">
                  <span className="text-gray-500 font-medium block">Deskripsi</span>
                  <div className="bg-gray-50 border border-gray-100 rounded-xl p-3.5 text-gray-700 leading-relaxed text-[11px]">
                    Hadirkan nutrisi terbaik untuk keluarga dengan sayur {selectedDetailProduct.name.toLowerCase()} segar dari Tani Gacor! Kami menyediakan {selectedDetailProduct.name.toLowerCase()} berkualitas premium yang dipanen dan disortir secara ketat sehingga kesegarannya tetap terjaga.
                  </div>
                </div>
              </div>
            </div>

            <DialogFooter className="pt-4 border-t border-gray-100">
              <Button
                type="button"
                onClick={() => setSelectedDetailProduct(null)}
                className="w-full h-10 bg-[#1B4332] hover:bg-[#032e21] text-white rounded-xl font-semibold text-xs cursor-pointer"
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
