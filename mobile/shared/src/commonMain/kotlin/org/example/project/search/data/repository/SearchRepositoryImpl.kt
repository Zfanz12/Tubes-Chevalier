package org.example.project.search.data.repository

import org.example.project.core.network.mapNetworkError
import org.example.project.home.domain.model.ProductPreview
import org.example.project.search.data.mapper.toProductPreviews
import org.example.project.search.data.remote.SearchApiService
import org.example.project.search.domain.model.LocationSort
import org.example.project.search.domain.model.PriceSort
import org.example.project.search.domain.model.RatingSort
import org.example.project.search.domain.model.SearchFilterState
import org.example.project.search.domain.repository.SearchRepository

// Terhubung ke backend Laravel sungguhan lewat SearchApiService (GET /petani).
//
// PENTING -- backend saat ini HANYA punya 1 endpoint (PetaniController@index) tanpa dukungan
// query/search/sort sama sekali. Karena itu:
//   - getRecommendedItems() & searchProducts() mengambil SELURUH data lewat getPetani(), lalu
//     di-flatten jadi satu ProductPreview per PRODUK (lewat toProductPreviews(), field `produks`),
//     bukan cuma satu per petani -- supaya semua penjual suatu barang ikut muncul saat kategori/
//     pencarian dipilih (mis. pilih "Wortel" -> semua petani yang jual wortel tampil, bukan cuma
//     yang produk pertamanya wortel). Filter/sort dikerjakan di sini (client-side), bukan di server.
//   - getSuggestions() juga filter dari data yang sama secara lokal.
// Begitu backend menambah endpoint search dengan query param (?q=, ?sort_by=, ?sort_dir=, dst),
// implementasi di bawah ini tinggal diganti untuk kirim param tsb ke server -- interface
// SearchRepository & domain model (ProductPreview) TIDAK perlu berubah.
class SearchRepositoryImpl(private val api: SearchApiService) : SearchRepository {

    override suspend fun getRecommendedItems(): Result<List<ProductPreview>> = runCatching {
        api.getPetani().flatMap { it.toProductPreviews() }
    }.mapNetworkError()

    override suspend fun getSuggestions(query: String): Result<List<String>> = runCatching {
        if (query.isBlank()) return@runCatching emptyList()

        api.getPetani()
            .flatMap { it.toProductPreviews() }
            .map { it.name }
            .distinct()
            .filter { it.contains(query, ignoreCase = true) }
    }.mapNetworkError()

    override suspend fun searchProducts(query: String, filter: SearchFilterState): Result<List<ProductPreview>> = runCatching {
        val all = api.getPetani().flatMap { it.toProductPreviews() }

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
        when (filter.rating) {
            RatingSort.HIGHEST -> sortedByPrice.sortedByDescending { it.rating }
            RatingSort.LOWEST -> sortedByPrice.sortedBy { it.rating }
        }
    }.mapNetworkError()
}