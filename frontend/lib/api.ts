const API_BASE_URL = "http://127.0.0.1:8000/api";

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

export interface ApiBukuKas {
  id: number;
  user_id: number;
  transaksi_id?: number | null;
  tipe: "pemasukan" | "pengeluaran";
  nominal: number;
  keterangan: string;
  tanggal: string;
  created_at: string;
}

export interface ApiBukuKasResponse {
  success: boolean;
  summary: {
    total_pemasukan: number;
    total_pengeluaran: number;
    saldo: number;
  };
  data: ApiBukuKas[];
}

export interface ApiMarketPrice {
  id: number;
  nama_komoditas: string;
  harga_rata_rata: number;
  satuan: string;
  tanggal: string;
  created_at: string;
  updated_at: string;
}

export interface ApiMarketPriceResponse {
  success: boolean;
  message: string;
  data: ApiMarketPrice[];
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
  role: "petani" | "umkm" | "admin";
  email?: string;
  latitude?: number;
  longitude?: number;
  alamat?: string;
}

export interface ApiPetani {
  id: number;
  user_id: number;
  nama: string;
  rating: number;
  user?: ApiUser;
  produks?: ApiProduk[];
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
// Produk API helpers
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Ambil daftar produk dari endpoint GET /petani.
 * Mengambil produk milik petani (berdasarkan userId) atau seluruh produk.
 */
export async function getProdukPetani(
  token?: string,
  userId?: number
): Promise<ApiProduk[]> {
  try {
    const petaniList = await apiFetch<any[]>("/petani", { token });
    if (!Array.isArray(petaniList)) return [];

    if (userId) {
      const myPetani = petaniList.find(
        (p) => p.user_id === userId || p.id === userId
      );
      if (myPetani && Array.isArray(myPetani.produks) && myPetani.produks.length > 0) {
        return myPetani.produks;
      }
    }

    const allProduks: ApiProduk[] = [];
    petaniList.forEach((p) => {
      if (Array.isArray(p.produks)) {
        allProduks.push(...p.produks);
      }
    });
    return allProduks;
  } catch (err) {
    console.error("Gagal mengambil data produk via /petani:", err);
    throw err;
  }
}

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
// Buku Kas API helpers
// ─────────────────────────────────────────────────────────────────────────────

export function getBukuKas(token: string): Promise<ApiBukuKasResponse> {
  return apiFetch("/buku-kas", { token });
}

export function createBukuKas(
  token: string,
  body: { tipe: "pemasukan" | "pengeluaran"; nominal: number; keterangan: string; tanggal: string }
): Promise<{ success: boolean; message: string; data: ApiBukuKas }> {
  return apiFetch("/buku-kas", { method: "POST", body, token });
}

// ─────────────────────────────────────────────────────────────────────────────
// Market Prices API helpers
// ─────────────────────────────────────────────────────────────────────────────

export function getMarketPrices(
  token: string,
  params?: { tanggal?: string; nama_komoditas?: string }
): Promise<ApiMarketPriceResponse> {
  const query = params
    ? "?" + new URLSearchParams(params as Record<string, string>).toString()
    : "";
  return apiFetch(`/market-prices${query}`, { token });
}

export function createMarketPrice(
  token: string,
  body: { nama_komoditas: string; harga_rata_rata: number; satuan: string; tanggal: string }
): Promise<{ success: boolean; message: string; data: ApiMarketPrice }> {
  return apiFetch("/market-prices", { method: "POST", body, token });
}

export function deleteMarketPrice(
  token: string,
  id: number
): Promise<{ success: boolean; message: string }> {
  return apiFetch(`/market-prices/${id}`, { method: "DELETE", token });
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
