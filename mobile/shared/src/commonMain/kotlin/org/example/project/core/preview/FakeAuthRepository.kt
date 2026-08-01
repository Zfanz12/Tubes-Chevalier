package org.example.project.core.preview

import kotlinx.coroutines.delay
import org.example.project.auth.domain.model.AuthSession
import org.example.project.auth.domain.model.AuthUser
import org.example.project.auth.domain.repository.AuthRepository

/**
 * Repository palsu KHUSUS untuk @Preview.
 * Selalu sukses tanpa memanggil backend asli, supaya preview Login/Register
 * bisa "melalui" prosesnya walau tanpa server & tanpa input manual.
 */
class FakeAuthRepository : AuthRepository {

    override suspend fun register(
        name: String, email: String, password: String, passwordConfirmation: String
    ): Result<AuthSession> {
        delay(300) // biar animasi loading kelihatan di preview
        return Result.success(
            AuthSession(
                user = AuthUser(id = 1, name = name.ifBlank { "Preview User" }, email = email.ifBlank { "preview@email.com" }),
                accessToken = "dummy-preview-token",
                tokenType = "Bearer"
            )
        )
    }

    override suspend fun login(email: String, password: String): Result<AuthSession> {
        delay(300)
        return Result.success(
            AuthSession(
                user = AuthUser(id = 1, name = "Preview User", email = email.ifBlank { "preview@email.com" }),
                accessToken = "dummy-preview-token",
                tokenType = "Bearer"
            )
        )
    }

    override suspend fun logout(): Result<Unit> {
        delay(100)
        return Result.success(Unit)
    }

    override fun isLoggedIn(): Boolean = true
}