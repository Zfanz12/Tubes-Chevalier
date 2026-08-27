package org.example.project.order.presentation

import org.example.project.order.domain.model.Order
import org.example.project.order.domain.model.OrderTab

data class OrderUiState(
    val isLoading: Boolean = false,
    val errorMessage: String? = null,
    val allOrders: List<Order> = emptyList(),
    val selectedTab: OrderTab = OrderTab.SEMUA,
    // id transaksi yang sedang dibuka dialog rating-nya (null = dialog tertutup)
    val ratingOrderId: Long? = null,
    val isSubmittingRating: Boolean = false
) {
    // Pemetaan tab -> status backend didokumentasikan di OrderViewModel.filterByTab
    val visibleOrders: List<Order> get() = filterByTab(allOrders, selectedTab)
}