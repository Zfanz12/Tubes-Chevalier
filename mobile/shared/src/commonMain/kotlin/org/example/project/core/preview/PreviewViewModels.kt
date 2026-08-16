package org.example.project.core.preview

import androidx.compose.runtime.Composable
import androidx.compose.runtime.remember
import org.example.project.cart.domain.usecase.*
import org.example.project.cart.presentation.CartViewModel

@Composable
fun rememberPreviewCartViewModel(): CartViewModel {
    val repository = remember { FakeCartRepository() }
    return remember {
        CartViewModel(
            ObserveCartItemsUseCase(repository),
            UpdateCartQuantityUseCase(repository),
            RemoveCartItemUseCase(repository),
            SetCartItemSelectedUseCase(repository),
            SetCartStoreSelectedUseCase(repository),
            SetCartSelectAllUseCase(repository),
            GetSimilarProductsUseCase(repository),
            CheckoutCartUseCase(repository),
            AddToCartUseCase(repository)
        )
    }
}