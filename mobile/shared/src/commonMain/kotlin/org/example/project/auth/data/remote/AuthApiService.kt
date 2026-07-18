package org.example.project.auth.data.remote

import io.ktor.client.HttpClient
import io.ktor.client.call.body
import io.ktor.client.request.post
import io.ktor.client.request.setBody
import io.ktor.http.isSuccess
import org.example.project.auth.data.dto.ApiErrorResponseDto
import org.example.project.auth.data.dto.AuthResponseDto
import org.example.project.auth.data.dto.LoginRequestDto
import org.example.project.auth.data.dto.RegisterRequestDto
import org.example.project.core.network.ApiConfig
import org.example.project.core.network.AppError

class AuthApiService(private val client: HttpClient) {

    suspend fun register(body: RegisterRequestDto): AuthResponseDto {
        val response = client.post("${ApiConfig.BASE_URL}/register") { setBody(body) }
        return handle(response)
    }

    suspend fun login(body: LoginRequestDto): AuthResponseDto {
        val response = client.post("${ApiConfig.BASE_URL}/login") { setBody(body) }
        return handle(response)
    }

    suspend fun logout() {
        client.post("${ApiConfig.BASE_URL}/logout")
    }

    private suspend fun handle(response: io.ktor.client.statement.HttpResponse): AuthResponseDto {
        if (response.status.isSuccess()) return response.body()

        val error: ApiErrorResponseDto = runCatching { response.body<ApiErrorResponseDto>() }
            .getOrDefault(ApiErrorResponseDto(message = "Terjadi kesalahan"))

        throw when (response.status.value) {
            422 -> AppError.Validation(error.errors.orEmpty(), error.message ?: "Validasi gagal")
            401 -> AppError.Unauthorized(error.message ?: "Kredensial salah")
            in 500..599 -> AppError.Server(response.status.value, error.message ?: "Server error")
            else -> AppError.Unknown(error.message ?: "Terjadi kesalahan")
        }
    }
}