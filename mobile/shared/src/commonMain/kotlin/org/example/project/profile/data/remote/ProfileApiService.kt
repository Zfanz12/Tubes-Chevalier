package org.example.project.profile.data.remote

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
import org.example.project.profile.data.dto.UpdateAlamatRequestDto
import org.example.project.profile.data.dto.UpdateAlamatResponseDto
import org.example.project.profile.data.dto.UpdateProfileRequestDto
import org.example.project.profile.data.dto.UpdateProfileResponseDto
import org.example.project.profile.data.dto.UserProfileDto

class ProfileApiService(private val client: HttpClient) {

    // Sudah ada di routes/api.php: Route::get('/user', ...) di dalam grup auth:sanctum.
    suspend fun getProfile(): UserProfileDto {
        val response = client.get("${ApiConfig.BASE_URL}/user")
        return handle(response)
    }

    // PERINGATAN: sama seperti catatan di AuthApiService.sendOtp -- endpoint ini BELUM ada di
    // routes/api.php. Yang tersedia sekarang cuma POST /petani/profile (khusus field petani:
    // rekening, qris_image, logistik, latitude, longitude -- lihat PetaniController::updateProfile).
    // Untuk field umum user (name, email, no_hp) perlu route baru di backend, misalnya:
    //   Route::post('/user/profile', [AuthController::class, 'updateProfile']);
    // Panggilan ini akan gagal (404) sampai endpoint tsb ditambahkan.
    suspend fun updateProfile(body: UpdateProfileRequestDto): UpdateProfileResponseDto {
        val response = client.post("${ApiConfig.BASE_URL}/user/profile") { setBody(body) }
        return handle(response)
    }

    // PERINGATAN: endpoint /user/alamat juga BELUM ada di routes/api.php. Perlu ditambahkan:
    //   Route::post('/user/alamat', [AuthController::class, 'updateAlamat']);
    suspend fun updateAlamat(body: UpdateAlamatRequestDto): UpdateAlamatResponseDto {
        val response = client.post("${ApiConfig.BASE_URL}/user/alamat") { setBody(body) }
        return handle(response)
    }

    private suspend inline fun <reified T> handle(response: HttpResponse): T {
        if (response.status.isSuccess()) return response.body()

        val error: ApiErrorResponseDto = runCatching { response.body<ApiErrorResponseDto>() }
            .getOrDefault(ApiErrorResponseDto(message = "Terjadi kesalahan"))

        throw when (response.status.value) {
            422 -> AppError.Validation(error.errors.orEmpty(), error.message ?: "Validasi gagal")
            401 -> AppError.Unauthorized(error.message ?: "Sesi berakhir, silakan masuk kembali")
            404 -> AppError.Unknown(error.message ?: "Endpoint tidak ditemukan (kemungkinan backend belum diupdate)")
            in 500..599 -> AppError.Server(response.status.value, error.message ?: "Server error")
            else -> AppError.Unknown(error.message ?: "Terjadi kesalahan")
        }
    }
}