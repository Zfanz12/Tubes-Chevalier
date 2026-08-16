package org.example.project.cart.presentation

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch
import org.example.project.cart.domain.model.CartItem
import org.example.project.cart.domain.model.CartStoreGroup
import org.example.project.cart.domain.model.SimilarProduct
import org.example.project.cart.presentation.components.CartWeightOption
import org.example.project.home.domain.model.ProductPreview
import org.example.project.cart.domain.usecase.AddToCartUseCase
import org.example.project.cart.domain.usecase.CheckoutCartUseCase
import org.example.project.cart.domain.usecase.GetSimilarProductsUseCase
import org.example.project.cart.domain.usecase.ObserveCartItemsUseCase
import org.example.project.cart.domain.usecase.RemoveCartItemUseCase
import org.example.project.cart.domain.usecase.SetCartItemSelectedUseCase
import org.example.project.cart.domain.usecase.SetCartSelectAllUseCase
import org.example.project.cart.domain.usecase.SetCartStoreSelectedUseCase
import org.example.project.cart.domain.usecase.UpdateCartQuantityUseCase
import org.example.project.core.network.AppError

// Petani yang lagi "libur" -- backend belum punya field status buka/tutup toko, jadi ditandai
// di sisi klien saja (persis Figma "toko 3" / Sayur Ngawi -> badge "Sedang libur").
private val CLOSED_STORE_IDS = setOf(3L)

class CartViewModel(
    private val observeCartItemsUseCase: ObserveCartItemsUseCase,
    private val updateCartQuantityUseCase: UpdateCartQuantityUseCase,
    private val removeCartItemUseCase: RemoveCartItemUseCase,
    private val setCartItemSelectedUseCase: SetCartItemSelectedUseCase,
    private val setCartStoreSelectedUseCase: SetCartStoreSelectedUseCase,
    private val setCartSelectAllUseCase: SetCartSelectAllUseCase,
    private val getSimilarProductsUseCase: GetSimilarProductsUseCase,
    private val checkoutCartUseCase: CheckoutCartUseCase,
    private val addToCartUseCase: AddToCartUseCase
) : ViewModel() {

    private val _uiState = MutableStateFlow(CartUiState(isLoading = true, isLoadingSimilar = true))
    val uiState: StateFlow<CartUiState> = _uiState.asStateFlow()

    init {
        viewModelScope.launch {
            observeCartItemsUseCase().collect { items -> applyItems(items) }
        }
        loadSimilarProducts()
    }

    private fun applyItems(items: List<CartItem>) {
        val groups = items
            .groupBy { it.petaniId }
            .map { (petaniId, groupItems) ->
                CartStoreGroup(
                    petaniId = petaniId,
                    petaniName = groupItems.first().petaniName,
                    isOpen = petaniId !in CLOSED_STORE_IDS,
                    items = groupItems
                )
            }
            .sortedBy { it.petaniName }

        val selectedItems = items.filter { it.isSelected && it.isAvailable }
        val selectableItems = items.filter { it.isAvailable }

        _uiState.value = _uiState.value.copy(
            isLoading = false,
            storeGroups = groups,
            isAllSelected = selectableItems.isNotEmpty() && selectableItems.all { it.isSelected },
            selectedCount = selectedItems.size,
            selectedTotal = selectedItems.sumOf { it.subtotal }
        )
    }

    private fun loadSimilarProducts() {
        viewModelScope.launch {
            _uiState.value = _uiState.value.copy(isLoadingSimilar = true)
            getSimilarProductsUseCase()
                .onSuccess { products ->
                    _uiState.value = _uiState.value.copy(isLoadingSimilar = false, similarProducts = products)
                }
                .onFailure {
                    _uiState.value = _uiState.value.copy(isLoadingSimilar = false)
                }
        }
    }

    fun onToggleItem(itemId: String, selected: Boolean) = setCartItemSelectedUseCase(itemId, selected)

    fun onToggleStore(petaniId: Long, selected: Boolean) = setCartStoreSelectedUseCase(petaniId, selected)

    fun onToggleAll(selected: Boolean) = setCartSelectAllUseCase(selected)

    fun onIncreaseQuantity(item: CartItem) = updateCartQuantityUseCase(item.id, item.quantity + 1)

    fun onDecreaseQuantity(item: CartItem) {
        if (item.quantity <= 1) removeCartItemUseCase(item.id)
        else updateCartQuantityUseCase(item.id, item.quantity - 1)
    }

    fun onRemoveItem(itemId: String) = removeCartItemUseCase(itemId)

    // Tombol "Tambahkan" di kartu "Produk Serupa" -- langsung memasukkan produk itu ke keranjang
    // (state lokal, lihat catatan CartRepositoryImpl) dengan quantity awal 1.
    fun onAddSimilarProduct(product: SimilarProduct) {
        addToCartUseCase(
            petaniId = product.petaniId,
            petaniName = product.petaniName,
            produkId = product.produkId,
            productName = product.productName,
            imageUrl = product.imageUrl,
            price = product.price,
            unit = product.unit,
            quantity = 1
        )
    }

    // BARU -- tombol "Tambahkan"/"Masukkan Keranjang" dari Home & Search (lihat AddToCartSheet).
    fun onAddProduct(product: ProductPreview, weight: CartWeightOption, quantity: Int) {
        val petaniId = product.id.toLongOrNull() ?: 0L
        addToCartUseCase(
            petaniId = petaniId,
            petaniName = product.farmerName,
            produkId = petaniId,
            productName = product.name,
            imageUrl = product.imageUrl,
            price = product.price * weight.factor,
            unit = weight.label,
            quantity = quantity,
            isAvailable = true
        )
    }

    fun onCheckout() {
        val selected = _uiState.value.storeGroups.flatMap { it.items }.filter { it.isSelected && it.isAvailable }
        if (selected.isEmpty()) {
            _uiState.value = _uiState.value.copy(errorMessage = "Pilih minimal 1 produk untuk checkout")
            return
        }

        viewModelScope.launch {
            _uiState.value = _uiState.value.copy(isCheckingOut = true, errorMessage = null, checkoutMessage = null)
            checkoutCartUseCase(selected)
                .onSuccess { results ->
                    val message = results.joinToString(separator = "\n") {
                        "${it.petaniName}: ${it.kodeTransaksi} berhasil dibuat"
                    }
                    _uiState.value = _uiState.value.copy(isCheckingOut = false, checkoutMessage = message)
                }
                .onFailure { error ->
                    _uiState.value = _uiState.value.copy(isCheckingOut = false, errorMessage = error.toMessage())
                }
        }
    }

    fun dismissMessages() {
        _uiState.value = _uiState.value.copy(errorMessage = null, checkoutMessage = null)
    }

    private fun Throwable.toMessage(): String = when (this) {
        is AppError.Validation -> fieldErrors.values.flatten().firstOrNull() ?: text
        is AppError -> message
        else -> message ?: "Terjadi kesalahan"
    }
}