package org.example.project.auth.presentation.register

data class RegisterUiState(
    val name: String = "",
    val noHp: String = "",
    val isLoading: Boolean = false,
    val errorMessage: String? = null,
    val isSuccess: Boolean = false
)