package org.example.project.cart.presentation.components

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Add
import androidx.compose.material.icons.filled.Remove
import androidx.compose.material3.Icon
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import org.example.project.core.theme.AppColors
import org.example.project.core.theme.AppShapePill
import org.example.project.core.util.formatRupiah
import org.example.project.home.domain.model.ProductPreview

// Satu opsi berat yang bisa dipilih user, sesuai overlay Figma (250g / 500g / 1kg).
data class CartWeightOption(val label: String, val factor: Double)

val DefaultCartWeightOptions = listOf(
    CartWeightOption("250g", 0.25),
    CartWeightOption("500g", 0.5),
    CartWeightOption("1kg", 1.0)
)

// Figma "overlay tambah keranjang" -- gambar produk + nama + harga/kg di atas, "Pilih Berat"
// (pill selectable), "Jumlah (kg)" (stepper -/+), lalu tombol outline penuh "Masukkan Keranjang".
@Composable
fun AddToCartSheet(
    product: ProductPreview,
    weightOptions: List<CartWeightOption> = DefaultCartWeightOptions,
    onConfirm: (weight: CartWeightOption, quantity: Int) -> Unit,
    modifier: Modifier = Modifier
) {
    var selectedWeight by remember(product.id) { mutableStateOf(weightOptions.first()) }
    var quantity by remember(product.id) { mutableStateOf(1) }

    Column(
        modifier = modifier.fillMaxWidth().padding(horizontal = 24.dp, vertical = 8.dp),
        verticalArrangement = Arrangement.spacedBy(20.dp)
    ) {
        // Header: gambar produk + nama + harga/kg
        Row(verticalAlignment = Alignment.CenterVertically, horizontalArrangement = Arrangement.spacedBy(16.dp)) {
            // TODO: ganti dengan AsyncImage begitu imageUrl dari API tersedia
            Box(
                modifier = Modifier.size(72.dp).clip(RoundedCornerShape(12.dp)).background(AppColors.Neutral)
            )
            Column(verticalArrangement = Arrangement.spacedBy(4.dp)) {
                Text(product.name, color = AppColors.Text, fontSize = 18.sp, fontWeight = FontWeight.Bold)
                Row(verticalAlignment = Alignment.Bottom) {
                    Text(formatRupiah(product.price), color = AppColors.Primary, fontSize = 16.sp, fontWeight = FontWeight.Bold)
                    Text("/${product.unit}", color = AppColors.Subtitle, fontSize = 13.sp)
                }
            }
        }

        // Pilih Berat
        Column(verticalArrangement = Arrangement.spacedBy(10.dp)) {
            Text("Pilih Berat", color = AppColors.Subtitle, fontSize = 14.sp)
            Row(horizontalArrangement = Arrangement.spacedBy(10.dp)) {
                weightOptions.forEach { option ->
                    WeightOptionPill(
                        option = option,
                        selected = option == selectedWeight,
                        onClick = { selectedWeight = option }
                    )
                }
            }
        }

        // Jumlah
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically
        ) {
            Text("Jumlah (${selectedWeight.label})", color = AppColors.Subtitle, fontSize = 14.sp)
            AddToCartQuantityStepper(
                quantity = quantity,
                onDecrease = { if (quantity > 1) quantity-- },
                onIncrease = { quantity++ }
            )
        }

        // Masukkan Keranjang
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .border(width = 1.5.dp, color = AppColors.Primary, shape = RoundedCornerShape(28.dp))
                .clip(RoundedCornerShape(28.dp))
                .clickable { onConfirm(selectedWeight, quantity) }
                .padding(vertical = 16.dp),
            horizontalArrangement = Arrangement.Center
        ) {
            Text("Masukkan Keranjang", color = AppColors.Primary, fontSize = 16.sp, fontWeight = FontWeight.SemiBold)
        }
    }
}

@Composable
private fun WeightOptionPill(option: CartWeightOption, selected: Boolean, onClick: () -> Unit) {
    Box(
        modifier = Modifier
            .background(
                color = if (selected) AppColors.Secondary.copy(alpha = 0.25f) else AppColors.White,
                shape = AppShapePill
            )
            .border(
                width = if (selected) 1.5.dp else 1.dp,
                color = if (selected) AppColors.Primary else AppColors.Border,
                shape = AppShapePill
            )
            .clickable(onClick = onClick)
            .padding(horizontal = 24.dp, vertical = 12.dp),
        contentAlignment = Alignment.Center
    ) {
        Text(
            option.label,
            color = if (selected) AppColors.Primary else AppColors.Subtitle,
            fontSize = 14.sp,
            fontWeight = if (selected) FontWeight.SemiBold else FontWeight.Normal
        )
    }
}

// Stepper "Jumlah (kg)" versi overlay -- serupa CartQuantityStepper yang sudah ada di layar
// Keranjang, tapi dibuat lebih besar sesuai proporsi di Figma overlay ini.
@Composable
private fun AddToCartQuantityStepper(quantity: Int, onDecrease: () -> Unit, onIncrease: () -> Unit) {
    Row(
        modifier = Modifier.clip(RoundedCornerShape(8.dp)),
        verticalAlignment = Alignment.CenterVertically
    ) {
        QuantityButton(icon = Icons.Default.Remove, onClick = onDecrease)
        Box(
            modifier = Modifier.background(AppColors.White).width(48.dp).height(36.dp),
            contentAlignment = Alignment.Center
        ) {
            Text("$quantity", fontSize = 16.sp, fontWeight = FontWeight.SemiBold, color = AppColors.Text)
        }
        QuantityButton(icon = Icons.Default.Add, onClick = onIncrease)
    }
}

@Composable
private fun QuantityButton(icon: androidx.compose.ui.graphics.vector.ImageVector, onClick: () -> Unit) {
    Box(
        modifier = Modifier
            .size(36.dp)
            .background(AppColors.Neutral)
            .clickable(onClick = onClick),
        contentAlignment = Alignment.Center
    ) {
        Icon(imageVector = icon, contentDescription = null, tint = AppColors.TextDark, modifier = Modifier.size(16.dp))
    }
}