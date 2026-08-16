package org.example.project.search.presentation

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import kotlinx.coroutines.Job
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch
import org.example.project.search.domain.model.LocationSort
import org.example.project.search.domain.model.PriceSort
import org.example.project.search.domain.model.RatingSort
import org.example.project.search.domain.usecase.GetRecommendedSearchItemsUseCase
import org.example.project.search.domain.usecase.GetSearchSuggestionsUseCase
import org.example.project.search.domain.usecase.SearchProductsUseCase

// Mengikuti pola ViewModel lain di project (lihat LoginViewModel): extends androidx ViewModel(),
// pakai viewModelScope, di-construct manual lewat AppContainer (tanpa DI framework).
class SearchViewModel(
    private val getRecommendedSearchItemsUseCase: GetRecommendedSearchItemsUseCase,
    private val getSearchSuggestionsUseCase: GetSearchSuggestionsUseCase,
    private val searchProductsUseCase: SearchProductsUseCase
) : ViewModel() {

    private val _uiState = MutableStateFlow(SearchUiState())
    val uiState: StateFlow<SearchUiState> = _uiState.asStateFlow()

    private var suggestionJob: Job? = null

    init {
        loadRecommended()
    }

    private fun loadRecommended() {
        viewModelScope.launch {
            _uiState.value = _uiState.value.copy(isLoading = true, errorMessage = null)
            getRecommendedSearchItemsUseCase()
                .onSuccess { items ->
                    _uiState.value = _uiState.value.copy(isLoading = false, recommendedItems = items)
                }
                .onFailure {
                    _uiState.value = _uiState.value.copy(isLoading = false, errorMessage = it.message)
                }
        }
    }

    fun onQueryChange(query: String) {
        _uiState.value = _uiState.value.copy(query = query)

        if (query.isBlank()) {
            suggestionJob?.cancel()
            _uiState.value = _uiState.value.copy(stage = SearchStage.DEFAULT, suggestions = emptyList())
            return
        }

        _uiState.value = _uiState.value.copy(stage = SearchStage.SUGGESTING)
        suggestionJob?.cancel()
        suggestionJob = viewModelScope.launch {
            getSearchSuggestionsUseCase(query)
                .onSuccess { suggestions ->
                    _uiState.value = _uiState.value.copy(suggestions = suggestions)
                }
        }
    }

    fun onClearQuery() {
        suggestionJob?.cancel()
        _uiState.value = _uiState.value.copy(
            query = "",
            stage = SearchStage.DEFAULT,
            suggestions = emptyList(),
            results = emptyList()
        )
    }

    // Dipanggil saat submit (Enter / klik ikon cari / pilih salah satu suggestion)
    fun onSubmitSearch(query: String = _uiState.value.query) {
        suggestionJob?.cancel()
        _uiState.value = _uiState.value.copy(query = query, stage = SearchStage.RESULT)
        runSearch()
    }

    private fun runSearch() {
        viewModelScope.launch {
            _uiState.value = _uiState.value.copy(isLoading = true, errorMessage = null)
            searchProductsUseCase(_uiState.value.query, _uiState.value.filter)
                .onSuccess { results ->
                    _uiState.value = _uiState.value.copy(isLoading = false, results = results)
                }
                .onFailure {
                    _uiState.value = _uiState.value.copy(isLoading = false, errorMessage = it.message)
                }
        }
    }

    fun openFilterSheet() {
        _uiState.value = _uiState.value.copy(isFilterSheetVisible = true)
    }

    fun closeFilterSheet() {
        _uiState.value = _uiState.value.copy(isFilterSheetVisible = false)
    }

    fun onSelectRatingSort(sort: RatingSort) {
        _uiState.value = _uiState.value.copy(filter = _uiState.value.filter.copy(rating = sort))
    }

    fun onSelectPriceSort(sort: PriceSort) {
        _uiState.value = _uiState.value.copy(filter = _uiState.value.filter.copy(price = sort))
    }

    fun onSelectLocationSort(sort: LocationSort) {
        _uiState.value = _uiState.value.copy(filter = _uiState.value.filter.copy(location = sort))
    }

    // Tombol "Terapkan" di bottom sheet filter
    fun applyFilter() {
        _uiState.value = _uiState.value.copy(isFilterSheetVisible = false)
        runSearch()
    }
}