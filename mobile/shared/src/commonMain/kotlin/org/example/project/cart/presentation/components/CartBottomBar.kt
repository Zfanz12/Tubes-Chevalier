package org.example.project.cart.presentation.components

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.CheckBox
import androidx.compose.material.icons.filled.CheckBoxOutlineBlank
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.material3.Icon
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import org.example.project.core.theme.AppColors

// Figma node 337:495 "cta" -- checkbox "Semua" + label total di kiri, tombol hijau
// "Checkout (n)" pill di kanan, menempel di bawah layar (background putih, shadow tipis).
@Composable
fun CartBottomBar(
    isAllSelected: Boolean,
    selectedCount: Int,
    selectedTotal: Double,
    isCheckingOut: Boolean,
    onToggleAll: (Boolean) -> Unit,
    onCheckout: () -> Unit
) {
    Row(
        modifier = Modifier.fillMaxWidth().background(AppColors.White).padding(horizontal = 16.dp, vertical = 12.dp),
        verticalAlignment = Alignment.CenterVertically
    ) {
        Icon(
            imageVector = if (isAllSelected) Icons.Default.CheckBox else Icons.Default.CheckBoxOutlineBlank,
            contentDescription = "Pilih semua",
            tint = AppColors.Primary,
            modifier = Modifier.size(20.dp).clickable { onToggleAll(!isAllSelected) }
        )
        Spacer(Modifier.width(8.dp))
        Column {
            Text("Semua", color = AppColors.Text, fontSize = 12.sp)
            Text("Rp ${selectedTotal.toInt()}", color = AppColors.Primary, fontSize = 16.sp, fontWeight = FontWeight.Bold)
        }

        Spacer(Modifier.weight(1f))

        Row(
            modifier = Modifier
                .background(if (selectedCount > 0) AppColors.Primary else AppColors.TextMuted, RoundedCornerShape(80.dp))
                .clickable(enabled = selectedCount > 0 && !isCheckingOut) { onCheckout() }
                .padding(horizontal = 24.dp, vertical = 12.dp),
            verticalAlignment = Alignment.CenterVertically
        ) {
            if (isCheckingOut) {
                CircularProgressIndicator(modifier = Modifier.size(16.dp), color = Color.White, strokeWidth = 2.dp)
                Spacer(Modifier.width(8.dp))
            }
            Text("Checkout ($selectedCount)", color = AppColors.White, fontSize = 14.sp, fontWeight = FontWeight.SemiBold)
        }
    }
}
