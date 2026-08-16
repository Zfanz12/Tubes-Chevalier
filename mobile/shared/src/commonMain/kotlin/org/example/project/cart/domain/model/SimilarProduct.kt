package org.example.project.cart.domain.model

// Kartu "Produk Serupa" di bawah keranjang. Sebagian besar diisi dari database sungguhan
// (GET /petani, lihat CartRepositoryImpl.getSimilarProducts), sisanya (isDummy = true) adalah
// data statis pelengkap -- backend saat ini HANYA mengembalikan 1 produk per petani
// (PetaniController@index: `$petani->produks->first()` untuk field komoditas/stok/harga di root,
// meski field `produks` di response berisi semua produk milik petani itu), jadi variasi produk
// dari database saja belum cukup untuk mengisi grid 2 kolom seperti di Figma.
data class SimilarProduct(
    val petaniId: Long,
    val petaniName: String,
    val produkId: Long,
    val productName: String,
    val imageUrl: String?,
    val price: Double,
    val unit: String = "kg",
    val stock: Double,
    val isOrganic: Boolean = false,
    val isDummy: Boolean = false
)

// Hasil satu transaksi setelah checkout berhasil dibuat di backend (POST /transaksi).
data class CheckoutResult(
    val petaniId: Long,
    val petaniName: String,
    val kodeTransaksi: String,
    val totalHarga: Double,
    val statusPesanan: String,
    val statusPembayaran: String
)
