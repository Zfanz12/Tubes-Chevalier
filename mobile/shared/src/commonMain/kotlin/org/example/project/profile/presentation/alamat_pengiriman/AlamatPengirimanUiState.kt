package org.example.project.profile.presentation.alamat_pengiriman

data class AlamatPengirimanUiState(
    val daftarAlamat: List<AlamatItem> = emptyList(),
    val isLoading: Boolean = false,
    val errorMessage: String? = null,
    val alamatToDelete: AlamatItem? = null
)