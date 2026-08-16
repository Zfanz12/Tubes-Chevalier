package org.example.project.search.data.dto

import kotlinx.serialization.Serializable

// Persis field yang dikembalikan PetaniController@index (Backend/Http/Controllers/Api/PetaniController.php):
// id, nama, komoditas, stok, harga, radius, rating, logistik.
//
// CATATAN KETERBATASAN BACKEND (penting dibaca sebelum lanjut kembangkan fitur search):
// 1. Endpoint ini me-return SATU produk per petani saja (`$petani->produks->first()`), bukan seluruh
//    katalog produk. Kalau satu petani punya banyak komoditas, yang lain tidak akan pernah muncul di
//    hasil pencarian sampai backend diubah untuk me-return semua produk (bukan hanya produk pertama).
// 2. Tidak ada query di endpoint ini sama sekali (tidak ada `?q=`, `?sort=`, dst) -- controller selalu
//    return SEMUA petani. Jadi pencarian, filter Rating/Harga/Lokasi, dan suggestion di app ini
//    SEMUA dikerjakan di sisi klien (Kotlin), bukan di server.
// 3. `radius` adalah string bebas (mis. "5 km"), bukan angka jarak asli -- di-parse best-effort di
//    PetaniMapper.kt. Untuk sorting lokasi yang akurat, sebaiknya backend penyediakan field numerik
//    (mis. latitude/longitude atau distance_km).
// 4. Tidak ada field gambar produk maupun flag "organik" -- keduanya belum ada di tabel `produks`.
@Serializable
data class PetaniDto(
    val id: Long,
    val nama: String,
    val komoditas: String,
    val stok: Double,
    val harga: Double,
    val radius: String? = null,
    val rating: Double = 0.0,
    val logistik: String? = null
)