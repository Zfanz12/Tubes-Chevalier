package org.example.project.auth.data.repository

import io.ktor.client.plugins.ClientRequestException
import io.ktor.client.plugins.ServerResponseException
import io.ktor.utils.io.errors.IOException
import org.example.project.auth.data.dto.LoginRequestDto
import org.example.project.auth.data.dto.RegisterRequestDto
import org.example.project.auth.data.dto.SendOtpRequestDto
import org.example.project.auth.data.remote.AuthApiService
import org.example.project.auth.domain.model.AuthSession
import org.example.project.auth.domain.model.AuthUser
import org.example.project.auth.domain.repository.AuthRepository
import org.example.project.core.network.AppError
import org.example.project.core.storage.SessionStorage

class AuthRepositoryImpl(private val api: AuthApiService) : AuthRepository {

    override suspend fun register(name: String, noHp: String, role: String): Result<Unit> = runCatching {
        api.register(RegisterRequestDto(name, noHp, role))
        // NOTE: TIDAK ada SessionStorage.saveToken() di sini -- response register tidak
        // berisi token. User harus lanjut ke step requestOtp() + login() setelah ini.
        Unit
    }.mapNetworkError()

    override suspend fun requestOtp(noHp: String): Result<Unit> = runCatching {
        api.sendOtp(SendOtpRequestDto(noHp))
        Unit
    }.mapNetworkError()

    override suspend fun login(noHp: String, otpCode: String): Result<AuthSession> = runCatching {
        val dto = api.login(LoginRequestDto(noHp, otpCode))
        val token = dto.token ?: throw AppError.Unknown(dto.message)
        val user = dto.user ?: throw AppError.Unknown("Data user tidak ditemukan pada response login")

        AuthSession(
            user = AuthUser(user.id, user.name, user.noHp, user.role),
            accessToken = token,
            tokenType = "Bearer"
        ).also { SessionStorage.saveToken(it.accessToken) }
    }.mapNetworkError()

    override suspend fun logout(): Result<Unit> {
        return try {
            // Panggil endpoint backend POST /api/logout dengan header Authorization: Bearer <token>
            api.logout()
            SessionStorage.clearToken()
            Result.success(Unit)
        } catch (e: Exception) {
            // Tetap bersihkan token di device meskipun koneksi gagal agar user tidak tertahan
            SessionStorage.clearToken()
            Result.success(Unit)
        }
    }

    override fun isLoggedIn(): Boolean = SessionStorage.getToken() != null

    private fun <T> Result<T>.mapNetworkError(): Result<T> = recoverCatching { throwable ->
        throw when (throwable) {
            is AppError -> throwable
            is ClientRequestException -> AppError.Unknown(throwable.message ?: "Permintaan gagal")
            is ServerResponseException -> AppError.Server(throwable.response.status.value, "Server bermasalah")
            is IOException -> AppError.Network("Tidak dapat terhubung ke server")
            else -> AppError.Unknown(throwable.message ?: "Terjadi kesalahan tidak dikenal")
        }
    }
}