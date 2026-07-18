package org.example.project.auth.domain.usecase

import org.example.project.auth.domain.model.AuthSession
import org.example.project.auth.domain.repository.AuthRepository

class LoginUseCase(private val repository: AuthRepository) {
    suspend operator fun invoke(email: String, password: String): Result<AuthSession> {
        if (email.isBlank() || password.isBlank()) {
            return Result.failure(IllegalArgumentException("Email dan password wajib diisi"))
        }
        return repository.login(email, password)
    }
}