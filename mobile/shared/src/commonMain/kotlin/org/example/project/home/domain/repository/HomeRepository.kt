package org.example.project.home.domain.repository

import org.example.project.home.domain.model.Category
import org.example.project.home.domain.model.HomeUser
import org.example.project.home.domain.model.ProductPreview

interface HomeRepository {
    suspend fun getCurrentUser(): Result<HomeUser>
    suspend fun getCategories(): Result<List<Category>>
    suspend fun getRecommendedProducts(): Result<List<ProductPreview>>
}