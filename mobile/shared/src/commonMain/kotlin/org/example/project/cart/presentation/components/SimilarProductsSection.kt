package org.example.project.cart.presentation.components

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import org.example.project.cart.domain.model.SimilarProduct
import org.example.project.core.theme.AppColors

// Figma node 337:494 "similar-product" -- judul "Produk Serupa" + subjudul, lalu grid 2 kolom.
// Digambar manual pakai Column/Row (chunked per 2) -- BUKAN LazyVerticalGrid -- karena section
// ini duduk di dalam Column yang sudah scrollable (mengikuti pola CategorySection di modul home).
@Composable
fun SimilarProductsSection(products: List<SimilarProduct>, onAddToCart: (SimilarProduct) -> Unit) {
    Column(
        modifier = Modifier.fillMaxWidth().background(AppColors.White).padding(16.dp),
        verticalArrangement = Arrangement.spacedBy(12.dp)
    ) {
        Column(verticalArrangement = Arrangement.spacedBy(2.dp)) {
            Text("Produk Serupa", color = AppColors.Text, fontSize = 16.sp, fontWeight = FontWeight.Bold)
            Text("Rekomendasi produk lain dari petani sekitar", color = AppColors.Subtitle, fontSize = 12.sp)
        }

        products.chunked(2).forEach { rowProducts ->
            Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.spacedBy(12.dp)) {
                rowProducts.forEach { product ->
                    SimilarProductCard(product = product, onAddToCart = onAddToCart, modifier = Modifier.weight(1f))
                }
                if (rowProducts.size == 1) Spacer(modifier = Modifier.weight(1f))
            }
        }
    }
}
