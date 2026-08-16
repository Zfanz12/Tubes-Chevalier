package org.example.project.home.data.repository

import kotlinx.coroutines.delay
import org.example.project.home.domain.model.Category
import org.example.project.home.domain.model.HomeUser
import org.example.project.home.domain.model.ProductPreview
import org.example.project.home.domain.repository.HomeRepository

// TODO: Ganti isi function ini begitu backend menyediakan endpoint
// GET /api/user, GET /api/categories, GET /api/products/recommended.
// Model domain & Result<T> sudah final -- ViewModel/UseCase/Screen TIDAK perlu diubah nanti.
class HomeRepositoryImpl : HomeRepository {

    override suspend fun getCurrentUser(): Result<HomeUser> = runCatching {
        delay(200)
        HomeUser(name = "Ubang Sibolo", location = "Bandung")
    }

    override suspend fun getCategories(): Result<List<Category>> = runCatching {
        delay(200)
        listOf(
            Category("bayam", "Bayam"),
            Category("wortel", "Wortel"),
            Category("kubis", "Kubis"),
            Category("tomat", "Tomat"),
            Category("sawi", "Sawi"),
            Category("kangkung", "Kangkung"),
            Category("brokoli", "Brokoli"),
            Category("seledri", "Seledri"),
            Category("jagung", "Jagung"),
            Category("timun", "Timun"),
            Category("buncis", "Buncis"),
            Category("kol_ungu", "Kol Ungu")
        )
    }

    override suspend fun getRecommendedProducts(): Result<List<ProductPreview>> = runCatching {
        delay(200)
        listOf(
            ProductPreview("1", "Bayam Organik", "Tani Makmur", null, 12500.0, "kg", 12.0, 1.2),
            ProductPreview("2", "Tomat Mantep", "Tani Makmur", null, 12500.0, "kg", 12.0, 1.2),
            ProductPreview("3", "Wortel Lokal", "Tani Makmur", null, 12500.0, "kg", 12.0, 1.2)
        )
    }
}