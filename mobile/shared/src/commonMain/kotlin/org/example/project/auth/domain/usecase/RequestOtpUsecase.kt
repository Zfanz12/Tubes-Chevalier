package org.example.project.auth.domain.usecase

import org.example.project.auth.domain.repository.AuthRepository

class RequestOtpUseCase(private val repository: AuthRepository) {
    suspend operator fun invoke(noHp: String): Result<Unit> {
        if (noHp.isBlank()) return Result.failure(IllegalArgumentException("Nomor WhatsApp wajib diisi"))
        return repository.requestOtp(noHp)
    }
}