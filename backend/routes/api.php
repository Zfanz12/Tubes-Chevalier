<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\PetaniController;
use App\Http\Controllers\Api\ProdukController;
use App\Http\Controllers\Api\TransaksiController;
use App\Http\Controllers\Api\BukuKasController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/

// Public routes
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::get('/petani', [PetaniController::class, 'index']);

// Protected routes
Route::middleware('auth:sanctum')->group(function () {
    // User Profile
    Route::get('/user', function (Request $request) {
        return $request->user();
    });
    Route::post('/logout', [AuthController::class, 'logout']);

    // Petani Profile & Product Management
    Route::post('/petani/profile', [PetaniController::class, 'updateProfile']);
    Route::post('/produk', [ProdukController::class, 'store']);
    Route::put('/produk/{id}', [ProdukController::class, 'update']);
    Route::delete('/produk/{id}', [ProdukController::class, 'destroy']);

    // Transaksi / Orders
    Route::get('/transaksi', [TransaksiController::class, 'index']);
    Route::get('/transaksi/{id}', [TransaksiController::class, 'show']);
    Route::post('/transaksi', [TransaksiController::class, 'store']);
    Route::post('/transaksi/{id}/bukti', [TransaksiController::class, 'uploadBukti']);
    Route::post('/transaksi/{id}/status', [TransaksiController::class, 'updateStatus']);
    Route::post('/transaksi/{id}/validasi', [TransaksiController::class, 'validasiPembayaran']);
    Route::post('/transaksi/{id}/rate', [TransaksiController::class, 'rateTransaksi']);

    // Buku Kas Digital
    Route::get('/buku-kas', [BukuKasController::class, 'index']);
    Route::post('/buku-kas', [BukuKasController::class, 'store']);
});
