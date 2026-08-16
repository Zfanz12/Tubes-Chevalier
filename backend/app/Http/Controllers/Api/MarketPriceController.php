<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\MarketPrice;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class MarketPriceController extends Controller
{
    /**
     * Get list of market prices (usually for today or historical).
     * Accessible by: Petani, UMKM, Admin.
     */
    public function index(Request $request)
    {
        $request->validate([
            'tanggal' => 'nullable|date',
            'nama_komoditas' => 'nullable|string',
        ]);

        $query = MarketPrice::query();

        // Default ke hari ini jika tidak dispesifikasikan, 
        // tapi jika ingin melihat semua data historical juga diperbolehkan.
        if ($request->has('tanggal')) {
            $query->whereDate('tanggal', $request->tanggal);
        } else {
            // default ke hari ini
            $query->whereDate('tanggal', today());
        }

        if ($request->has('nama_komoditas')) {
            $query->where('nama_komoditas', 'like', '%' . $request->nama_komoditas . '%');
        }

        $marketPrices = $query->orderBy('nama_komoditas', 'asc')->get();

        return response()->json([
            'success' => true,
            'message' => 'Daftar harga pasar harian berhasil diambil',
            'data' => $marketPrices
        ]);
    }

    /**
     * Store or update a market price.
     * Accessible by: Admin only.
     */
    public function store(Request $request)
    {
        // Pastikan hanya user dengan role 'admin' yang bisa mengakses
        if ($request->user()->role !== 'admin') {
            return response()->json([
                'success' => false,
                'message' => 'Akses ditolak. Hanya Admin yang dapat menginput harga pasar harian.'
            ], 403);
        }

        $validator = Validator::make($request->all(), [
            'nama_komoditas' => 'required|string',
            'harga_rata_rata' => 'required|numeric|min:0',
            'satuan' => 'nullable|string',
            'tanggal' => 'required|date',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validasi gagal',
                'errors' => $validator->errors()
            ], 422);
        }

        // Simpan atau update jika sudah ada untuk hari & komoditas yang sama
        $marketPrice = MarketPrice::updateOrCreate(
            [
                'nama_komoditas' => $request->nama_komoditas,
                'tanggal' => $request->tanggal,
            ],
            [
                'harga_rata_rata' => $request->harga_rata_rata,
                'satuan' => $request->satuan ?? 'kg',
            ]
        );

        return response()->json([
            'success' => true,
            'message' => 'Harga pasar harian berhasil disimpan',
            'data' => $marketPrice
        ], 201);
    }

    /**
     * Delete a market price record.
     * Accessible by: Admin only.
     */
    public function destroy(Request $request, $id)
    {
        if ($request->user()->role !== 'admin') {
            return response()->json([
                'success' => false,
                'message' => 'Akses ditolak. Hanya Admin yang dapat menghapus harga pasar harian.'
            ], 403);
        }

        $marketPrice = MarketPrice::find($id);

        if (!$marketPrice) {
            return response()->json([
                'success' => false,
                'message' => 'Data harga pasar tidak ditemukan'
            ], 404);
        }

        $marketPrice->delete();

        return response()->json([
            'success' => true,
            'message' => 'Harga pasar harian berhasil dihapus'
        ]);
    }
}
