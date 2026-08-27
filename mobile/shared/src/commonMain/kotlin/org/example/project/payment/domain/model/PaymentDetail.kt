package org.example.project.payment.domain.model

// Mengikuti kolom enum `metode_pembayaran` di migrations/2026_07_25_093403_create_transaksis_table.php:
// ['cod', 'transfer_bank', 'qris']. Dibuat ULANG di sini (bukan reuse dari order/domain/model/Order.kt)
// karena modul payment sengaja berdiri sendiri (lihat PaymentDetail di bawah) dan supaya UI
// pembayaran (QRIS vs transfer vs COD punya tampilan/alur yang beda total, lihat PaymentWaitingScreen)
// bisa exhaustive-when tanpa bergantung ke modul order.
enum class PaymentMethod {
    QRIS, TRANSFER_BANK, COD, UNKNOWN;

    companion object {
        fun fromRaw(raw: String): PaymentMethod = when (raw) {
            "qris" -> QRIS
            "transfer_bank" -> TRANSFER_BANK
            "cod" -> COD
            else -> UNKNOWN
        }
    }
}

// Sama seperti order/domain/model/Order.kt::OrderStatus -- disalin (bukan direuse) supaya modul
// payment tidak punya dependensi ke modul order. Sumber kebenaran tetap kolom `status_pesanan`
// migrations/2026_07_25_093403_create_transaksis_table.php: ['pending','preparing','shipping','completed'].
enum class OrderStatus {
    PENDING, PREPARING, SHIPPING, COMPLETED, UNKNOWN;

    companion object {
        fun fromRaw(raw: String): OrderStatus = when (raw) {
            "pending" -> PENDING
            "preparing" -> PREPARING
            "shipping" -> SHIPPING
            "completed" -> COMPLETED
            else -> UNKNOWN
        }
    }
}

// Kolom `status_pembayaran`: ['unpaid', 'paid'].
enum class PaymentStatus {
    UNPAID, PAID, UNKNOWN;

    companion object {
        fun fromRaw(raw: String): PaymentStatus = when (raw) {
            "unpaid" -> UNPAID
            "paid" -> PAID
            else -> UNKNOWN
        }
    }
}

// Info petani yang relevan untuk layar pembayaran, diambil dari relasi `petani` pada
// GET /transaksi/{id} (TransaksiController@show: ->with(['user','petani','items.produk'])).
// Petani model TIDAK punya $hidden (lihat Models/Petani.php), jadi `rekening` & `qris_image`
// otomatis ikut terkirim tanpa perlu API Resource/transform tambahan di backend.
data class PetaniPaymentInfo(
    val id: Long,
    val nama: String,
    // Nomor rekening tujuan transfer manual, mis. "BCA 123456789". Null kalau petani belum
    // mengisi profilnya lewat POST /petani/profile.
    val rekening: String?,
    // URL ABSOLUT siap pakai (AsyncImage) ke barcode QRIS milik petani -- sudah digabung dengan
    // base server (bukan /api) oleh PaymentMapper.buildMediaUrl, karena backend hanya mengirim
    // path relatif ("/storage/qris/xxxxx.png", lihat PetaniController::updateProfile).
    val qrisImageUrl: String?
)

data class PaymentItem(
    val id: Long,
    val produkId: Long,
    val namaBarang: String,
    val jumlahKg: Double,
    val hargaSatuan: Double
) {
    val subtotal: Double get() = jumlahKg * hargaSatuan
}

// Model utama layar Pembayaran, hasil mapping GET /transaksi/{id} (lihat PaymentMapper.toPaymentDetail).
data class PaymentDetail(
    val id: Long,
    val kodeTransaksi: String,
    val totalHarga: Double,
    val metodePembayaran: PaymentMethod,
    val metodePengiriman: String,
    val status: OrderStatus,
    val paymentStatus: PaymentStatus,
    val items: List<PaymentItem>,
    val petani: PetaniPaymentInfo?,
    // URL absolut ke foto bukti transfer/QRIS yang SUDAH diupload UMKM (null selama belum upload).
    val buktiPembayaranUrl: String?,
    // Epoch millis (UTC) dari `created_at` backend -- dasar hitung mundur 24 jam di PaymentViewModel
    // (lihat DateTimeUtil.PAYMENT_DEADLINE_MILLIS). Null kalau backend tidak mengirim created_at
    // sama sekali (seharusnya tidak terjadi, Transaksi pakai $table->timestamps()).
    val createdAtEpochMillis: Long?
) {
    // Dipakai PaymentWaitingScreen untuk memutuskan tampilkan kartu QRIS/rekening & tombol upload
    // bukti, atau tidak sama sekali. Begitu status_pembayaran sudah 'paid' (divalidasi petani lewat
    // POST /transaksi/{id}/validasi -- di luar scope alur UMKM ini, lihat TransaksiController)
    // ATAU sudah ada bukti_pembayaran ter-upload, halaman menunggu tidak relevan lagi ditampilkan.
    val isWaitingForPayment: Boolean get() = paymentStatus == PaymentStatus.UNPAID && buktiPembayaranUrl == null
}