package org.example.project.core.preview

import kotlinx.coroutines.delay
import org.example.project.home.domain.model.Category
import org.example.project.home.domain.model.HomeUser
import org.example.project.home.domain.model.ProductPreview
import org.example.project.home.domain.model.StaticCategories
import org.example.project.home.domain.repository.HomeRepository

class FakeHomeRepository : HomeRepository {

    override suspend fun getCurrentUser(): Result<HomeUser> {

        delay(100)

        return Result.success(
            HomeUser(
                name = "Andini Putri",
                location = "Lembang, Bandung Barat"
            )
        )
    }


    override suspend fun getCategories(): Result<List<Category>> {

        return Result.success(StaticCategories.list)
    }


    override suspend fun getRecommendedProducts(): Result<List<ProductPreview>> {

        delay(100)

        return Result.success(

            listOf(

                ProductPreview(
                    id = "101",
                    name = "Tomat Cherry",
                    farmerName = "Pak Soekarno",
                    imageUrl = null,
                    price = 12_500.0,
                    unit = "kg",
                    stock = 12.0,
                    distanceKm = 1.2,
                    isOrganic = true,
                    rating = 4.8
                ),

                ProductPreview(
                    id = "102",
                    name = "Bayam Organik Asal Jember",
                    farmerName = "Tani Makmur",
                    imageUrl = null,
                    price = 12_500.0,
                    unit = "ikat",
                    stock = 20.0,
                    distanceKm = 2.4,
                    isOrganic = true,
                    rating = 4.9
                ),

                ProductPreview(
                    id = "103",
                    name = "Wortel Lokal",
                    farmerName = "Tani Makmur",
                    imageUrl = null,
                    price = 12_500.0,
                    unit = "kg",
                    stock = 15.0,
                    distanceKm = 3.1,
                    isOrganic = false,
                    rating = 4.7
                ),

                ProductPreview(
                    id = "104",
                    name = "Pak Choy Gokil",
                    farmerName = "Tani Makmur",
                    imageUrl = null,
                    price = 12_500.0,
                    unit = "ikat",
                    stock = 18.0,
                    distanceKm = 2.1,
                    isOrganic = true,
                    rating = 4.8
                ),

                ProductPreview(
                    id = "105",
                    name = "Kangkung Mantep",
                    farmerName = "Tani Makmur",
                    imageUrl = null,
                    price = 12_500.0,
                    unit = "ikat",
                    stock = 25.0,
                    distanceKm = 1.8,
                    isOrganic = true,
                    rating = 4.8
                ),

                ProductPreview(
                    id = "106",
                    name = "Sawi Hijau",
                    farmerName = "Sayur Segar",
                    imageUrl = null,
                    price = 10_000.0,
                    unit = "ikat",
                    stock = 17.0,
                    distanceKm = 4.2,
                    isOrganic = false,
                    rating = 4.6
                )

            )

        )
    }
}