package org.example.project.search.domain.model

enum class RatingSort(val label: String) {
    HIGHEST("Rating Tertinggi"),
    LOWEST("Rating Terendah")
}

enum class PriceSort(val label: String) {
    HIGHEST("Harga Tertinggi"),
    LOWEST("Harga Terendah")
}

enum class LocationSort(val label: String) {
    NEAREST("Toko Terdekat"),
    FARTHEST("Toko Terjauh")
}

// Default sesuai Figma: "Rating Tertinggi", "Harga Tertinggi", "Toko Terdekat" sudah terpilih duluan
data class SearchFilterState(
    val rating: RatingSort = RatingSort.HIGHEST,
    val price: PriceSort = PriceSort.HIGHEST,
    val location: LocationSort = LocationSort.NEAREST
)