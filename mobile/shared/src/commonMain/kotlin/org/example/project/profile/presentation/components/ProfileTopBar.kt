package org.example.project.profile.presentation.components

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.ChevronLeft
import androidx.compose.material3.Icon
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import org.example.project.core.theme.AppColors
import org.example.project.core.theme.AppSpacing

/**
 * Header sesuai seluruh frame "Informasi Pribadi / Alamat Pengiriman / Bantuan / Tentang
 * Harvesta / Ubah Password / Alamat Baru / Ubah Alamat" pada Figma: latar putih, ikon panah
 * kembali di kiri, judul tebal di tengah.
 */
@Composable
fun ProfileTopBar(
    title: String,
    onBackClick: () -> Unit
) {
    Box(
        modifier = Modifier
            .fillMaxWidth()
            .background(AppColors.White)
            .padding(horizontal = AppSpacing.md, vertical = AppSpacing.md)
    ) {
        Box(
            modifier = Modifier
                .size(28.dp)
                .clickable(onClick = onBackClick)
                .align(Alignment.CenterStart)
        ) {
            Icon(
                imageVector = Icons.Default.ChevronLeft,
                contentDescription = "Kembali",
                tint = AppColors.Text,
                modifier = Modifier.size(28.dp)
            )
        }
        Text(
            text = title,
            style = MaterialTheme.typography.titleLarge,
            fontWeight = FontWeight.Bold,
            color = AppColors.Text,
            modifier = Modifier.align(Alignment.Center)
        )
    }
}