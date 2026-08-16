package org.example.project.home.presentation

import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.ModalBottomSheet
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Text
import androidx.compose.material3.rememberModalBottomSheetState
import androidx.compose.runtime.Composable
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import org.example.project.cart.presentation.CartViewModel
import org.example.project.cart.presentation.components.AddToCartSheet
import org.example.project.core.preview.FakeHomeRepository
import org.example.project.core.theme.AppColors
import org.example.project.home.domain.model.ProductPreview
import org.example.project.home.domain.usecase.GetCategoriesUseCase
import org.example.project.home.domain.usecase.GetCurrentUserUseCase
import org.example.project.home.domain.usecase.GetRecommendedProductsUseCase
import org.example.project.home.presentation.components.*

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun HomeScreen(
    viewModel: HomeViewModel,
    onSeeAllCategories: () -> Unit,
    onNavigateToSearch: () -> Unit = {},
    onNavigateToOrder: () -> Unit = {},
    cartViewModel: CartViewModel,
    onNavigateToCart: () -> Unit = {},
    onNavigateToProfile: () -> Unit = {}
) {
    val state by viewModel.uiState.collectAsState()
    val addToCartSheetState = rememberModalBottomSheetState()
    var productForAddToCart by remember { mutableStateOf<ProductPreview?>(null) }

    Scaffold(
        containerColor = AppColors.Background,
        bottomBar = {
            BottomNavBar(
                selectedItem = BottomNavItem.HOME,
                onItemSelected = { item ->
                    when (item) {
                        BottomNavItem.ORDER -> onNavigateToOrder()
                        BottomNavItem.PROFILE -> onNavigateToProfile()
                        else -> { /* TODO: sambungkan nanti (Notifikasi) */ }
                    }
                }
            )
        }
    ) { padding ->
        Column(
            modifier = Modifier.fillMaxSize().padding(padding).verticalScroll(rememberScrollState())
        ) {
            HomeTopBar(
                userName = state.userName,
                location = state.userLocation,
                onCartClick = onNavigateToCart,
                onProfileClick = onNavigateToProfile
            )

            Column(modifier = Modifier.padding(horizontal = 24.dp)) {
                HomeSearchBar(query = state.searchQuery, onQueryChange = viewModel::onSearchQueryChange, onClick = onNavigateToSearch)

                Spacer(Modifier.height(24.dp))
                PromoBannerSection()

                Spacer(Modifier.height(24.dp))
                CategorySection(categories = state.categories, onSeeAllClick = onSeeAllCategories)

                Spacer(Modifier.height(24.dp))
                Text("Rekomendasi Produk", style = MaterialTheme.typography.titleMedium, fontWeight = FontWeight.Bold)
                Text("Pilihan terbaik petani minggu ini", style = MaterialTheme.typography.bodySmall, color = AppColors.Subtitle)

                Spacer(Modifier.height(12.dp))
                state.products.forEach { product ->
                    ProductCard(product = product, onAddToCart = { productForAddToCart = it })
                    Spacer(Modifier.height(12.dp))
                }
            }
            Spacer(Modifier.height(24.dp))
        }
    }

    productForAddToCart?.let { product ->
        ModalBottomSheet(
            onDismissRequest = { productForAddToCart = null },
            sheetState = addToCartSheetState
        ) {
            AddToCartSheet(
                product = product,
                onConfirm = { weight, quantity ->
                    cartViewModel.onAddProduct(product, weight, quantity)
                    productForAddToCart = null
                }
            )
        }
    }
}

@Preview
@Composable
private fun HomeScreenPreview() {
    val fakeRepo = remember { FakeHomeRepository() }
    val viewModel = remember {
        HomeViewModel(
            GetCurrentUserUseCase(fakeRepo),
            GetCategoriesUseCase(fakeRepo),
            GetRecommendedProductsUseCase(fakeRepo)
        )
    }

    val cartViewModel = org.example.project.core.preview.rememberPreviewCartViewModel()

    MaterialTheme {
        HomeScreen(viewModel = viewModel, onSeeAllCategories = {}, cartViewModel = cartViewModel)
    }
}