package org.example.project.order.data.repository

import org.example.project.core.network.mapNetworkError
import org.example.project.order.data.mapper.toOrder
import org.example.project.order.data.remote.OrderApiService
import org.example.project.order.domain.model.Order
import org.example.project.order.domain.repository.OrderRepository

// Terhubung ke backend Laravel sungguhan lewat OrderApiService (GET /transaksi, POST /transaksi/{id}/rate).
//
// PENTING -- backend TransaksiController@index tidak punya filter status/tab ataupun pagination:
// dia selalu mengembalikan SEMUA transaksi milik user yang login. Karena itu getOrders() mengambil
// seluruh data sekali jalan, dan pemfilteran per-tab (Semua/Belum Bayar/Diproses/Dikirim/Selesai/
// Dibatalkan -- lihat Figma node 367-4455, 382-5023, 382-5424, 472-11758) dikerjakan di
// OrderViewModel secara client-side, sama seperti pola SearchRepositoryImpl untuk fitur search.
//
// Tab "Dibatalkan" akan SELALU kosong: enum status_pesanan di database
// (migrations/migrations/2026_07_25_093403_create_transaksis_table.php) cuma punya
// ['pending', 'preparing', 'shipping', 'completed'] -- tidak ada status pembatalan sama sekali.
// Perlu migration + endpoint baru di backend kalau fitur pembatalan pesanan mau diaktifkan.
class OrderRepositoryImpl(private val api: OrderApiService) : OrderRepository {

    override suspend fun getOrders(): Result<List<Order>> = runCatching {
        api.getTransaksi()
            .map { it.toOrder() }
            .sortedByDescending { it.id }
    }.mapNetworkError()

    override suspend fun rateOrder(orderId: Long, rating: Int): Result<Unit> = runCatching {
        api.rateTransaksi(orderId, rating)
        Unit
    }.mapNetworkError()
}