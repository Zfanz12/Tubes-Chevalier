package org.example.project.auth.data.remote

import io.ktor.client.HttpClient
import io.ktor.client.call.body
import io.ktor.client.request.post
import io.ktor.client.request.setBody
import io.ktor.client.statement.HttpResponse
import io.ktor.http.isSuccess
import org.example.project.auth.data.dto.ApiErrorResponseDto
import org.example.project.auth.data.dto.LoginRequestDto
import org.example.project.auth.data.dto.LoginResponseDto
import org.example.project.auth.data.dto.RegisterRequestDto
import org.example.project.auth.data.dto.RegisterResponseDto
import org.example.project.auth.data.dto.SendOtpRequestDto
import org.example.project.auth.data.dto.SendOtpResponseDto
import org.example.project.core.network.ApiConfig
import org.example.project.core.network.AppError

class AuthApiService(private val client: HttpClient) {

    suspend fun register(body: RegisterRequestDto): RegisterResponseDto {
        val response = client.post("${ApiConfig.BASE_URL}/register") { setBody(body) }
        return handle(response)
    }

    suspend fun sendOtp(body: SendOtpRequestDto): SendOtpResponseDto {
        val response = client.post("${ApiConfig.BASE_URL}/send-otp") { setBody(body) }
        return handle(response)
    }

    // Login sekarang pakai no_hp + otp_code, bukan email + password
    suspend fun login(body: LoginRequestDto): LoginResponseDto {
        val response = client.post("${ApiConfig.BASE_URL}/login") { setBody(body) }
        return handle(response)
    }

    suspend fun logout() {
        client.post("${ApiConfig.BASE_URL}/logout")
    }

    private suspend inline fun <reified T> handle(response: HttpResponse): T {
        if (response.status.isSuccess()) return response.body()

        val error: ApiErrorResponseDto = runCatching { response.body<ApiErrorResponseDto>() }
            .getOrDefault(ApiErrorResponseDto(message = "Terjadi kesalahan"))

        throw when (response.status.value) {
            422 -> AppError.Validation(error.errors.orEmpty(), error.message ?: "Validasi gagal")
            401 -> AppError.Unauthorized(error.message ?: "Kode OTP salah atau kedaluwarsa")
            404 -> AppError.Unknown(error.message ?: "Endpoint tidak ditemukan (kemungkinan backend belum diupdate)")
            in 500..599 -> AppError.Server(response.status.value, error.message ?: "Server error")
            else -> AppError.Unknown(error.message ?: "Terjadi kesalahan")
        }
    }
}