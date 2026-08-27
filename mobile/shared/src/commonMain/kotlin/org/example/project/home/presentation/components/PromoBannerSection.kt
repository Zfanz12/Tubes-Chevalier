package org.example.project.home.presentation.components

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import org.example.project.core.theme.AppColors

@Composable
fun PromoBannerSection() {
    Column {
        Text("Sedang Diskon", style = MaterialTheme.typography.titleMedium, fontWeight = FontWeight.Bold)
        Spacer(Modifier.height(12.dp))
        Row(horizontalArrangement = Arrangement.spacedBy(12.dp)) {
            PromoCard(modifier = Modifier.weight(1f))
            PromoCard(modifier = Modifier.weight(1f))
        }
    }
}

@Composable
private fun PromoCard(modifier: Modifier = Modifier) {
    // TODO: ganti Box ini dengan AsyncImage/gambar promo asli saat data API siap
    Box(
        modifier = modifier.height(192.dp).clip(RoundedCornerShape(16.dp))
            .background(AppColors.Secondary.copy(alpha = 0.25f))
    )
}