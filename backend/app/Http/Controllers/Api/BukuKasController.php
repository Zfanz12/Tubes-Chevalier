<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\BukuKas;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class BukuKasController extends Controller
{
    /**
     * Get Buku Kas records for the authenticated user.
     */
    public function index(Request $request): JsonResponse
    {
        $user = $request->user();

        $records = BukuKas::where('user_id', $user->id)
            ->orderBy('tanggal', 'desc')
            ->get();

        // Calculate summary
        $totalPemasukan = $records->where('tipe', 'pemasukan')->sum('nominal');
        $totalPengeluaran = $records->where('tipe', 'pengeluaran')->sum('nominal');
        $saldo = $totalPemasukan - $totalPengeluaran;

        return response()->json([
            'summary' => [
                'total_pemasukan' => $totalPemasukan,
                'total_pengeluaran' => $totalPengeluaran,
                'saldo' => $saldo
            ],
            'records' => $records
        ]);
    }

    /**
     * Store a manual entry in Buku Kas (UMKM or Petani manual cash tracking).
     */
    public function store(Request $request): JsonResponse
    {
        $user = $request->user();

        $validator = Validator::make($request->all(), [
            'tipe' => 'required|in:pemasukan,pengeluaran',
            'nominal' => 'required|numeric|min:0.01',
            'keterangan' => 'required|string|max:255',
            'tanggal' => 'nullable|date',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validasi gagal',
                'errors' => $validator->errors()
            ], 422);
        }

        $record = BukuKas::create([
            'user_id' => $user->id,
            'tipe' => $request->tipe,
            'nominal' => $request->nominal,
            'keterangan' => $request->keterangan,
            'tanggal' => $request->tanggal ? $request->tanggal : now(),
        ]);

        return response()->json([
            'message' => 'Catatan kas berhasil ditambahkan',
            'data' => $record
        ], 201);
    }
}
