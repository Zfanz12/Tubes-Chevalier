package org.example.project.order.data.remote

import io.ktor.client.HttpClient
import io.ktor.client.call.body
import io.ktor.client.request.get
import io.ktor.client.request.post
import io.ktor.client.request.setBody
import io.ktor.client.statement.HttpResponse
import io.ktor.http.isSuccess
import org.example.project.auth.data.dto.ApiErrorResponseDto
import org.example.project.core.network.ApiConfig
import org.example.project.core.network.AppError
import org.example.project.order.data.dto.OrderActionResponseDto
import org.example.project.order.data.dto.RateTransaksiRequestDto
import org.example.project.order.data.dto.TransaksiDto

class OrderApiService(private val client: HttpClient) {

    // Terkonfirmasi dari routes/api.php: Route::get('/transaksi', [TransaksiController::class, 'index'])
    // di dalam grup middleware('auth:sanctum'). Untuk user berrole 'umkm', controller me-load
    // relasi ['petani', 'items.produk'] dan mengembalikan SEMUA transaksi milik user yang login
    // (tanpa filter status/pagination di server) -- filter per-tab ("Belum Bayar", "Diproses", dst)
    // dikerjakan di OrderRepositoryImpl secara client-side, sama seperti pola SearchRepositoryImpl.
    suspend fun getTransaksi(): List<TransaksiDto> {
        val response = client.get("${ApiConfig.BASE_URL}/transaksi")
        return handle(response)
    }

    // Terkonfirmasi dari routes/api.php: Route::post('/transaksi/{id}/rate', ...).
    // Hanya untuk role UMKM (lihat TransaksiController@rateTransaksi), dan backend menolak (422)
    // kalau status_pesanan transaksi belum 'completed'.
    suspend fun rateTransaksi(id: Long, rating: Int): OrderActionResponseDto {
        val response = client.post("${ApiConfig.BASE_URL}/transaksi/$id/rate") {
            setBody(RateTransaksiRequestDto(rating = rating))
        }
        return handle(response)
    }

    private suspend inline fun <reified T> handle(response: HttpResponse): T {
        if (response.status.isSuccess()) return response.body()

        val error: ApiErrorResponseDto = runCatching { response.body<ApiErrorResponseDto>() }
            .getOrDefault(ApiErrorResponseDto(message = "Terjadi kesalahan"))

        throw when (response.status.value) {
            401 -> AppError.Unauthorized(error.message ?: "Sesi berakhir, silakan login ulang")
            403 -> AppError.Unauthorized(error.message ?: "Anda tidak punya akses untuk aksi ini")
            422 -> AppError.Validation(error.errors.orEmpty(), error.message ?: "Validasi gagal")
            in 500..599 -> AppError.Server(response.status.value, error.message ?: "Server bermasalah")
            else -> AppError.Unknown(error.message ?: "Terjadi kesalahan")
        }
    }
}