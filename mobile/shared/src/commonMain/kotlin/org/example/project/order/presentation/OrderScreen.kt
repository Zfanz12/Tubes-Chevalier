package org.example.project.order.presentation

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import org.example.project.core.theme.AppColors
import org.example.project.core.theme.AppSpacing
import org.example.project.home.presentation.components.BottomNavBar
import org.example.project.home.presentation.components.BottomNavItem
import org.example.project.order.domain.model.Order
import org.example.project.order.presentation.components.OrderCard
import org.example.project.order.presentation.components.OrderTabBar
import org.example.project.order.presentation.components.OrderTopBar
import org.example.project.order.presentation.components.RateOrderDialog

// Figma: 367-4455 (Semua), 382-5023 (Belum Bayar), 382-5424 (Diproses), 472-11758 (Dikirim),
// 453-10900 (referensi status/komponen tambahan).
@Composable
fun OrderScreen(
    viewModel: OrderViewModel,
    onItemSelected: (BottomNavItem) -> Unit,
    // Fitur pembayaran & pelacakan pengiriman akan dibangun di iterasi berikutnya (link Figma
    // menyusul) -- untuk sekarang callback ini cukup diteruskan ke parent (mis. untuk log/snackbar
    // "Fitur pembayaran segera hadir") lewat HomeNavHost/App.kt.
    onPayClick: (Order) -> Unit = {},
    onTrackClick: (Order) -> Unit = {}
) {
    val state by viewModel.uiState.collectAsState()

    Scaffold(
        containerColor = AppColors.Background,
        bottomBar = {
            BottomNavBar(selectedItem = BottomNavItem.ORDER, onItemSelected = onItemSelected)
        }
    ) { padding ->
        Column(modifier = Modifier.fillMaxSize().padding(padding)) {
            OrderTopBar()
            OrderTabBar(selectedTab = state.selectedTab, onTabSelected = viewModel::onTabSelected)

            when {
                state.isLoading && state.allOrders.isEmpty() -> {
                    Box(modifier = Modifier.fillMaxSize(), contentAlignment = Alignment.Center) {
                        CircularProgressIndicator(color = AppColors.Primary)
                    }
                }

                state.errorMessage != null && state.allOrders.isEmpty() -> {
                    Box(modifier = Modifier.fillMaxSize(), contentAlignment = Alignment.Center) {
                        Text(
                            state.errorMessage ?: "Gagal memuat pesanan",
                            color = AppColors.Error,
                            style = MaterialTheme.typography.bodyMedium
                        )
                    }
                }

                state.visibleOrders.isEmpty() -> {
                    Box(modifier = Modifier.fillMaxSize(), contentAlignment = Alignment.Center) {
                        Text(
                            "Belum ada pesanan pada kategori ini",
                            color = AppColors.Subtitle,
                            style = MaterialTheme.typography.bodyMedium
                        )
                    }
                }

                else -> {
                    LazyColumn(
                        modifier = Modifier.fillMaxSize(),
                        contentPadding = PaddingValues(
                            horizontal = AppSpacing.lg,
                            vertical = AppSpacing.sm
                        ),
                        verticalArrangement = Arrangement.spacedBy(AppSpacing.md)
                    ) {
                        items(state.visibleOrders, key = { it.id }) { order ->
                            OrderCard(
                                order = order,
                                onPayClick = onPayClick,
                                onTrackClick = onTrackClick,
                                onRateClick = { viewModel.openRatingDialog(it.id) }
                            )
                        }
                        item { Spacer(Modifier.padding(bottom = 8.dp)) }
                    }
                }
            }
        }
    }

    if (state.ratingOrderId != null) {
        RateOrderDialog(
            isSubmitting = state.isSubmittingRating,
            onDismiss = viewModel::closeRatingDialog,
            onSubmit = { rating -> viewModel.submitRating(state.ratingOrderId!!, rating) }
        )
    }
}