package org.example.project.search.data.mapper

import org.example.project.home.domain.model.ProductPreview
import org.example.project.search.data.dto.PetaniDto

fun PetaniDto.toProductPreview(): ProductPreview = ProductPreview(
    id = id.toString(),
    name = komoditas,          // nama_barang produk pertama milik petani ini
    farmerName = nama,         // nama petani/toko
    imageUrl = null,           // TODO: backend belum punya kolom gambar produk
    price = harga,
    unit = "kg",                // migration produks: stok & harga tidak simpan satuan eksplisit, asumsi kg
    stock = stok,
    distanceKm = parseRadiusKm(radius),
    isOrganic = false,          // TODO: backend belum punya kolom "organik"
    rating = rating
)

// Best-effort parsing "5 km" / "12" / null -> 5.0 / 12.0 / 0.0.
// TODO: minta backend sediakan field numerik asli (distance_km atau lat/long) untuk sorting lokasi yang akurat.
private fun parseRadiusKm(radius: String?): Double =
    radius?.let { Regex("""[0-9]+(\.[0-9]+)?""").find(it)?.value?.toDoubleOrNull() } ?: 0.0