package org.example.project.home.data.remote

import io.ktor.client.HttpClient
import io.ktor.client.call.body
import io.ktor.client.request.get
import io.ktor.client.statement.HttpResponse
import io.ktor.http.isSuccess
import org.example.project.auth.data.dto.ApiErrorResponseDto
import org.example.project.core.network.ApiConfig
import org.example.project.core.network.AppError
import org.example.project.profile.data.dto.UserProfileDto
import org.example.project.search.data.dto.PetaniDto

// Home tidak punya endpoint khusus di backend, jadi dipenuhi dari 2 endpoint yang sudah nyata
// dan sudah dipakai modul lain:
//   - GET /user   (sama seperti ProfileApiService.getProfile(), grup auth:sanctum)
//   - GET /petani (sama seperti SearchApiService.getPetani(), endpoint public)
// Belum ada endpoint kategori/produk rekomendasi terpisah, sehingga kategori tetap dari
// StaticCategories (lihat HomeRepositoryImpl) dan "produk rekomendasi" diambil dari /petani.

class HomeApiService(private val client: HttpClient) {

    suspend fun getUser(): UserProfileDto {
        val response = client.get("${ApiConfig.BASE_URL}/user")
        return handle(response)
    }

    suspend fun getPetani(): List<PetaniDto> {
        val response = client.get("${ApiConfig.BASE_URL}/petani")
        return handle(response)
    }

    private suspend inline fun <reified T> handle(response: HttpResponse): T {
        if (response.status.isSuccess()) return response.body()

        val error: ApiErrorResponseDto = runCatching { response.body<ApiErrorResponseDto>() }
            .getOrDefault(ApiErrorResponseDto(message = "Terjadi kesalahan"))

        throw when (response.status.value) {
            401 -> AppError.Unauthorized(error.message ?: "Sesi berakhir, silakan masuk kembali")
            422 -> AppError.Validation(error.errors.orEmpty(), error.message ?: "Validasi gagal")
            in 500..599 -> AppError.Server(response.status.value, error.message ?: "Server bermasalah")
            else -> AppError.Unknown(error.message ?: "Terjadi kesalahan")
        }
    }
}