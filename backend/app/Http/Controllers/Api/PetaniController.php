<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Petani;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class PetaniController extends Controller
{
    /**
     * Get list of farmers with their products and calculated distance if GPS is provided.
     * If no GPS is provided, display all farmers.
     * Radius limit: 10 km (Must Have US-02, US-21).
     */
    public function index(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'latitude' => 'nullable|numeric|between:-90,90',
            'longitude' => 'nullable|numeric|between:-180,180',
            'radius' => 'nullable|numeric|min:0', // default to 10 if coordinates are passed
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validasi parameter lokasi gagal',
                'errors' => $validator->errors()
            ], 422);
        }

        $userLat = $request->latitude;
        $userLng = $request->longitude;
        $radiusLimit = $request->radius ?? 10; // Default 10 km radius filter

        $petanis = Petani::with(['produks', 'user'])->get();

        $formatted = $petanis->map(function ($petani) use ($userLat, $userLng) {
            $produkList = $petani->produks;
            $produk = $produkList->first();

            // Calculate distance if both user coords and farmer coords are available
            $distance = null;
            $distanceStr = $petani->radius; // fallback to static DB string

            $farmerUser = $petani->user;
            if ($userLat !== null && $userLng !== null && $farmerUser && $farmerUser->latitude !== null && $farmerUser->longitude !== null) {
                $distance = $this->calculateHaversineDistance(
                    $userLat,
                    $userLng,
                    $farmerUser->latitude,
                    $farmerUser->longitude
                );
                $distanceStr = round($distance, 1) . ' km';
            }

            return [
                'id' => $petani->id,
                'nama' => $petani->nama,
                'rekening' => $petani->rekening,
                'qris_image' => $petani->qris_image,
                'komoditas' => $produk ? $produk->nama_barang : 'Tidak ada komoditas',
                'stok' => $produk ? (float) $produk->stok : 0,
                'harga' => $produk ? (float) $produk->harga : 0,
                'radius' => $distanceStr,
                'distance_val' => $distance, // float value in km for filtering/sorting
                'rating' => (float) $petani->rating,
                'logistik' => $petani->logistik,
                'produks' => $produkList,
            ];
        });

        // If coordinates were provided, filter by radius (< 10 km) and sort by nearest
        if ($userLat !== null && $userLng !== null) {
            $formatted = $formatted->filter(function ($item) use ($radiusLimit) {
                // If farmer doesn't have coordinates, we keep it as fallback (or exclude, but here we exclude if it exceeds limit)
                return $item['distance_val'] === null || $item['distance_val'] <= $radiusLimit;
            })->sortBy('distance_val')->values();
        }

        return response()->json($formatted);
    }

    /**
     * Update farmer profile info (bank account, QRIS image, location etc.)
     */
    public function updateProfile(Request $request): JsonResponse
    {
        $user = $request->user();
        if ($user->role !== 'petani') {
            return response()->json(['message' => 'Hanya petani yang dapat memperbarui profil petani'], 403);
        }

        $petani = Petani::where('user_id', $user->id)->first();
        if (!$petani) {
            return response()->json(['message' => 'Profil petani tidak ditemukan'], 404);
        }

        $validator = Validator::make($request->all(), [
            'nama' => 'sometimes|required|string|max:255',
            'rekening' => 'sometimes|required|string|max:255',
            'qris_image' => 'sometimes|required|image|mimes:jpeg,png,jpg|max:2048',
            'logistik' => 'sometimes|required|string|max:255',
            'latitude' => 'sometimes|required|numeric|between:-90,90',
            'longitude' => 'sometimes|required|numeric|between:-180,180',
            'alamat' => 'sometimes|required|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validasi gagal',
                'errors' => $validator->errors()
            ], 422);
        }

        // Update User location if provided
        if ($request->has('latitude') || $request->has('longitude') || $request->has('alamat')) {
            $user->update($request->only(['latitude', 'longitude', 'alamat']));
        }

        // Handle QRIS Image Upload
        if ($request->hasFile('qris_image')) {
            $file = $request->file('qris_image');
            $filename = 'qris_' . $petani->id . '_' . time() . '.' . $file->getClientOriginalExtension();
            $path = $file->storeAs('qris', $filename, 'public');
            $petani->qris_image = '/storage/' . $path;
        }

        // Update Petani Fields
        if ($request->has('nama')) {
            $petani->nama = $request->nama;
        }
        if ($request->has('rekening')) {
            $petani->rekening = $request->rekening;
        }
        if ($request->has('logistik')) {
            $petani->logistik = $request->logistik;
        }

        $petani->save();

        return response()->json([
            'message' => 'Profil petani berhasil diperbarui',
            'data' => $petani->load('user')
        ]);
    }

    /**
     * Haversine formula to calculate distance between two coordinates in kilometers.
     */
    private function calculateHaversineDistance($lat1, $lon1, $lat2, $lon2): float
    {
        $earthRadius = 6371; // Earth's radius in kilometers

        $dLat = deg2rad($lat2 - $lat1);
        $dLon = deg2rad($lon2 - $lon1);

        $a = sin($dLat / 2) * sin($dLat / 2) +
             cos(deg2rad($lat1)) * cos(deg2rad($lat2)) *
             sin($dLon / 2) * sin($dLon / 2);

        $c = 2 * atan2(sqrt($a), sqrt(1 - $a));

        return $earthRadius * $c;
    }
}
