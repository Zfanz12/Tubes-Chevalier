package org.example.project.cart.data.repository

import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import org.example.project.cart.data.dto.CheckoutItemRequestDto
import org.example.project.cart.data.dto.CheckoutRequestDto
import org.example.project.cart.data.remote.CartApiService
import org.example.project.cart.domain.model.CartItem
import org.example.project.cart.domain.model.CheckoutResult
import org.example.project.cart.domain.model.SimilarProduct
import org.example.project.cart.domain.repository.CartRepository
import org.example.project.core.network.mapNetworkError

// Keranjang murni state lokal (lihat catatan di CartItem.kt -- backend tidak punya endpoint
// cart), disimpan di MutableStateFlow supaya Home/Search/Keranjang selalu sinkron. Diisi data
// contoh di awal (persis konten "keranjang" di Figma) supaya layar Keranjang tidak kosong saat
// pertama dibuka -- mengikuti pola HomeRepositoryImpl yang juga memakai data lokal untuk fitur
// yang belum punya endpoint sungguhan.
//
// Yang TERHUBUNG ke backend sungguhan lewat CartApiService:
//   - getSimilarProducts() -> GET /petani (dipakai untuk grid "Produk Serupa")
//   - checkout()           -> POST /transaksi (dipanggil per petani saat tombol Checkout ditekan)
class CartRepositoryImpl(private val api: CartApiService) : CartRepository {

    private val _cartItems = MutableStateFlow(seedInitialCart())
    override val cartItems: StateFlow<List<CartItem>> = _cartItems.asStateFlow()

    override fun addItem(
        petaniId: Long,
        petaniName: String,
        produkId: Long,
        productName: String,
        imageUrl: String?,
        price: Double,
        unit: String,
        quantity: Int,
        isAvailable: Boolean
    ) {
        val key = CartItem.key(petaniId, produkId)
        val current = _cartItems.value
        val existing = current.firstOrNull { it.id == key }

        _cartItems.value = if (existing != null) {
            current.map { if (it.id == key) it.copy(quantity = it.quantity + quantity) else it }
        } else {
            current + CartItem(
                id = key,
                petaniId = petaniId,
                petaniName = petaniName,
                produkId = produkId,
                productName = productName,
                imageUrl = imageUrl,
                price = price,
                unit = unit,
                quantity = quantity.coerceAtLeast(1),
                isSelected = true,
                isAvailable = isAvailable
            )
        }
    }

    override fun updateQuantity(itemId: String, quantity: Int) {
        if (quantity <= 0) {
            removeItem(itemId)
            return
        }
        _cartItems.value = _cartItems.value.map { if (it.id == itemId) it.copy(quantity = quantity) else it }
    }

    override fun removeItem(itemId: String) {
        _cartItems.value = _cartItems.value.filterNot { it.id == itemId }
    }

    override fun setItemSelected(itemId: String, selected: Boolean) {
        _cartItems.value = _cartItems.value.map { if (it.id == itemId) it.copy(isSelected = selected) else it }
    }

    override fun setStoreSelected(petaniId: Long, selected: Boolean) {
        _cartItems.value = _cartItems.value.map {
            if (it.petaniId == petaniId && it.isAvailable) it.copy(isSelected = selected) else it
        }
    }

    override fun setAllSelected(selected: Boolean) {
        _cartItems.value = _cartItems.value.map { if (it.isAvailable) it.copy(isSelected = selected) else it }
    }

    override suspend fun getSimilarProducts(): Result<List<SimilarProduct>> = runCatching {
        val fromDatabase = runCatching {
            api.getPetani().flatMap { petani ->
                // Ambil SEMUA produk milik petani ini (field `produks`), bukan cuma yang pertama,
                // supaya "Produk Serupa" tidak melulu 1 kartu per toko seperti di modul search.
                petani.produks.map { produk ->
                    SimilarProduct(
                        petaniId = petani.id,
                        petaniName = petani.nama,
                        produkId = produk.id,
                        productName = produk.namaBarang,
                        imageUrl = null, // TODO: backend belum punya kolom gambar produk
                        price = produk.harga,
                        unit = "kg",
                        stock = produk.stok,
                        isOrganic = false // TODO: backend belum punya kolom "organik"
                    )
                }
            }
        }.getOrDefault(emptyList())

        // Backend saat ini realistiknya cuma punya sedikit petani/produk seed, jadi grid 2 kolom
        // ala Figma dilengkapi beberapa produk dummy (isDummy = true) supaya tampilan tetap penuh
        // sesuai instruksi: "tampilkan sebagian dummy data".
        val dummy = dummySimilarProducts().filter { d ->
            fromDatabase.none { it.produkId == d.produkId && it.petaniId == d.petaniId }
        }

        (fromDatabase + dummy).distinctBy { it.petaniId to it.produkId }
    }.mapNetworkError()

    override suspend fun checkout(
        items: List<CartItem>,
        metodePembayaran: String,
        metodePengiriman: String
    ): Result<List<CheckoutResult>> = runCatching {
        require(items.isNotEmpty()) { "Pilih minimal 1 produk untuk checkout" }

        // Satu transaksi backend hanya boleh 1 petani -> kelompokkan dulu, lalu POST /transaksi
        // sekali per kelompok. Kalau salah satu gagal, exception dilempar & sisanya batal --
        // errornya sudah cukup jelas (mis. stok tidak cukup) untuk ditampilkan ke pengguna.
        val results = items.groupBy { it.petaniId }.map { (petaniId, groupItems) ->
            val response = api.checkout(
                CheckoutRequestDto(
                    petaniId = petaniId,
                    metodePembayaran = metodePembayaran,
                    metodePengiriman = metodePengiriman,
                    items = groupItems.map { CheckoutItemRequestDto(produkId = it.produkId, jumlah = it.quantity.toDouble()) }
                )
            )
            val data = response.data
            CheckoutResult(
                petaniId = petaniId,
                petaniName = groupItems.first().petaniName,
                kodeTransaksi = data?.kodeTransaksi ?: "-",
                totalHarga = data?.totalHarga ?: groupItems.sumOf { it.subtotal },
                statusPesanan = data?.statusPesanan ?: "pending",
                statusPembayaran = data?.statusPembayaran ?: "unpaid"
            )
        }

        // Checkout sukses -> keluarkan item yang baru saja dipesan dari keranjang.
        val checkedOutIds = items.map { it.id }.toSet()
        _cartItems.value = _cartItems.value.filterNot { it.id in checkedOutIds }

        results
    }.mapNetworkError()

    private fun seedInitialCart(): List<CartItem> = listOf(
        CartItem(
            id = CartItem.key(1, 101), petaniId = 1, petaniName = "Tani Makmur",
            produkId = 101, productName = "Bayam Organik Asal Jember", imageUrl = null,
            price = 25_000.0, unit = "ikat", quantity = 2, isSelected = true
        ),
        CartItem(
            id = CartItem.key(1, 102), petaniId = 1, petaniName = "Tani Makmur",
            produkId = 102, productName = "Kangkung Mantep", imageUrl = null,
            price = 20_000.0, unit = "ikat", quantity = 10, isSelected = true
        ),
        CartItem(
            id = CartItem.key(2, 201), petaniId = 2, petaniName = "Udin Mekar",
            produkId = 201, productName = "Bayam Hijau Segar", imageUrl = null,
            price = 15_000.0, unit = "ikat", quantity = 2, isSelected = true
        ),
        CartItem(
            id = CartItem.key(2, 202), petaniId = 2, petaniName = "Udin Mekar",
            produkId = 202, productName = "Tomat Asal Ngawi", imageUrl = null,
            price = 10_000.0, unit = "kg", quantity = 2, isSelected = true
        ),
        CartItem(
            id = CartItem.key(2, 203), petaniId = 2, petaniName = "Udin Mekar",
            produkId = 203, productName = "Bayam Hijau Segar", imageUrl = null,
            price = 7_500.0, unit = "ikat", quantity = 2, isSelected = false, isAvailable = false
        ),
        CartItem(
            id = CartItem.key(3, 301), petaniId = 3, petaniName = "Sayur Ngawi",
            produkId = 301, productName = "Bayam Organik Asal Jember", imageUrl = null,
            price = 25_000.0, unit = "ikat", quantity = 2, isSelected = false
        ),
        CartItem(
            id = CartItem.key(3, 302), petaniId = 3, petaniName = "Sayur Ngawi",
            produkId = 302, productName = "Kangkung Mantep", imageUrl = null,
            price = 20_000.0, unit = "ikat", quantity = 10, isSelected = false
        )
    )

    // Toko "Sayur Ngawi" (petaniId 3) sengaja ditandai libur lewat CartViewModel (lihat
    // CLOSED_STORE_IDS) supaya perilakunya konsisten persis Figma (340:1861 "toko 3" -> badge
    // "Sedang libur", seluruh item tidak bisa dicentang).
    private fun dummySimilarProducts(): List<SimilarProduct> = listOf(
        SimilarProduct(1, "Tani Makmur", 9001, "Wortel Lokal", null, 12_500.0, "kg", 12.0, isOrganic = true, isDummy = true),
        SimilarProduct(1, "Tani Makmur", 9002, "Pak Choy Gokil", null, 12_500.0, "kg", 12.0, isDummy = true),
        SimilarProduct(1, "Tani Makmur", 9003, "Kangkung Mantep", null, 12_500.0, "kg", 12.0, isDummy = true),
        SimilarProduct(1, "Tani Makmur", 9004, "Bayam Organik Asal Jember", null, 12_500.0, "kg", 12.0, isOrganic = true, isDummy = true)
    )
}
