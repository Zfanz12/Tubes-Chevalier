package org.example.project.home.presentation.components

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.AddShoppingCart
import androidx.compose.material.icons.filled.FavoriteBorder
import androidx.compose.material.icons.filled.LocationOn
import androidx.compose.material.icons.filled.Store
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.Icon
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import org.example.project.core.theme.AppColors
import org.example.project.home.domain.model.ProductPreview

@Composable
fun ProductCard(
    product: ProductPreview,
    onAddToCart: (ProductPreview) -> Unit = {},
    onToggleFavorite: (ProductPreview) -> Unit = {}
) {
    Card(
        shape = RoundedCornerShape(16.dp),
        colors = CardDefaults.cardColors(containerColor = AppColors.White),
        modifier = Modifier.fillMaxWidth()
    ) {
        Row(modifier = Modifier.padding(17.dp)) {
            // TODO: ganti dengan AsyncImage saat imageUrl dari API sudah ada
            Box(modifier = Modifier.size(120.dp).clip(RoundedCornerShape(12.dp)).background(AppColors.Border))
            Spacer(Modifier.width(12.dp))
            Column(modifier = Modifier.weight(1f)) {
                Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceBetween) {
                    Text(
                        product.name,
                        style = MaterialTheme.typography.bodyLarge,
                        fontWeight = FontWeight.SemiBold,
                        modifier = Modifier.weight(1f)
                    )
                    Icon(
                        imageVector = Icons.Default.FavoriteBorder,
                        contentDescription = "Favorit",
                        modifier = Modifier.size(20.dp).clickable { onToggleFavorite(product) },
                        tint = AppColors.Subtitle
                    )
                }
                Spacer(Modifier.height(4.dp))
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Icon(Icons.Default.Store, contentDescription = null, modifier = Modifier.size(14.dp), tint = AppColors.Subtitle)
                    Spacer(Modifier.width(4.dp))
                    Text(product.farmerName, style = MaterialTheme.typography.bodySmall, color = AppColors.Subtitle)
                }
                Spacer(Modifier.height(4.dp))
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Icon(Icons.Default.LocationOn, contentDescription = null, modifier = Modifier.size(14.dp), tint = AppColors.Subtitle)
                    Spacer(Modifier.width(4.dp))
                    Text("${product.distanceKm} km dari Anda", style = MaterialTheme.typography.bodySmall, color = AppColors.Subtitle)
                }
                Spacer(Modifier.height(4.dp))
                Text("Stok: ${product.stock.toInt()} kg", style = MaterialTheme.typography.bodySmall)
                Spacer(Modifier.height(8.dp))
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Row {
                        Text("Rp ${product.price.toInt()}", fontWeight = FontWeight.Bold)
                        Text("/${product.unit}", style = MaterialTheme.typography.bodySmall)
                    }
                    Box(
                        modifier = Modifier.size(36.dp).clip(CircleShape)
                            .background(AppColors.Primary)
                            .clickable { onAddToCart(product) },
                        contentAlignment = Alignment.Center
                    ) {
                        Icon(
                            imageVector = Icons.Default.AddShoppingCart,
                            contentDescription = "Tambah ke keranjang",
                            tint = AppColors.White,
                            modifier = Modifier.size(18.dp)
                        )
                    }
                }
            }
        }
    }
}