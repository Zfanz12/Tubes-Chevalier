package org.example.project.auth.domain.usecase

import org.example.project.auth.domain.model.AuthSession
import org.example.project.auth.domain.repository.AuthRepository

class RegisterUseCase(private val repository: AuthRepository) {
    suspend operator fun invoke(
        name: String,
        email: String,
        password: String,
        passwordConfirmation: String
    ): Result<AuthSession> {
        if (name.isBlank() || email.isBlank() || password.isBlank()) {
            return Result.failure(IllegalArgumentException("Semua kolom wajib diisi"))
        }
        if (password != passwordConfirmation) {
            return Result.failure(IllegalArgumentException("Konfirmasi password tidak sama"))
        }
        return repository.register(name, email, password, passwordConfirmation)
    }
}