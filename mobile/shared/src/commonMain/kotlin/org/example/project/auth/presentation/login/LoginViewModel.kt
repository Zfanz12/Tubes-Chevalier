package org.example.project.auth.presentation.login

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch
import org.example.project.auth.domain.usecase.LoginUseCase
import org.example.project.auth.domain.usecase.RequestOtpUseCase
import org.example.project.core.network.AppError

class LoginViewModel(
    private val requestOtpUseCase: RequestOtpUseCase,
    private val loginUseCase: LoginUseCase
) : ViewModel() {

    private val _uiState = MutableStateFlow(LoginUiState())
    val uiState: StateFlow<LoginUiState> = _uiState.asStateFlow()

    fun onNoHpChange(value: String) { _uiState.value = _uiState.value.copy(noHp = value, errorMessage = null) }
    fun onOtpCodeChange(value: String) { _uiState.value = _uiState.value.copy(otpCode = value, errorMessage = null) }

    fun sendOtp() {
        val state = _uiState.value
        viewModelScope.launch {
            _uiState.value = state.copy(isLoading = true, errorMessage = null, infoMessage = null)
            requestOtpUseCase(state.noHp)
                .onSuccess {
                    _uiState.value = _uiState.value.copy(
                        isLoading = false, stage = LoginStage.OTP,
                        infoMessage = "Kode OTP telah dikirim ke WhatsApp Anda"
                    )
                }
                .onFailure { error -> _uiState.value = _uiState.value.copy(isLoading = false, errorMessage = error.toMessage()) }
        }
    }

    fun resendOtp() = sendOtp()

    fun changePhoneNumber() {
        _uiState.value = LoginUiState(noHp = _uiState.value.noHp)
    }

    fun submit() {
        val state = _uiState.value
        viewModelScope.launch {
            _uiState.value = state.copy(isLoading = true, errorMessage = null)
            loginUseCase(state.noHp, state.otpCode)
                .onSuccess { _uiState.value = _uiState.value.copy(isLoading = false, isSuccess = true) }
                .onFailure { error -> _uiState.value = _uiState.value.copy(isLoading = false, errorMessage = error.toMessage()) }
        }
    }

    private fun Throwable.toMessage(): String = when (this) {
        is AppError.Validation -> fieldErrors.values.flatten().firstOrNull() ?: text
        is AppError -> message
        else -> message ?: "Terjadi kesalahan"
    }
}