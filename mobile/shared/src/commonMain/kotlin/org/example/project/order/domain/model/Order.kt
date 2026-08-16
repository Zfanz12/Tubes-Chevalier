package org.example.project.order.domain.model

// Mengikuti enum kolom status_pesanan di migrations/migrations/2026_07_25_093403_create_transaksis_table.php:
// ['pending', 'preparing', 'shipping', 'completed']. TIDAK ADA status "dibatalkan"/"cancelled" di backend
// saat ini -- lihat catatan di OrderTab.DIBATALKAN & OrderRepositoryImpl.
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

// Mengikuti enum kolom status_pembayaran: ['unpaid', 'paid'].
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

// Tab filter di Figma (367:4455): Semua / Belum Bayar / Diproses / Dikirim / Selesai / Dibatalkan.
// Pemetaan ke status backend didokumentasikan di OrderRepositoryImpl.
enum class OrderTab(val label: String) {
    SEMUA("Semua"),
    BELUM_BAYAR("Belum Bayar"),
    DIPROSES("Diproses"),
    DIKIRIM("Dikirim"),
    SELESAI("Selesai"),
    DIBATALKAN("Dibatalkan")
}

data class OrderItem(
    val id: Long,
    val produkId: Long,
    val namaBarang: String,
    val jumlahKg: Double,
    val hargaSatuan: Double
) {
    val subtotal: Double get() = jumlahKg * hargaSatuan
}

data class Order(
    val id: Long,
    val kodeTransaksi: String,
    val farmerName: String,
    val items: List<OrderItem>,
    val totalHarga: Double,
    val metodePembayaran: String,
    val metodePengiriman: String,
    val status: OrderStatus,
    val paymentStatus: PaymentStatus,
    val rating: Int?,
    val createdAt: String?
)