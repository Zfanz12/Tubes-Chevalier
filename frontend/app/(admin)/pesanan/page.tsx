"use client";

import React, { useState, useMemo, useEffect } from "react";
import {
  Hourglass,
  PackageCheck,
  Truck,
  CheckCircle2,
  Search,
  Plus,
  ArrowUpRight,
  MapPin,
  XCircle,
  Package,
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

// US-17: Status pesanan sesuai dokumen MVP
type OrderStatus = "Menunggu" | "Disiapkan" | "Siap Diambil" | "Sedang Dikirim" | "Selesai";

// US-06: Metode pengambilan — Pickup atau Diantar
type DeliveryMethod = "Pickup" | "Diantar";

interface OrderItem {
  id: string;
  customer: string;
  date: string;
  total: string;
  status: OrderStatus;
  deliveryMethod: DeliveryMethod;
  alamat?: string;
  items?: { name: string; qty: string; price: string }[];
}

// Helper: parse DD/MM/YYYY → Date object
function parseDDMMYYYY(dateStr: string): Date | null {
  const parts = dateStr.split("/");
  if (parts.length !== 3) return null;
  const [day, month, year] = parts.map(Number);
  if (!day || !month || !year) return null;
  return new Date(year, month - 1, day);
}

const REFERENCE_TODAY = new Date();

function isWithinDays(dateStr: string, days: number): boolean {
  const parsed = parseDDMMYYYY(dateStr);
  if (!parsed) return true;
  const diffMs = REFERENCE_TODAY.getTime() - parsed.getTime();
  return diffMs >= 0 && diffMs <= days * 24 * 60 * 60 * 1000;
}

// Status transition logic — forward only, branching by delivery method
function getNextStatuses(current: OrderStatus, deliveryMethod: DeliveryMethod): OrderStatus[] {
  switch (current) {
    case "Menunggu":
      return ["Disiapkan"];
    case "Disiapkan":
      return deliveryMethod === "Pickup" ? ["Siap Diambil"] : ["Sedang Dikirim"];
    case "Siap Diambil":
      return ["Selesai"];
    case "Sedang Dikirim":
      return ["Selesai"];
    case "Selesai":
      return [];
    default:
      return [];
  }
}

// Status badge color map
const statusBadgeClass: Record<string, string> = {
  Menunggu: "bg-red-50 text-red-600 border-red-200",
  Disiapkan: "bg-amber-50 text-amber-700 border-amber-200",
  "Siap Diambil": "bg-blue-50 text-blue-600 border-blue-200",
  "Sedang Dikirim": "bg-indigo-50 text-indigo-600 border-indigo-200",
  Selesai: "bg-teal-50 text-teal-700 border-teal-200",
};

// Delivery method badge
const deliveryBadgeClass: Record<string, string> = {
  Pickup: "bg-purple-50 text-purple-700 border-purple-200",
  Diantar: "bg-sky-50 text-sky-700 border-sky-200",
};

let nextIdCounter = 12352;

const initialOrders: OrderItem[] = [
  {
    id: "INV-12345",
    customer: "Reza Rahardian",
    date: "12/02/2026",
    total: "Rp 130.000",
    status: "Menunggu",
    deliveryMethod: "Diantar",
    alamat: "Jl. Merdeka No. 45, Bandung",
    items: [{ name: "Tomat Segar", qty: "5 kg", price: "Rp 60.000" }, { name: "Bayam Organik", qty: "7 kg", price: "Rp 70.000" }],
  },
  {
    id: "INV-12346",
    customer: "Siti Aminah",
    date: "12/02/2026",
    total: "Rp 150.000",
    status: "Menunggu",
    deliveryMethod: "Pickup",
    items: [{ name: "Kangkung Fresh", qty: "10 kg", price: "Rp 150.000" }],
  },
  {
    id: "INV-12347",
    customer: "Budi Santoso",
    date: "12/02/2026",
    total: "Rp 20.000",
    status: "Disiapkan",
    deliveryMethod: "Diantar",
    alamat: "Jl. Sudirman No. 12, Jakarta",
    items: [{ name: "Wortel Manis", qty: "2 kg", price: "Rp 20.000" }],
  },
  {
    id: "INV-12348",
    customer: "Dewi Lestari",
    date: "12/02/2026",
    total: "Rp 30.000",
    status: "Disiapkan",
    deliveryMethod: "Pickup",
    items: [{ name: "Cabai Rawit", qty: "1 kg", price: "Rp 30.000" }],
  },
  {
    id: "INV-12349",
    customer: "Ahmad Subarkah",
    date: "12/02/2026",
    total: "Rp 130.000",
    status: "Sedang Dikirim",
    deliveryMethod: "Diantar",
    alamat: "Jl. Asia Afrika No. 88, Bandung",
    items: [{ name: "Pak Choy", qty: "8 kg", price: "Rp 130.000" }],
  },
  {
    id: "INV-12350",
    customer: "Rina Nose",
    date: "12/02/2026",
    total: "Rp 130.000",
    status: "Selesai",
    deliveryMethod: "Pickup",
    items: [{ name: "Brokoli Hijau", qty: "4 kg", price: "Rp 130.000" }],
  },
  {
    id: "INV-12351",
    customer: "Eko Prasetyo",
    date: "12/02/2026",
    total: "Rp 130.000",
    status: "Siap Diambil",
    deliveryMethod: "Pickup",
    items: [{ name: "Bayam Hijau", qty: "9 kg", price: "Rp 130.000" }],
  },
];

export default function PesananPage() {
  const [orders, setOrders] = useState<OrderItem[]>(initialOrders);
  const [searchQuery, setSearchQuery] = useState("");
  const [timeFilter, setTimeFilter] = useState<"Semua" | "7 hari" | "30 hari">("Semua");
  const [currentPage, setCurrentPage] = useState(1);

  // Confirmation Modals State (matching dialog menu ... .png)
  const [selectedOrder, setSelectedOrder] = useState<OrderItem | null>(null);
  const [confirmTerimaOrder, setConfirmTerimaOrder] = useState<OrderItem | null>(null);
  const [confirmTolakOrder, setConfirmTolakOrder] = useState<OrderItem | null>(null);
  const [confirmKirimOrder, setConfirmKirimOrder] = useState<OrderItem | null>(null);
  const [confirmSelesaiOrder, setConfirmSelesaiOrder] = useState<OrderItem | null>(null);
  const [confirmBatalOrder, setConfirmBatalOrder] = useState<OrderItem | null>(null);
  const [alasanTolak, setAlasanTolak] = useState("Stok Habis");
  const [alasanBatal, setAlasanBatal] = useState("Permintaan Pembeli");
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [newOrderCustomer, setNewOrderCustomer] = useState("");
  const [newOrderDeliveryMethod, setNewOrderDeliveryMethod] = useState<DeliveryMethod>("Pickup");
  const [newOrderAlamat, setNewOrderAlamat] = useState("");
  const [selectedCatalogItem, setSelectedCatalogItem] = useState("Bayam Murid Siswoyo");
  const [itemQty, setItemQty] = useState("2");
  const [addedItems, setAddedItems] = useState<{ name: string; qty: string; price: string }[]>([
    { name: "Bayam Organik Asal Jember", qty: "2 kg", price: "Rp 25.000" },
  ]);

  const itemsPerPage = 5;

  const filteredOrders = useMemo(() => {
    return orders.filter((ord) => {
      const matchSearch =
        ord.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ord.customer.toLowerCase().includes(searchQuery.toLowerCase());
      if (!matchSearch) return false;

      if (timeFilter === "7 hari") return isWithinDays(ord.date, 7);
      if (timeFilter === "30 hari") return isWithinDays(ord.date, 30);
      return true;
    });
  }, [orders, searchQuery, timeFilter]);

  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage) || 1;

  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const paginatedOrders = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredOrders.slice(start, start + itemsPerPage);
  }, [filteredOrders, currentPage]);

  const countMenunggu = orders.filter((o) => o.status === "Menunggu").length;
  const countDisiapkan = orders.filter((o) => o.status === "Disiapkan").length;
  const countInTransit = orders.filter((o) => o.status === "Sedang Dikirim" || o.status === "Siap Diambil").length;
  const countSelesai = orders.filter((o) => o.status === "Selesai").length;

  const updateOrderStatus = (id: string, newStatus: OrderStatus) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === id ? { ...o, status: newStatus } : o))
    );
    setSelectedOrder((prev) => {
      if (prev && prev.id === id) {
        return { ...prev, status: newStatus };
      }
      return prev;
    });
    toast.success(`Status pesanan ${id} diperbarui menjadi "${newStatus}"`);
  };

  const handleAddItemToOrder = () => {
    const numericQty = parseFloat(itemQty);
    if (isNaN(numericQty) || numericQty <= 0) {
      toast.error("Jumlah harus berupa angka valid (minimal 1)!");
      return;
    }
    const unitPrice = 12500;
    const totalPriceNum = unitPrice * numericQty;
    const formattedPrice = `Rp ${totalPriceNum.toLocaleString("id-ID")}`;
    setAddedItems((prev) => [
      ...prev,
      { name: selectedCatalogItem, qty: `${numericQty} kg`, price: formattedPrice },
    ]);
    toast.success(`Item "${selectedCatalogItem}" ditambahkan ke rincian pesanan`);
  };

  const handleAddOrderSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (addedItems.length === 0) {
      toast.error("Tambahkan minimal 1 produk ke rincian pesanan!");
      return;
    }

    const calculatedTotalNum = addedItems.reduce((acc, item) => {
      const p = parseFloat(item.price.replace(/[^\d]/g, "")) || 0;
      return acc + p;
    }, 0);

    const formattedTotal = `Rp ${calculatedTotalNum.toLocaleString("id-ID")}`;
    const customerName = newOrderCustomer.trim() || "Customer Umum";

    nextIdCounter++;
    const order: OrderItem = {
      id: `INV-${nextIdCounter}`,
      customer: customerName,
      date: new Date().toLocaleDateString("id-ID"),
      total: formattedTotal,
      status: "Menunggu",
      deliveryMethod: newOrderDeliveryMethod,
      alamat: newOrderDeliveryMethod === "Diantar" ? newOrderAlamat.trim() : undefined,
      items: addedItems,
    };

    setOrders([order, ...orders]);
    setIsAddOpen(false);
    setNewOrderCustomer("");
    setNewOrderAlamat("");
    setAddedItems([{ name: "Bayam Organik Asal Jember", qty: "2 kg", price: "Rp 25.000" }]);
  };

  return (
    <div className="w-full space-y-6">
      {/* ── Stat Cards ── */}
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
                {countMenunggu > 0 && (
                  <span className="bg-[#d40005] text-white text-xs font-semibold px-3 py-1 rounded-full shadow-2xs">
                    Urgent
                  </span>
                )}
              </div>
              <p className="text-2xl font-bold text-gray-900 tracking-tight">{countMenunggu}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 pt-0.5">
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-600 border border-emerald-100 shrink-0">
              <ArrowUpRight className="w-3.5 h-3.5" />
              +8%
            </span>
            <span className="text-xs text-gray-400 truncate">Naik dari hari sebelumnya</span>
          </div>
        </div>

        {/* Card 2: Disiapkan */}
        <div className="bg-white rounded-2xl p-5 shadow-[0_4px_20px_rgba(3,59,42,0.06)] border border-emerald-300 ring-1 ring-black/5 space-y-3">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-amber-50 border border-amber-200 text-amber-600 flex items-center justify-center shrink-0">
              <PackageCheck className="w-6 h-6" />
            </div>
            <div className="flex-1 min-w-0">
              <span className="text-sm font-medium text-gray-500 block">Disiapkan</span>
              <p className="text-2xl font-bold text-gray-900 tracking-tight">{countDisiapkan}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 pt-0.5">
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-600 border border-emerald-100 shrink-0">
              <ArrowUpRight className="w-3.5 h-3.5" />
              +15%
            </span>
            <span className="text-xs text-gray-400 truncate">Naik dari hari sebelumnya</span>
          </div>
        </div>

        {/* Card 3: Siap Diambil / Sedang Dikirim */}
        <div className="bg-white rounded-2xl p-5 shadow-[0_4px_20px_rgba(3,59,42,0.06)] border border-emerald-300 ring-1 ring-black/5 space-y-3">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-200 text-blue-600 flex items-center justify-center shrink-0">
              <Truck className="w-6 h-6" />
            </div>
            <div className="flex-1 min-w-0">
              <span className="text-sm font-medium text-gray-500 block">Dalam Perjalanan</span>
              <p className="text-2xl font-bold text-gray-900 tracking-tight">{countInTransit}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 pt-0.5">
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-600 border border-emerald-100 shrink-0">
              <ArrowUpRight className="w-3.5 h-3.5" />
              +22%
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
              <p className="text-2xl font-bold text-gray-900 tracking-tight">{countSelesai}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 pt-0.5">
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-600 border border-emerald-100 shrink-0">
              <ArrowUpRight className="w-3.5 h-3.5" />
              +31%
            </span>
            <span className="text-xs text-gray-400 truncate">Naik dari hari sebelumnya</span>
          </div>
        </div>
      </div>

      {/* ── Main Order Table Card ── */}
      <div className="bg-white rounded-2xl p-6 shadow-[0_4px_20px_rgba(3,59,42,0.06)] border border-emerald-300 ring-1 ring-black/5 space-y-5">
        {/* Table Controls */}
        <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
          <div className="relative w-full lg:w-80">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Cari pesanan..."
              className="w-full bg-[#f3f4f6] text-sm text-gray-800 placeholder:text-gray-400 rounded-full pl-4 pr-10 py-2.5 outline-none focus:ring-2 focus:ring-[#1B4332]/20 transition"
            />
            <Search className="w-4 h-4 text-gray-700 absolute right-3.5 top-1/2 -translate-y-1/2" />
          </div>

          <div className="flex flex-wrap items-center justify-between sm:justify-end w-full lg:w-auto gap-4">
            <div className="bg-[#eefcf4] p-1.5 rounded-full border border-[#c6f0d8] inline-flex items-center gap-1.5">
              {(["Semua", "7 hari", "30 hari"] as const).map((tf) => (
                <button
                  key={tf}
                  onClick={() => {
                    setTimeFilter(tf);
                    setCurrentPage(1);
                  }}
                  className={`px-4.5 py-1.5 text-xs rounded-full transition cursor-pointer ${
                    timeFilter === tf
                      ? "font-bold bg-[#1B4332] text-white shadow-2xs"
                      : "font-semibold text-gray-500 hover:text-gray-900"
                  }`}
                >
                  {tf}
                </button>
              ))}
            </div>

            <button
              onClick={() => setIsAddOpen(true)}
              className="bg-[#1B4332] hover:bg-[#05543c] text-white text-xs font-semibold rounded-full px-5 py-2.5 transition flex items-center justify-center gap-1.5 shadow-xs cursor-pointer"
            >
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
                <th className="py-3.5 px-3 text-center">Pengambilan</th>
                <th className="py-3.5 px-3 text-center">Status</th>
                <th className="py-3.5 px-3 text-center"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
              {paginatedOrders.length > 0 ? (
                paginatedOrders.map((item, index) => (
                  <tr key={index} className="hover:bg-gray-50/60 transition-colors">
                    <td className="py-4 px-3 font-medium text-gray-700 text-xs">{item.id}</td>
                    <td className="py-4 px-3 font-semibold text-gray-800 text-xs">{item.customer}</td>
                    <td className="py-4 px-3 text-center text-gray-600 text-xs">{item.date}</td>
                    <td className="py-4 px-3 text-center font-medium text-gray-900 text-xs">{item.total}</td>
                    <td className="py-4 px-3 text-center">
                      <span className={`inline-flex items-center justify-center gap-1 border rounded-full px-3 py-1 text-xs font-semibold ${deliveryBadgeClass[item.deliveryMethod]}`}>
                        {item.deliveryMethod === "Pickup" ? <MapPin className="w-3 h-3" /> : <Truck className="w-3 h-3" />}
                        {item.deliveryMethod === "Pickup" ? "Ambil Sendiri" : "Diantar"}
                      </span>
                    </td>
                    <td className="py-4 px-3 text-center">
                      <span className={`inline-flex items-center justify-center border rounded-full px-3.5 py-1 text-xs font-semibold ${statusBadgeClass[item.status]}`}>
                        {item.status}
                      </span>
                    </td>
                    <td className="py-4 px-3 text-right pr-4">
                      <button
                        onClick={() => setSelectedOrder(item)}
                        className="bg-[#1B4332] hover:bg-[#05543c] text-white rounded-full px-5 py-2 text-xs font-semibold transition cursor-pointer shadow-2xs"
                      >
                        Lihat detail
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-gray-400 text-xs font-medium">
                    Tidak ada pesanan yang sesuai.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
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

      {/* ── Modal Catat Pesanan (overlay catat pesanan.png) ── */}
      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent className="sm:max-w-lg bg-white rounded-2xl p-6 shadow-2xl border border-emerald-300 ring-1 ring-black/5">
          <DialogHeader className="pb-3 border-b border-gray-100">
            <DialogTitle className="text-lg font-bold text-gray-900">Catat Pesanan</DialogTitle>
          </DialogHeader>

          <form onSubmit={handleAddOrderSubmit} className="space-y-4 py-3 text-xs">
            <div className="space-y-1.5">
              <Label className="text-gray-700 font-semibold">Nama Customer</Label>
              <Input
                placeholder="Masukkan nama customer (opsional)"
                value={newOrderCustomer}
                onChange={(e) => setNewOrderCustomer(e.target.value)}
                className="h-10 rounded-xl border-gray-200 focus:ring-2 focus:ring-[#1B4332]/20"
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <Label className="text-gray-700 font-semibold">Nama Produk</Label>
                <span className="text-[11px] font-semibold text-red-500">Wajib</span>
              </div>
              <select
                value={selectedCatalogItem}
                onChange={(e) => setSelectedCatalogItem(e.target.value)}
                className="w-full h-10 bg-white border border-gray-200 rounded-xl pl-3.5 pr-10 text-xs font-medium text-gray-800 outline-none focus:ring-2 focus:ring-[#1B4332]/20 appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2220%22%20height%3D%2220%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%234b5563%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpath%20d%3D%22m6%209%206%206%206-6%22%2F%3E%3C%2Fsvg%3E')] bg-[length:16px_16px] bg-[right_14px_center] bg-no-repeat cursor-pointer"
              >
                <option value="Bayam Murid Siswoyo">Bayam Murid Siswoyo</option>
                <option value="Bayam Organik Asal Jember">Bayam Organik Asal Jember</option>
                <option value="Wortel Penyembah Durian">Wortel Penyembah Durian</option>
                <option value="Kangkung Segar Hydro">Kangkung Segar Hydro</option>
                <option value="Sawi Hijau Organik">Sawi Hijau Organik</option>
                <option value="Tomat Merah Super">Tomat Merah Super</option>
              </select>
            </div>

            <div className="flex items-center justify-between gap-4">
              <div className="flex-1 space-y-1.5">
                <div className="flex justify-between items-center">
                  <Label className="text-gray-700 font-semibold">Jumlah</Label>
                  <span className="text-[11px] font-semibold text-red-500">Wajib</span>
                </div>
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    min="1"
                    placeholder="Masukkan jumlah"
                    value={itemQty}
                    onChange={(e) => setItemQty(e.target.value)}
                    className="h-10 rounded-xl border-gray-200 focus:ring-2 focus:ring-[#1B4332]/20"
                  />
                  <span className="text-xs font-medium text-gray-500 shrink-0">Kilogram</span>
                </div>
              </div>

              <button
                type="button"
                onClick={handleAddItemToOrder}
                className="mt-5 h-10 px-4 bg-[#1B4332] hover:bg-[#032e21] text-white rounded-xl font-semibold text-xs transition flex items-center gap-1.5 shrink-0 shadow-xs cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                Tambah Produk
              </button>
            </div>

            {/* Rincian Produk Section (overlay catat pesanan.png) */}
            <div className="pt-4 border-t border-gray-100 space-y-3">
              <h4 className="font-bold text-gray-900 text-xs">Rincian Produk</h4>
              {addedItems.length > 0 ? (
                <div className="space-y-2 bg-gray-50/70 p-3.5 rounded-xl border border-gray-100">
                  {addedItems.map((item, idx) => (
                    <div key={idx} className="flex justify-between items-center py-1 border-b border-gray-100 last:border-0">
                      <div>
                        <p className="font-semibold text-gray-800 text-xs">{item.name}</p>
                        <p className="text-[11px] text-gray-500">Rp 12.500 x {item.qty.replace(/[^\d.]/g, "")}</p>
                      </div>
                      <span className="font-bold text-gray-900 text-xs">{item.price}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-gray-400 italic text-center py-2">Belum ada produk ditambahkan</p>
              )}
            </div>

            <DialogFooter className="pt-4 gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsAddOpen(false)}
                className="h-10 px-5 rounded-xl font-semibold text-xs cursor-pointer"
              >
                Batal
              </Button>
              <Button
                type="submit"
                className="h-10 px-6 bg-[#1B4332] hover:bg-[#032e21] text-white rounded-xl font-semibold text-xs cursor-pointer shadow-xs"
              >
                Simpan Pesanan
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* ── Modal Detail Pesanan (overlay detail pesanan status ... png) ── */}
      {selectedOrder && (
        <Dialog open={!!selectedOrder} onOpenChange={(open) => !open && setSelectedOrder(null)}>
          <DialogContent className="sm:max-w-md bg-white rounded-2xl p-6 shadow-2xl border border-emerald-300 ring-1 ring-black/5">
            <DialogHeader className="pb-3 border-b border-gray-100 flex items-center justify-between">
              <DialogTitle className="text-base font-bold text-gray-900">Detail Pesanan</DialogTitle>
            </DialogHeader>

            <div className="py-2 space-y-4 text-xs">
              {/* Section 1: Informasi Pesanan */}
              <div className="space-y-2">
                <h4 className="font-bold text-gray-900 text-xs">Informasi Pesanan</h4>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400 font-medium">ID Pesanan</span>
                    <span className="font-bold text-gray-900">#TR-KSD234DFGI</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400 font-medium">Tanggal Pesanan</span>
                    <span className="font-bold text-gray-900">Senin, 20 April 2026</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400 font-medium">Customer</span>
                    <span className="font-bold text-gray-900">{selectedOrder.customer}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400 font-medium">Nomor Telepon</span>
                    <span className="font-bold text-gray-900">Transfer Virtual Account BCA</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400 font-medium">Status Pesanan</span>
                    <span className={`font-bold text-xs ${
                      selectedOrder.status === "Menunggu" ? "text-red-500" :
                      selectedOrder.status === "Disiapkan" ? "text-[#22c55e]" :
                      selectedOrder.status === "Sedang Dikirim" || selectedOrder.status === "Siap Diambil" ? "text-blue-500" :
                      "text-emerald-500"
                    }`}>
                      {selectedOrder.status === "Menunggu" ? "Menunggu Konfirmasi" :
                       selectedOrder.status === "Disiapkan" ? "Diproses" :
                       selectedOrder.status === "Sedang Dikirim" ? "Dikirim" :
                       selectedOrder.status === "Siap Diambil" ? "Siap Diambil" :
                       "Selesai"}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400 font-medium">Jenis Pesanan</span>
                    <span className="font-bold text-gray-900">Online</span>
                  </div>
                </div>
              </div>

              {/* Section 2: Alamat Pengiriman */}
              <div className="pt-3 border-t border-gray-100 space-y-1.5">
                <h4 className="font-bold text-gray-900 text-xs">Alamat Pengiriman</h4>
                <p className="font-bold text-gray-900 text-xs">
                  {selectedOrder.customer} (+62) 851 1234 1234
                </p>
                <p className="text-gray-400 text-[11px] leading-relaxed">
                  {selectedOrder.alamat || "Jalan Buah Batu Nomor 128, Kost Buah Batu Kaya, Lantai 2, Kamar 205, Desa Anjing Besar, Kecamatan Lengkong, Kota Bandung, Jawa Barat 40264"}
                </p>
              </div>

              {/* Section 3: Produk (3 item) */}
              <div className="pt-3 border-t border-gray-100 space-y-3">
                <h4 className="font-bold text-gray-900 text-xs">
                  Produk ({selectedOrder.items?.length || 3} item)
                </h4>
                <div className="space-y-3">
                  {(selectedOrder.items || [
                    { name: "Bayam Organik Asal Jember", qty: "2 kg", price: "Rp25.000" },
                    { name: "Wortel Penyembah Durian", qty: "2 kg", price: "Rp30.000" },
                    { name: "Bayam Palsu Asal Ngawi", qty: "1 kg", price: "Rp15.000" },
                  ]).map((item, idx) => (
                    <div key={idx} className="space-y-0.5">
                      <p className="text-gray-400 font-medium text-xs">{item.name}</p>
                      <div className="flex justify-between items-center text-xs font-bold text-gray-900">
                        <span>Rp12.500 x {item.qty.replace(/[^\d.]/g, "") || "2"}</span>
                        <span>{item.price}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action transitions at bottom (triggers popup confirmation dialogs) */}
              <div className="pt-3 border-t border-gray-100 flex gap-2">
                {selectedOrder.status === "Menunggu" && (
                  <>
                    <Button
                      onClick={() => setConfirmTolakOrder(selectedOrder)}
                      className="flex-1 h-9 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-semibold cursor-pointer shadow-xs"
                    >
                      Tolak Pesanan
                    </Button>
                    <Button
                      onClick={() => setConfirmTerimaOrder(selectedOrder)}
                      className="flex-1 h-9 bg-[#1B4332] hover:bg-[#032e21] text-white rounded-xl text-xs font-semibold cursor-pointer shadow-xs"
                    >
                      Terima Pesanan
                    </Button>
                  </>
                )}
                {selectedOrder.status === "Disiapkan" && (
                  <Button
                    onClick={() => setConfirmKirimOrder(selectedOrder)}
                    className="flex-1 h-9 bg-[#1B4332] hover:bg-[#032e21] text-white rounded-xl text-xs font-semibold cursor-pointer shadow-xs"
                  >
                    Kirim Produk
                  </Button>
                )}
                {(selectedOrder.status === "Sedang Dikirim" || selectedOrder.status === "Siap Diambil") && (
                  <Button
                    onClick={() => setConfirmSelesaiOrder(selectedOrder)}
                    className="flex-1 h-9 bg-[#1B4332] hover:bg-[#032e21] text-white rounded-xl text-xs font-semibold cursor-pointer shadow-xs"
                  >
                    Konfirmasi Selesai
                  </Button>
                )}
              </div>
            </div>

            <DialogFooter className="pt-3">
              <Button
                onClick={() => setSelectedOrder(null)}
                className="w-full bg-[#1B4332] hover:bg-[#032e21] text-white rounded-xl h-10 text-sm font-semibold cursor-pointer shadow-sm"
              >
                Tutup
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* ── Dialog Popup Konfirmasi Terima Pesanan (dialog menu terima pesanan.png) ── */}
      {confirmTerimaOrder && (
        <Dialog open={!!confirmTerimaOrder} onOpenChange={(open) => !open && setConfirmTerimaOrder(null)}>
          <DialogContent className="sm:max-w-xs bg-white rounded-2xl p-6 shadow-2xl border border-gray-100 text-center">
            <div className="w-14 h-14 rounded-full bg-emerald-100/70 border border-emerald-300 text-[#1B4332] flex items-center justify-center mx-auto mb-3">
              <Package className="w-7 h-7" />
            </div>

            <DialogTitle className="text-base font-bold text-gray-900 text-center">
              Terima Pesanan?
            </DialogTitle>
            <p className="text-xs text-gray-500 text-center mt-1 leading-relaxed">
              Pilih <span className="font-bold text-gray-800">Terima</span> untuk menerima pesanan dan mulai siapkan produk
            </p>

            <div className="flex items-center gap-3 pt-5">
              <Button
                variant="secondary"
                onClick={() => setConfirmTerimaOrder(null)}
                className="flex-1 h-10 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold text-xs rounded-xl"
              >
                Batal
              </Button>
              <Button
                onClick={() => {
                  updateOrderStatus(confirmTerimaOrder.id, "Disiapkan");
                  setConfirmTerimaOrder(null);
                }}
                className="flex-1 h-10 bg-[#1B4332] hover:bg-[#032e21] text-white font-semibold text-xs rounded-xl shadow-xs"
              >
                Terima
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* ── Dialog Popup Konfirmasi Tolak Pesanan (dialog menu tolak pesanan.png) ── */}
      {confirmTolakOrder && (
        <Dialog open={!!confirmTolakOrder} onOpenChange={(open) => !open && setConfirmTolakOrder(null)}>
          <DialogContent className="sm:max-w-xs bg-white rounded-2xl p-6 shadow-2xl border border-gray-100 text-center">
            <div className="w-14 h-14 rounded-full bg-red-100/80 border border-red-300 text-red-600 flex items-center justify-center mx-auto mb-3">
              <XCircle className="w-8 h-8" />
            </div>

            <DialogTitle className="text-base font-bold text-gray-900 text-center">
              Tolak Pesanan?
            </DialogTitle>
            <p className="text-xs text-gray-500 text-center mt-1 leading-relaxed">
              Pesanan akan ditolak dan pembayaran akan dikembalikan kepada pembeli
            </p>

            <div className="space-y-1.5 text-left pt-3">
              <div className="flex justify-between items-center">
                <Label className="text-xs font-semibold text-gray-700">Alasan Penolakan</Label>
                <span className="text-[11px] font-semibold text-red-500">Wajib</span>
              </div>
              <select
                value={alasanTolak}
                onChange={(e) => setAlasanTolak(e.target.value)}
                className="w-full h-10 bg-white border border-gray-200 rounded-xl pl-3 pr-8 text-xs font-medium text-gray-800 outline-none focus:ring-2 focus:ring-red-500/20"
              >
                <option value="Stok Habis">Stok Habis</option>
                <option value="Toko Tutup">Toko Tutup</option>
                <option value="Alamat Tidak Terjangkau">Alamat Tidak Terjangkau</option>
              </select>
            </div>

            <div className="flex items-center gap-3 pt-4">
              <Button
                variant="secondary"
                onClick={() => setConfirmTolakOrder(null)}
                className="flex-1 h-10 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold text-xs rounded-xl"
              >
                Batal
              </Button>
              <Button
                onClick={() => {
                  toast.error(`Pesanan ${confirmTolakOrder.id} ditolak!`);
                  setOrders((prev) => prev.filter((o) => o.id !== confirmTolakOrder.id));
                  setConfirmTolakOrder(null);
                  setSelectedOrder(null);
                }}
                className="flex-1 h-10 bg-red-600 hover:bg-red-700 text-white font-semibold text-xs rounded-xl shadow-xs"
              >
                Tolak Pesanan
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* ── Dialog Popup Konfirmasi Kirim Produk (dialog menu kirim produk.png) ── */}
      {confirmKirimOrder && (
        <Dialog open={!!confirmKirimOrder} onOpenChange={(open) => !open && setConfirmKirimOrder(null)}>
          <DialogContent className="sm:max-w-xs bg-white rounded-2xl p-6 shadow-2xl border border-gray-100 text-center">
            <div className="w-14 h-14 rounded-full bg-emerald-100/70 border border-emerald-300 text-[#1B4332] flex items-center justify-center mx-auto mb-3">
              <Truck className="w-7 h-7" />
            </div>

            <DialogTitle className="text-base font-bold text-gray-900 text-center">
              Kirim Produk?
            </DialogTitle>
            <p className="text-xs text-gray-500 text-center mt-1 leading-relaxed">
              Pilih <span className="font-bold text-gray-800">Kirim</span> jika produk sudah siap dikirim
            </p>

            <div className="flex items-center gap-3 pt-5">
              <Button
                variant="secondary"
                onClick={() => setConfirmKirimOrder(null)}
                className="flex-1 h-10 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold text-xs rounded-xl"
              >
                Batal
              </Button>
              <Button
                onClick={() => {
                  updateOrderStatus(confirmKirimOrder.id, "Sedang Dikirim");
                  setConfirmKirimOrder(null);
                }}
                className="flex-1 h-10 bg-[#1B4332] hover:bg-[#032e21] text-white font-semibold text-xs rounded-xl shadow-xs"
              >
                Kirim
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* ── Dialog Popup Konfirmasi Pesanan Terkirim / Selesai (dialog menu produk diterima.png) ── */}
      {confirmSelesaiOrder && (
        <Dialog open={!!confirmSelesaiOrder} onOpenChange={(open) => !open && setConfirmSelesaiOrder(null)}>
          <DialogContent className="sm:max-w-xs bg-white rounded-2xl p-6 shadow-2xl border border-gray-100 text-center">
            <div className="w-14 h-14 rounded-full bg-emerald-100/70 border border-emerald-300 text-[#1B4332] flex items-center justify-center mx-auto mb-3">
              <CheckCircle2 className="w-7 h-7" />
            </div>

            <DialogTitle className="text-base font-bold text-gray-900 text-center">
              Konfirmasi Pesanan Terkirim?
            </DialogTitle>
            <p className="text-xs text-gray-500 text-center mt-1 leading-relaxed">
              Pilih <span className="font-bold text-gray-800">Konfirmasi</span> jika pesanan sudah diterima pelanggan
            </p>

            <div className="flex items-center gap-3 pt-5">
              <Button
                variant="secondary"
                onClick={() => setConfirmSelesaiOrder(null)}
                className="flex-1 h-10 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold text-xs rounded-xl"
              >
                Batal
              </Button>
              <Button
                onClick={() => {
                  updateOrderStatus(confirmSelesaiOrder.id, "Selesai");
                  setConfirmSelesaiOrder(null);
                }}
                className="flex-1 h-10 bg-[#1B4332] hover:bg-[#032e21] text-white font-semibold text-xs rounded-xl shadow-xs"
              >
                Konfirmasi
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
