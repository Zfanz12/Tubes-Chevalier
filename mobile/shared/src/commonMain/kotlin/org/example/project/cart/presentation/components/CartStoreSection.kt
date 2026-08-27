package org.example.project.cart.presentation.components

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.CheckBox
import androidx.compose.material.icons.filled.CheckBoxOutlineBlank
import androidx.compose.material.icons.filled.ChevronRight
import androidx.compose.material3.Icon
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import org.example.project.cart.domain.model.CartItem
import org.example.project.cart.domain.model.CartStoreGroup
import org.example.project.core.theme.AppColors
import org.example.project.core.theme.AppShapePill

// Figma node 340:1733 "toko 1" -- header nama toko (+ badge "Sedang libur" node 348:3808 kalau
// group.isOpen = false) diikuti daftar CartItemRow per produk milik toko itu.
@Composable
fun CartStoreSection(
    group: CartStoreGroup,
    onToggleStore: (Boolean) -> Unit,
    onToggleItem: (CartItem, Boolean) -> Unit,
    onIncrease: (CartItem) -> Unit,
    onDecrease: (CartItem) -> Unit,
    onRemove: (CartItem) -> Unit,
    onStoreClick: () -> Unit = {}
) {
    Column(
        modifier = Modifier.fillMaxWidth().background(AppColors.White).padding(horizontal = 12.dp, vertical = 18.dp),
        verticalArrangement = Arrangement.spacedBy(12.dp)
    ) {
        Row(verticalAlignment = Alignment.CenterVertically, horizontalArrangement = Arrangement.spacedBy(12.dp)) {
            Icon(
                imageVector = if (group.isFullySelected) Icons.Default.CheckBox else Icons.Default.CheckBoxOutlineBlank,
                contentDescription = "Pilih semua produk ${group.petaniName}",
                tint = if (group.isOpen) AppColors.Primary else AppColors.Border,
                modifier = Modifier.size(20.dp).clickable(enabled = group.isOpen) { onToggleStore(!group.isFullySelected) }
            )
            Row(
                verticalAlignment = Alignment.CenterVertically,
                horizontalArrangement = Arrangement.spacedBy(8.dp),
                modifier = Modifier.clickable(onClick = onStoreClick)
            ) {
                Text(group.petaniName, color = AppColors.TextDark, fontSize = 14.sp, fontWeight = FontWeight.Medium)
                Icon(imageVector = Icons.Default.ChevronRight, contentDescription = null, tint = AppColors.TextDark, modifier = Modifier.size(14.dp))
            }
            if (!group.isOpen) {
                Box(modifier = Modifier.background(AppColors.TextMuted, AppShapePill).padding(horizontal = 12.dp, vertical = 4.dp)) {
                    Text("Sedang libur", color = AppColors.White, fontSize = 10.sp, fontWeight = FontWeight.Medium)
                }
            }
        }

        Column(verticalArrangement = Arrangement.spacedBy(24.dp)) {
            group.items.forEach { item ->
                CartItemRow(
                    item = item,
                    enabled = group.isOpen && item.isAvailable,
                    onToggleSelected = { selected -> onToggleItem(item, selected) },
                    onIncrease = { onIncrease(item) },
                    onDecrease = { onDecrease(item) },
                    onRemove = { onRemove(item) }
                )
            }
        }
    }
}
