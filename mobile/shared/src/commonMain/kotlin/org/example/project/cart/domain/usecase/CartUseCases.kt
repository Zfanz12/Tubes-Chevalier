package org.example.project.cart.domain.usecase

import kotlinx.coroutines.flow.StateFlow
import org.example.project.cart.domain.model.CartItem
import org.example.project.cart.domain.model.CheckoutResult
import org.example.project.cart.domain.model.SimilarProduct
import org.example.project.cart.domain.repository.CartRepository

class ObserveCartItemsUseCase(private val repository: CartRepository) {
    operator fun invoke(): StateFlow<List<CartItem>> = repository.cartItems
}

// Dipakai dari mana pun tombol "Tambahkan"/"+ keranjang" muncul (Home, Search, Produk Serupa).
class AddToCartUseCase(private val repository: CartRepository) {
    operator fun invoke(
        petaniId: Long,
        petaniName: String,
        produkId: Long,
        productName: String,
        imageUrl: String?,
        price: Double,
        unit: String = "kg",
        quantity: Int = 1,
        isAvailable: Boolean = true
    ) = repository.addItem(petaniId, petaniName, produkId, productName, imageUrl, price, unit, quantity, isAvailable)
}

class UpdateCartQuantityUseCase(private val repository: CartRepository) {
    operator fun invoke(itemId: String, quantity: Int) = repository.updateQuantity(itemId, quantity)
}

class RemoveCartItemUseCase(private val repository: CartRepository) {
    operator fun invoke(itemId: String) = repository.removeItem(itemId)
}

class SetCartItemSelectedUseCase(private val repository: CartRepository) {
    operator fun invoke(itemId: String, selected: Boolean) = repository.setItemSelected(itemId, selected)
}

class SetCartStoreSelectedUseCase(private val repository: CartRepository) {
    operator fun invoke(petaniId: Long, selected: Boolean) = repository.setStoreSelected(petaniId, selected)
}

class SetCartSelectAllUseCase(private val repository: CartRepository) {
    operator fun invoke(selected: Boolean) = repository.setAllSelected(selected)
}

class GetSimilarProductsUseCase(private val repository: CartRepository) {
    suspend operator fun invoke(): Result<List<SimilarProduct>> = repository.getSimilarProducts()
}

class CheckoutCartUseCase(private val repository: CartRepository) {
    suspend operator fun invoke(
        items: List<CartItem>,
        metodePembayaran: String = "qris",
        metodePengiriman: String = "pickup"
    ): Result<List<CheckoutResult>> = repository.checkout(items, metodePembayaran, metodePengiriman)
}
