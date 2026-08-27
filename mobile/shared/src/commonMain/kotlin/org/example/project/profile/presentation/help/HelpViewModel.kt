package org.example.project.profile.presentation.help

import androidx.lifecycle.ViewModel
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow

class HelpViewModel : ViewModel() {

    private val _uiState = MutableStateFlow(HelpUiState())
    val uiState: StateFlow<HelpUiState> = _uiState.asStateFlow()

    fun onSearchQueryChange(value: String) { _uiState.value = _uiState.value.copy(searchQuery = value) }

    fun onFaqClick(id: String) {
        val current = _uiState.value
        _uiState.value = current.copy(expandedId = if (current.expandedId == id) null else id)
    }

    fun onPertanyaanLainChange(value: String) { _uiState.value = _uiState.value.copy(pertanyaanLain = value) }
}