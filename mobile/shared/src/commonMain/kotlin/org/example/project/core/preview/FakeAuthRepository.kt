package org.example.project.core.preview

import kotlinx.coroutines.delay
import org.example.project.auth.domain.model.AuthSession
import org.example.project.auth.domain.model.AuthUser
import org.example.project.auth.domain.repository.AuthRepository

class FakeAuthRepository : AuthRepository {

    override suspend fun register(name: String, noHp: String, role: String): Result<Unit> {
        delay(300)
        return Result.success(Unit)
    }

    override suspend fun requestOtp(noHp: String): Result<Unit> {
        delay(300)
        return Result.success(Unit)
    }

    override suspend fun login(noHp: String, otpCode: String): Result<AuthSession> {
        delay(300)
        return Result.success(
            AuthSession(
                user = AuthUser(
                    id = 1,
                    name = "Preview User",
                    noHp = noHp.ifBlank { "081234567890" },
                    role = "umkm"
                ),
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