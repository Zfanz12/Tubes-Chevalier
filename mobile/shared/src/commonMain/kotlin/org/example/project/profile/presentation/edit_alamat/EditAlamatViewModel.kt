package org.example.project.profile.presentation.edit_alamat

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch
import org.example.project.core.network.AppError
import org.example.project.profile.domain.usecase.GetProfileUseCase
import org.example.project.profile.domain.usecase.UpdateAlamatUseCase
import org.example.project.profile.presentation.alamat_pengiriman.AlamatItem

class EditAlamatViewModel(
    private val getProfileUseCase: GetProfileUseCase,
    private val updateAlamatUseCase: UpdateAlamatUseCase,
    initial: AlamatItem? = null
) : ViewModel() {

    private val _uiState = MutableStateFlow(
        initial?.let {
            EditAlamatUiState(
                id = it.id,
                alamatLengkap = it.alamatLengkap,
                catatan = it.catatan,
                namaPenerima = it.namaPenerima,
                noHpPenerima = it.noHpPenerima,
                isUtama = it.isUtama,
                isLoading = false
            )
        } ?: EditAlamatUiState()
    )
    val uiState: StateFlow<EditAlamatUiState> = _uiState.asStateFlow()

    init {
        if (initial == null) loadCurrentAlamat()
    }

    private fun loadCurrentAlamat() {
        viewModelScope.launch {
            _uiState.value = _uiState.value.copy(isLoading = true, errorMessage = null)
            getProfileUseCase()
                .onSuccess { profile ->
                    _uiState.value = _uiState.value.copy(
                        isLoading = false,
                        alamatLengkap = profile.alamat.orEmpty(),
                        namaPenerima = profile.name,
                        noHpPenerima = profile.noHp,
                        latitude = profile.latitude,
                        longitude = profile.longitude
                    )
                }
                .onFailure { error -> _uiState.value = _uiState.value.copy(isLoading = false, errorMessage = error.toMessage()) }
        }
    }

    fun onAlamatLengkapChange(value: String) { _uiState.value = _uiState.value.copy(alamatLengkap = value, errorMessage = null) }
    fun onCatatanChange(value: String) { _uiState.value = _uiState.value.copy(catatan = value, errorMessage = null) }
    fun onNamaPenerimaChange(value: String) { _uiState.value = _uiState.value.copy(namaPenerima = value, errorMessage = null) }
    fun onNoHpPenerimaChange(value: String) { _uiState.value = _uiState.value.copy(noHpPenerima = value, errorMessage = null) }

    /** Tombol "Simpan" pada form Ubah Alamat diklik -> validasi dulu, jika lolos buka popup konfirmasi. */
    fun onSimpanClicked() {
        val state = _uiState.value
        if (state.alamatLengkap.isBlank() || state.namaPenerima.isBlank() || state.noHpPenerima.isBlank()) {
            _uiState.value = state.copy(errorMessage = "Alamat lengkap, nama, dan nomor HP penerima wajib diisi")
            return
        }
        _uiState.value = state.copy(showConfirmDialog = true, errorMessage = null)
    }

    /** Tombol "Tidak" pada popup konfirmasi -> tutup popup, TIDAK ada data alamat yang diubah. */
    fun onDismissConfirmDialog() {
        _uiState.value = _uiState.value.copy(showConfirmDialog = false)
    }

    /** Tombol "Simpan" pada popup konfirmasi -> perubahan benar-benar disimpan ke database sesuai [id] alamat ini. */
    fun onConfirmSimpan() {
        val state = _uiState.value.copy(showConfirmDialog = false)
        _uiState.value = state
        viewModelScope.launch {
            _uiState.value = state.copy(isSaving = true, errorMessage = null)
            updateAlamatUseCase(state.alamatLengkap, state.latitude, state.longitude)
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