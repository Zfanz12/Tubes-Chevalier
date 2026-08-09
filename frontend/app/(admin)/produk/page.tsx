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
import { toast } from "sonner";

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
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  // Modals
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deletingProduct, setDeletingProduct] = useState<Product | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    stock: "",
    price: "",
    unitSelect: "/kg",
    customUnit: "",
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
      toast.error("Nama produk tidak boleh kosong!");
      return false;
    }
    if (!trimmedCategory) {
      toast.error("Kategori produk tidak boleh kosong!");
      return false;
    }
    if (isNaN(numericStock) || numericStock < 0) {
      toast.error("Jumlah stok harus berupa angka valid (minimal 0)!");
      return false;
    }
    if (isNaN(numericPrice) || numericPrice <= 0) {
      toast.error("Harga produk harus berupa angka valid lebih dari 0!");
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

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validated = validateForm();
    if (!validated) return;

    const { trimmedName, trimmedCategory, numericStock, numericPrice, finalUnit } = validated;

    // Automatic status determination strictly dependent on stock
    const computedStatus = computeStatusFromStock(numericStock);
    const formattedPrice = `Rp ${numericPrice.toLocaleString("id-ID")}`;

    // Extract unit label without leading slash for stock string (e.g. "/ikat" -> "ikat")
    const unitLabel = finalUnit.replace(/^\//, "");

    nextProdukId++;
    const newProd: Product = {
      id: nextProdukId,
      name: trimmedName,
      category: trimmedCategory,
      stock: `${numericStock} ${unitLabel}`,
      price: formattedPrice,
      unit: finalUnit,
      status: computedStatus,
      image: formData.image,
    };

    setProducts([newProd, ...products]);
    setIsAddOpen(false);
    toast.success(`Produk "${newProd.name}" berhasil ditambahkan dengan status "${computedStatus}"!`);
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      name: "",
      category: "",
      stock: "",
      price: "",
      unitSelect: "/kg",
      customUnit: "",
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
      stock: stockVal,
      price: priceVal,
      unitSelect: isPreset ? p.unit : "Custom",
      customUnit: isPreset ? "" : p.unit,
      image: p.image,
    });
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;

    const validated = validateForm();
    if (!validated) return;

    const { trimmedName, trimmedCategory, numericStock, numericPrice, finalUnit } = validated;

    // Automatic status determination strictly dependent on stock
    const computedStatus = computeStatusFromStock(numericStock);
    const formattedPrice = `Rp ${numericPrice.toLocaleString("id-ID")}`;
    const unitLabel = finalUnit.replace(/^\//, "");

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
              status: computedStatus,
              image: formData.image,
            }
          : item
      )
    );

    toast.success(`Produk "${trimmedName}" diperbarui! Status otomatis: ${computedStatus}`);
    setEditingProduct(null);
    resetForm();
  };

  const handleDeleteConfirm = () => {
    if (!deletingProduct) return;
    setProducts((prev) => prev.filter((p) => p.id !== deletingProduct.id));
    toast.success(`Produk "${deletingProduct.name}" berhasil dihapus`);
    setDeletingProduct(null);
  };

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
              setIsAddOpen(true);
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

                    <td className="py-4 text-center pr-2">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => openEditModal(item)}
                          className="bg-[#1B4332] hover:bg-[#05543c] text-white rounded-full px-5 py-1.5 text-xs font-semibold transition cursor-pointer shadow-2xs"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => setDeletingProduct(item)}
                          className="bg-[#ef4444] hover:bg-[#dc2626] text-white rounded-full px-4.5 py-1.5 text-xs font-semibold transition cursor-pointer shadow-2xs"
                        >
                          Hapus
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

      {/* ── Modal Hapus Produk Confirmation ── */}
      {deletingProduct && (
        <Dialog open={!!deletingProduct} onOpenChange={(open) => !open && setDeletingProduct(null)}>
          <DialogContent className="sm:max-w-md bg-white rounded-2xl p-6 shadow-2xl border border-gray-100">
            <DialogHeader className="pb-2">
              <DialogTitle className="text-base font-bold text-gray-900">Konfirmasi Hapus Produk</DialogTitle>
              <DialogDescription className="text-xs text-gray-500 leading-relaxed mt-1">
                Apakah Anda yakin ingin menghapus produk <span className="font-bold text-gray-800">{deletingProduct.name}</span>? Perubahan ini tidak dapat dibatalkan.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="pt-4 gap-3 flex justify-end">
              <Button
                type="button"
                variant="outline"
                onClick={() => setDeletingProduct(null)}
                className="h-10 px-5 rounded-xl font-semibold cursor-pointer"
              >
                Batal
              </Button>
              <Button
                type="button"
                onClick={handleDeleteConfirm}
                className="h-10 px-6 bg-[#ef4444] hover:bg-[#dc2626] text-white rounded-xl font-semibold cursor-pointer"
              >
                Hapus Produk
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
