package org.example.project.profile.presentation.edit_alamat

data class EditAlamatUiState(
    val id: String = "utama",
    val alamatLengkap: String = "",
    val catatan: String = "",
    val namaPenerima: String = "",
    val noHpPenerima: String = "",
    val isUtama: Boolean = true,
    val latitude: Double? = null,
    val longitude: Double? = null,
    val isLoading: Boolean = true,
    val isSaving: Boolean = false,
    val errorMessage: String? = null,
    val isSuccess: Boolean = false,
    val showConfirmDialog: Boolean = false
)