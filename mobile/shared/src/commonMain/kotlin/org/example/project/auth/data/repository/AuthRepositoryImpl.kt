package org.example.project.auth.data.repository

import io.ktor.client.plugins.ClientRequestException
import io.ktor.client.plugins.ServerResponseException
import io.ktor.utils.io.errors.IOException
import org.example.project.auth.data.dto.LoginRequestDto
import org.example.project.auth.data.dto.RegisterRequestDto
import org.example.project.auth.data.remote.AuthApiService
import org.example.project.auth.domain.model.AuthSession
import org.example.project.auth.domain.model.AuthUser
import org.example.project.auth.domain.repository.AuthRepository
import org.example.project.core.network.AppError
import org.example.project.core.storage.SessionStorage

class AuthRepositoryImpl(private val api: AuthApiService) : AuthRepository {

    override suspend fun register(
        name: String, email: String, password: String, passwordConfirmation: String
    ): Result<AuthSession> = runCatching {
        val dto = api.register(RegisterRequestDto(name, email, password, passwordConfirmation))
        dto.toDomain().also { SessionStorage.saveToken(it.accessToken) }
    }.mapNetworkError()

    override suspend fun login(email: String, password: String): Result<AuthSession> = runCatching {
        val dto = api.login(LoginRequestDto(email, password))
        dto.toDomain().also { SessionStorage.saveToken(it.accessToken) }
    }.mapNetworkError()

    override suspend fun logout(): Result<Unit> = runCatching {
        api.logout()
        SessionStorage.clearToken()
    }.mapNetworkError()

    override fun isLoggedIn(): Boolean = SessionStorage.getToken() != null

    private fun org.example.project.auth.data.dto.AuthResponseDto.toDomain() = AuthSession(
        user = AuthUser(user.id, user.name, user.email),
        accessToken = accessToken,
        tokenType = tokenType
    )

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