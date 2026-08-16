package org.example.project.home.domain.model

data class ProductPreview(
    val id: String,
    val name: String,
    val farmerName: String,
    val imageUrl: String?,
    val price: Double,
    val unit: String = "kg",
    val stock: Double,
    val distanceKm: Double,
    val isOrganic: Boolean = false,
    val rating: Double = 0.0
)