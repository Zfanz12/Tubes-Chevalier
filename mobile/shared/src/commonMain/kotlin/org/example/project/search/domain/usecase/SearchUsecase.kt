package org.example.project.search.domain.usecase

import org.example.project.home.domain.model.ProductPreview
import org.example.project.search.domain.model.SearchFilterState
import org.example.project.search.domain.repository.SearchRepository

class GetRecommendedSearchItemsUseCase(private val repository: SearchRepository) {
    suspend operator fun invoke(): Result<List<ProductPreview>> = repository.getRecommendedItems()
}

class GetSearchSuggestionsUseCase(private val repository: SearchRepository) {
    suspend operator fun invoke(query: String): Result<List<String>> = repository.getSuggestions(query)
}

class SearchProductsUseCase(private val repository: SearchRepository) {
    suspend operator fun invoke(query: String, filter: SearchFilterState): Result<List<ProductPreview>> =
        repository.searchProducts(query, filter)
}