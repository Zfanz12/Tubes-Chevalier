package org.example.project.core.network

import io.ktor.client.plugins.ClientRequestException
import io.ktor.client.plugins.ServerResponseException
import io.ktor.utils.io.errors.IOException

// AuthRepositoryImpl punya salinan privat serupa (private fun <T> Result<T>.mapNetworkError()) --
// sengaja tidak diubah/dipindah ke sini supaya kode Auth yang sudah ada tidak tersentuh.
// Repository BARU (seperti SearchRepositoryImpl) pakai versi bersama ini saja.
fun <T> Result<T>.mapNetworkError(): Result<T> = recoverCatching { throwable ->
    throw when (throwable) {
        is AppError -> throwable
        is ClientRequestException -> AppError.Unknown(throwable.message ?: "Permintaan gagal")
        is ServerResponseException -> AppError.Server(throwable.response.status.value, "Server bermasalah")
        is IOException -> AppError.Network("Tidak dapat terhubung ke server")
        else -> AppError.Unknown(throwable.message ?: "Terjadi kesalahan tidak dikenal")
    }
}