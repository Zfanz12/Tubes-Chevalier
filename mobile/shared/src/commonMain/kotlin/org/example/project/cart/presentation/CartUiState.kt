package org.example.project.cart.presentation

import org.example.project.cart.domain.model.CartStoreGroup
import org.example.project.cart.domain.model.SimilarProduct

data class CartUiState(
    val isLoading: Boolean = false,
    val storeGroups: List<CartStoreGroup> = emptyList(),
    val isAllSelected: Boolean = false,
    val selectedCount: Int = 0,
    val selectedTotal: Double = 0.0,
    val similarProducts: List<SimilarProduct> = emptyList(),
    val isLoadingSimilar: Boolean = false,
    val isCheckingOut: Boolean = false,
    val checkoutMessage: String? = null,
    val errorMessage: String? = null
) {
    val isEmpty: Boolean get() = !isLoading && storeGroups.all { it.items.isEmpty() }
}
