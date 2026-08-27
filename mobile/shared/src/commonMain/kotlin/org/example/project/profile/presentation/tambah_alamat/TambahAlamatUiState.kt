package org.example.project.profile.presentation.tambah_alamat

data class TambahAlamatUiState(
    val alamatLengkap: String = "",
    val catatan: String = "",
    val namaPenerima: String = "",
    val noHpPenerima: String = "",
    val isSaving: Boolean = false,
    val errorMessage: String? = null,
    val isSuccess: Boolean = false,
    val showConfirmDialog: Boolean = false
)