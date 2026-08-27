package org.example.project.search.data.mapper

import org.example.project.home.domain.model.ProductPreview
import org.example.project.search.data.dto.PetaniDto

// Satu petani -> banyak ProductPreview, satu untuk TIAP produk di `produks` (bukan cuma produk
// pertama), supaya kategori/search bisa menampilkan semua penjual suatu barang -- bukan cuma
// petani yang produk pertamanya kebetulan cocok.
fun PetaniDto.toProductPreviews(): List<ProductPreview> {

    if (produks.isEmpty()) {
        // Fallback: backend versi lama / respons tanpa field `produks` -- tetap tampilkan
        // ringkasan produk pertama seperti sebelumnya, supaya tidak hilang total.
        return listOf(
            ProductPreview(
                id = id.toString(),
                name = komoditas,
                farmerName = nama,
                imageUrl = null,        // TODO: backend belum punya kolom gambar produk
                price = harga,
                unit = "kg",
                stock = stok,
                distanceKm = parseRadiusKm(radius),
                isOrganic = false,      // TODO: backend belum punya kolom "organik"
                rating = rating
            )
        )
    }

    return produks.map { produk ->
        ProductPreview(
            id = produk.id.toString(),
            name = produk.namaBarang,
            farmerName = nama,
            imageUrl = null,            // TODO: backend belum punya kolom gambar produk
            price = produk.harga,
            unit = "kg",                 // migration produks: stok & harga tidak simpan satuan eksplisit, asumsi kg
            stock = produk.stok,
            distanceKm = parseRadiusKm(radius),
            isOrganic = false,          // TODO: backend belum punya kolom "organik"
            rating = rating
        )
    }
}

// Best-effort parsing "5 km" / "12" / null -> 5.0 / 12.0 / 0.0.
// TODO: minta backend sediakan field numerik asli (distance_km atau lat/long) untuk sorting lokasi yang akurat.
private fun parseRadiusKm(radius: String?): Double =
    radius?.let { Regex("""[0-9]+(\.[0-9]+)?""").find(it)?.value?.toDoubleOrNull() } ?: 0.0