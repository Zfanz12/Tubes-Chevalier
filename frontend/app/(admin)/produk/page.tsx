"use client";

import React, { useState, useMemo, useEffect, useCallback } from "react";
import {
  Package,
  Sprout,
  AlertTriangle,
  LayoutGrid,
  Search,
  Plus,
  Trash2,
  CheckCircle2,
  Info,
  ArrowLeft,
  Loader2,
  AlertCircle,
  Upload,
  Image as ImageIcon,
  Check,
  Edit2,
  Save,
  X,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { 
  createProduk, 
  updateProduk, 
  deleteProduk, 
  getProdukList, 
  formatRupiah,
  ApiProduk, 
} from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
<<<<<<< Updated upstream
import { showToast } from "@/lib/custom-toast";
=======
<<<<<<< Updated upstream
import { toast } from "sonner";
>>>>>>> Stashed changes
import { createProduk, updateProduk, deleteProduk } from "@/lib/api";
=======
import { showToast } from "@/lib/custom-toast";
>>>>>>> Stashed changes
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
    image: "https://images.unsplash.com/photo-1576045057995-568f588f82fb?auto=format&fit=crop&w=300&q=80",
  },
  {
    id: 2,
    name: "Tomat Mantep",
    category: "Tomat",
    stock: "34 gram",
    price: "Rp 11.500",
    unit: "/gram",
    status: "Tersedia",
    image: "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=300&q=80",
  },
  {
    id: 3,
    name: "Wortel Lokal",
    category: "Wortel",
    stock: "0 gram",
    price: "Rp 6.500",
    unit: "/gram",
    status: "Habis",
    image: "https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?auto=format&fit=crop&w=300&q=80",
  },
  {
    id: 4,
    name: "Pak Choy Gokil",
    category: "Pak Choy",
    stock: "120 gram",
    price: "Rp 3.500",
    unit: "/gram",
    status: "Tersedia",
    image: "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=300&q=80",
  },
  {
    id: 5,
    name: "Kangkung Mantep",
    category: "Kangkung",
    stock: "1 ikat",
    price: "Rp 4.500",
    unit: "/ikat",
    status: "Menipis",
    image: "https://images.unsplash.com/photo-1576045057995-568f588f82fb?auto=format&fit=crop&w=300&q=80",
  },
  {
    id: 6,
    name: "Brokoli Organik",
    category: "Brokoli",
    stock: "15 kg",
    price: "Rp 18.500",
    unit: "/kg",
    status: "Tersedia",
    image: "https://images.unsplash.com/photo-1584270354949-c26b0d5b4a0c?auto=format&fit=crop&w=300&q=80",
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

const PRESET_IMAGES = [
  { label: "Bayam Segar", url: "https://images.unsplash.com/photo-1576045057995-568f588f82fb?auto=format&fit=crop&w=300&q=80" },
  { label: "Tomat Merah", url: "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=300&q=80" },
  { label: "Wortel Orange", url: "https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?auto=format&fit=crop&w=300&q=80" },
  { label: "Pak Choy Hijau", url: "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=300&q=80" },
  { label: "Brokoli Organik", url: "https://images.unsplash.com/photo-1584270354949-c26b0d5b4a0c?auto=format&fit=crop&w=300&q=80" },
];

function computeStatusFromStock(stockNum: number): Product["status"] {
  if (isNaN(stockNum) || stockNum <= 0) return "Habis";
  if (stockNum <= 5) return "Menipis";
  return "Tersedia";
}

function mapApiToProduct(api: ApiProduk): Product {
  const stockNum = typeof api.stok === "number" ? api.stok : parseFloat(api.stok) || 0;
  const priceNum = typeof api.harga === "number" ? api.harga : parseFloat(api.harga) || 0;
  const matchedCatalog = KOMODITAS_CATALOG.find((k) => k.name.toLowerCase() === api.nama_barang.toLowerCase());

  return {
    id: api.id,
    name: api.nama_barang,
    category: matchedCatalog ? matchedCatalog.category : "Sayuran",
    stock: `${stockNum} kg`,
    price: formatRupiah(priceNum),
    unit: "/kg",
    status: computeStatusFromStock(stockNum),
    image:
  PRESET_IMAGES.find((img) =>
    api.nama_barang.toLowerCase().includes(img.label.split(" ")[0].toLowerCase())
  )?.url || PRESET_IMAGES[0].url,
  };
}

export default function ProdukPage() {
  const token = useAuthStore((s) => s.token);
  const user = useAuthStore((s) => s.user);

  const [products, setProducts] = useState<Product[]>(initialProducts);
<<<<<<< Updated upstream
=======
<<<<<<< Updated upstream
  const [isMutating, setIsMutating] = useState(false);
=======
  const [isLoadingData, setIsLoadingData] = useState(true);
>>>>>>> Stashed changes
>>>>>>> Stashed changes
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  // -- Fetch Produk dari Backend --
  const fetchProduk = useCallback(async () => {
    if (!token) {
      setProducts(initialProducts);
      setIsLoadingData(false);
      return;
    }

    try {
      setIsLoadingData(true);
      const res = await getProdukList(token);
      // Assuming res.data contains ApiProduk[]
      const mapped = (res || []).map(mapApiToProduct);
      setProducts(mapped);
    } catch (err: unknown) {
      const error = err as { message?: string };
      showToast(`Gagal memuat produk dari server: ${error?.message ?? "Error"}`, "error");
      setProducts(initialProducts); // fallback dummy data if API fails
    } finally {
      setIsLoadingData(false);
    }
  }, [token]);

  useEffect(() => {
    fetchProduk();
  }, [fetchProduk]);

  // View mode: "table" | "add" | "edit"
  const [viewMode, setViewMode] = useState<"table" | "add" | "edit">("table");

  // Modals matching Figma popups
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [selectedDetailProduct, setSelectedDetailProduct] = useState<Product | null>(null);
  
  const [showInitialAddConfirmModal, setShowInitialAddConfirmModal] = useState(false);
  const [showAddConfirmModal, setShowAddConfirmModal] = useState(false);
  const [confirmEditInitialProduct, setConfirmEditInitialProduct] = useState<Product | null>(null);
  const [showEditSubmitConfirmModal, setShowEditSubmitConfirmModal] = useState(false);
  const [deletingProductStep1, setDeletingProductStep1] = useState<Product | null>(null);
  const [deletingProductStep2, setDeletingProductStep2] = useState<Product | null>(null);
  const [deleteInputName, setDeleteInputName] = useState("");

  // Form & Defensive States
  const [failedImages, setFailedImages] = useState<Record<number, boolean>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const [showUnsavedModal, setShowUnsavedModal] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [touchedFields, setTouchedFields] = useState<Record<string, boolean>>({});

  const defaultFormData = {
    name: "",
    category: "",
    jenisProduk: "Sayuran Organik",
    deskripsi: "",
    stock: "",
    price: "",
    unitSelect: "/kg",
    customUnit: "",
    minimalPembelian: "1",
    statusProduk: "Aktif" as "Aktif" | "Nonaktif",
    image: "https://images.unsplash.com/photo-1576045057995-568f588f82fb?auto=format&fit=crop&w=300&q=80",
  };

  const [formData, setFormData] = useState(defaultFormData);

  const itemsPerPage = 5;

  const filteredProducts = useMemo(() => {
    return products.filter(
      (p) =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.category.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [products, searchQuery]);

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage) || 1;

  // Pagination safety
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

  // Field validation logic
  const validateSingleField = useCallback(
    (fieldName: string, value: string, currentData = formData): string => {
      switch (fieldName) {
        case "name":
          if (!value || !value.trim()) return "Nama produk (komoditas) wajib dipilih.";
          return "";

        case "category":
          if (!value || !value.trim()) return "Kategori produk wajib diisi.";
          return "";

        case "deskripsi":
          if (!value || !value.trim()) return "Deskripsi produk wajib diisi.";
          if (value.trim().length < 10) return "Deskripsi terlalu pendek (minimal 10 karakter).";
          if (value.length > 500) return "Deskripsi terlalu panjang (maksimal 500 karakter).";
          return "";

        case "price": {
          if (!value || !value.toString().trim()) return "Harga produk wajib diisi.";
          const numPrice = parseFloat(String(value).replace(/[^\d]/g, ""));
          if (isNaN(numPrice) || numPrice <= 0) return "Harga produk harus berupa angka valid lebih dari 0.";
          if (numPrice > 100000000) return "Harga produk tidak boleh melebihi Rp 100.000.000.";
          return "";
        }

        case "stock": {
          if (value === "" || value === null || value === undefined) return "Jumlah stok wajib diisi.";
          const numStock = parseFloat(String(value));
          if (isNaN(numStock) || numStock < 0) return "Jumlah stok harus berupa angka valid (minimal 0).";
          if (numStock > 100000) return "Jumlah stok tidak boleh melebihi 100.000.";
          return "";
        }

        case "minimalPembelian": {
          if (!value || !value.toString().trim()) return "Minimal pembelian wajib diisi.";
          const numMin = parseFloat(String(value));
          if (isNaN(numMin) || numMin < 1) return "Minimal pembelian minimal 1.";
          return "";
        }

        case "customUnit": {
          if (currentData.unitSelect === "Custom" && (!value || !value.trim())) {
            return "Satuan custom wajib diisi.";
          }
          return "";
        }

        default:
          return "";
      }
    },
    [formData]
  );

  // Validate entire form
  const validateFullForm = useCallback(() => {
    const errors: Record<string, string> = {};
    const keysToValidate = ["name", "category", "deskripsi", "price", "stock", "minimalPembelian"];
    if (formData.unitSelect === "Custom") keysToValidate.push("customUnit");

    keysToValidate.forEach((key) => {
      const err = validateSingleField(key, (formData as Record<string, any>)[key], formData);
      if (err) errors[key] = err;
    });

    setFieldErrors(errors);
    return {
      isValid: Object.keys(errors).length === 0,
      errors,
    };
  }, [formData, validateSingleField]);

  // Handle field change with auto-clearing error
  const handleFieldChange = (field: string, value: string) => {
    setIsDirty(true);
    const updated = { ...formData, [field]: value };
    setFormData(updated);

    if (touchedFields[field]) {
      const errorMsg = validateSingleField(field, value, updated);
      setFieldErrors((prev) => ({ ...prev, [field]: errorMsg }));
    }
  };

  const handleFieldsChange = (updates: Record<string, string>) => {
    setIsDirty(true);
    const updated = { ...formData, ...updates };
    setFormData(updated);

    const newErrors = { ...fieldErrors };
    Object.keys(updates).forEach((field) => {
      if (touchedFields[field]) {
        newErrors[field] = validateSingleField(field, updates[field], updated);
      }
    });
    setFieldErrors(newErrors);
  };

  // Handle field blur
  const handleFieldBlur = (field: string) => {
    setTouchedFields((prev) => ({ ...prev, [field]: true }));
    const errorMsg = validateSingleField(field, (formData as Record<string, any>)[field], formData);
    setFieldErrors((prev) => ({ ...prev, [field]: errorMsg }));
  };

  // Reset form & state
  const resetForm = () => {
    setFormData(defaultFormData);
    setFieldErrors({});
    setTouchedFields({});
    setIsDirty(false);
    setIsSubmitting(false);
  };

  // Handle Cancel / Back Navigation with Unsaved Protection
  const handleCancelForm = () => {
    if (isDirty) {
      setShowUnsavedModal(true);
    } else {
      setViewMode("table");
      setEditingProduct(null);
      resetForm();
    }
  };

  // Handle Add Product Submission
  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    // Touch all fields for error display
    const allTouched: Record<string, boolean> = {
      name: true,
      category: true,
      deskripsi: true,
      price: true,
      stock: true,
      minimalPembelian: true,
      customUnit: true,
    };
    setTouchedFields(allTouched);

    const { isValid, errors } = validateFullForm();
    if (!isValid) {
      showToast("Mohon perbaiki kolom input yang belum sesuai.", "error");
      const firstErrorField = Object.keys(errors)[0];
      if (firstErrorField) {
        const inputElem = document.getElementById(`field-${firstErrorField}`);
        inputElem?.focus();
      }
      return;
    }

    // Trigger Image 2 confirmation dialog
    setShowAddConfirmModal(true);
  };

  const executeAddProduct = async () => {
    setShowAddConfirmModal(false);
    setIsSubmitting(true);

    const numericStock = parseFloat(formData.stock) || 0;
    const numericPrice = parseFloat(formData.price.replace(/[^\d]/g, "")) || 0;
    const finalUnit =
      formData.unitSelect === "Custom"
        ? formData.customUnit.trim()
          ? formData.customUnit.startsWith("/")
            ? formData.customUnit.trim()
            : `/${formData.customUnit.trim()}`
          : "/unit"
        : formData.unitSelect;

    const computedStatus = computeStatusFromStock(numericStock);
    const formattedPrice = `Rp ${numericPrice.toLocaleString("id-ID")}`;
    const unitLabel = finalUnit.replace(/^\//, "");

    nextProdukId++;
    const tempId = nextProdukId;
    const newProd: Product = {
      id: tempId,
      name: formData.name.trim(),
      category: formData.category.trim(),
      stock: `${numericStock} ${unitLabel}`,
      price: formattedPrice,
      unit: finalUnit,
      status: computedStatus,
      image: formData.image,
    };

    // Optimistic UI update
    setProducts((prev) => [newProd, ...prev]);

    // Backend sync if farmer token available
    if (token && user?.role === "petani") {
      try {
        const res = await createProduk(token, {
          nama_barang: formData.name.trim(),
          stok: numericStock,
          harga: numericPrice,
        });
        setProducts((prev) =>
          prev.map((p) => (p.id === tempId ? { ...p, id: res.data.id } : p))
        );
        showToast(`Produk "${formData.name}" berhasil disimpan ke server!`, "success");
      } catch (err: unknown) {
        const error = err as { message?: string };
        showToast(`Produk ditambahkan lokal, gagal sinkron server: ${error?.message ?? "Error"}`, "error");
      }
    } else {
      showToast(`Produk "${newProd.name}" berhasil ditambahkan!`, "success");
    }

    setIsSubmitting(false);
    setIsDirty(false);
    setFieldErrors({});
    setTouchedFields({});
    setViewMode("table");
    resetForm();
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
      deskripsi: `Hadirkan nutrisi terbaik untuk keluarga dengan sayur ${p.name.toLowerCase()} segar dari petani lokal Harvesta!`,
      stock: stockVal,
      price: priceVal,
      unitSelect: isPreset ? p.unit : "Custom",
      customUnit: isPreset ? "" : p.unit,
      minimalPembelian: "1",
      statusProduk: p.status === "Habis" ? "Nonaktif" : "Aktif",
      image: p.image,
    });
    setFieldErrors({});
    setTouchedFields({});
    setIsDirty(false);
    setViewMode("edit");
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct || isSubmitting) return;

    const { isValid, errors } = validateFullForm();
    if (!isValid) {
      showToast("Mohon perbaiki kolom yang belum sesuai.", "error");
      const firstErrorField = Object.keys(errors)[0];
      if (firstErrorField) {
        document.getElementById(`field-${firstErrorField}`)?.focus();
      }
      return;
    }

    // Trigger Image 5 confirmation dialog
    setShowEditSubmitConfirmModal(true);
  };

  const executeEditProduct = async () => {
    if (!editingProduct) return;
    setShowEditSubmitConfirmModal(false);
    setIsSubmitting(true);

    const productId = editingProduct.id;
    const numericStock = parseFloat(formData.stock) || 0;
    const numericPrice = parseFloat(formData.price.replace(/[^\d]/g, "")) || 0;
    const finalUnit =
      formData.unitSelect === "Custom"
        ? formData.customUnit.trim()
          ? formData.customUnit.startsWith("/")
            ? formData.customUnit.trim()
            : `/${formData.customUnit.trim()}`
          : "/unit"
        : formData.unitSelect;

    const computedStatus = computeStatusFromStock(numericStock);
    const formattedPrice = `Rp ${numericPrice.toLocaleString("id-ID")}`;
    const unitLabel = finalUnit.replace(/^\//, "");
    const finalStatus = formData.statusProduk === "Nonaktif" ? "Habis" : computedStatus;

    setProducts((prev) =>
      prev.map((item) =>
        item.id === productId
          ? {
              ...item,
              name: formData.name.trim(),
              category: formData.category.trim(),
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

    if (token && user?.role === "petani") {
      try {
        await updateProduk(token, productId, {
          nama_barang: formData.name.trim(),
          stok: numericStock,
          harga: numericPrice,
        });
        showToast(`Produk "${formData.name}" berhasil diperbarui di server!`, "success");
      } catch (err: unknown) {
        const error = err as { message?: string };
        showToast(`Perubahan disimpan lokal, gagal sinkron: ${error?.message ?? "Error"}`, "error");
      }
    } else {
      showToast(`Produk "${formData.name}" berhasil diperbarui!`, "success");
    }

    setIsSubmitting(false);
    setIsDirty(false);
    setFieldErrors({});
    setTouchedFields({});
    setViewMode("table");
    resetForm();
  };

  const executeDeleteProduct = async (toDelete: Product) => {
    setProducts((prev) => prev.filter((p) => p.id !== toDelete.id));

    if (token && user?.role === "petani") {
      try {
        await deleteProduk(token, toDelete.id);
        showToast(`Produk "${toDelete.name}" berhasil dihapus dari server!`, "success");
      } catch (err: unknown) {
        const error = err as { message?: string };
        setProducts((prev) => [toDelete, ...prev]);
        showToast(`Gagal menghapus dari server: ${error?.message ?? "Unknown error"}`, "error");
      }
    } else {
      showToast(`Produk "${toDelete.name}" berhasil dihapus`, "success");
    }
  };

  // ── Full Page View for Tambah & Edit Produk ──
  if (viewMode === "add" || viewMode === "edit") {
    const isEdit = viewMode === "edit";

    // Validasi kelengkapan seksi
    const isInfoCompleted = !!(formData.name && formData.category && formData.deskripsi.trim().length >= 10);
    const isPenjualanCompleted = !!(
      formData.price && 
      formData.stock && 
      formData.minimalPembelian && 
      (formData.unitSelect !== "Custom" || formData.customUnit.trim())
    );
    const isFotoCompleted = !!formData.image.trim();

    return (
      <div className="space-y-6 w-full pb-12">
        {/* Top Header */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleCancelForm}
            className="w-9 h-9 rounded-xl bg-white border border-gray-200 text-gray-700 flex items-center justify-center hover:bg-gray-50 transition cursor-pointer shadow-2xs"
            aria-label="Kembali ke Daftar Produk"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
              {isEdit ? "Edit Produk" : "Tambah Produk Baru"}
            </h1>
            <p className="text-xs text-gray-500 font-medium">
              {isEdit ? "Perbarui informasi produk panen yang sudah terdaftar" : "Isi seluruh informasi detail produk panen untuk dipublikasikan"}
            </p>
          </div>
        </div>

        {/* Form Container */}
        <form onSubmit={isEdit ? handleEditSubmit : handleAddSubmit} className="flex flex-col lg:flex-row gap-6 items-start">
          {/* Left Sidebar Card */}
          <div className="w-full lg:w-72 bg-white rounded-2xl p-5 shadow-[0_4px_20px_rgba(3,59,42,0.06)] border border-emerald-300 ring-1 ring-black/5 space-y-6 shrink-0">
            <div>
              <h3 className="font-bold text-gray-900 text-sm border-b border-gray-100 pb-3">Kelengkapan Form</h3>
              <div className="space-y-4 pt-4 text-xs font-medium">
                <div className={`flex items-center gap-3 font-bold ${isInfoCompleted ? "text-[#1B4332]" : "text-gray-400"}`}>
                  <div className={`w-7 h-7 rounded-full border flex items-center justify-center text-xs transition ${isInfoCompleted ? "bg-emerald-100 border-emerald-300 text-[#1B4332]" : "bg-gray-50 border-gray-200 text-gray-300"}`}>
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <span>1. Informasi Produk</span>
                </div>
                <div className={`flex items-center gap-3 font-bold ${isPenjualanCompleted ? "text-[#1B4332]" : "text-gray-400"}`}>
                  <div className={`w-7 h-7 rounded-full border flex items-center justify-center text-xs transition ${isPenjualanCompleted ? "bg-emerald-100 border-emerald-300 text-[#1B4332]" : "bg-gray-50 border-gray-200 text-gray-300"}`}>
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <span>2. Informasi Penjualan</span>
                </div>
                <div className={`flex items-center gap-3 font-bold ${isFotoCompleted ? "text-[#1B4332]" : "text-gray-400"}`}>
                  <div className={`w-7 h-7 rounded-full border flex items-center justify-center text-xs transition ${isFotoCompleted ? "bg-emerald-100 border-emerald-300 text-[#1B4332]" : "bg-gray-50 border-gray-200 text-gray-300"}`}>
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <span>3. Foto Produk</span>
                </div>
              </div>
            </div>

            {/* Live Readonly Status Badge Indicator */}
            <div className="border border-emerald-200/80 bg-emerald-50/50 rounded-xl p-3.5 space-y-2">
              <div className="flex items-center gap-2 text-xs font-semibold text-gray-800">
                <Info className="w-4 h-4 text-emerald-700 shrink-0" />
                <span>Status Terhitung Otomatis</span>
              </div>
              <div className="pt-1">
                {liveComputedStatus === "Tersedia" && (
                  <span className="inline-flex items-center justify-center bg-[#b7e4c7] text-[#1B4332] border border-[#74c69d] rounded-full px-3 py-1 text-xs font-bold w-full">
                    Tersedia (Stok &gt; 5)
                  </span>
                )}
                {liveComputedStatus === "Menipis" && (
                  <span className="inline-flex items-center justify-center bg-[#fef9c3] text-[#854d0e] border border-[#fef08a] rounded-full px-3 py-1 text-xs font-bold w-full">
                    Menipis (Stok ≤ 5)
                  </span>
                )}
                {liveComputedStatus === "Habis" && (
                  <span className="inline-flex items-center justify-center bg-gray-100 text-gray-600 border border-gray-300 rounded-full px-3 py-1 text-xs font-bold w-full">
                    Habis (Stok 0)
                  </span>
                )}
              </div>
            </div>

            {/* Status Produk Toggle Pill (Edit mode) */}
            {isEdit && (
              <div className="space-y-2 border-t border-gray-100 pt-4">
                <Label className="text-xs font-semibold text-gray-700 block">Status Produk:</Label>
                <div className="flex items-center bg-gray-100 p-1 rounded-full border border-gray-200">
                  <button
                    type="button"
                    onClick={() => handleFieldChange("statusProduk", "Aktif")}
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
                    onClick={() => handleFieldChange("statusProduk", "Nonaktif")}
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
                disabled={isSubmitting}
                onClick={handleCancelForm}
                className="flex-1 h-10 rounded-xl font-semibold text-xs cursor-pointer border-gray-200 hover:bg-gray-100"
              >
                Batal
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 h-10 bg-[#1B4332] hover:bg-[#032e21] text-white rounded-xl font-semibold text-xs cursor-pointer shadow-xs disabled:opacity-50 flex items-center justify-center gap-1.5"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Menyimpan...</span>
                  </>
                ) : (
                  <span>Simpan</span>
                )}
              </Button>
            </div>
          </div>

          {/* Right Main Content Cards */}
          <div className="flex-1 space-y-6 w-full">
            {/* Card 1: Informasi Produk */}
            <div className="bg-white rounded-2xl p-6 shadow-[0_4px_20px_rgba(3,59,42,0.06)] border border-emerald-300 ring-1 ring-black/5 space-y-4">
              <h3 className="font-bold text-gray-900 text-sm border-b border-gray-100 pb-3 flex items-center justify-between">
                <span>1. Informasi Produk</span>
                <span className="text-xs text-gray-400 font-normal">* Wajib diisi</span>
              </h3>

              {/* Nama Produk Dropdown */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <Label htmlFor="field-name" className="text-gray-700 font-semibold text-xs">
                    Nama Produk (Komoditas)
                  </Label>
                  <span className="text-[11px] font-semibold text-red-500">Wajib</span>
                </div>
                <select
                  id="field-name"
                  value={formData.name}
                  disabled={isSubmitting}
                  onChange={(e) => {
                    const selected = KOMODITAS_CATALOG.find((k) => k.name === e.target.value);
                    if (selected) {
                      handleFieldsChange({ name: e.target.value, category: selected.category });
                    } else {
                      handleFieldChange("name", e.target.value);
                    }
                  }}
                  onBlur={() => handleFieldBlur("name")}
                  aria-invalid={!!fieldErrors.name}
                  aria-describedby={fieldErrors.name ? "err-name" : undefined}
                  className={`w-full h-10 bg-white border rounded-xl pl-3.5 pr-10 text-xs font-medium text-gray-800 outline-none transition appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2220%22%20height%3D%2220%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%234b5563%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpath%20d%3D%22m6%209%206%206%206-6%22%2F%3E%3C%2Fsvg%3E')] bg-[length:16px_16px] bg-[right_14px_center] bg-no-repeat cursor-pointer ${
                    fieldErrors.name
                      ? "border-red-500 ring-2 ring-red-100"
                      : "border-gray-200 focus:ring-2 focus:ring-[#1B4332]/20"
                  }`}
                >
                  <option value="" disabled>Pilih komoditas sayuran / buah...</option>
                  {KOMODITAS_CATALOG.map((k) => (
                    <option key={k.name} value={k.name}>{k.name} — ({k.category})</option>
                  ))}
                </select>
                {fieldErrors.name && (
                  <p id="err-name" className="text-red-500 text-[11px] flex items-center gap-1 mt-1 font-semibold">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>{fieldErrors.name}</span>
                  </p>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Kategori */}
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center">
                    <Label htmlFor="field-category" className="text-gray-700 font-semibold text-xs">
                      Kategori Sayuran
                    </Label>
                    <span className="text-[11px] font-semibold text-red-500">Wajib</span>
                  </div>
                  <Input
                    id="field-category"
                    value={formData.category}
                    disabled={isSubmitting}
                    onChange={(e) => handleFieldChange("category", e.target.value)}
                    onBlur={() => handleFieldBlur("category")}
                    placeholder="Contoh: Bayam, Tomat, dll."
                    aria-invalid={!!fieldErrors.category}
                    aria-describedby={fieldErrors.category ? "err-category" : undefined}
                    className={`h-10 rounded-xl text-xs transition ${
                      fieldErrors.category
                        ? "border-red-500 ring-2 ring-red-100"
                        : "border-gray-200 focus:ring-2 focus:ring-[#1B4332]/20"
                    }`}
                  />
                  {fieldErrors.category && (
                    <p id="err-category" className="text-red-500 text-[11px] flex items-center gap-1 mt-1 font-semibold">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                      <span>{fieldErrors.category}</span>
                    </p>
                  )}
                </div>

                {/* Jenis Produk */}
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
                        disabled={isSubmitting}
                        checked={formData.jenisProduk === "Sayuran Organik"}
                        onChange={(e) => handleFieldChange("jenisProduk", e.target.value)}
                        className="accent-[#1B4332]"
                      />
                      Sayuran Organik
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer text-gray-700 font-medium">
                      <input
                        type="radio"
                        name="jenisProduk"
                        value="Sayuran Non Organik"
                        disabled={isSubmitting}
                        checked={formData.jenisProduk === "Sayuran Non Organik"}
                        onChange={(e) => handleFieldChange("jenisProduk", e.target.value)}
                        className="accent-[#1B4332]"
                      />
                      Sayuran Non Organik
                    </label>
                  </div>
                </div>
              </div>

              {/* Deskripsi */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <Label htmlFor="field-deskripsi" className="text-gray-700 font-semibold text-xs">
                    Deskripsi Produk
                  </Label>
                  <span className="text-[11px] text-gray-400">({formData.deskripsi.length}/500)</span>
                </div>
                <textarea
                  id="field-deskripsi"
                  rows={4}
                  value={formData.deskripsi}
                  disabled={isSubmitting}
                  onChange={(e) => handleFieldChange("deskripsi", e.target.value)}
                  onBlur={() => handleFieldBlur("deskripsi")}
                  placeholder="Tuliskan deskripsi lengkap kualitas produk panen Anda..."
                  aria-invalid={!!fieldErrors.deskripsi}
                  aria-describedby={fieldErrors.deskripsi ? "err-deskripsi" : undefined}
                  className={`w-full p-3 rounded-xl border outline-none text-xs text-gray-800 transition ${
                    fieldErrors.deskripsi
                      ? "border-red-500 ring-2 ring-red-100"
                      : "border-gray-200 focus:ring-2 focus:ring-[#1B4332]/20"
                  }`}
                />
                {fieldErrors.deskripsi && (
                  <p id="err-deskripsi" className="text-red-500 text-[11px] flex items-center gap-1 mt-1 font-semibold">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>{fieldErrors.deskripsi}</span>
                  </p>
                )}
              </div>
            </div>

            {/* Card 2: Informasi Penjualan */}
            <div className="bg-white rounded-2xl p-6 shadow-[0_4px_20px_rgba(3,59,42,0.06)] border border-emerald-300 ring-1 ring-black/5 space-y-4">
              <h3 className="font-bold text-gray-900 text-sm border-b border-gray-100 pb-3">2. Informasi Penjualan</h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Harga */}
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center">
                    <Label htmlFor="field-price" className="text-gray-700 font-semibold text-xs">
                      Harga Produk (Rp)
                    </Label>
                    <span className="text-[11px] font-semibold text-red-500">Wajib</span>
                  </div>
                  <div className="relative">
                    <Input
                      id="field-price"
                      type="number"
                      min="1"
                      value={formData.price}
                      disabled={isSubmitting}
                      onChange={(e) => handleFieldChange("price", e.target.value)}
                      onBlur={() => handleFieldBlur("price")}
                      placeholder="Contoh: 12500"
                      aria-invalid={!!fieldErrors.price}
                      aria-describedby={fieldErrors.price ? "err-price" : undefined}
                      className={`h-10 rounded-xl text-xs transition ${
                        fieldErrors.price
                          ? "border-red-500 ring-2 ring-red-100"
                          : "border-gray-200 focus:ring-2 focus:ring-[#1B4332]/20"
                      }`}
                    />
                  </div>
                  {fieldErrors.price && (
                    <p id="err-price" className="text-red-500 text-[11px] flex items-center gap-1 mt-1 font-semibold">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                      <span>{fieldErrors.price}</span>
                    </p>
                  )}
                </div>

                {/* Satuan Unit */}
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center">
                    <Label htmlFor="field-unitSelect" className="text-gray-700 font-semibold text-xs">
                      Satuan Penjualan
                    </Label>
                    <span className="text-[11px] font-semibold text-red-500">Wajib</span>
                  </div>
                  <select
                    id="field-unitSelect"
                    value={formData.unitSelect}
                    disabled={isSubmitting}
                    onChange={(e) => handleFieldChange("unitSelect", e.target.value)}
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

              {/* Input Custom Unit jika memilih "Custom" */}
              {formData.unitSelect === "Custom" && (
                <div className="space-y-1.5">
                  <Label htmlFor="field-customUnit" className="text-gray-700 font-semibold text-xs">
                    Tulis Satuan Custom
                  </Label>
                  <Input
                    id="field-customUnit"
                    value={formData.customUnit}
                    disabled={isSubmitting}
                    onChange={(e) => handleFieldChange("customUnit", e.target.value)}
                    onBlur={() => handleFieldBlur("customUnit")}
                    placeholder="Contoh: /keranjang atau /ikat-besar"
                    aria-invalid={!!fieldErrors.customUnit}
                    aria-describedby={fieldErrors.customUnit ? "err-customUnit" : undefined}
                    className={`h-10 rounded-xl text-xs transition ${
                      fieldErrors.customUnit
                        ? "border-red-500 ring-2 ring-red-100"
                        : "border-gray-200 focus:ring-2 focus:ring-[#1B4332]/20"
                    }`}
                  />
                  {fieldErrors.customUnit && (
                    <p id="err-customUnit" className="text-red-500 text-[11px] flex items-center gap-1 mt-1 font-semibold">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                      <span>{fieldErrors.customUnit}</span>
                    </p>
                  )}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Minimal Pembelian */}
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center">
                    <Label htmlFor="field-minimalPembelian" className="text-gray-700 font-semibold text-xs">
                      Minimal Pembelian
                    </Label>
                    <span className="text-[11px] font-semibold text-red-500">Wajib</span>
                  </div>
                  <Input
                    id="field-minimalPembelian"
                    type="number"
                    min="1"
                    value={formData.minimalPembelian}
                    disabled={isSubmitting}
                    onChange={(e) => handleFieldChange("minimalPembelian", e.target.value)}
                    onBlur={() => handleFieldBlur("minimalPembelian")}
                    placeholder="Masukkan jumlah minimal"
                    aria-invalid={!!fieldErrors.minimalPembelian}
                    aria-describedby={fieldErrors.minimalPembelian ? "err-minimalPembelian" : undefined}
                    className={`h-10 rounded-xl text-xs transition ${
                      fieldErrors.minimalPembelian
                        ? "border-red-500 ring-2 ring-red-100"
                        : "border-gray-200 focus:ring-2 focus:ring-[#1B4332]/20"
                    }`}
                  />
                  {fieldErrors.minimalPembelian && (
                    <p id="err-minimalPembelian" className="text-red-500 text-[11px] flex items-center gap-1 mt-1 font-semibold">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                      <span>{fieldErrors.minimalPembelian}</span>
                    </p>
                  )}
                </div>

                {/* Jumlah Stok */}
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center">
                    <Label htmlFor="field-stock" className="text-gray-700 font-semibold text-xs">
                      Jumlah Stok Panen
                    </Label>
                    <span className="text-[11px] font-semibold text-red-500">Wajib</span>
                  </div>
                  <Input
                    id="field-stock"
                    type="number"
                    min="0"
                    step="1"
                    value={formData.stock}
                    disabled={isSubmitting}
                    onChange={(e) => handleFieldChange("stock", e.target.value)}
                    onBlur={() => handleFieldBlur("stock")}
                    placeholder="Contoh: 45"
                    aria-invalid={!!fieldErrors.stock}
                    aria-describedby={fieldErrors.stock ? "err-stock" : undefined}
                    className={`h-10 rounded-xl text-xs transition ${
                      fieldErrors.stock
                        ? "border-red-500 ring-2 ring-red-100"
                        : "border-gray-200 focus:ring-2 focus:ring-[#1B4332]/20"
                    }`}
                  />
                  {fieldErrors.stock && (
                    <p id="err-stock" className="text-red-500 text-[11px] flex items-center gap-1 mt-1 font-semibold">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                      <span>{fieldErrors.stock}</span>
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Card 3: Foto Produk Panen Interaktif */}
            <div className="bg-white rounded-2xl p-6 shadow-[0_4px_20px_rgba(3,59,42,0.06)] border border-emerald-300 ring-1 ring-black/5 space-y-4">
              <h3 className="font-bold text-gray-900 text-sm border-b border-gray-100 pb-3 flex items-center justify-between">
                <span>3. Foto Produk</span>
                <span className="text-xs text-gray-400 font-normal">Pilih sampel atau masukkan URL</span>
              </h3>

              {/* Preview Image Box */}
              <div className="flex flex-col sm:flex-row items-center gap-4 border border-emerald-100 bg-emerald-50/30 rounded-2xl p-4">
                <div className="relative w-24 h-24 rounded-xl overflow-hidden bg-gray-100 border border-gray-200 shrink-0 shadow-2xs">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={formData.image}
                    alt="Pratinjau Produk"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="space-y-1 text-center sm:text-left flex-1">
                  <p className="text-xs font-bold text-gray-800 flex items-center gap-1.5 justify-center sm:justify-start">
                    <ImageIcon className="w-4 h-4 text-[#1B4332]" />
                    <span>Pratinjau Foto Produk</span>
                  </p>
                  <p className="text-[11px] text-gray-500">
                    Foto yang menarik membantu pembeli UMKM mengenali kualitas sayur segar Anda.
                  </p>
                </div>
              </div>

              {/* Preset Image Options */}
              <div className="space-y-2 pt-1">
                <Label className="text-xs font-semibold text-gray-700 block">Pilih Preset Foto Sayuran:</Label>
                <div className="grid grid-cols-5 gap-2">
                  {PRESET_IMAGES.map((imgItem) => {
                    const isSelected = formData.image === imgItem.url;
                    return (
                      <button
                        key={imgItem.label}
                        type="button"
                        onClick={() => handleFieldChange("image", imgItem.url)}
                        className={`relative rounded-xl overflow-hidden border-2 aspect-square group transition cursor-pointer ${
                          isSelected ? "border-[#1B4332] ring-2 ring-[#1B4332]/20" : "border-gray-200 hover:border-emerald-400"
                        }`}
                        title={imgItem.label}
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={imgItem.url} alt={imgItem.label} className="w-full h-full object-cover" />
                        {isSelected && (
                          <div className="absolute inset-0 bg-[#1B4332]/40 flex items-center justify-center">
                            <Check className="w-5 h-5 text-white" />
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="space-y-2 pt-2 mt-4 border-t border-gray-100">
                <Label className="text-xs font-semibold text-gray-700 block mt-2">Atau Upload / Masukkan URL Sendiri:</Label>
                
                <div className="flex flex-col sm:flex-row items-center gap-3">
                  {/* Hidden file input */}
                  <input 
                    type="file" 
                    id="file-upload-add" 
                    accept="image/*" 
                    className="hidden" 
                    disabled={isSubmitting}
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onloadend = () => {
                          if (typeof reader.result === 'string') {
                            handleFieldChange("image", reader.result);
                          }
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                  />
                  <Button 
                    type="button" 
                    disabled={isSubmitting}
                    onClick={() => document.getElementById('file-upload-add')?.click()}
                    variant="outline" 
                    className="h-10 w-full sm:w-auto rounded-xl text-xs font-semibold px-4 flex items-center gap-2 cursor-pointer shadow-xs border-gray-200"
                  >
                    <Upload className="w-4 h-4" />
                    Upload File
                  </Button>
                  <span className="text-xs text-gray-400 font-medium hidden sm:inline-block">atau</span>
                  <Input
                    id="field-image-url"
                    value={formData.image}
                    disabled={isSubmitting}
                    onChange={(e) => handleFieldChange("image", e.target.value)}
                    placeholder="Paste URL foto..."
                    className="h-10 w-full rounded-xl text-xs sm:flex-1 border-gray-200 focus:ring-2 focus:ring-[#1B4332]/20 transition"
                  />
                </div>
              </div>
            </div>
          </div>
        </form>

        {/* ── Dialog Konfirmasi Unsaved Changes ── */}
        <Dialog open={showUnsavedModal} onOpenChange={setShowUnsavedModal}>
          <DialogContent className="sm:max-w-md bg-white rounded-2xl p-6 shadow-2xl border border-gray-100">
            <DialogHeader>
              <DialogTitle className="text-base font-bold text-gray-900 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-amber-500" />
                <span>Perubahan Belum Disimpan</span>
              </DialogTitle>
              <DialogDescription className="text-xs text-gray-600 pt-2 leading-relaxed">
                Apakah Anda yakin ingin keluar dari form ini? Semua rincian produk yang telah Anda isi akan hilang dan tidak tersimpan.
              </DialogDescription>
            </DialogHeader>

            <DialogFooter className="pt-4 flex items-center gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowUnsavedModal(false)}
                className="flex-1 h-10 text-xs font-semibold rounded-xl cursor-pointer"
              >
                Lanjutkan Mengedit
              </Button>
              <Button
                type="button"
                onClick={() => {
                  setShowUnsavedModal(false);
                  setIsDirty(false);
                  setFieldErrors({});
                  setTouchedFields({});
                  setViewMode("table");
                  resetForm();
                }}
                className="flex-1 h-10 bg-red-600 hover:bg-red-700 text-white text-xs font-semibold rounded-xl cursor-pointer shadow-xs"
              >
                Keluar Tanpa Menyimpan
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    );
  }

  // ── Main Table View for Product List ──
  return (
    <div className="space-y-6 w-full pb-10">
      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
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

      {/* Main Product Table Card */}
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

          <button
            onClick={() => setShowInitialAddConfirmModal(true)}
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
              {isLoadingData ?  (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-gray-500 text-xs font-medium">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <Loader2 className="w-6 h-6 animate-spin text-[#1B4332]" />
                      <span>Memuat data produk...</span>
                    </div>
                  </td>
                </tr>
              ) : paginatedProducts.length > 0 ? (
                paginatedProducts.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50/50 transition">
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
                          onClick={() => setConfirmEditInitialProduct(item)}
                          className="bg-[#5ec250] hover:bg-[#4cb03f] text-white rounded-full px-4 py-1.5 text-xs font-semibold transition cursor-pointer shadow-2xs"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => setDeletingProductStep1(item)}
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
              <div className="space-y-1.5">
                <Label className="text-gray-700 font-semibold">Nama Produk (Komoditas)</Label>
                <select
                  value={formData.name}
                  onChange={(e) => {
                    const selected = KOMODITAS_CATALOG.find((k) => k.name === e.target.value);
                    if (selected) {
                      handleFieldsChange({ name: e.target.value, category: selected.category });
                    } else {
                      handleFieldChange("name", e.target.value);
                    }
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
                    onChange={(e) => handleFieldChange("stock", e.target.value)}
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
                    value={formData.price}
                    onChange={(e) => handleFieldChange("price", e.target.value)}
                    className="h-10 rounded-xl border-gray-200 focus:ring-2 focus:ring-[#1B4332]/20"
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-gray-700 font-semibold">Satuan Unit</Label>
                  <select
                    value={formData.unitSelect}
                    onChange={(e) => handleFieldChange("unitSelect", e.target.value)}
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
                    onChange={(e) => handleFieldChange("customUnit", e.target.value)}
                    className="h-10 rounded-xl border-gray-200 focus:ring-2 focus:ring-[#1B4332]/20"
                    required
                  />
                </div>
              )}

              <div className="space-y-1.5">
                <Label className="text-gray-700 font-semibold">Upload / URL Foto Produk</Label>
                <div className="flex flex-col sm:flex-row items-center gap-2">
                  <input 
                    type="file" 
                    id="file-upload-edit" 
                    accept="image/*" 
                    className="hidden" 
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onloadend = () => {
                          if (typeof reader.result === 'string') {
                            handleFieldChange("image", reader.result);
                          }
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                  />
                  <Button 
                    type="button" 
                    onClick={() => document.getElementById('file-upload-edit')?.click()}
                    variant="outline" 
                    className="h-10 w-full sm:w-auto rounded-xl text-xs font-semibold px-3 flex items-center justify-center gap-1.5 cursor-pointer border-gray-200"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    Upload
                  </Button>
                  <Input
                    value={formData.image}
                    onChange={(e) => handleFieldChange("image", e.target.value)}
                    placeholder="Atau Paste URL foto..."
                    className="h-10 w-full sm:flex-1 rounded-xl border-gray-200 focus:ring-2 focus:ring-[#1B4332]/20"
                  />
                </div>
              </div>

              {/* Status Indicator */}
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
                  disabled={isSubmitting}
                  className="h-10 px-6 bg-[#1B4332] hover:bg-[#032e21] text-white rounded-xl font-semibold cursor-pointer flex items-center gap-2"
                >
                  {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
                  <span>Simpan Perubahan</span>
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      )}

      {/* ── 0. Modal Confirmation: Tambah Produk Baru? Initial ── */}
      <Dialog open={showInitialAddConfirmModal} onOpenChange={setShowInitialAddConfirmModal}>
        <DialogContent className="sm:max-w-md bg-white rounded-3xl p-6 shadow-2xl border border-gray-100 text-center flex flex-col items-center">
          <div className="w-16 h-16 bg-[#d5ebe1] rounded-full flex items-center justify-center border-[1.5px] border-[#1B4332] mb-3">
            <Plus className="w-7 h-7 text-[#014c32]" />
          </div>
          <DialogTitle className="text-lg font-bold text-gray-900 mb-1">Tambah Produk Baru?</DialogTitle>
          <DialogDescription className="text-sm text-gray-500 mb-4 font-medium leading-relaxed max-w-[340px]">
            Pilih <span className="font-bold text-gray-700">Tambah</span> untuk membuat produk baru yang akan ditampilkan
          </DialogDescription>
          
          <div className="flex w-full gap-3">
            <Button 
              type="button"
              variant="outline" 
              onClick={() => setShowInitialAddConfirmModal(false)}
              className="flex-1 rounded-xl h-11 bg-[#e2e2e2] border-transparent hover:bg-[#d1d1d1] text-gray-500 font-bold text-sm cursor-pointer"
            >
              Batal
            </Button>
            <Button 
              type="button"
              onClick={() => {
                setShowInitialAddConfirmModal(false);
                resetForm();
                setViewMode("add");
              }}
              className="flex-1 rounded-xl h-11 bg-[#014c32] hover:bg-[#023c28] text-white font-bold text-sm cursor-pointer"
            >
              Tambah
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* ── 1. Modal Confirmation: Simpan Produk Baru? (Image 2) ── */}
      <Dialog open={showAddConfirmModal} onOpenChange={setShowAddConfirmModal}>
        <DialogContent className="sm:max-w-md bg-white rounded-3xl p-6 shadow-2xl border border-gray-100 text-center flex flex-col items-center">
          <div className="w-16 h-16 bg-[#d5ebe1] rounded-full flex items-center justify-center border-[1.5px] border-[#1B4332] mb-3">
            <Save className="w-7 h-7 text-[#014c32]" />
          </div>
          <DialogTitle className="text-lg font-bold text-gray-900 mb-1">Simpan Produk Baru?</DialogTitle>
          <DialogDescription className="text-sm text-gray-500 mb-4 font-medium leading-relaxed max-w-[340px]">
            Pilih <span className="font-bold text-gray-700">Simpan</span> untuk menyimpan data produk
          </DialogDescription>
          
          <div className="flex w-full gap-3">
            <Button 
              type="button"
              variant="outline" 
              onClick={() => setShowAddConfirmModal(false)}
              className="flex-1 rounded-xl h-11 bg-[#e2e2e2] border-transparent hover:bg-[#d1d1d1] text-gray-500 font-bold text-sm cursor-pointer"
            >
              Batal
            </Button>
            <Button 
              type="button"
              onClick={executeAddProduct}
              className="flex-1 rounded-xl h-11 bg-[#014c32] hover:bg-[#023c28] text-white font-bold text-sm cursor-pointer"
            >
              Simpan
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* ── 2. Modal Confirmation: Edit Produk? (Image 3) ── */}
      <Dialog open={!!confirmEditInitialProduct} onOpenChange={(open) => !open && setConfirmEditInitialProduct(null)}>
        <DialogContent className="sm:max-w-md bg-white rounded-3xl p-6 shadow-2xl border border-gray-100 text-center flex flex-col items-center">
          <div className="w-16 h-16 bg-[#d5ebe1] rounded-full flex items-center justify-center border-[1.5px] border-[#1B4332] mb-3">
            <Edit2 className="w-7 h-7 text-[#014c32]" />
          </div>
          <DialogTitle className="text-lg font-bold text-gray-900 mb-1">Edit Produk?</DialogTitle>
          <DialogDescription className="text-sm text-gray-500 mb-4 font-medium leading-relaxed max-w-[340px]">
            Pilih <span className="font-bold text-gray-700">Edit</span> untuk mengubah informasi produk ini
          </DialogDescription>
          
          <div className="flex w-full gap-3">
            <Button 
              type="button"
              variant="outline" 
              onClick={() => setConfirmEditInitialProduct(null)}
              className="flex-1 rounded-xl h-11 bg-[#e2e2e2] border-transparent hover:bg-[#d1d1d1] text-gray-500 font-bold text-sm cursor-pointer"
            >
              Batal
            </Button>
            <Button 
              type="button"
              onClick={() => {
                const p = confirmEditInitialProduct;
                setConfirmEditInitialProduct(null);
                if (p) openEditModal(p);
              }}
              className="flex-1 rounded-xl h-11 bg-[#014c32] hover:bg-[#023c28] text-white font-bold text-sm cursor-pointer"
            >
              Edit
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* ── 3. Modal Confirmation: Simpan Perubahan? (Image 5) ── */}
      <Dialog open={showEditSubmitConfirmModal} onOpenChange={setShowEditSubmitConfirmModal}>
        <DialogContent className="sm:max-w-md bg-white rounded-3xl p-6 shadow-2xl border border-gray-100 text-center flex flex-col items-center">
          <div className="w-16 h-16 bg-[#d5ebe1] rounded-full flex items-center justify-center border-[1.5px] border-[#1B4332] mb-3">
            <Edit2 className="w-7 h-7 text-[#014c32]" />
          </div>
          <DialogTitle className="text-lg font-bold text-gray-900 mb-1">Simpan Perubahan?</DialogTitle>
          <DialogDescription className="text-sm text-gray-500 mb-4 font-medium leading-relaxed max-w-[340px]">
            Pilih <span className="font-bold text-gray-700">Simpan</span> untuk menyimpan informasi perubahan produk
          </DialogDescription>
          
          <div className="flex w-full gap-3">
            <Button 
              type="button"
              variant="outline" 
              onClick={() => setShowEditSubmitConfirmModal(false)}
              className="flex-1 rounded-xl h-11 bg-[#e2e2e2] border-transparent hover:bg-[#d1d1d1] text-gray-500 font-bold text-sm cursor-pointer"
            >
              Batal
            </Button>
            <Button 
              type="button"
              onClick={executeEditProduct}
              className="flex-1 rounded-xl h-11 bg-[#014c32] hover:bg-[#023c28] text-white font-bold text-sm cursor-pointer"
            >
              Simpan
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* ── 4. Modal Confirmation: Hapus Produk? Step 1 (Image 4) ── */}
      <Dialog open={!!deletingProductStep1} onOpenChange={(open) => !open && setDeletingProductStep1(null)}>
        <DialogContent className="sm:max-w-md bg-white rounded-3xl p-6 shadow-2xl border border-gray-100 text-center flex flex-col items-center">
          <div className="w-16 h-16 bg-[#fdd8d8] rounded-full flex items-center justify-center border-[1.5px] border-red-500 mb-3">
            <Trash2 className="w-7 h-7 text-red-500" />
          </div>
          <DialogTitle className="text-lg font-bold text-gray-900 mb-1">Hapus Produk?</DialogTitle>
          <DialogDescription className="text-sm text-gray-500 mb-4 font-medium leading-relaxed max-w-[340px]">
            Tindakan ini akan menghapus data secara permanen dari sistem
          </DialogDescription>
          
          <div className="flex w-full gap-3">
            <Button 
              type="button"
              variant="outline" 
              onClick={() => setDeletingProductStep1(null)}
              className="flex-1 rounded-xl h-11 bg-[#e2e2e2] border-transparent hover:bg-[#d1d1d1] text-gray-500 font-bold text-sm cursor-pointer"
            >
              Batal
            </Button>
            <Button 
              type="button"
              onClick={() => {
                const p = deletingProductStep1;
                setDeletingProductStep1(null);
                if (p) {
                  setDeletingProductStep2(p);
                  setDeleteInputName("");
                }
              }}
              className="flex-1 rounded-xl h-11 bg-[#f00000] hover:bg-[#d00000] text-white font-bold text-sm cursor-pointer"
            >
              Hapus
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* ── 5. Modal Confirmation: Hapus Produk Step 2 Retype (Image 1) ── */}
      <Dialog open={!!deletingProductStep2} onOpenChange={(open) => !open && setDeletingProductStep2(null)}>
        <DialogContent className="sm:max-w-md bg-white rounded-2xl p-6 shadow-2xl border border-gray-100">
          <div className="flex items-center justify-between border-b border-gray-100 pb-3 mb-4">
            <DialogTitle className="text-base font-bold text-gray-900">Hapus Produk</DialogTitle>
          </div>
          
          <p className="text-xs font-medium text-gray-600 mb-3">
            Tulis ulang nama produk <span className="font-bold text-gray-900">&ldquo;{deletingProductStep2?.name}&rdquo;</span>, untuk hapus produk
          </p>

          <Input 
            value={deleteInputName}
            onChange={(e) => setDeleteInputName(e.target.value)}
            placeholder="Masukkan nama produk"
            className="h-11 rounded-xl bg-[#f9fafb] border-gray-200 text-xs font-medium focus:ring-2 focus:ring-red-500/20 mb-6"
          />

          <Button 
            disabled={deleteInputName.trim() !== deletingProductStep2?.name}
            onClick={() => {
              if (!deletingProductStep2) return;
              const p = deletingProductStep2;
              setDeletingProductStep2(null);
              executeDeleteProduct(p);
            }}
            className="w-full h-11 bg-[#f00000] hover:bg-[#d00000] disabled:opacity-40 text-white font-bold text-sm rounded-xl cursor-pointer"
          >
            Hapus
          </Button>
        </DialogContent>
      </Dialog>

      {/* ── Modal Detail Produk ── */}
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
                    Hadirkan nutrisi terbaik untuk keluarga dengan sayur {selectedDetailProduct.name.toLowerCase()} segar dari petani lokal Harvesta! Kami menyediakan {selectedDetailProduct.name.toLowerCase()} berkualitas premium yang dipanen dan disortir secara ketat sehingga kesegarannya tetap terjaga.
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
