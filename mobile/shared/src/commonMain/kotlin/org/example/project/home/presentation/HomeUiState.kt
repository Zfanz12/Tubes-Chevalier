package org.example.project.home.presentation

import org.example.project.home.domain.model.Category
import org.example.project.home.domain.model.ProductPreview

data class HomeUiState(
    val isLoading: Boolean = false,
    val userName: String = "",
    val userLocation: String = "",
    val searchQuery: String = "",
    val categories: List<Category> = emptyList(),
    val products: List<ProductPreview> = emptyList()
)