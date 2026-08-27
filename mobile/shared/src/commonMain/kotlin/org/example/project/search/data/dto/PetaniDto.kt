package org.example.project.search.data.dto

import kotlinx.serialization.Serializable
import org.example.project.cart.data.dto.ProdukNestedDto

@Serializable
data class PetaniDto(
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