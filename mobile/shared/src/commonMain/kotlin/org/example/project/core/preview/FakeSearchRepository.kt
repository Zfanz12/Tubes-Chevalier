package org.example.project.core.preview

import kotlinx.coroutines.delay
import org.example.project.home.domain.model.ProductPreview
import org.example.project.search.domain.model.LocationSort
import org.example.project.search.domain.model.PriceSort
import org.example.project.search.domain.model.RatingSort
import org.example.project.search.domain.model.SearchFilterState
import org.example.project.search.domain.repository.SearchRepository

// Dipakai HANYA untuk @Preview (SearchScreenPreview) supaya bisa dijalankan tanpa koneksi
// ke backend sungguhan. Untuk runtime app yang sebenarnya, lihat SearchRepositoryImpl
// (search/data/repository) yang terhubung ke GET /petani.
class FakeSearchRepository : SearchRepository {

    private val suggestionPool = listOf(
        "Bayam Organik", "Wortel", "Jagung", "Sawi", "Kubis", "Bawang", "Kangkung",
        "Buntut babi", "Bulukumba", "Bintang", "Bau badan", "Bento", "Bu Retno", "Bis primajasa"
    )

    override suspend fun getRecommendedItems(): Result<List<ProductPreview>> {
        delay(300)
        return Result.success(
            listOf(
                ProductPreview("s1", "Bayam Organik", "Tani Makmur", null, 12500.0, "kg", 12.0, 1.2, isOrganic = true, rating = 4.8),
                ProductPreview("s2", "Wortel", "Tani Makmur", null, 12500.0, "kg", 12.0, 1.2, rating = 4.5),
                ProductPreview("s3", "Jagung", "Tani Makmur", null, 12500.0, "kg", 12.0, 1.2, rating = 4.6),
                ProductPreview("s4", "Sawi", "Tani Makmur", null, 12500.0, "kg", 12.0, 1.2, rating = 4.3),
                ProductPreview("s5", "Kubis", "Tani Makmur", null, 12500.0, "kg", 12.0, 1.2, rating = 4.2),
                ProductPreview("s6", "Bawang", "Tani Makmur", null, 12500.0, "kg", 12.0, 1.2, rating = 4.7),
                ProductPreview("s7", "Kangkung", "Tani Makmur", null, 12500.0, "kg", 12.0, 1.2, rating = 4.4)
            )
        )
    }

    override suspend fun getSuggestions(query: String): Result<List<String>> {
        delay(150)
        return Result.success(
            if (query.isBlank()) emptyList()
            else suggestionPool.filter { it.contains(query, ignoreCase = true) }
        )
    }

    override suspend fun searchProducts(query: String, filter: SearchFilterState): Result<List<ProductPreview>> {
        delay(400)
        val dummyResults = listOf(
            ProductPreview("r1", "Wortel Lokal", "Tani Makmur", null, 12500.0, "kg", 12.0, 0.8, isOrganic = true, rating = 4.9),
            ProductPreview("r2", "Bayam Organik Asal Jember", "Tani Makmur", null, 12500.0, "kg", 12.0, 1.1, rating = 4.7),
            ProductPreview("r3", "Wortel Lokal", "Tani Makmur", null, 12500.0, "kg", 12.0, 2.3, rating = 4.5),
            ProductPreview("r4", "Pak Choy Gokil", "Tani Makmur", null, 12500.0, "kg", 12.0, 1.5, isOrganic = true, rating = 4.6),
            ProductPreview("r5", "Kangkung Mantep", "Tani Makmur", null, 12500.0, "kg", 12.0, 0.5, rating = 4.8),
            ProductPreview("r6", "Pak Choy Gokil", "Tani Makmur", null, 12500.0, "kg", 12.0, 3.1, rating = 4.2),
            ProductPreview("r7", "Bayam Organik Asal Jember", "Tani Makmur", null, 12500.0, "kg", 12.0, 1.9, rating = 4.4),
            ProductPreview("r8", "Kangkung Mantep", "Tani Makmur", null, 12500.0, "kg", 12.0, 2.7, rating = 4.3)
        )

        val filtered = if (query.isBlank()) dummyResults
        else dummyResults.filter { it.name.contains(query, ignoreCase = true) }

        val sortedByLocation = when (filter.location) {
            LocationSort.NEAREST -> filtered.sortedBy { it.distanceKm }
            LocationSort.FARTHEST -> filtered.sortedByDescending { it.distanceKm }
        }
        val sortedByPrice = when (filter.price) {
            PriceSort.HIGHEST -> sortedByLocation.sortedByDescending { it.price }
            PriceSort.LOWEST -> sortedByLocation.sortedBy { it.price }
        }
        val sorted = when (filter.rating) {
            RatingSort.HIGHEST -> sortedByPrice.sortedByDescending { it.rating }
            RatingSort.LOWEST -> sortedByPrice.sortedBy { it.rating }
        }
        return Result.success(sorted)
    }
}