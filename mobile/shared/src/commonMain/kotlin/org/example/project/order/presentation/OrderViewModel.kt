package org.example.project.order.presentation

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch
import org.example.project.order.domain.model.Order
import org.example.project.order.domain.model.OrderStatus
import org.example.project.order.domain.model.OrderTab
import org.example.project.order.domain.model.PaymentStatus
import org.example.project.order.domain.usecase.GetOrdersUseCase
import org.example.project.order.domain.usecase.RateOrderUseCase

// Pemetaan tab Figma (367-4455 "Semua", 382-5023 "Belum Bayar", 382-5424 "Diproses",
// 472-11758 "Dikirim") ke kombinasi status_pesanan/status_pembayaran di backend:
//
//   - BELUM_BAYAR : status_pesanan == pending  && status_pembayaran == unpaid
//                   (pesanan baru dibuat, menunggu pembayaran diverifikasi/di-upload buktinya --
//                   lihat TransaksiController@store & @uploadBukti)
//   - DIPROSES    : status_pesanan == preparing
//   - DIKIRIM     : status_pesanan == shipping
//   - SELESAI     : status_pesanan == completed
//   - DIBATALKAN  : SELALU KOSONG -- backend belum punya status pembatalan sama sekali
//                   (lihat catatan di OrderRepositoryImpl)
//
// Catatan: status_pembayaran cuma berubah jadi 'paid' lewat TransaksiController@validasiPembayaran,
// yang men-set status_pesanan jadi 'completed' di saat bersamaan. Jadi kombinasi "sudah bayar tapi
// masih diproses/dikirim" pada praktiknya hanya terjadi untuk metode COD (di mana petani menaikkan
// status_pesanan lewat @updateStatus sementara status_pembayaran tetap 'unpaid' sampai selesai).
fun filterByTab(orders: List<Order>, tab: OrderTab): List<Order> = when (tab) {
    OrderTab.SEMUA -> orders
    OrderTab.BELUM_BAYAR -> orders.filter {
        it.paymentStatus == PaymentStatus.UNPAID && it.status == OrderStatus.PENDING
    }
    OrderTab.DIPROSES -> orders.filter { it.status == OrderStatus.PREPARING }
    OrderTab.DIKIRIM -> orders.filter { it.status == OrderStatus.SHIPPING }
    OrderTab.SELESAI -> orders.filter { it.status == OrderStatus.COMPLETED }
    OrderTab.DIBATALKAN -> emptyList()
}

// Mengikuti pola ViewModel lain di project (lihat SearchViewModel): extends androidx ViewModel(),
// pakai viewModelScope, di-construct manual lewat AppContainer.
class OrderViewModel(
    private val getOrdersUseCase: GetOrdersUseCase,
    private val rateOrderUseCase: RateOrderUseCase
) : ViewModel() {

    private val _uiState = MutableStateFlow(OrderUiState())
    val uiState: StateFlow<OrderUiState> = _uiState.asStateFlow()

    init {
        loadOrders()
    }

    fun loadOrders() {
        viewModelScope.launch {
            _uiState.value = _uiState.value.copy(isLoading = true, errorMessage = null)
            getOrdersUseCase()
                .onSuccess { orders ->
                    _uiState.value = _uiState.value.copy(isLoading = false, allOrders = orders)
                }
                .onFailure {
                    _uiState.value = _uiState.value.copy(isLoading = false, errorMessage = it.message)
                }
        }
    }

    fun onTabSelected(tab: OrderTab) {
        _uiState.value = _uiState.value.copy(selectedTab = tab)
    }

    fun openRatingDialog(orderId: Long) {
        _uiState.value = _uiState.value.copy(ratingOrderId = orderId)
    }

    fun closeRatingDialog() {
        _uiState.value = _uiState.value.copy(ratingOrderId = null)
    }

    fun submitRating(orderId: Long, rating: Int) {
        viewModelScope.launch {
            _uiState.value = _uiState.value.copy(isSubmittingRating = true)
            rateOrderUseCase(orderId, rating)
                .onSuccess {
                    // Optimis: update rating di list lokal supaya tidak perlu reload semua dari server
                    val updated = _uiState.value.allOrders.map { order ->
                        if (order.id == orderId) order.copy(rating = rating) else order
                    }
                    _uiState.value = _uiState.value.copy(
                        isSubmittingRating = false,
                        allOrders = updated,
                        ratingOrderId = null
                    )
                }
                .onFailure {
                    _uiState.value = _uiState.value.copy(isSubmittingRating = false, errorMessage = it.message)
                }
        }
    }
}