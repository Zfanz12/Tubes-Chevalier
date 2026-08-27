package org.example.project.home.presentation

import androidx.compose.runtime.Composable
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import org.example.project.auth.domain.usecase.LogoutUseCase
import org.example.project.cart.presentation.CartScreen
import org.example.project.cart.presentation.CartViewModel
import org.example.project.home.domain.model.ProductPreview
import org.example.project.home.presentation.category.CategoryListScreen
import org.example.project.home.presentation.chat.ChatScreen
import org.example.project.home.presentation.components.BottomNavItem
import org.example.project.home.presentation.detail.ProductDetailScreen
import org.example.project.home.presentation.notification.NotificationScreen
import org.example.project.order.presentation.OrderScreen
import org.example.project.order.presentation.OrderViewModel
import org.example.project.profile.domain.usecase.GetProfileUseCase
import org.example.project.profile.domain.usecase.UpdateAlamatUseCase
import org.example.project.profile.domain.usecase.UpdateProfileUseCase
import org.example.project.profile.presentation.navigation.ProfileNavHost
import org.example.project.search.presentation.SearchScreen
import org.example.project.search.presentation.SearchViewModel

private enum class HomeDestination {
    HOME,
    CATEGORY_LIST,
    SEARCH,
    ORDER,
    CART,
    PROFILE,
    PRODUCT_DETAIL,
    CHAT,
    NOTIFICATION
}

@Composable
fun HomeNavHost(
    viewModel: HomeViewModel,
    searchViewModel: SearchViewModel,
    cartViewModel: CartViewModel,
    orderViewModel: OrderViewModel,
    getProfileUseCase: GetProfileUseCase,
    updateProfileUseCase: UpdateProfileUseCase,
    updateAlamatUseCase: UpdateAlamatUseCase,
    logoutUseCase: LogoutUseCase,
    onLoggedOut: () -> Unit = {}
) {
    var destination by rememberSaveable {
        mutableStateOf(HomeDestination.HOME)
    }

    var selectedProduct by remember {
        mutableStateOf<ProductPreview?>(null)
    }

    // Layar Cart & Chat bisa diakses dari beberapa tempat (Home, Product Detail, Profile),
    // jadi kita ingat asalnya supaya tombol kembali mengarah ke layar yang benar.
    var cartBackDestination by remember {
        mutableStateOf(HomeDestination.HOME)
    }

    var chatBackDestination by remember {
        mutableStateOf(HomeDestination.PRODUCT_DETAIL)
    }

    val state by viewModel.uiState.collectAsState()

    when (destination) {

        HomeDestination.HOME -> HomeScreen(
            viewModel = viewModel,

            onSeeAllCategories = {
                destination =
                    HomeDestination.CATEGORY_LIST
            },

            onNavigateToSearch = {
                destination =
                    HomeDestination.SEARCH
            },

            onNavigateToOrder = {
                destination =
                    HomeDestination.ORDER
            },

            cartViewModel = cartViewModel,

            onNavigateToCart = {
                cartBackDestination =
                    HomeDestination.HOME

                destination =
                    HomeDestination.CART
            },

            onNavigateToProfile = {
                destination =
                    HomeDestination.PROFILE
            },

            onNavigateToNotification = {
                destination =
                    HomeDestination.NOTIFICATION
            },

            onProductClick = { product ->
                selectedProduct = product

                destination =
                    HomeDestination.PRODUCT_DETAIL
            }
        )

        HomeDestination.CATEGORY_LIST -> CategoryListScreen(
            categories = state.categories,

            onBack = {
                destination =
                    HomeDestination.HOME
            },

            onCategoryClick = { category ->

                searchViewModel.onSubmitSearch(
                    category.name
                )

                destination =
                    HomeDestination.SEARCH
            }
        )

        HomeDestination.SEARCH -> SearchScreen(
            viewModel = searchViewModel,

            onBack = {
                destination =
                    HomeDestination.HOME
            },

            cartViewModel = cartViewModel
        )

        HomeDestination.ORDER -> OrderScreen(
            viewModel = orderViewModel,

            onItemSelected = { item ->

                when (item) {

                    BottomNavItem.HOME -> {
                        destination =
                            HomeDestination.HOME
                    }

                    BottomNavItem.ORDER -> {
                        destination =
                            HomeDestination.ORDER
                    }

                    BottomNavItem.PROFILE -> {
                        destination =
                            HomeDestination.PROFILE
                    }

                    BottomNavItem.NOTIFICATION -> {
                        destination =
                            HomeDestination.NOTIFICATION
                    }
                }
            }
        )

        HomeDestination.CART -> CartScreen(
            viewModel = cartViewModel,

            onBack = {
                destination =
                    cartBackDestination
            }
        )

        HomeDestination.PROFILE -> ProfileNavHost(
            getProfileUseCase =
                getProfileUseCase,

            updateProfileUseCase =
                updateProfileUseCase,

            updateAlamatUseCase =
                updateAlamatUseCase,

            logoutUseCase =
                logoutUseCase,

            onNavigateToCart = {
                cartBackDestination =
                    HomeDestination.PROFILE

                destination =
                    HomeDestination.CART
            },

            onNavigateToChat = {
                chatBackDestination =
                    HomeDestination.PROFILE

                destination =
                    HomeDestination.CHAT
            },

            onItemSelected = { item ->

                when (item) {

                    BottomNavItem.HOME -> {
                        destination =
                            HomeDestination.HOME
                    }

                    BottomNavItem.ORDER -> {
                        destination =
                            HomeDestination.ORDER
                    }

                    BottomNavItem.NOTIFICATION -> {
                        destination =
                            HomeDestination.NOTIFICATION
                    }

                    BottomNavItem.PROFILE -> {
                        destination =
                            HomeDestination.PROFILE
                    }
                }
            },

            onLoggedOut =
                onLoggedOut
        )

        HomeDestination.PRODUCT_DETAIL -> {

            selectedProduct?.let { product ->

                ProductDetailScreen(
                    product = product,

                    onBack = {
                        destination =
                            HomeDestination.HOME
                    },

                    onChat = {
                        chatBackDestination =
                            HomeDestination.PRODUCT_DETAIL

                        destination =
                            HomeDestination.CHAT
                    },

                    onAddToCart = {
                        cartBackDestination =
                            HomeDestination.HOME

                        destination =
                            HomeDestination.CART
                    }
                )

            } ?: run {

                destination =
                    HomeDestination.HOME
            }
        }

        HomeDestination.CHAT -> ChatScreen(
            onBack = {
                destination =
                    chatBackDestination
            }
        )

        HomeDestination.NOTIFICATION -> NotificationScreen(
            onBack = {
                destination =
                    HomeDestination.HOME
            }
        )
    }
}