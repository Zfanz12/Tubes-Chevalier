package org.example.project.home.presentation

import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.runtime.collectAsState
import org.example.project.home.presentation.category.CategoryListScreen

private enum class HomeDestination { HOME, CATEGORY_LIST }

@Composable
fun HomeNavHost(viewModel: HomeViewModel) {
    var destination by rememberSaveable { mutableStateOf(HomeDestination.HOME) }
    val state by viewModel.uiState.collectAsState()

    when (destination) {
        HomeDestination.HOME -> HomeScreen(
            viewModel = viewModel,
            onSeeAllCategories = { destination = HomeDestination.CATEGORY_LIST }
        )
        HomeDestination.CATEGORY_LIST -> CategoryListScreen(
            categories = state.categories,
            onBack = { destination = HomeDestination.HOME }
        )
    }
}