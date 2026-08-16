package org.example.project.auth.domain.usecase

import org.example.project.auth.domain.model.AuthSession
import org.example.project.auth.domain.repository.AuthRepository

class LoginUseCase(private val repository: AuthRepository) {
    suspend operator fun invoke(noHp: String, otpCode: String): Result<AuthSession> {
        if (noHp.isBlank() || otpCode.isBlank()) {
            return Result.failure(IllegalArgumentException("Nomor WhatsApp dan kode OTP wajib diisi"))
        }
        return repository.login(noHp, otpCode)
    }
}