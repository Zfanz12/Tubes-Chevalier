<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\BukuKas;
use App\Models\Petani;
use App\Models\Produk;
use App\Models\Transaksi;
use App\Models\TransaksiItem;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;

class TransaksiController extends Controller
{
    /**
     * Display a listing of user transactions (UMKM or Petani).
     */
    public function index(Request $request): JsonResponse
    {
        $user = $request->user();

        if ($user->role === 'petani') {
            $petani = Petani::where('user_id', $user->id)->first();
            if (!$petani) {
                return response()->json(['message' => 'Profil petani tidak ditemukan'], 404);
            }
            $transaksis = Transaksi::with(['user', 'items.produk'])
                ->where('petani_id', $petani->id)
                ->orderBy('created_at', 'desc')
                ->get();
        } else {
            $transaksis = Transaksi::with(['petani', 'items.produk'])
                ->where('user_id', $user->id)
                ->orderBy('created_at', 'desc')
                ->get();
        }

        return response()->json($transaksis);
    }

    /**
     * Display the specified transaction details.
     */
    public function show(Request $request, string $id): JsonResponse
    {
        $user = $request->user();

        $transaksi = Transaksi::with(['user', 'petani', 'items.produk'])->find($id);

        if (!$transaksi) {
            return response()->json(['message' => 'Transaksi tidak ditemukan'], 404);
        }

        // Authorize
        if ($user->role === 'petani') {
            $petani = Petani::where('user_id', $user->id)->first();
            if (!$petani || $transaksi->petani_id !== $petani->id) {
                return response()->json(['message' => 'Unauthorized'], 403);
            }
        } else {
            if ($transaksi->user_id !== $user->id) {
                return response()->json(['message' => 'Unauthorized'], 403);
            }
        }

        return response()->json($transaksi);
    }

    /**
     * Store a newly created transaction (UMKM checkout - Aturan 3-Klik).
     */
    public function store(Request $request): JsonResponse
    {
        $user = $request->user();
        if ($user->role !== 'umkm') {
            return response()->json(['message' => 'Hanya UMKM yang dapat membuat pesanan'], 403);
        }

        $validator = Validator::make($request->all(), [
            'petani_id' => 'required|exists:petanis,id',
            'metode_pembayaran' => 'required|in:cod,transfer_bank,qris',
            'metode_pengiriman' => 'required|in:pickup,delivery',
            'items' => 'required|array|min:1',
            'items.*.produk_id' => 'required|exists:produks,id',
            'items.*.jumlah' => 'required|numeric|min:0.01',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validasi gagal',
                'errors' => $validator->errors()
            ], 422);
        }

        // Check if items belong to the farmer
        foreach ($request->items as $item) {
            $produk = Produk::find($item['produk_id']);
            if ($produk->petani_id != $request->petani_id) {
                return response()->json([
                    'message' => 'Salah satu produk tidak tersedia di petani yang Anda pilih'
                ], 422);
            }
            if ($produk->stok < $item['jumlah']) {
                return response()->json([
                    'message' => "Stok produk '{$produk->nama_barang}' tidak mencukupi. Tersedia: {$produk->stok} kg"
                ], 422);
            }
        }

        try {
            $transaksi = DB::transaction(function () use ($request, $user) {
                $total_harga = 0;
                $itemsData = [];

                foreach ($request->items as $item) {
                    $produk = Produk::find($item['produk_id']);
                    $subtotal = $produk->harga * $item['jumlah'];
                    $total_harga += $subtotal;

                    // Kurangi stok produk
                    $produk->decrement('stok', $item['jumlah']);

                    $itemsData[] = [
                        'produk_id' => $produk->id,
                        'jumlah' => $item['jumlah'],
                        'harga_satuan' => $produk->harga,
                    ];
                }

                $transaksi = Transaksi::create([
                    'user_id' => $user->id,
                    'petani_id' => $request->petani_id,
                    'kode_transaksi' => 'TRX-' . date('Ymd') . '-' . strtoupper(Str::random(6)),
                    'total_harga' => $total_harga,
                    'metode_pembayaran' => $request->metode_pembayaran,
                    'metode_pengiriman' => $request->metode_pengiriman,
                    'status_pesanan' => 'pending',
                    'status_pembayaran' => 'unpaid',
                ]);

                foreach ($itemsData as $data) {
                    $data['transaksi_id'] = $transaksi->id;
                    TransaksiItem::create($data);
                }

                return $transaksi;
            });

            return response()->json([
                'message' => 'Pesanan berhasil dibuat',
                'data' => $transaksi->load('items.produk')
            ], 201);

        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Terjadi kesalahan saat memproses transaksi',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Upload payment proof (UMKM only).
     */
    public function uploadBukti(Request $request, string $id): JsonResponse
    {
        $user = $request->user();
        if ($user->role !== 'umkm') {
            return response()->json(['message' => 'Hanya UMKM yang dapat mengunggah bukti pembayaran'], 403);
        }

        $transaksi = Transaksi::where('id', $id)->where('user_id', $user->id)->first();
        if (!$transaksi) {
            return response()->json(['message' => 'Transaksi tidak ditemukan'], 404);
        }

        $validator = Validator::make($request->all(), [
            'bukti_pembayaran' => 'required|image|mimes:jpeg,png,jpg|max:2048',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validasi gagal',
                'errors' => $validator->errors()
            ], 422);
        }

        if ($request->hasFile('bukti_pembayaran')) {
            $file = $request->file('bukti_pembayaran');
            $filename = 'bukti_' . $transaksi->kode_transaksi . '_' . time() . '.' . $file->getClientOriginalExtension();
            $path = $file->storeAs('bukti_pembayaran', $filename, 'public');

            $transaksi->update([
                'bukti_pembayaran' => '/storage/' . $path,
            ]);

            return response()->json([
                'message' => 'Bukti pembayaran berhasil diunggah',
                'data' => $transaksi
            ]);
        }

        return response()->json(['message' => 'File tidak ditemukan'], 400);
    }

    /**
     * Update order status (Petani only).
     */
    public function updateStatus(Request $request, string $id): JsonResponse
    {
        $user = $request->user();
        if ($user->role !== 'petani') {
            return response()->json(['message' => 'Hanya petani yang dapat memperbarui status pesanan'], 403);
        }

        $petani = Petani::where('user_id', $user->id)->first();
        if (!$petani) {
            return response()->json(['message' => 'Profil petani tidak ditemukan'], 404);
        }

        $transaksi = Transaksi::where('id', $id)->where('petani_id', $petani->id)->first();
        if (!$transaksi) {
            return response()->json(['message' => 'Transaksi tidak ditemukan'], 404);
        }

        $validator = Validator::make($request->all(), [
            'status_pesanan' => 'required|in:preparing,shipping,completed',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validasi gagal',
                'errors' => $validator->errors()
            ], 422);
        }

        $oldStatus = $transaksi->status_pesanan;
        $newStatus = $request->status_pesanan;

        try {
            DB::transaction(function () use ($transaksi, $newStatus, $oldStatus, $user) {
                $transaksi->update(['status_pesanan' => $newStatus]);

                // Jika diubah ke selesai dan sebelumnya belum selesai
                if ($newStatus === 'completed' && $oldStatus !== 'completed') {
                    // Update status pembayaran juga jika belum dibayar (misal COD)
                    if ($transaksi->status_pembayaran !== 'paid') {
                        $transaksi->update(['status_pembayaran' => 'paid']);
                    }

                    // Trigger Buku Kas Digital Otomatis
                    $this->triggerBukuKas($transaksi);
                }
            });

            return response()->json([
                'message' => 'Status pesanan berhasil diperbarui',
                'data' => $transaksi
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Gagal memperbarui status pesanan',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Validate payment manually and complete transaction (Petani only).
     */
    public function validasiPembayaran(Request $request, string $id): JsonResponse
    {
        $user = $request->user();
        if ($user->role !== 'petani') {
            return response()->json(['message' => 'Hanya petani yang dapat memvalidasi pembayaran'], 403);
        }

        $petani = Petani::where('user_id', $user->id)->first();
        if (!$petani) {
            return response()->json(['message' => 'Profil petani tidak ditemukan'], 404);
        }

        $transaksi = Transaksi::where('id', $id)->where('petani_id', $petani->id)->first();
        if (!$transaksi) {
            return response()->json(['message' => 'Transaksi tidak ditemukan'], 404);
        }

        if ($transaksi->status_pesanan === 'completed') {
            return response()->json(['message' => 'Transaksi ini sudah selesai'], 400);
        }

        try {
            DB::transaction(function () use ($transaksi) {
                // Set status bayar jadi paid dan status pesanan selesai
                $transaksi->update([
                    'status_pembayaran' => 'paid',
                    'status_pesanan' => 'completed'
                ]);

                // Trigger Buku Kas Digital Otomatis
                $this->triggerBukuKas($transaksi);
            });

            return response()->json([
                'message' => 'Pembayaran tervalidasi dan pesanan diselesaikan',
                'data' => $transaksi
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Gagal memvalidasi pembayaran',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Submit rating for transaction (UMKM only).
     */
    public function rateTransaksi(Request $request, string $id): JsonResponse
    {
        $user = $request->user();
        if ($user->role !== 'umkm') {
            return response()->json(['message' => 'Hanya UMKM yang dapat memberikan rating'], 403);
        }

        $transaksi = Transaksi::where('id', $id)->where('user_id', $user->id)->first();
        if (!$transaksi) {
            return response()->json(['message' => 'Transaksi tidak ditemukan'], 404);
        }

        if ($transaksi->status_pesanan !== 'completed') {
            return response()->json(['message' => 'Hanya transaksi selesai yang dapat diberi rating'], 400);
        }

        $validator = Validator::make($request->all(), [
            'rating' => 'required|integer|min:1|max:5',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validasi gagal',
                'errors' => $validator->errors()
            ], 422);
        }

        $transaksi->update(['rating' => $request->rating]);

        // Rekalkulasi rating Petani
        $petani = Petani::find($transaksi->petani_id);
        if ($petani) {
            $avgRating = Transaksi::where('petani_id', $petani->id)
                ->whereNotNull('rating')
                ->avg('rating');
            $petani->update(['rating' => round($avgRating, 2)]);
        }

        return response()->json([
            'message' => 'Terima kasih atas rating Anda',
            'data' => $transaksi
        ]);
    }

    /**
     * Trigger automatic book entries for both buyer and seller.
     */
    private function triggerBukuKas(Transaksi $transaksi): void
    {
        // 1. Catat Pengeluaran untuk Pembeli (UMKM)
        BukuKas::create([
            'user_id' => $transaksi->user_id,
            'transaksi_id' => $transaksi->id,
            'tipe' => 'pengeluaran',
            'nominal' => $transaksi->total_harga,
            'keterangan' => 'Belanja bahan baku: ' . $transaksi->kode_transaksi,
            'tanggal' => now(),
        ]);

        // 2. Catat Pemasukan untuk Penjual (Petani)
        // Dapatkan user_id dari profil petani
        $petani = Petani::find($transaksi->petani_id);
        if ($petani && $petani->user_id) {
            BukuKas::create([
                'user_id' => $petani->user_id,
                'transaksi_id' => $transaksi->id,
                'tipe' => 'pemasukan',
                'nominal' => $transaksi->total_harga,
                'keterangan' => 'Penjualan hasil tani: ' . $transaksi->kode_transaksi,
                'tanggal' => now(),
            ]);
        }
    }
}
