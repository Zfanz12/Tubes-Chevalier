package org.example.project

import org.example.project.core.theme.HarvestaTheme
import androidx.compose.material3.Surface
import androidx.compose.runtime.*
import org.example.project.auth.presentation.login.LoginScreen
import org.example.project.auth.presentation.login.LoginViewModel
import org.example.project.auth.domain.usecase.LoginUseCase
import org.example.project.auth.domain.usecase.RequestOtpUseCase
import org.example.project.core.preview.PhaseAFakeAuthRepository
import org.example.project.auth.presentation.register.RegisterScreen
import org.example.project.auth.presentation.register.RegisterViewModel
import org.example.project.cart.presentation.CartViewModel
import org.example.project.core.storage.SessionStorage
import org.example.project.di.AppContainer
import org.example.project.home.presentation.HomeNavHost
import org.example.project.home.presentation.HomeViewModel
import org.example.project.order.presentation.OrderViewModel
import org.example.project.search.presentation.SearchViewModel
import org.example.project.welcome.presentation.WelcomeScreen

private enum class AuthScreen {
    WELCOME,
    LOGIN,
    REGISTER,
    HOME
}

@Composable
fun App() {

    var screen by remember {

        mutableStateOf(
            if (SessionStorage.getToken() != null) {
                AuthScreen.HOME
            } else {
                AuthScreen.WELCOME
            }
        )

    }
    val phaseAFakeAuthRepository = remember {
        PhaseAFakeAuthRepository()
    }
    val loginViewModel = remember {
        LoginViewModel(
            RequestOtpUseCase(
                phaseAFakeAuthRepository
            ),
            LoginUseCase(
                phaseAFakeAuthRepository
            )
        )
    }

    val registerViewModel = remember {
        RegisterViewModel(
            AppContainer.registerUseCase
        )
    }

    val homeViewModel = remember {
        HomeViewModel(
            AppContainer.getCurrentUserUseCase,
            AppContainer.getCategoriesUseCase,
            AppContainer.getRecommendedProductsUseCase
        )
    }

    val searchViewModel = remember {
        SearchViewModel(
            AppContainer.getRecommendedSearchItemsUseCase,
            AppContainer.getSearchSuggestionsUseCase,
            AppContainer.searchProductsUseCase
        )
    }

    val orderViewModel = remember {
        OrderViewModel(
            AppContainer.getOrdersUseCase,
            AppContainer.rateOrderUseCase
        )
    }

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

    HarvestaTheme {

        Surface {

            when (screen) {

                AuthScreen.WELCOME -> {
                    WelcomeScreen(
                        onStart = {
                            screen = AuthScreen.LOGIN
                        },
                        onLogin = {
                            screen = AuthScreen.LOGIN
                        }
                    )
                }
                AuthScreen.LOGIN -> {
                    LoginScreen(
                        viewModel = loginViewModel,
                        onLoginSuccess = {
                            screen = AuthScreen.HOME
                        },
                        onNavigateToRegister = {
                            screen = AuthScreen.REGISTER
                        },
                        onBackClick = {
                            screen = AuthScreen.WELCOME
                        }
                    )
                }

                AuthScreen.REGISTER -> {
                    RegisterScreen(
                        viewModel = registerViewModel,
                        onRegisterSuccess = {
                            screen = AuthScreen.LOGIN
                        },
                        onNavigateToLogin = {
                            screen = AuthScreen.LOGIN
                        }
                    )
                }

                AuthScreen.HOME -> {
                    HomeNavHost(
                        viewModel = homeViewModel,
                        searchViewModel = searchViewModel,
                        cartViewModel = cartViewModel,
                        orderViewModel = orderViewModel,
                        getProfileUseCase = AppContainer.getProfileUseCase,
                        updateProfileUseCase = AppContainer.updateProfileUseCase,
                        updateAlamatUseCase = AppContainer.updateAlamatUseCase,
                        logoutUseCase = AppContainer.logoutUseCase,
                        onLoggedOut = {
                            screen = AuthScreen.WELCOME
                        }
                    )
                }
            }
        }
    }

}