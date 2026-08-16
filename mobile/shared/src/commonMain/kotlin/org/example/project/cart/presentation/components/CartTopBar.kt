package org.example.project.cart.presentation.components

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.ChevronLeft
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import org.example.project.core.theme.AppColors

// Figma node 337:499 "back" -- chevron kiri + judul "Keranjang" bold 20sp di atas background putih.
@Composable
fun CartTopBar(onBack: () -> Unit) {
    Row(
        modifier = Modifier.fillMaxWidth().background(AppColors.White).padding(vertical = 12.dp, horizontal = 12.dp),
        verticalAlignment = Alignment.CenterVertically
    ) {
        IconButton(onClick = onBack) {
            Icon(imageVector = Icons.Default.ChevronLeft, contentDescription = "Kembali", tint = AppColors.Text)
        }
        Text("Keranjang", fontSize = 20.sp, fontWeight = FontWeight.Bold, color = AppColors.Text)
    }
}
