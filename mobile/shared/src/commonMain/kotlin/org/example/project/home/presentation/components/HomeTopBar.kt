package org.example.project.home.presentation.components

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Notifications
import androidx.compose.material.icons.filled.ShoppingCart
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

@Composable
fun HomeTopBar(
    userName: String,
    location: String,
    onCartClick: () -> Unit = {},
    onNotificationClick: () -> Unit = {},
    onProfileClick: () -> Unit = {}
) {
    Row(
        modifier = Modifier.fillMaxWidth().padding(horizontal = 24.dp, vertical = 12.dp),
        horizontalArrangement = Arrangement.SpaceBetween,
        verticalAlignment = Alignment.CenterVertically
    ) {
        Row(verticalAlignment = Alignment.CenterVertically) {
            Box(
                modifier = Modifier
                    .size(42.dp)
                    .clip(CircleShape)
                    .background(AppColors.Secondary)
                    // BARU -- logo profile di kiri atas kini bisa ditekan untuk membuka ProfileScreen.
                    .clickable(onClick = onProfileClick)
            )
            Spacer(Modifier.width(12.dp))
            Column {
                Text("Hi, $userName", style = MaterialTheme.typography.titleSmall, fontWeight = FontWeight.SemiBold)
                Text(location, style = MaterialTheme.typography.bodySmall, color = AppColors.Subtitle)
            }
        }
        Row {
            Icon(
                imageVector = Icons.Default.ShoppingCart,
                contentDescription = "Keranjang",
                // BARU -- sebelumnya ikon ini tidak bisa ditekan sama sekali (param onCartClick
                // sudah ada tapi tidak pernah dipakai). Sekarang jadi pintu masuk ke CartScreen.
                modifier = Modifier.padding(8.dp).clickable(onClick = onCartClick),
                tint = AppColors.Primary
            )
            Icon(
                imageVector = Icons.Default.Notifications,
                contentDescription = "Notifikasi",
                modifier = Modifier.padding(8.dp),
                tint = AppColors.Primary
            )
        }
    }
}