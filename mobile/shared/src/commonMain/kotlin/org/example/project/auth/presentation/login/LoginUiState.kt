package org.example.project.auth.presentation.login

enum class LoginStage { PHONE, OTP }

data class LoginUiState(
    val stage: LoginStage = LoginStage.PHONE,
    val noHp: String = "",
    val otpCode: String = "",
    val isLoading: Boolean = false,
    val errorMessage: String? = null,
    val infoMessage: String? = null,
    val isSuccess: Boolean = false
)