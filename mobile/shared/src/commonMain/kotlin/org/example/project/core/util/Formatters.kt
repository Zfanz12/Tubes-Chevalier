package org.example.project.core.util

// Format ribuan ala Indonesia (mis. 12500.0 -> "Rp 12.500", 125000.0 -> "Rp 125.000").
// BARU -- sebelumnya ProductCard & SearchProductCard menampilkan harga mentah lewat
// `product.price.toInt()` (contoh: "Rp 12500"), tidak konsisten dengan format di Figma
// ("Rp 12.500") maupun dengan formatRupiah lokal yang sudah ada di OrderCard.kt.
// Dipindah ke sini supaya satu implementasi dipakai di semua tempat yang menampilkan harga.
fun formatRupiah(amount: Double, withPrefix: Boolean = true): String {
    val rounded = amount.toLong()
    val grouped = rounded.toString().reversed().chunked(3).joinToString(".").reversed()
    return if (withPrefix) "Rp $grouped" else grouped
}