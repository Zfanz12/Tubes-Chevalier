package org.example.project.profile.presentation.components

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.statusBarsPadding
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.ChatBubbleOutline
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
import org.example.project.core.theme.AppSpacing

/**
 * Header untuk halaman utama Profile (tab root, bukan sub-halaman): judul "Profile" tebal
 * di kiri, aksi Keranjang & Pesan (dengan badge notifikasi) berbentuk lingkaran di kanan.
 */
@Composable
fun ProfileMainTopBar(
    hasCartBadge: Boolean = true,
    hasMessageBadge: Boolean = true,
    onCartClick: () -> Unit = {},
    onMessageClick: () -> Unit = {}
) {
    Row(
        modifier = Modifier
            .fillMaxWidth()
            .background(AppColors.White)
            .statusBarsPadding()
            .padding(horizontal = AppSpacing.md, vertical = AppSpacing.sm + 4.dp),
        horizontalArrangement = androidx.compose.foundation.layout.Arrangement.SpaceBetween,
        verticalAlignment = Alignment.CenterVertically
    ) {
        Text(
            text = "Profile",
            style = MaterialTheme.typography.titleLarge,
            fontWeight = FontWeight.Bold,
            color = AppColors.Text
        )

        Row(
            horizontalArrangement = androidx.compose.foundation.layout.Arrangement.spacedBy(AppSpacing.sm)
        ) {
            ProfileTopBarIconButton(
                icon = Icons.Default.ShoppingCart,
                contentDescription = "Keranjang",
                showBadge = hasCartBadge,
                onClick = onCartClick
            )
            ProfileTopBarIconButton(
                icon = Icons.Default.ChatBubbleOutline,
                contentDescription = "Pesan",
                showBadge = hasMessageBadge,
                onClick = onMessageClick
            )
        }
    }
}

@Composable
private fun ProfileTopBarIconButton(
    icon: androidx.compose.ui.graphics.vector.ImageVector,
    contentDescription: String,
    showBadge: Boolean,
    onClick: () -> Unit
) {
    Box(
        modifier = Modifier.size(40.dp),
        contentAlignment = Alignment.Center
    ) {
        Box(
            modifier = Modifier
                .size(40.dp)
                .clip(CircleShape)
                .border(1.dp, AppColors.Border, CircleShape)
                .clickable(onClick = onClick),
            contentAlignment = Alignment.Center
        ) {
            Icon(
                imageVector = icon,
                contentDescription = contentDescription,
                tint = AppColors.Primary,
                modifier = Modifier.size(18.dp)
            )
        }

        if (showBadge) {
            Box(
                modifier = Modifier
                    .size(8.dp)
                    .align(Alignment.TopEnd)
                    .clip(CircleShape)
                    .background(AppColors.Error)
                    .border(1.dp, AppColors.White, CircleShape)
            )
        }
    }
}