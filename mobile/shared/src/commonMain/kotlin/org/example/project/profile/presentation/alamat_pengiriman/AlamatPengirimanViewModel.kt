package org.example.project.profile.presentation.alamat_pengiriman

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch
import org.example.project.core.network.AppError
import org.example.project.profile.domain.usecase.GetProfileUseCase
import org.example.project.profile.domain.usecase.UpdateAlamatUseCase

class AlamatPengirimanViewModel(
    private val getProfileUseCase: GetProfileUseCase,
    private val updateAlamatUseCase: UpdateAlamatUseCase
) : ViewModel() {

    private val _uiState = MutableStateFlow(AlamatPengirimanUiState(isLoading = true))
    val uiState: StateFlow<AlamatPengirimanUiState> = _uiState.asStateFlow()

    init {
        load()
    }

    private fun load() {
        viewModelScope.launch {
            _uiState.value = _uiState.value.copy(isLoading = true, errorMessage = null)
            getProfileUseCase()
                .onSuccess { profile ->
                    val alamatUtama = AlamatItem(
                        id = "utama",
                        namaPenerima = profile.name,
                        noHpPenerima = profile.noHp,
                        alamatLengkap = profile.alamat.orEmpty(),
                        isUtama = true
                    )
                    _uiState.value = _uiState.value.copy(
                        isLoading = false,
                        daftarAlamat = listOf(alamatUtama)
                    )
                }
                .onFailure { error ->
                    _uiState.value = _uiState.value.copy(isLoading = false, errorMessage = error.toMessage())
                }
        }
    }

    /** Simpan alamat baru atau perbarui yang sudah ada (dipanggil dari layar Tambah/Ubah Alamat). */
    fun upsert(item: AlamatItem) {
        val current = _uiState.value.daftarAlamat
        val updated = if (current.any { it.id == item.id }) {
            current.map { if (it.id == item.id) item else it }
        } else {
            current + item
        }
        _uiState.value = _uiState.value.copy(
            daftarAlamat = if (item.isUtama) updated.map { it.copy(isUtama = it.id == item.id) } else updated
        )
        if (item.isUtama) syncAlamatUtamaKeBackend(item)
    }

    fun jadikanUtama(id: String) {
        val current = _uiState.value.daftarAlamat
        val target = current.firstOrNull { it.id == id } ?: return
        _uiState.value = _uiState.value.copy(daftarAlamat = current.map { it.copy(isUtama = it.id == id) })
        syncAlamatUtamaKeBackend(target)
    }

    /** Tombol hapus (ikon tempat sampah) di kartu alamat diklik -> buka popup konfirmasi "Hapus Alamat". */
    fun onHapusClicked(id: String) {
        val target = _uiState.value.daftarAlamat.firstOrNull { it.id == id } ?: return
        _uiState.value = _uiState.value.copy(alamatToDelete = target)
    }

    /** Tombol "Batal" pada popup konfirmasi hapus -> tutup popup, data alamat TIDAK dihapus. */
    fun onDismissHapusDialog() {
        _uiState.value = _uiState.value.copy(alamatToDelete = null)
    }

    /** Tombol "Hapus" pada popup konfirmasi -> alamat benar-benar dihapus dari daftar. */
    fun onConfirmHapus() {
        val target = _uiState.value.alamatToDelete ?: return
        _uiState.value = _uiState.value.copy(
            daftarAlamat = _uiState.value.daftarAlamat.filterNot { it.id == target.id },
            alamatToDelete = null
        )
    }

    fun alamat(id: String): AlamatItem? = _uiState.value.daftarAlamat.firstOrNull { it.id == id }

    // Backend saat ini hanya mendukung satu field alamat bebas teks, jadi hanya alamat utama
    // yang disinkronkan; alamat lain murni tersimpan lokal sampai endpoint multi-alamat ada.
    private fun syncAlamatUtamaKeBackend(item: AlamatItem) {
        viewModelScope.launch {
            updateAlamatUseCase(item.alamatLengkap, null, null)
        }
    }

    private fun Throwable.toMessage(): String = when (this) {
        is AppError.Validation -> fieldErrors.values.flatten().firstOrNull() ?: text
        is AppError -> message
        else -> message ?: "Terjadi kesalahan"
    }
}