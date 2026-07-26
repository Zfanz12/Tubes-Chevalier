<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Petani;
use App\Models\Produk;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class ProdukController extends Controller
{
    /**
     * Store a newly created product in storage (Petani only).
     */
    public function store(Request $request): JsonResponse
    {
        $user = $request->user();
        if ($user->role !== 'petani') {
            return response()->json(['message' => 'Hanya petani yang dapat menambahkan produk'], 403);
        }

        $petani = Petani::where('user_id', $user->id)->first();
        if (!$petani) {
            return response()->json(['message' => 'Profil petani tidak ditemukan'], 404);
        }

        $validator = Validator::make($request->all(), [
            'nama_barang' => 'required|string|max:255',
            'stok' => 'required|numeric|min:0',
            'harga' => 'required|numeric|min:0',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validasi gagal',
                'errors' => $validator->errors()
            ], 422);
        }

        $produk = Produk::create([
            'petani_id' => $petani->id,
            'nama_barang' => $request->nama_barang,
            'stok' => $request->stok,
            'harga' => $request->harga,
        ]);

        return response()->json([
            'message' => 'Produk berhasil ditambahkan',
            'data' => $produk
        ], 201);
    }

    /**
     * Update the specified product in storage (Petani only).
     */
    public function update(Request $request, string $id): JsonResponse
    {
        $user = $request->user();
        if ($user->role !== 'petani') {
            return response()->json(['message' => 'Hanya petani yang dapat mengedit produk'], 403);
        }

        $petani = Petani::where('user_id', $user->id)->first();
        if (!$petani) {
            return response()->json(['message' => 'Profil petani tidak ditemukan'], 404);
        }

        $produk = Produk::where('id', $id)->where('petani_id', $petani->id)->first();
        if (!$produk) {
            return response()->json(['message' => 'Produk tidak ditemukan atau bukan milik Anda'], 404);
        }

        $validator = Validator::make($request->all(), [
            'nama_barang' => 'sometimes|required|string|max:255',
            'stok' => 'sometimes|required|numeric|min:0',
            'harga' => 'sometimes|required|numeric|min:0',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validasi gagal',
                'errors' => $validator->errors()
            ], 422);
        }

        $produk->update($request->only(['nama_barang', 'stok', 'harga']));

        return response()->json([
            'message' => 'Produk berhasil diperbarui',
            'data' => $produk
        ]);
    }

    /**
     * Remove the specified product from storage (Petani only).
     */
    public function destroy(Request $request, string $id): JsonResponse
    {
        $user = $request->user();
        if ($user->role !== 'petani') {
            return response()->json(['message' => 'Hanya petani yang dapat menghapus produk'], 403);
        }

        $petani = Petani::where('user_id', $user->id)->first();
        if (!$petani) {
            return response()->json(['message' => 'Profil petani tidak ditemukan'], 404);
        }

        $produk = Produk::where('id', $id)->where('petani_id', $petani->id)->first();
        if (!$produk) {
            return response()->json(['message' => 'Produk tidak ditemukan atau bukan milik Anda'], 404);
        }

        $produk->delete();

        return response()->json([
            'message' => 'Produk berhasil dihapus'
        ]);
    }
}
