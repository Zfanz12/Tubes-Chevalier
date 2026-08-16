const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api";

type RequestOptions = {
  method?: string;
  body?: unknown;
  token?: string;
};

export async function apiFetch<T>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<T> {
  const { method = "GET", body, token } = options;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    Accept: "application/json",
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_BASE_URL}${endpoint}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  const data = await res.json();

  if (!res.ok) {
    // Lempar error dengan message dari API
    throw data;
  }

  return data as T;
}

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

export interface ApiProduk {
  id: number;
  petani_id: number;
  nama_barang: string;
  stok: number;
  harga: number;
  created_at: string;
  updated_at: string;
}

export interface ApiTransaksiItem {
  id: number;
  transaksi_id: number;
  produk_id: number;
  jumlah: number;
  harga_satuan: number;
  produk?: ApiProduk;
}

export interface ApiUser {
  id: number;
  name: string;
  no_hp: string;
  role: "petani" | "umkm";
}

export interface ApiPetani {
  id: number;
  user_id: number;
  nama: string;
  rating: number;
  user?: ApiUser;
}

export interface ApiTransaksi {
  id: number;
  user_id: number;
  petani_id: number;
  kode_transaksi: string;
  total_harga: number;
  metode_pembayaran: string;
  metode_pengiriman: string;
  status_pesanan: string;
  status_pembayaran: string;
  rating: number | null;
  bukti_pembayaran: string | null;
  created_at: string;
  updated_at: string;
  user?: ApiUser;
  petani?: ApiPetani;
  items?: ApiTransaksiItem[];
}

// ─────────────────────────────────────────────────────────────────────────────
// Produk API helpers (Petani only)
// ─────────────────────────────────────────────────────────────────────────────

export function createProduk(
  token: string,
  body: { nama_barang: string; stok: number; harga: number }
): Promise<{ message: string; data: ApiProduk }> {
  return apiFetch("/produk", { method: "POST", body, token });
}

export function updateProduk(
  token: string,
  id: number,
  body: Partial<{ nama_barang: string; stok: number; harga: number }>
): Promise<{ message: string; data: ApiProduk }> {
  return apiFetch(`/produk/${id}`, { method: "PUT", body, token });
}

export function deleteProduk(
  token: string,
  id: number
): Promise<{ message: string }> {
  return apiFetch(`/produk/${id}`, { method: "DELETE", token });
}

export function getProdukList(token: string): Promise<ApiProduk[]> {
  return apiFetch("/produk", { token });
}

// ─────────────────────────────────────────────────────────────────────────────
// Transaksi API helpers
// ─────────────────────────────────────────────────────────────────────────────

export function getTransaksi(token: string): Promise<ApiTransaksi[]> {
  return apiFetch("/transaksi", { token });
}

export function getTransaksiDetail(
  token: string,
  id: number
): Promise<ApiTransaksi> {
  return apiFetch(`/transaksi/${id}`, { token });
}

// ─────────────────────────────────────────────────────────────────────────────
// Petani API helpers (Public)
// ─────────────────────────────────────────────────────────────────────────────

export function getPetaniList(): Promise<ApiPetani[]> {
  return apiFetch("/petani");
}

// ─────────────────────────────────────────────────────────────────────────────
// Buku Kas / Data Panen (Catatan Keuangan & Panen)
// ─────────────────────────────────────────────────────────────────────────────

export interface ApiBukuKas {
  id: number;
  petani_id: number;
  tipe: "pemasukan" | "pengeluaran";
  jumlah: number;
  keterangan: string;
  tanggal: string;
  created_at: string;
}

export function getBukuKas(token: string): Promise<ApiBukuKas[]> {
  return apiFetch("/buku-kas", { token });
}

export function createBukuKas(
  token: string,
  body: { tipe: "pemasukan" | "pengeluaran"; jumlah: number; 
    keterangan: string; tanggal: string }
): Promise<{ message: string; data: ApiBukuKas }> {
  return apiFetch("/buku-kas", { method: "POST", body, token });
}

// ─────────────────────────────────────────────────────────────────────────────
// Utility: format Rupiah
// ─────────────────────────────────────────────────────────────────────────────

export function formatRupiah(amount: number): string {
  return `Rp ${amount.toLocaleString("id-ID")}`;
}

// Utility: format tanggal dari ISO ke DD/MM/YYYY
export function formatTanggal(isoString: string): string {
  if (!isoString) return "-";
  const d = new Date(isoString);
  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = d.getFullYear();
  return `${day}/${month}/${year}`;
}

// Utility: map status_pesanan backend → label frontend
export function mapStatusPesanan(status: string): string {
  const map: Record<string, string> = {
    pending: "Pending",
    processing: "Disiapkan",
    shipped: "Sedang Dikirim",
    completed: "Selesai",
    cancelled: "Gagal",
  };
  return map[status] ?? status;
}

// Utility: map metode_pembayaran backend → label frontend
export function mapMetodePembayaran(metode: string): string {
  const map: Record<string, string> = {
    cod: "COD",
    transfer_bank: "Transfer Bank",
    qris: "QRIS",
  };
  return map[metode] ?? metode;
}
