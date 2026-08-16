package org.example.project.profile.presentation.profile

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.update
import kotlinx.coroutines.launch
import org.example.project.auth.domain.usecase.LogoutUseCase
import org.example.project.core.network.AppError
import org.example.project.profile.domain.usecase.GetProfileUseCase

class ProfileViewModel(
    private val getProfileUseCase: GetProfileUseCase,
    private val logoutUseCase: LogoutUseCase
) : ViewModel() {

    private val _uiState = MutableStateFlow(ProfileUiState())
    val uiState: StateFlow<ProfileUiState> = _uiState.asStateFlow()

    init {
        loadProfile()
    }

    fun loadProfile() {
        viewModelScope.launch {
            _uiState.value = _uiState.value.copy(isLoading = true, errorMessage = null)
            getProfileUseCase()
                .onSuccess { profile -> _uiState.value = _uiState.value.copy(isLoading = false, profile = profile) }
                .onFailure { error -> _uiState.value = _uiState.value.copy(isLoading = false, errorMessage = error.toMessage()) }
        }
    }

    // Buka pop-up dialog konfirmasi
    fun onLogoutClicked() {
        _uiState.update { it.copy(showLogoutDialog = true) }
    }

    // Tutup / Batal dialog konfirmasi
    fun onDismissLogoutDialog() {
        _uiState.update { it.copy(showLogoutDialog = false) }
    }

    // Eksekusi logout saat tombol konfirmasi "Keluar" di dialog diklik
    fun onConfirmLogout(onLogoutSuccess: () -> Unit) {
        viewModelScope.launch {
            _uiState.update { it.copy(showLogoutDialog = false, isLoading = true) }
            val result = logoutUseCase()
            _uiState.update { it.copy(isLoading = false) }
            if (result.isSuccess) {
                onLogoutSuccess()
            }
        }
    }

    private fun Throwable.toMessage(): String = when (this) {
        is AppError.Validation -> fieldErrors.values.flatten().firstOrNull() ?: text
        is AppError -> message
        else -> message ?: "Terjadi kesalahan"
    }
}