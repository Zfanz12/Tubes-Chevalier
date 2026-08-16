package org.example.project.cart.data.dto

import kotlinx.serialization.SerialName
import kotlinx.serialization.Serializable

// GET /petani (PetaniController@index) -- selain field ringkas (komoditas/stok/harga = produk
// PERTAMA milik petani), controller juga menyertakan `produks`: SELURUH produk milik petani itu
// (lihat `'produks' => $produkList` di PetaniController.php). Field ini yang dipakai fitur
// keranjang untuk mengisi grid "Produk Serupa" dengan produk asli dari database, bukan cuma satu
// per toko seperti yang dipakai modul search.
@Serializable
data class PetaniWithProdukDto(
    val id: Long,
    val nama: String,
    val komoditas: String,
    val stok: Double,
    val harga: Double,
    val radius: String? = null,
    val rating: Double = 0.0,
    val logistik: String? = null,
    val produks: List<ProdukNestedDto> = emptyList()
)

@Serializable
data class ProdukNestedDto(
    val id: Long,
    @SerialName("petani_id") val petaniId: Long,
    @SerialName("nama_barang") val namaBarang: String,
    val stok: Double,
    val harga: Double
)

// POST /transaksi (TransaksiController@store). Satu request = satu petani, sesuai validasi
// backend (`petani_id` wajib & semua `produk_id` di items harus milik petani itu).
@Serializable
data class CheckoutRequestDto(
    @SerialName("petani_id") val petaniId: Long,
    @SerialName("metode_pembayaran") val metodePembayaran: String,
    @SerialName("metode_pengiriman") val metodePengiriman: String,
    val items: List<CheckoutItemRequestDto>
)

@Serializable
data class CheckoutItemRequestDto(
    @SerialName("produk_id") val produkId: Long,
    val jumlah: Double
)

@Serializable
data class CheckoutResponseDto(
    val message: String? = null,
    val data: TransaksiDataDto? = null
)

@Serializable
data class TransaksiDataDto(
    val id: Long? = null,
    @SerialName("kode_transaksi") val kodeTransaksi: String? = null,
    @SerialName("total_harga") val totalHarga: Double? = null,
    @SerialName("status_pesanan") val statusPesanan: String? = null,
    @SerialName("status_pembayaran") val statusPembayaran: String? = null
)
