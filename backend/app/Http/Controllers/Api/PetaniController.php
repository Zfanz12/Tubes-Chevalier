<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Petani;
use Illuminate\Http\JsonResponse;

class PetaniController extends Controller
{
    /**
     * Get list of farmers with their products.
     */
    public function index(): JsonResponse
    {
        $petanis = Petani::with('produks')->get();

        // Transform data format agar sesuai dengan dummy response di Next.js
        $formatted = $petanis->map(function ($petani) {
            // Karena relasi hasMany, asumsikan kita ambil produk pertama untuk mock ini
            // atau return list produk. Tapi jika melihat template Next.js:
            // id, nama, komoditas, stok, harga, radius, rating, logistik
            $produk = $petani->produks->first();

            return [
                'id' => $petani->id,
                'nama' => $petani->nama,
                'komoditas' => $produk ? $produk->nama_barang : 'Tidak ada komoditas',
                'stok' => $produk ? (float) $produk->stok : 0,
                'harga' => $produk ? (float) $produk->harga : 0,
                'radius' => $petani->radius,
                'rating' => (float) $petani->rating,
                'logistik' => $petani->logistik,
            ];
        });

        return response()->json($formatted);
    }
}
