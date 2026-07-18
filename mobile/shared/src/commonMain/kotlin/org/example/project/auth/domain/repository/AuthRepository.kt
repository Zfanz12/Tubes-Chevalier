package org.example.project.auth.domain.repository

import org.example.project.auth.domain.model.AuthSession

interface AuthRepository {
    suspend fun register(
        name: String,
        email: String,
        password: String,
        passwordConfirmation: String
    ): Result<AuthSession>

    suspend fun login(email: String, password: String): Result<AuthSession>

    suspend fun logout(): Result<Unit>

    fun isLoggedIn(): Boolean
}