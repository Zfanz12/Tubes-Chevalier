package org.example.project.search.presentation

import org.example.project.home.domain.model.ProductPreview
import org.example.project.search.domain.model.SearchFilterState

// 3 kondisi tampilan sesuai Figma:
// DEFAULT    -> field kosong, tampil "Anda mungkin suka" (698:268)
// SUGGESTING -> user sedang mengetik, tampil daftar nama produk yang cocok (698:1932)
// RESULT     -> user submit pencarian, tampil grid kartu produk + tombol filter (701:2283)
enum class SearchStage { DEFAULT, SUGGESTING, RESULT }

data class SearchUiState(
    val query: String = "",
    val stage: SearchStage = SearchStage.DEFAULT,
    val recommendedItems: List<ProductPreview> = emptyList(),
    val suggestions: List<String> = emptyList(),
    val results: List<ProductPreview> = emptyList(),
    val filter: SearchFilterState = SearchFilterState(),
    val isFilterSheetVisible: Boolean = false,
    val isLoading: Boolean = false,
    val errorMessage: String? = null
)