<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;

class AuthController extends Controller
{
    /**
     * Send OTP to WhatsApp (Mocked / logged for testing)
     */
    public function sendOtp(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'no_hp' => 'required|string|min:8|max:15',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validasi gagal',
                'errors' => $validator->errors()
            ], 422);
        }

        $noHp = $request->no_hp;
        
        // Find user by no_hp, if not exists we can optionally create one (or require registration first).
        // Spec US-01: "login menggunakan nomor WhatsApp sehingga saya dapat menggunakan aplikasi dengan mudah tanpa registrasi rumit".
        // Biasanya passwordless login langsung register/login otomatis.
        $user = User::where('no_hp', $noHp)->first();
        
        if (!$user) {
            // Jika user belum terdaftar, kita daftarkan sebagai 'umkm' secara otomatis demi kemudahan login (atau kirim error).
            // Di sini kita daftarkan saja otomatis dengan nama default biar cepet.
            $user = User::create([
                'name' => 'User ' . substr($noHp, -4),
                'no_hp' => $noHp,
                'role' => 'umkm',
            ]);
        }

        // Generate 6 digit OTP
        $otp = strval(rand(100000, 999999));
        
        // Set expirations (5 minutes from now)
        $user->otp_code = $otp;
        $user->otp_expires_at = now()->addMinutes(5);
        $user->save();

        // LOGGING OTP UNTUK TESTING LOKAL (FE & Mobile tinggal cek storage/logs/laravel.log)
        \Illuminate\Support\Facades\Log::info("=== MOCK OTP HARVESTA ===");
        \Illuminate\Support\Facades\Log::info("Kirim OTP ke WA: {$noHp}");
        \Illuminate\Support\Facades\Log::info("OTP Code: {$otp}");
        \Illuminate\Support\Facades\Log::info("=========================");

        // Note: Di production, di sini dimasukkan HTTP request ke gateway WA (seperti Fonnte/Waba)
        // Contoh: Http::post('https://api.fonnte.com/send', [...]);

        return response()->json([
            'message' => 'OTP berhasil dikirim ke WhatsApp',
            'no_hp' => $noHp,
            'otp_preview' => $otp // Tampilkan juga di response body biar testing FE/Mobile gampang tanpa perlu buka log
        ]);
    }

    /**
     * Handle user registration.
     */
    public function register(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'no_hp' => 'required|string|min:8|max:15|unique:users',
            'role' => 'required|in:petani,umkm',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validasi gagal',
                'errors' => $validator->errors()
            ], 422);
        }

        $user = User::create([
            'name' => $request->name,
            'no_hp' => $request->no_hp,
            'role' => $request->role,
        ]);

        // If registering as farmer, initialize the petani profile
        if ($user->role === 'petani') {
            \App\Models\Petani::create([
                'user_id' => $user->id,
                'nama' => $user->name,
                'rating' => 5.0,
            ]);
        }

        // Generate and send OTP for first login
        $otp = strval(rand(100000, 999999));
        $user->otp_code = $otp;
        $user->otp_expires_at = now()->addMinutes(5);
        $user->save();

        \Illuminate\Support\Facades\Log::info("=== MOCK OTP HARVESTA (REGISTRATION) ===");
        \Illuminate\Support\Facades\Log::info("Kirim OTP ke WA: {$user->no_hp}");
        \Illuminate\Support\Facades\Log::info("OTP Code: {$otp}");
        \Illuminate\Support\Facades\Log::info("========================================");

        return response()->json([
            'message' => 'Registrasi berhasil. Silakan verifikasi OTP yang dikirim ke WhatsApp Anda.',
            'user' => $user,
            'otp_preview' => $otp
        ], 201);
    }

    /**
     * Handle user login via OTP.
     */
    public function login(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'no_hp' => 'required|string',
            'otp' => 'required|string|size:6',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validasi gagal',
                'errors' => $validator->errors()
            ], 422);
        }

        $user = User::where('no_hp', $request->no_hp)->first();

        if (!$user) {
            return response()->json([
                'message' => 'Nomor WhatsApp tidak terdaftar'
            ], 404);
        }

        // Validate OTP
        if ($user->otp_code !== $request->otp) {
            return response()->json([
                'message' => 'Kode OTP salah'
            ], 401);
        }

        // Check expiration
        if (now()->greaterThan($user->otp_expires_at)) {
            return response()->json([
                'message' => 'Kode OTP sudah kedaluwarsa. Silakan minta kode baru.'
            ], 401);
        }

        // Clear OTP on successful login
        $user->otp_code = null;
        $user->otp_expires_at = null;
        $user->save();

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'message' => 'Login berhasil',
            'access_token' => $token,
            'token_type' => 'Bearer',
            'user' => $user
        ]);
    }

    /**
     * Handle user logout.
     */
    public function logout(Request $request): JsonResponse
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'message' => 'Logout berhasil'
        ]);
    }
}
