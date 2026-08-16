package org.example.project.order.data.mapper

import kotlinx.serialization.json.JsonElement
import kotlinx.serialization.json.jsonPrimitive
import org.example.project.order.data.dto.TransaksiDto
import org.example.project.order.domain.model.Order
import org.example.project.order.domain.model.OrderItem
import org.example.project.order.domain.model.OrderStatus
import org.example.project.order.domain.model.PaymentStatus

// Lihat catatan tipe data di OrderDtos.kt -- kolom decimal dikirim backend sebagai JsonElement
// (bisa string "55000.00" ataupun number tergantung ada/tidaknya cast di masa depan).
// .jsonPrimitive.content mengambil representasi teks mentahnya baik dari JSON string maupun number,
// jadi toDoubleOrNull() di bawah ini aman untuk kedua kasus.
private fun JsonElement.toDoubleSafe(): Double =
    runCatching { jsonPrimitive.content.toDouble() }.getOrDefault(0.0)

fun TransaksiDto.toOrder(): Order = Order(
    id = id,
    kodeTransaksi = kode_transaksi,
    farmerName = petani?.nama ?: "Petani",
    items = items.map { item ->
        OrderItem(
            id = item.id,
            produkId = item.produk_id,
            namaBarang = item.produk?.nama_barang ?: "Produk",
            jumlahKg = item.jumlah.toDoubleSafe(),
            hargaSatuan = item.harga_satuan.toDoubleSafe()
        )
    },
    totalHarga = total_harga.toDoubleSafe(),
    metodePembayaran = metode_pembayaran,
    metodePengiriman = metode_pengiriman,
    status = OrderStatus.fromRaw(status_pesanan),
    paymentStatus = PaymentStatus.fromRaw(status_pembayaran),
    rating = rating,
    createdAt = created_at
)