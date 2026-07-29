package org.example.project.home.presentation

data class HomeUiState(
    val isLoading: Boolean = false,
    val username: String = "",
    val email: String = ""
)