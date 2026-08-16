package org.example.project.order.data.dto

import kotlinx.serialization.Serializable
import kotlinx.serialization.json.JsonElement

// Bentuk response persis mengikuti TransaksiController@index / @show (migrations/Http/Controllers/Api/TransaksiController.php):
// response()->json($transaksis) langsung dari Eloquent, TANPA API Resource/transform apa pun.
//
// PENTING soal tipe data -- kolom decimal (total_harga, jumlah, harga_satuan, harga) di
// migrations/migrations/2026_07_25_093403_create_transaksis_table.php dkk TIDAK punya $casts
// di Model (lihat Models/Transaksi.php, TransaksiItem.php, Produk.php -- beda dengan Petani/Produk
// di PetaniController yang di-cast manual (float) sebelum dikirim). Eloquent tanpa cast akan
// mengirim kolom decimal sebagai STRING berformat "55000.00" di JSON, bukan number. Karena itu
// field-field tsb di-parse sebagai JsonElement lalu dibaca via .jsonPrimitive.content.toDouble()
// di OrderMapper -- itu aman baik kalau backend suatu saat menambah cast (jadi number) maupun
// kalau tetap string seperti sekarang.
@Serializable
data class TransaksiDto(
    val id: Long,
    val kode_transaksi: String,
    val total_harga: JsonElement,
    val metode_pembayaran: String,
    val bukti_pembayaran: String? = null,
    val metode_pengiriman: String,
    val status_pesanan: String,
    val status_pembayaran: String,
    val rating: Int? = null,
    val created_at: String? = null,
    // Ada di response index() untuk role UMKM (with(['petani', 'items.produk'])) --
    // lihat TransaksiController@index. Untuk role petani, backend mengirim `user` bukan `petani`,
    // tapi halaman Order ini dibuat untuk sisi UMKM (pembeli), jadi `user` tidak dipetakan di sini.
    val petani: PetaniRelDto? = null,
    val items: List<TransaksiItemDto> = emptyList()
)

@Serializable
data class PetaniRelDto(
    val id: Long,
    val nama: String
)

@Serializable
data class TransaksiItemDto(
    val id: Long,
    val produk_id: Long,
    val jumlah: JsonElement,
    val harga_satuan: JsonElement,
    val produk: ProdukRelDto? = null
)

@Serializable
data class ProdukRelDto(
    val id: Long,
    val nama_barang: String
)

// Body untuk POST /transaksi/{id}/rate (TransaksiController@rateTransaksi, khusus role UMKM)
@Serializable
data class RateTransaksiRequestDto(
    val rating: Int
)

// Body ringkas untuk respons message-only, dipakai untuk endpoint rate/status yang cuma
// mengembalikan {"message": "..."} atau {"message": "...", "data": {...}} -- data-nya diabaikan
// di sini karena UI cukup butuh konfirmasi berhasil/gagal (state lokal sudah dioptimis-update).
@Serializable
data class OrderActionResponseDto(
    val message: String? = null
)