<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Petani;
use App\Models\Produk;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;

class ProdukController extends Controller
{
    /**
     * Store a newly created product in storage (Petani only).
     * Mendukung multipart/form-data untuk upload gambar produk.
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
            'stok'        => 'required|numeric|min:0',
            'harga'       => 'required|numeric|min:0',
            'gambar'      => 'nullable|image|mimes:jpeg,png,jpg,webp|max:2048',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validasi gagal',
                'errors'  => $validator->errors()
            ], 422);
        }

        // Handle gambar upload
        $gambarPath = null;
        if ($request->hasFile('gambar')) {
            $file     = $request->file('gambar');
            $filename = 'produk_' . $petani->id . '_' . time() . '.' . $file->getClientOriginalExtension();
            $path     = $file->storeAs('produk_images', $filename, 'public');
            $gambarPath = '/storage/' . $path;
        }

        $produk = Produk::create([
            'petani_id'   => $petani->id,
            'nama_barang' => $request->nama_barang,
            'stok'        => $request->stok,
            'harga'       => $request->harga,
            'gambar'      => $gambarPath,
        ]);

        return response()->json([
            'message' => 'Produk berhasil ditambahkan',
            'data'    => $produk
        ], 201);
    }

    /**
     * Update the specified product in storage (Petani only).
     * Mendukung multipart/form-data agar gambar bisa diperbarui sekaligus.
     * Karena PHP tidak mendukung PUT multipart, gunakan POST dengan _method=PUT
     * atau gunakan endpoint khusus POST /produk/{id}/gambar.
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
            'stok'        => 'sometimes|required|numeric|min:0',
            'harga'       => 'sometimes|required|numeric|min:0',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validasi gagal',
                'errors'  => $validator->errors()
            ], 422);
        }

        $produk->update($request->only(['nama_barang', 'stok', 'harga']));

        return response()->json([
            'message' => 'Produk berhasil diperbarui',
            'data'    => $produk
        ]);
    }

    /**
     * Upload or replace gambar produk (Petani only).
     * POST /produk/{id}/gambar
     */
    public function uploadGambar(Request $request, string $id): JsonResponse
    {
        $user = $request->user();
        if ($user->role !== 'petani') {
            return response()->json(['message' => 'Hanya petani yang dapat mengunggah gambar produk'], 403);
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
            'gambar' => 'required|image|mimes:jpeg,png,jpg,webp|max:2048',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validasi gagal',
                'errors'  => $validator->errors()
            ], 422);
        }

        // Hapus gambar lama jika ada
        if ($produk->gambar && str_starts_with($produk->gambar, '/storage/')) {
            $oldPath = str_replace('/storage/', '', $produk->gambar);
            Storage::disk('public')->delete($oldPath);
        }

        $file     = $request->file('gambar');
        $filename = 'produk_' . $petani->id . '_' . $id . '_' . time() . '.' . $file->getClientOriginalExtension();
        $path     = $file->storeAs('produk_images', $filename, 'public');

        $produk->update(['gambar' => '/storage/' . $path]);

        return response()->json([
            'message' => 'Gambar produk berhasil diperbarui',
            'data'    => $produk
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

        // Hapus gambar dari storage jika ada
        if ($produk->gambar && str_starts_with($produk->gambar, '/storage/')) {
            $oldPath = str_replace('/storage/', '', $produk->gambar);
            Storage::disk('public')->delete($oldPath);
        }

        $produk->delete();

        return response()->json([
            'message' => 'Produk berhasil dihapus'
        ]);
    }
}
