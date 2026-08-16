package org.example.project.profile.presentation.tambah_alamat

import androidx.lifecycle.ViewModel
import kotlin.random.Random
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import org.example.project.profile.presentation.alamat_pengiriman.AlamatItem

class TambahAlamatViewModel : ViewModel() {

    private val _uiState = MutableStateFlow(TambahAlamatUiState())
    val uiState: StateFlow<TambahAlamatUiState> = _uiState.asStateFlow()

    fun onAlamatLengkapChange(value: String) { _uiState.value = _uiState.value.copy(alamatLengkap = value, errorMessage = null) }
    fun onCatatanChange(value: String) { _uiState.value = _uiState.value.copy(catatan = value, errorMessage = null) }
    fun onNamaPenerimaChange(value: String) { _uiState.value = _uiState.value.copy(namaPenerima = value, errorMessage = null) }
    fun onNoHpPenerimaChange(value: String) { _uiState.value = _uiState.value.copy(noHpPenerima = value, errorMessage = null) }

    /** Tombol "Simpan Alamat" pada form diklik -> validasi dulu, jika lolos buka popup konfirmasi "Simpan". */
    fun onSimpanClicked() {
        val state = _uiState.value
        if (state.alamatLengkap.isBlank() || state.namaPenerima.isBlank() || state.noHpPenerima.isBlank()) {
            _uiState.value = state.copy(errorMessage = "Alamat lengkap, nama, dan nomor HP penerima wajib diisi")
            return
        }
        _uiState.value = state.copy(showConfirmDialog = true, errorMessage = null)
    }

    /** Tombol "Tidak" pada popup konfirmasi -> tutup popup, TIDAK ada data alamat baru yang dibuat. */
    fun onDismissConfirmDialog() {
        _uiState.value = _uiState.value.copy(showConfirmDialog = false)
    }

    /** Tombol "Simpan" pada popup konfirmasi -> alamat baru benar-benar dibuat & disimpan (lihat [ProfileNavHost]). */
    fun onConfirmSimpan(): AlamatItem {
        val state = _uiState.value
        _uiState.value = state.copy(showConfirmDialog = false, isSuccess = true)
        return AlamatItem(
            id = Random.nextLong().toString(),
            namaPenerima = state.namaPenerima,
            noHpPenerima = state.noHpPenerima,
            alamatLengkap = state.alamatLengkap,
            catatan = state.catatan,
            isUtama = false
        )
    }
}