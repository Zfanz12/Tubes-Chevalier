package org.example.project.profile.presentation.profile

import org.example.project.profile.domain.model.UserProfile

data class ProfileUiState(
    val isLoading: Boolean = true,
    val profile: UserProfile? = null,
    val errorMessage: String? = null,
    val isLoggedOut: Boolean = false,
    val showLogoutDialog: Boolean = false
)