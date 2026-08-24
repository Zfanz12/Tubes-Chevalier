package org.example.project.core.preview

import kotlinx.coroutines.delay
import org.example.project.auth.domain.model.AuthSession
import org.example.project.auth.domain.model.AuthUser
import org.example.project.auth.domain.repository.AuthRepository

/**
 * Dummy authentication untuk Phase A.
 *
 * Tidak memanggil backend.
 * Tidak membutuhkan WhatsApp.
 * Tidak membutuhkan database.
 *
 * Phase B akan menggantikan repository ini dengan
 * AuthRepositoryImpl yang menggunakan API.
 */
class PhaseAFakeAuthRepository : AuthRepository {

    override suspend fun register(
        name: String,
        noHp: String,
        role: String
    ): Result<Unit> {

        delay(300)

        return Result.success(Unit)
    }


    override suspend fun requestOtp(
        noHp: String
    ): Result<Unit> {

        delay(500)

        return Result.success(Unit)
    }


    override suspend fun login(
        noHp: String,
        otpCode: String
    ): Result<AuthSession> {

        delay(500)

        return Result.success(

            AuthSession(

                user = AuthUser(
                    id = 1,
                    name = "Andini Putri",
                    noHp = noHp,
                    role = "umkm"
                ),

                accessToken = "phase-a-dummy-token",

                tokenType = "Bearer"

            )

        )
    }


    override suspend fun logout(): Result<Unit> {

        delay(200)

        return Result.success(Unit)
    }


    override fun isLoggedIn(): Boolean {
        return false
    }
}