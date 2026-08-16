package org.example.project.cart.domain.repository

import kotlinx.coroutines.flow.StateFlow
import org.example.project.cart.domain.model.CartItem
import org.example.project.cart.domain.model.CheckoutResult
import org.example.project.cart.domain.model.SimilarProduct

interface CartRepository {

    // Sumber kebenaran isi keranjang -- StateFlow supaya semua layar (Home, Search, Keranjang)
    // yang menambah/menampilkan item selalu sinkron secara real-time tanpa perlu refresh manual.
    val cartItems: StateFlow<List<CartItem>>

    fun addItem(
        petaniId: Long,
        petaniName: String,
        produkId: Long,
        productName: String,
        imageUrl: String?,
        price: Double,
        unit: String,
        quantity: Int = 1,
        isAvailable: Boolean = true
    )

    fun updateQuantity(itemId: String, quantity: Int)
    fun removeItem(itemId: String)

    fun setItemSelected(itemId: String, selected: Boolean)
    fun setStoreSelected(petaniId: Long, selected: Boolean)
    fun setAllSelected(selected: Boolean)

    // Grid "Produk Serupa" -- lihat catatan lengkap di SimilarProduct.kt soal data DB vs dummy.
    suspend fun getSimilarProducts(): Result<List<SimilarProduct>>

    // Checkout item terpilih. Satu transaksi backend (POST /transaksi) hanya boleh berisi produk
    // dari SATU petani (lihat TransaksiController@store), jadi item dikelompokkan per toko dan
    // dikirim sebagai beberapa request terpisah -- lihat implementasi di CartRepositoryImpl.
    suspend fun checkout(
        items: List<CartItem>,
        metodePembayaran: String = "qris",
        metodePengiriman: String = "pickup"
    ): Result<List<CheckoutResult>>
}
