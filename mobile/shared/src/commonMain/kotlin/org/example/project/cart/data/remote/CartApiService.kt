package org.example.project.cart.data.remote

import io.ktor.client.HttpClient
import io.ktor.client.call.body
import io.ktor.client.request.get
import io.ktor.client.request.post
import io.ktor.client.request.setBody
import io.ktor.client.statement.HttpResponse
import io.ktor.http.isSuccess
import org.example.project.auth.data.dto.ApiErrorResponseDto
import org.example.project.cart.data.dto.CheckoutRequestDto
import org.example.project.cart.data.dto.CheckoutResponseDto
import org.example.project.cart.data.dto.PetaniWithProdukDto
import org.example.project.core.network.ApiConfig
import org.example.project.core.network.AppError

class CartApiService(private val client: HttpClient) {

    // Sama seperti SearchApiService -- endpoint PUBLIC (di luar auth:sanctum), dipakai di sini
    // untuk mengisi "Produk Serupa" dengan katalog produk sungguhan dari database.
    suspend fun getPetani(): List<PetaniWithProdukDto> {
        val response = client.get("${ApiConfig.BASE_URL}/petani")
        return handle(response)
    }

    // Terkonfirmasi ada di routes/api.php (grup auth:sanctum): Route::post('/transaksi', ...).
    // Butuh Bearer token yang sudah otomatis terpasang lewat HttpClientFactory (Auth plugin).
    suspend fun checkout(body: CheckoutRequestDto): CheckoutResponseDto {
        val response = client.post("${ApiConfig.BASE_URL}/transaksi") { setBody(body) }
        return handle(response)
    }

    private suspend inline fun <reified T> handle(response: HttpResponse): T {
        if (response.status.isSuccess()) return response.body()

        val error: ApiErrorResponseDto = runCatching { response.body<ApiErrorResponseDto>() }
            .getOrDefault(ApiErrorResponseDto(message = "Terjadi kesalahan"))

        throw when (response.status.value) {
            401 -> AppError.Unauthorized(error.message ?: "Sesi berakhir, silakan masuk kembali")
            403 -> AppError.Unauthorized(error.message ?: "Hanya UMKM yang dapat melakukan checkout")
            422 -> AppError.Validation(error.errors.orEmpty(), error.message ?: "Validasi gagal")
            in 500..599 -> AppError.Server(response.status.value, error.message ?: "Server bermasalah")
            else -> AppError.Unknown(error.message ?: "Terjadi kesalahan")
        }
    }
}
