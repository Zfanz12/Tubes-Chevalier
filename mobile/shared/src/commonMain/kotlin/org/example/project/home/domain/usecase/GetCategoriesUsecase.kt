package org.example.project.home.domain.usecase

import org.example.project.home.domain.model.Category
import org.example.project.home.domain.repository.HomeRepository

class GetCategoriesUseCase(private val repository: HomeRepository) {
    suspend operator fun invoke(): Result<List<Category>> = repository.getCategories()
}