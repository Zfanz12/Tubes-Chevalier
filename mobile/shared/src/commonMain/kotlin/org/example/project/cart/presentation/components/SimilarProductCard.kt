package org.example.project.cart.presentation.components

import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import org.example.project.cart.domain.model.SimilarProduct
import org.example.project.core.presentation.components.ProductGridCard

// Figma node 786:517 "card-product 1" -- sama gayanya dengan SearchProductCard (modul search)
// supaya konsisten visual di seluruh app.
@Composable
fun SimilarProductCard(product: SimilarProduct, onAddToCart: (SimilarProduct) -> Unit, modifier: Modifier = Modifier) {
    ProductGridCard(
        farmerName = product.petaniName,
        productName = product.productName,
        stockLabel = "Stok: ${product.stock.toInt()} ${product.unit}",
        price = product.price,
        unit = product.unit,
        isOrganic = product.isOrganic,
        onAddToCart = { onAddToCart(product) },
        modifier = modifier
    )
}