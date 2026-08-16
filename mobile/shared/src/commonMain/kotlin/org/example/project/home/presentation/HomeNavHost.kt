package org.example.project.home.presentation

import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.runtime.collectAsState
import org.example.project.cart.presentation.CartScreen
import org.example.project.cart.presentation.CartViewModel
import org.example.project.home.presentation.category.CategoryListScreen
import org.example.project.home.presentation.components.BottomNavItem
import org.example.project.order.presentation.OrderScreen
import org.example.project.order.presentation.OrderViewModel
import org.example.project.search.presentation.SearchScreen
import org.example.project.search.presentation.SearchViewModel
import org.example.project.auth.domain.usecase.LogoutUseCase
import org.example.project.profile.domain.usecase.GetProfileUseCase
import org.example.project.profile.domain.usecase.UpdateAlamatUseCase
import org.example.project.profile.domain.usecase.UpdateProfileUseCase
import org.example.project.profile.presentation.navigation.ProfileNavHost

// BARU -- ditambahkan CART supaya ikon keranjang di HomeTopBar & CartScreen benar-benar
// tersambung ke navigation graph (sebelumnya CartScreen tidak pernah dipanggil dari sini sama sekali).
// BARU -- ditambahkan PROFILE supaya logo profile di HomeTopBar & item Profile di BottomNavBar
// benar-benar tersambung ke ProfileNavHost (sebelumnya belum pernah dipanggil dari sini).
private enum class HomeDestination { HOME, CATEGORY_LIST, SEARCH, ORDER, CART, PROFILE }

@Composable
fun HomeNavHost(
    viewModel: HomeViewModel,
    // Dikonstruksi & di-inject dari App.kt (lewat AppContainer), sama seperti `viewModel` di atas --
    // supaya wiring dependency tetap terpusat di satu tempat (App.kt), bukan tersebar di tiap NavHost.
    searchViewModel: SearchViewModel,
    // BARU -- fitur keranjang.
    cartViewModel: CartViewModel,
    // BARU -- fitur order
    orderViewModel: OrderViewModel,
    // BARU -- fitur profile, use case-nya dikonstruksi di App.kt lewat AppContainer.
    getProfileUseCase: GetProfileUseCase,
    updateProfileUseCase: UpdateProfileUseCase,
    updateAlamatUseCase: UpdateAlamatUseCase,
    logoutUseCase: LogoutUseCase,
    onLoggedOut: () -> Unit = {}
) {
    var destination by rememberSaveable { mutableStateOf(HomeDestination.HOME) }
    val state by viewModel.uiState.collectAsState()

    when (destination) {
        HomeDestination.HOME -> HomeScreen(
            viewModel = viewModel,
            onSeeAllCategories = { destination = HomeDestination.CATEGORY_LIST },
            onNavigateToSearch = { destination = HomeDestination.SEARCH },
            onNavigateToOrder = { destination = HomeDestination.ORDER },
            cartViewModel = cartViewModel,
            onNavigateToCart = { destination = HomeDestination.CART },
            onNavigateToProfile = { destination = HomeDestination.PROFILE }
        )
        HomeDestination.CATEGORY_LIST -> CategoryListScreen(
            categories = state.categories,
            onBack = { destination = HomeDestination.HOME },
            onCategoryClick = { category ->
                searchViewModel.onSubmitSearch(category.name)
                destination = HomeDestination.SEARCH
            }
        )
        HomeDestination.SEARCH -> SearchScreen(
            viewModel = searchViewModel,
            onBack = { destination = HomeDestination.HOME },
            cartViewModel = cartViewModel
        )
        HomeDestination.ORDER -> OrderScreen(
            viewModel = orderViewModel,
            onItemSelected = { item ->
                when (item) {
                    BottomNavItem.HOME -> destination = HomeDestination.HOME
                    BottomNavItem.ORDER -> { /* sudah di halaman Order */ }
                    BottomNavItem.PROFILE -> destination = HomeDestination.PROFILE
                    else -> { /* TODO: sambungkan nanti (Notifikasi) */ }
                }
            }
        )

        HomeDestination.CART -> CartScreen(
            viewModel = cartViewModel,
            onBack = { destination = HomeDestination.HOME }
        )

        HomeDestination.PROFILE -> ProfileNavHost(
            getProfileUseCase = getProfileUseCase,
            updateProfileUseCase = updateProfileUseCase,
            updateAlamatUseCase = updateAlamatUseCase,
            logoutUseCase = logoutUseCase,
            onLoggedOut = onLoggedOut
        )
    }
}