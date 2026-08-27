package org.example.project.payment.domain.usecase

import org.example.project.payment.domain.model.PaymentDetail
import org.example.project.payment.domain.repository.PaymentRepository

class GetPaymentDetailUseCase(private val repository: PaymentRepository) {
    suspend operator fun invoke(transaksiId: Long): Result<PaymentDetail> =
        repository.getPaymentDetail(transaksiId)
}

class UploadBuktiPembayaranUseCase(private val repository: PaymentRepository) {
    suspend operator fun invoke(
        transaksiId: Long,
        imageBytes: ByteArray,
        fileName: String,
        mimeType: String
    ): Result<PaymentDetail> {
        // Validasi ringan sisi klien meniru aturan backend (`bukti_pembayaran' => 'required|image|
        // mimes:jpeg,png,jpg|max:2048'` di TransaksiController::uploadBukti) supaya user dapat pesan
        // error cepat tanpa menunggu roundtrip network kalau filenya jelas-jelas tidak valid.
        if (imageBytes.isEmpty()) {
            return Result.failure(IllegalArgumentException("File bukti pembayaran tidak valid"))
        }
        val maxBytes = 2048 * 1024 // 2048 KB, sama seperti max:2048 di validator Laravel (KB)
        if (imageBytes.size > maxBytes) {
            return Result.failure(IllegalArgumentException("Ukuran file maksimal 2 MB"))
        }
        val allowedMimeTypes = setOf("image/jpeg", "image/jpg", "image/png")
        if (mimeType !in allowedMimeTypes) {
            return Result.failure(IllegalArgumentException("Format file harus JPG atau PNG"))
        }
        return repository.uploadBuktiPembayaran(transaksiId, imageBytes, fileName, mimeType)
    }
}