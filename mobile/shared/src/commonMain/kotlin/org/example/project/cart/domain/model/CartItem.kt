package org.example.project.cart.domain.model

// Satu baris produk di keranjang. `id` adalah key unik ("petaniId:produkId") supaya jumlah
// bisa digabung otomatis kalau produk yang sama ditambahkan lagi dari Home/Search/Produk Serupa.
//
// CATATAN ARSITEKTUR (penting dibaca sebelum lanjut kembangkan fitur ini):
// Backend (routes/api.php & migrations/) SAMA SEKALI tidak punya tabel/endpoint "cart" atau
// "keranjang" -- yang ada hanya GET /petani (katalog) dan POST /transaksi (checkout langsung,
// tanpa keranjang tersimpan di server). Karena itu keranjang di app ini murni STATE LOKAL
// (disimpan di CartRepositoryImpl, mengikuti pola HomeRepositoryImpl yang juga pakai data lokal
// selama endpoint aslinya belum ada), dan baru "terhubung ke backend sungguhan" pada saat
// checkout, yaitu ketika CartRepositoryImpl mengelompokkan item per petani lalu memanggil
// POST /transaksi (lihat CartApiService.checkout).
data class CartItem(
    val id: String,
    val petaniId: Long,
    val petaniName: String,
    val produkId: Long,
    val productName: String,
    val imageUrl: String?,
    val price: Double,
    val unit: String = "kg",
    val quantity: Int,
    val isSelected: Boolean = true,
    // false kalau stok produk ini sudah habis -- baris tetap tampil (sesuai Figma, badge
    // "Tidak tersedia") tapi checkbox/qty stepper dinonaktifkan & tidak ikut dihitung ke total.
    val isAvailable: Boolean = true
) {
    val subtotal: Double get() = price * quantity

    companion object {
        fun key(petaniId: Long, produkId: Long) = "$petaniId:$produkId"
    }
}

// Pengelompokan item keranjang per toko (petani), sesuai section "toko 1/2/3" di Figma.
data class CartStoreGroup(
    val petaniId: Long,
    val petaniName: String,
    // false kalau toko sedang libur (badge "Sedang libur") -- seluruh item di toko ini
    // dinonaktifkan (tidak bisa dicentang/checkout) sampai toko buka lagi.
    val isOpen: Boolean = true,
    val items: List<CartItem>
) {
    val isFullySelected: Boolean get() = items.isNotEmpty() && items.all { it.isSelected || !it.isAvailable }
    val selectableItems: List<CartItem> get() = items.filter { isOpen && it.isAvailable }
}
