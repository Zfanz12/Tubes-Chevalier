package org.example.project.core.preview

import kotlinx.coroutines.delay
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import org.example.project.cart.domain.model.CartItem
import org.example.project.cart.domain.model.CheckoutResult
import org.example.project.cart.domain.model.SimilarProduct
import org.example.project.cart.domain.repository.CartRepository

// Dipakai HANYA untuk @Preview (CartScreenPreview) supaya bisa dijalankan tanpa koneksi ke
// backend sungguhan. Untuk runtime app yang sebenarnya, lihat CartRepositoryImpl (cart/data/repository)
// yang terhubung ke GET /petani (produk serupa) & POST /transaksi (checkout).
class FakeCartRepository : CartRepository {

    private val _cartItems = MutableStateFlow(
        listOf(
            CartItem(
                id = CartItem.key(1L, 1L),
                petaniId = 1L,
                petaniName = "Tani Makmur",
                produkId = 1L,
                productName = "Bayam Organik",
                imageUrl = null,
                price = 12500.0,
                unit = "kg",
                quantity = 2
            ),
            CartItem(
                id = CartItem.key(2L, 2L),
                petaniId = 2L,
                petaniName = "Sayur Segar",
                produkId = 2L,
                productName = "Wortel Lokal",
                imageUrl = null,
                price = 10000.0,
                unit = "kg",
                quantity = 1
            )
        )
    )
    override val cartItems: StateFlow<List<CartItem>> = _cartItems.asStateFlow()

    override fun addItem(
        petaniId: Long,
        petaniName: String,
        produkId: Long,
        productName: String,
        imageUrl: String?,
        price: Double,
        unit: String,
        quantity: Int,
        isAvailable: Boolean
    ) {
        val key = CartItem.key(petaniId, produkId)
        val current = _cartItems.value
        val existing = current.firstOrNull { it.id == key }
        _cartItems.value = if (existing != null) {
            current.map { if (it.id == key) it.copy(quantity = it.quantity + quantity) else it }
        } else {
            current + CartItem(
                id = key,
                petaniId = petaniId,
                petaniName = petaniName,
                produkId = produkId,
                productName = productName,
                imageUrl = imageUrl,
                price = price,
                unit = unit,
                quantity = quantity.coerceAtLeast(1),
                isAvailable = isAvailable
            )
        }
    }

    override fun updateQuantity(itemId: String, quantity: Int) {
        _cartItems.value = _cartItems.value.map { if (it.id == itemId) it.copy(quantity = quantity) else it }
    }

    override fun removeItem(itemId: String) {
        _cartItems.value = _cartItems.value.filterNot { it.id == itemId }
    }

    override fun setItemSelected(itemId: String, selected: Boolean) {
        _cartItems.value = _cartItems.value.map { if (it.id == itemId) it.copy(isSelected = selected) else it }
    }

    override fun setStoreSelected(petaniId: Long, selected: Boolean) {
        _cartItems.value = _cartItems.value.map { if (it.petaniId == petaniId) it.copy(isSelected = selected) else it }
    }

    override fun setAllSelected(selected: Boolean) {
        _cartItems.value = _cartItems.value.map { it.copy(isSelected = selected) }
    }

    override suspend fun getSimilarProducts(): Result<List<SimilarProduct>> = runCatching {
        delay(200)
        listOf(
            SimilarProduct(3L, "Kebun Rejeki", 3L, "Kangkung Segar", null, 8000.0, "kg", 20.0),
            SimilarProduct(4L, "Sayur Asri", 4L, "Sawi Hijau", null, 9000.0, "kg", 15.0)
        )
    }

    override suspend fun checkout(
        items: List<CartItem>,
        metodePembayaran: String,
        metodePengiriman: String
    ): Result<List<CheckoutResult>> = runCatching {
        delay(200)
        items.groupBy { it.petaniId }.map { (petaniId, groupItems) ->
            CheckoutResult(
                petaniId = petaniId,
                petaniName = groupItems.first().petaniName,
                kodeTransaksi = "TRX-$petaniId",
                totalHarga = groupItems.sumOf { it.subtotal },
                statusPesanan = "diproses",
                statusPembayaran = "berhasil"
            )
        }
    }
}