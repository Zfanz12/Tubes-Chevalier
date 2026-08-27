package org.example.project.cart.presentation

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import org.example.project.cart.presentation.components.CartBottomBar
import org.example.project.cart.presentation.components.CartStoreSection
import org.example.project.cart.presentation.components.CartTopBar
import org.example.project.cart.presentation.components.SimilarProductsSection
import org.example.project.core.theme.AppColors

// Figma node 337:357 "keranjang" -- top bar, daftar toko/produk yang bisa dicentang per
// item/toko, section "Produk Serupa", lalu bottom bar checkout menempel di bawah.
@Composable
fun CartScreen(
    viewModel: CartViewModel,
    onBack: () -> Unit,
    onNavigateToStore: (Long) -> Unit = {}
) {
    val state by viewModel.uiState.collectAsState()

    Scaffold(
        containerColor = AppColors.Background,
        topBar = { CartTopBar(onBack = onBack) },
        bottomBar = {
            CartBottomBar(
                isAllSelected = state.isAllSelected,
                selectedCount = state.selectedCount,
                selectedTotal = state.selectedTotal,
                isCheckingOut = state.isCheckingOut,
                onToggleAll = viewModel::onToggleAll,
                onCheckout = viewModel::onCheckout
            )
        }
    ) { padding ->
        Column(modifier = Modifier.fillMaxSize().padding(padding)) {

            // Banner pesan sukses/gagal checkout -- pola inline sederhana sama seperti
            // auth/presentation/login/LoginScreen.kt (bukan Snackbar, karena project ini belum
            // memakai SnackbarHost di layar mana pun).
            (state.checkoutMessage ?: state.errorMessage)?.let { message ->
                Text(
                    text = message,
                    color = if (state.checkoutMessage != null) AppColors.Success else MaterialTheme.colorScheme.error,
                    style = MaterialTheme.typography.bodySmall,
                    modifier = Modifier.fillMaxWidth().background(AppColors.White).padding(horizontal = 16.dp, vertical = 8.dp)
                )
            }

            when {
                state.isLoading -> {
                    Box(modifier = Modifier.fillMaxSize(), contentAlignment = Alignment.Center) {
                        CircularProgressIndicator(color = AppColors.Primary)
                    }
                }

                state.isEmpty -> {
                    Box(modifier = Modifier.fillMaxSize().padding(32.dp), contentAlignment = Alignment.Center) {
                        Text("Keranjang kamu masih kosong", color = AppColors.Subtitle, style = MaterialTheme.typography.bodyMedium)
                    }
                }

                else -> {
                    Column(
                        modifier = Modifier.fillMaxSize().verticalScroll(rememberScrollState()),
                        verticalArrangement = Arrangement.spacedBy(8.dp)
                    ) {
                        state.storeGroups.forEach { group ->
                            CartStoreSection(
                                group = group,
                                onToggleStore = { selected -> viewModel.onToggleStore(group.petaniId, selected) },
                                onToggleItem = { item, selected -> viewModel.onToggleItem(item.id, selected) },
                                onIncrease = viewModel::onIncreaseQuantity,
                                onDecrease = viewModel::onDecreaseQuantity,
                                onRemove = { item -> viewModel.onRemoveItem(item.id) },
                                onStoreClick = { onNavigateToStore(group.petaniId) }
                            )
                        }

                        SimilarProductsSection(products = state.similarProducts, onAddToCart = viewModel::onAddSimilarProduct)

                        Spacer(Modifier.height(8.dp))
                    }
                }
            }
        }
    }
}

@Preview
@Composable
private fun CartScreenPreview() {
    val viewModel = org.example.project.core.preview.rememberPreviewCartViewModel()

    MaterialTheme {
        CartScreen(viewModel = viewModel, onBack = {})
    }
}