package org.example.project

import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Surface
import androidx.compose.runtime.*
import org.example.project.auth.presentation.login.LoginScreen
import org.example.project.auth.presentation.login.LoginViewModel
import org.example.project.auth.presentation.register.RegisterScreen
import org.example.project.auth.presentation.register.RegisterViewModel
import org.example.project.cart.presentation.CartViewModel
import org.example.project.core.storage.SessionStorage
import org.example.project.di.AppContainer
import org.example.project.home.presentation.HomeNavHost
import org.example.project.home.presentation.HomeViewModel
import org.example.project.order.presentation.OrderViewModel
import org.example.project.search.presentation.SearchViewModel

private enum class AuthScreen { LOGIN, REGISTER, HOME }

@Composable
fun App() {
    var screen by remember {
        mutableStateOf(if (SessionStorage.getToken() != null) AuthScreen.HOME else AuthScreen.LOGIN)
    }

    // App.kt
    val loginViewModel = remember { LoginViewModel(AppContainer.requestOtpUseCase, AppContainer.loginUseCase) }
    val registerViewModel = remember { RegisterViewModel(AppContainer.registerUseCase) }
    val homeViewModel = remember {
        HomeViewModel(
            AppContainer.getCurrentUserUseCase,
            AppContainer.getCategoriesUseCase,
            AppContainer.getRecommendedProductsUseCase
        )
    }
    // BARU -- fitur search, dikonstruksi di sini (pusat DI) lalu diteruskan ke HomeNavHost
    val searchViewModel = remember {
        SearchViewModel(
            AppContainer.getRecommendedSearchItemsUseCase,
            AppContainer.getSearchSuggestionsUseCase,
            AppContainer.searchProductsUseCase
        )
    }

    // BARU -- fitur order, dikonstruksi di sini (pusat DI) lalu diteruskan ke HomeNavHost
    val orderViewModel = remember {
        OrderViewModel(AppContainer.getOrdersUseCase, AppContainer.rateOrderUseCase)
    }

    // BARU -- fitur keranjang, dikonstruksi di sini (pusat DI) lalu diteruskan ke HomeNavHost.
    val cartViewModel = remember {
        CartViewModel(
            AppContainer.observeCartItemsUseCase,
            AppContainer.updateCartQuantityUseCase,
            AppContainer.removeCartItemUseCase,
            AppContainer.setCartItemSelectedUseCase,
            AppContainer.setCartStoreSelectedUseCase,
            AppContainer.setCartSelectAllUseCase,
            AppContainer.getSimilarProductsUseCase,
            AppContainer.checkoutCartUseCase,
            AppContainer.addToCartUseCase
        )
    }

    MaterialTheme {
        Surface {
            when (screen) {
                AuthScreen.LOGIN -> LoginScreen(
                    viewModel = loginViewModel,
                    onLoginSuccess = { screen = AuthScreen.HOME },
                    onNavigateToRegister = { screen = AuthScreen.REGISTER }
                )
                AuthScreen.REGISTER -> RegisterScreen(
                    viewModel = registerViewModel,
                    onRegisterSuccess = { screen = AuthScreen.LOGIN },
                    onNavigateToLogin = { screen = AuthScreen.LOGIN }
                )
                AuthScreen.HOME -> HomeNavHost(
                    viewModel = homeViewModel,
                    searchViewModel = searchViewModel,
                    cartViewModel = cartViewModel,
                    orderViewModel = orderViewModel,
                    // BARU -- fitur profile, supaya logo profile di HomeTopBar bisa membuka ProfileScreen.
                    getProfileUseCase = AppContainer.getProfileUseCase,
                    updateProfileUseCase = AppContainer.updateProfileUseCase,
                    updateAlamatUseCase = AppContainer.updateAlamatUseCase,
                    logoutUseCase = AppContainer.logoutUseCase,
                    onLoggedOut = { screen = AuthScreen.LOGIN }
                )
            }
        }
    }
}