package org.example.project.auth.presentation.register

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch
import org.example.project.auth.domain.usecase.RegisterUseCase
import org.example.project.core.network.AppError

class RegisterViewModel(private val registerUseCase: RegisterUseCase) : ViewModel() {

    // Aplikasi mobile ini KHUSUS untuk sisi UMKM -- tidak ada pilihan role di UI,
    // role selalu dikirim sebagai "umkm" (sisi Petani ada di aplikasi/kanal terpisah).
    private val fixedRole = "umkm"

    private val _uiState = MutableStateFlow(RegisterUiState())
    val uiState: StateFlow<RegisterUiState> = _uiState.asStateFlow()

    fun onNameChange(v: String) { _uiState.value = _uiState.value.copy(name = v, errorMessage = null) }
    fun onNoHpChange(v: String) { _uiState.value = _uiState.value.copy(noHp = v, errorMessage = null) }

    fun submit() {
        val state = _uiState.value
        viewModelScope.launch {
            _uiState.value = state.copy(isLoading = true, errorMessage = null)
            val result = registerUseCase(
                name = state.name,
                noHp = state.noHp,
                role = fixedRole
            )
            result.onSuccess { _uiState.value = _uiState.value.copy(isLoading = false, isSuccess = true) }
                .onFailure { error -> _uiState.value = _uiState.value.copy(isLoading = false, errorMessage = error.toMessage()) }
        }
    }

    private fun Throwable.toMessage(): String = when (this) {
        is AppError.Validation -> fieldErrors.values.flatten().firstOrNull() ?: text
        is AppError -> message
        else -> message ?: "Terjadi kesalahan"
    }
}