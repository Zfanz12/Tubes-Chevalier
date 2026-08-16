package org.example.project.profile.presentation.edit_profile

data class EditProfileUiState(
    val username: String = "",
    val name: String = "",
    val email: String = "",
    val noHp: String = "",
    val role: String = "",
    val isLoading: Boolean = true,
    val isSaving: Boolean = false,
    val errorMessage: String? = null,
    val isSuccess: Boolean = false
)