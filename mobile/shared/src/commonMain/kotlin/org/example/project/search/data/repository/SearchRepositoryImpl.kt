package org.example.project.search.data.repository

import org.example.project.core.network.mapNetworkError
import org.example.project.home.domain.model.ProductPreview
import org.example.project.search.data.mapper.toProductPreview
import org.example.project.search.data.remote.SearchApiService
import org.example.project.search.domain.model.LocationSort
import org.example.project.search.domain.model.PriceSort
import org.example.project.search.domain.model.RatingSort
import org.example.project.search.domain.model.SearchFilterState
import org.example.project.search.domain.repository.SearchRepository

// Terhubung ke backend Laravel sungguhan lewat SearchApiService (GET /petani).
//
// PENTING -- backend saat ini HANYA punya 1 endpoint (PetaniController@index) tanpa dukungan
// query/search/sort sama sekali, dan hanya me-return 1 produk per petani. Karena itu:
//   - getRecommendedItems() & searchProducts() mengambil SELURUH data lewat getPetani(), lalu
//     filter/sort dikerjakan di sini (client-side), bukan di server.
//   - getSuggestions() juga filter dari data yang sama secara lokal.
// Begitu backend menambah endpoint search dengan query param (?q=, ?sort_by=, ?sort_dir=, dst)
// dan/atau ProdukController yang me-return semua produk (bukan cuma produk pertama tiap petani),
// implementasi di bawah ini tinggal diganti untuk kirim param tsb ke server -- interface
// SearchRepository & domain model (ProductPreview) TIDAK perlu berubah.
class SearchRepositoryImpl(private val api: SearchApiService) : SearchRepository {

    override suspend fun getRecommendedItems(): Result<List<ProductPreview>> = runCatching {
        api.getPetani().map { it.toProductPreview() }
    }.mapNetworkError()

    override suspend fun getSuggestions(query: String): Result<List<String>> = runCatching {
        if (query.isBlank()) return@runCatching emptyList()

        api.getPetani()
            .map { it.komoditas }
            .distinct()
            .filter { it.contains(query, ignoreCase = true) }
    }.mapNetworkError()

    override suspend fun searchProducts(query: String, filter: SearchFilterState): Result<List<ProductPreview>> = runCatching {
        val all = api.getPetani().map { it.toProductPreview() }

        val filtered = if (query.isBlank()) all
        else all.filter { it.name.contains(query, ignoreCase = true) || it.farmerName.contains(query, ignoreCase = true) }

        val sortedByLocation = when (filter.location) {
            LocationSort.NEAREST -> filtered.sortedBy { it.distanceKm }
            LocationSort.FARTHEST -> filtered.sortedByDescending { it.distanceKm }
        }
        val sortedByPrice = when (filter.price) {
            PriceSort.HIGHEST -> sortedByLocation.sortedByDescending { it.price }
            PriceSort.LOWEST -> sortedByLocation.sortedBy { it.price }
        }
        // NOTE: sort terakhir (rating) yang menentukan urutan akhir -- demo sederhana saja.
        // Multi-criteria sort (rating > harga > lokasi) idealnya dilakukan di backend nanti.
        when (filter.rating) {
            RatingSort.HIGHEST -> sortedByPrice.sortedByDescending { it.rating }
            RatingSort.LOWEST -> sortedByPrice.sortedBy { it.rating }
        }
    }.mapNetworkError()
}