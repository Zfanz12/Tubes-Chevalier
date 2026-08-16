package org.example.project.profile.presentation.edit_profile

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch
import org.example.project.core.network.AppError
import org.example.project.profile.domain.usecase.GetProfileUseCase
import org.example.project.profile.domain.usecase.UpdateProfileUseCase

class EditProfileViewModel(
    private val getProfileUseCase: GetProfileUseCase,
    private val updateProfileUseCase: UpdateProfileUseCase
) : ViewModel() {

    private val _uiState = MutableStateFlow(EditProfileUiState())
    val uiState: StateFlow<EditProfileUiState> = _uiState.asStateFlow()

    init {
        loadCurrentProfile()
    }

    private fun loadCurrentProfile() {
        viewModelScope.launch {
            _uiState.value = _uiState.value.copy(isLoading = true, errorMessage = null)
            getProfileUseCase()
                .onSuccess { profile ->
                    _uiState.value = _uiState.value.copy(
                        isLoading = false,
                        username = profile.name,
                        name = profile.name,
                        email = profile.email,
                        noHp = profile.noHp,
                        role = profile.role
                    )
                }
                .onFailure { error -> _uiState.value = _uiState.value.copy(isLoading = false, errorMessage = error.toMessage()) }
        }
    }

    fun onUsernameChange(value: String) { _uiState.value = _uiState.value.copy(username = value, errorMessage = null) }
    fun onNameChange(value: String) { _uiState.value = _uiState.value.copy(name = value, errorMessage = null) }
    fun onEmailChange(value: String) { _uiState.value = _uiState.value.copy(email = value, errorMessage = null) }

    fun submit() {
        val state = _uiState.value
        viewModelScope.launch {
            _uiState.value = state.copy(isSaving = true, errorMessage = null)
            updateProfileUseCase(state.name, state.email, state.noHp)
                .onSuccess { _uiState.value = _uiState.value.copy(isSaving = false, isSuccess = true) }
                .onFailure { error -> _uiState.value = _uiState.value.copy(isSaving = false, errorMessage = error.toMessage()) }
        }
    }

    private fun Throwable.toMessage(): String = when (this) {
        is AppError.Validation -> fieldErrors.values.flatten().firstOrNull() ?: text
        is AppError -> message
        else -> message ?: "Terjadi kesalahan"
    }
}