package org.example.project.auth.domain.repository

import org.example.project.auth.domain.model.AuthSession

interface AuthRepository {
    // MVP passwordless: register hanya butuh name + no_hp + role. Tidak mengembalikan
    // token/session -- alur baru: register -> kirim OTP -> login pakai OTP.
    suspend fun register(name: String, noHp: String, role: String): Result<Unit>

    // Step 1 dari login: minta backend kirim kode OTP ke WhatsApp nomor ini
    suspend fun requestOtp(noHp: String): Result<Unit>

    // Login pakai no_hp + otp_code (6 digit), BUKAN email + password
    suspend fun login(noHp: String, otpCode: String): Result<AuthSession>

    suspend fun logout(): Result<Unit>

    fun isLoggedIn(): Boolean
}