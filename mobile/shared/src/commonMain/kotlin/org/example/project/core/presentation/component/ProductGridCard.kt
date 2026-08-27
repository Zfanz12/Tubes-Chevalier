package org.example.project.core.presentation.components

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.AddShoppingCart
import androidx.compose.material.icons.filled.Store
import androidx.compose.material3.Icon
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import org.example.project.core.theme.AppColors
import org.example.project.core.theme.AppShapePill
import org.example.project.core.util.formatRupiah

// Kartu produk grid generik dipakai bersama oleh:
//  - SearchProductCard (search/presentation/components) -- hasil pencarian & kategori
//  - SimilarProductCard (cart/presentation/components)  -- "Produk Serupa" di layar Keranjang
@Composable
fun ProductGridCard(
    farmerName: String,
    productName: String,
    stockLabel: String,
    price: Double,
    unit: String,
    isOrganic: Boolean,
    onAddToCart: () -> Unit,
    modifier: Modifier = Modifier,
    buttonLabel: String = "Tambahkan"
) {
    Column(
        modifier = modifier
            .fillMaxWidth()
            .border(width = 1.dp, color = AppColors.Border, shape = RoundedCornerShape(12.dp))
            .padding(12.dp),
        verticalArrangement = Arrangement.spacedBy(8.dp)
    ) {
        ProductImageWithOrganicBadge(isOrganic = isOrganic)

        Column(verticalArrangement = Arrangement.spacedBy(4.dp)) {
            Row(verticalAlignment = Alignment.CenterVertically, horizontalArrangement = Arrangement.spacedBy(4.dp)) {
                Icon(Icons.Default.Store, contentDescription = null, tint = AppColors.TextMuted, modifier = Modifier.size(16.dp))
                Text(farmerName, color = AppColors.TextMuted, fontSize = 12.sp)
            }
            Text(productName, color = AppColors.Text, fontSize = 14.sp, fontWeight = FontWeight.SemiBold, maxLines = 2)
            Text(stockLabel, color = AppColors.Tertiary, fontSize = 10.sp, fontWeight = FontWeight.SemiBold)
        }

        Row(verticalAlignment = Alignment.Bottom) {
            Text("${formatRupiah(price)} ", color = AppColors.Primary, fontSize = 16.sp, fontWeight = FontWeight.Bold)
            Text("/$unit", color = AppColors.Subtitle, fontSize = 12.sp)
        }

        AddToCartPillButton(label = buttonLabel, onClick = onAddToCart)
    }
}

// Gambar produk 1:1 + badge "Organik" di pojok kanan-atas (Figma "card-product").
@Composable
private fun ProductImageWithOrganicBadge(isOrganic: Boolean) {
    Box(modifier = Modifier.fillMaxWidth().aspectRatio(1f)) {
        // TODO: ganti dengan AsyncImage begitu imageUrl dari API tersedia
        Box(modifier = Modifier.fillMaxSize().clip(RoundedCornerShape(8.dp)).background(AppColors.Neutral))
        if (isOrganic) {
            Box(
                modifier = Modifier
                    .align(Alignment.TopEnd)
                    .background(AppColors.Primary, AppShapePill)
                    .padding(horizontal = 8.dp, vertical = 4.dp)
            ) {
                Text("Organik", color = AppColors.White, fontSize = 10.sp, fontWeight = FontWeight.SemiBold)
            }
        }
    }
}

// Tombol pill hijau penuh dengan ikon keranjang, dipakai di semua kartu produk grid.
@Composable
private fun AddToCartPillButton(label: String, onClick: () -> Unit) {
    Row(
        modifier = Modifier
            .background(AppColors.Primary, AppShapePill)
            .clickable(onClick = onClick)
            .padding(horizontal = 12.dp, vertical = 8.dp)
            .fillMaxWidth(),
        horizontalArrangement = Arrangement.Center,
        verticalAlignment = Alignment.CenterVertically
    ) {
        Icon(Icons.Default.AddShoppingCart, contentDescription = null, tint = AppColors.White, modifier = Modifier.size(16.dp))
        Spacer(Modifier.width(8.dp))
        Text(label, color = AppColors.White, fontSize = 12.sp, fontWeight = FontWeight.SemiBold)
    }
}