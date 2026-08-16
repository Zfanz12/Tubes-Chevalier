package org.example.project.search.domain.repository

import org.example.project.home.domain.model.ProductPreview
import org.example.project.search.domain.model.SearchFilterState

interface SearchRepository {
    // Dipanggil saat search field masih kosong -- state "searching before" (698:268)
    suspend fun getRecommendedItems(): Result<List<ProductPreview>>

    // Dipanggil setiap kali user mengetik -- state "searching after" (698:1932), list saran nama produk
    suspend fun getSuggestions(query: String): Result<List<String>>

    // Dipanggil saat user submit pencarian -- state "searching result" (701:2283)
    suspend fun searchProducts(query: String, filter: SearchFilterState): Result<List<ProductPreview>>
}