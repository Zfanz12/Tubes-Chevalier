package org.example.project.search.presentation.components

import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import org.example.project.core.presentation.components.ProductGridCard
import org.example.project.home.domain.model.ProductPreview

// Figma: "card-product" (1114:274) -- border #EFEFEF radius 12dp, gambar 1:1 radius 8dp,
// badge "Organik" bg Primary di pojok kanan-atas gambar, harga Primary bold,
// stok Tertiary (#8B5E3C), tombol "Tambahkan" pill Primary.
@Composable
fun SearchProductCard(
    product: ProductPreview,
    onAddToCart: (ProductPreview) -> Unit = {},
    modifier: Modifier = Modifier
) {
    ProductGridCard(
        farmerName = product.farmerName,
        productName = product.name,
        stockLabel = "Stok: ${product.stock.toInt()} ${product.unit}",
        price = product.price,
        unit = product.unit,
        isOrganic = product.isOrganic,
        onAddToCart = { onAddToCart(product) },
        modifier = modifier
    )
}