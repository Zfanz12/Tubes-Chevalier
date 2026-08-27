package org.example.project.profile.presentation.alamat_pengiriman

/**
 * Model alamat pengiriman untuk kebutuhan UI "Alamat Pengiriman" / "Alamat Baru" / "Ubah Alamat".
 *
 * CATATAN: [org.example.project.profile.domain.model.UserProfile] saat ini hanya menyimpan satu
 * field `alamat` bertipe String, sedangkan Figma menuntut daftar alamat bernama dengan penerima
 * & catatan masing-masing. Model ini sengaja diletakkan di layer presentation (bukan domain)
 * karena belum ada endpoint/DTO backend yang mendukung banyak alamat -- begitu tersedia,
 * pindahkan ke domain/model dan hubungkan lewat repository sesungguhnya.
 */
data class AlamatItem(
    val id: String,
    val namaPenerima: String,
    val noHpPenerima: String,
    val alamatLengkap: String,
    val catatan: String = "",
    val isUtama: Boolean = false
)