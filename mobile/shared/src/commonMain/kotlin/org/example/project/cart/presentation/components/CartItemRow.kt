package org.example.project.cart.presentation.components

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.CheckBox
import androidx.compose.material.icons.filled.CheckBoxOutlineBlank
import androidx.compose.material.icons.filled.Delete
import androidx.compose.material3.Icon
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import org.example.project.cart.domain.model.CartItem
import org.example.project.core.theme.AppColors
import org.example.project.core.theme.AppShapePill

// Figma node 340:1740 "content" + 425:6609 "action" -- checkbox, foto 86x86, nama produk,
// badge jumlah, harga, lalu baris aksi (hapus + stepper qty) rata kanan di bawahnya.
// `enabled` = false kalau toko libur ATAU stok produk habis (item.isAvailable) -- checkbox &
// stepper dinonaktifkan, dan foto diberi overlay label "Tidak tersedia" (Figma node 340:1917).
@Composable
fun CartItemRow(
    item: CartItem,
    enabled: Boolean,
    onToggleSelected: (Boolean) -> Unit,
    onIncrease: () -> Unit,
    onDecrease: () -> Unit,
    onRemove: () -> Unit
) {
    Column(modifier = Modifier.fillMaxWidth(), verticalArrangement = Arrangement.spacedBy(4.dp)) {
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.spacedBy(12.dp),
            verticalAlignment = Alignment.Top
        ) {
            Icon(
                imageVector = if (item.isSelected && enabled) Icons.Default.CheckBox else Icons.Default.CheckBoxOutlineBlank,
                contentDescription = "Pilih produk",
                tint = if (enabled) AppColors.Primary else AppColors.Border,
                modifier = Modifier.size(20.dp).clickable(enabled = enabled) { onToggleSelected(!item.isSelected) }
            )

            Box(
                modifier = Modifier
                    .size(86.dp)
                    .clip(RoundedCornerShape(8.dp))
                    .border(width = 1.dp, color = AppColors.Border, shape = RoundedCornerShape(8.dp))
                    .background(AppColors.Neutral) // TODO: ganti AsyncImage(item.imageUrl) begitu backend punya kolom gambar
            ) {
                if (!item.isAvailable) {
                    Box(
                        modifier = Modifier
                            .align(Alignment.BottomCenter)
                            .fillMaxWidth()
                            .background(AppColors.TextMuted)
                            .padding(vertical = 4.dp),
                        contentAlignment = Alignment.Center
                    ) {
                        Text("Tidak tersedia", color = AppColors.White, fontSize = 10.sp)
                    }
                }
            }

            Column(
                modifier = Modifier.weight(1f).height(86.dp),
                verticalArrangement = Arrangement.SpaceBetween,
                horizontalAlignment = Alignment.End
            ) {
                Column(verticalArrangement = Arrangement.spacedBy(8.dp), horizontalAlignment = Alignment.Start) {
                    Text(
                        item.productName,
                        color = AppColors.Text,
                        fontSize = 16.sp,
                        fontWeight = FontWeight.Medium,
                        maxLines = 2
                    )
                    Box(
                        modifier = Modifier
                            .background(if (enabled) AppColors.Primary else AppColors.TextMuted, AppShapePill)
                            .padding(horizontal = 12.dp, vertical = 4.dp)
                    ) {
                        Text("${item.quantity} ${item.unit}", color = AppColors.White, fontSize = 12.sp, fontWeight = FontWeight.SemiBold)
                    }
                }
                Text("Rp ${item.price.toInt()}", color = AppColors.Primary, fontSize = 16.sp, fontWeight = FontWeight.Bold)
            }
        }

        if (enabled) {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.End,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Icon(
                    imageVector = Icons.Default.Delete,
                    contentDescription = "Hapus dari keranjang",
                    tint = AppColors.Subtitle,
                    modifier = Modifier.size(18.dp).clickable(onClick = onRemove)
                )
                Spacer(Modifier.width(16.dp))
                CartQuantityStepper(quantity = item.quantity, onDecrease = onDecrease, onIncrease = onIncrease, enabled = enabled)
            }
        }
    }
}
