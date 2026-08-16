package org.example.project.search.data.remote

import io.ktor.client.HttpClient
import io.ktor.client.call.body
import io.ktor.client.request.get
import io.ktor.client.statement.HttpResponse
import io.ktor.http.isSuccess
import org.example.project.auth.data.dto.ApiErrorResponseDto
import org.example.project.core.network.ApiConfig
import org.example.project.core.network.AppError
import org.example.project.search.data.dto.PetaniDto

class SearchApiService(private val client: HttpClient) {

    // Terkonfirmasi dari routes/api.php: Route::get('/petani', [PetaniController::class, 'index']);
    // Endpoint ini PUBLIC (di luar grup middleware('auth:sanctum')), jadi tidak butuh Bearer token --
    // tapi tetap aman dikirim lewat HttpClientFactory yang sudah pasang Auth plugin secara default,
    // karena server akan mengabaikan header Authorization yang tidak diminta.
    suspend fun getPetani(): List<PetaniDto> {
        val response = client.get("${ApiConfig.BASE_URL}/petani")
        return handle(response)
    }

    private suspend inline fun <reified T> handle(response: HttpResponse): T {
        if (response.status.isSuccess()) return response.body()

        val error: ApiErrorResponseDto = runCatching { response.body<ApiErrorResponseDto>() }
            .getOrDefault(ApiErrorResponseDto(message = "Terjadi kesalahan"))

        throw when (response.status.value) {
            401 -> AppError.Unauthorized(error.message ?: "Sesi berakhir, silakan login ulang")
            422 -> AppError.Validation(error.errors.orEmpty(), error.message ?: "Validasi gagal")
            in 500..599 -> AppError.Server(response.status.value, error.message ?: "Server bermasalah")
            else -> AppError.Unknown(error.message ?: "Terjadi kesalahan")
        }
    }
}