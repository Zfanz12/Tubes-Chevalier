package org.example.project.home.presentation

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch
import org.example.project.home.domain.usecase.GetCategoriesUseCase
import org.example.project.home.domain.usecase.GetCurrentUserUseCase
import org.example.project.home.domain.usecase.GetRecommendedProductsUseCase

class HomeViewModel(
    private val getCurrentUserUseCase: GetCurrentUserUseCase,
    private val getCategoriesUseCase: GetCategoriesUseCase,
    private val getRecommendedProductsUseCase: GetRecommendedProductsUseCase
) : ViewModel() {

    private val _uiState = MutableStateFlow(HomeUiState())
    val uiState: StateFlow<HomeUiState> = _uiState.asStateFlow()

    init { load() }

    fun onSearchQueryChange(value: String) {
        _uiState.value = _uiState.value.copy(searchQuery = value)
    }

    fun load() {
        viewModelScope.launch {
            _uiState.value = _uiState.value.copy(isLoading = true)
            val user = getCurrentUserUseCase()
            val categories = getCategoriesUseCase()
            val products = getRecommendedProductsUseCase()
            _uiState.value = _uiState.value.copy(
                isLoading = false,
                userName = user.getOrNull()?.name ?: "",
                userLocation = user.getOrNull()?.location ?: "",
                categories = categories.getOrNull() ?: emptyList(),
                products = products.getOrNull() ?: emptyList()
            )
        }
    }
}