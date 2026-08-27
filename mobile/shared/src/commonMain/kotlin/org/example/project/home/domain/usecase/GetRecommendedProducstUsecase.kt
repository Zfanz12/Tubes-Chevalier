package org.example.project.home.domain.usecase

import org.example.project.home.domain.model.ProductPreview
import org.example.project.home.domain.repository.HomeRepository

class GetRecommendedProductsUseCase(private val repository: HomeRepository) {
    suspend operator fun invoke(): Result<List<ProductPreview>> = repository.getRecommendedProducts()
}