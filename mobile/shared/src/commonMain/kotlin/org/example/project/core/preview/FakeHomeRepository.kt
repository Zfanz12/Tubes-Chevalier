package org.example.project.core.preview

import kotlinx.coroutines.delay
import org.example.project.home.domain.model.Category
import org.example.project.home.domain.model.HomeUser
import org.example.project.home.domain.model.ProductPreview
import org.example.project.home.domain.repository.HomeRepository

class FakeHomeRepository : HomeRepository {

    override suspend fun getCurrentUser(): Result<HomeUser> {
        delay(100)
        return Result.success(HomeUser(name = "Ubang Sibolo", location = "Bandung"))
    }

    override suspend fun getCategories(): Result<List<Category>> {
        delay(100)
        return Result.success(
            listOf(
                Category("bayam", "Bayam"),
                Category("wortel", "Wortel"),
                Category("kubis", "Kubis"),
                Category("tomat", "Tomat"),
                Category("sawi", "Sawi"),
                Category("kangkung", "Kangkung")
            )
        )
    }

    override suspend fun getRecommendedProducts(): Result<List<ProductPreview>> {
        delay(100)
        return Result.success(
            listOf(
                ProductPreview("1", "Bayam Organik", "Tani Makmur", null, 12500.0, "kg", 12.0, 1.2),
                ProductPreview("2", "Tomat Mantep", "Tani Makmur", null, 12500.0, "kg", 12.0, 1.2),
                ProductPreview("3", "Wortel Lokal", "Tani Makmur", null, 12500.0, "kg", 12.0, 1.2)
            )
        )
    }
}