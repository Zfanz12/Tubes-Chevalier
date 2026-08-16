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
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import org.example.project.core.theme.AppColors

// Figma node 425:6612 "Input" -- kotak min/angka/plus, border #DDD, tombol min/plus bg #DDD.
@Composable
fun CartQuantityStepper(
    quantity: Int,
    onDecrease: () -> Unit,
    onIncrease: () -> Unit,
    enabled: Boolean = true
) {
    Row(
        modifier = Modifier
            .height(28.dp)
            .border(width = 1.dp, color = AppColors.Border, shape = RoundedCornerShape(4.dp))
            .clip(RoundedCornerShape(4.dp)),
        verticalAlignment = Alignment.CenterVertically
    ) {
        StepperButton(icon = Icons.Default.Remove, onClick = onDecrease, enabled = enabled)
        Box(
            modifier = Modifier.background(AppColors.White).width(34.dp).fillMaxHeight(),
            contentAlignment = Alignment.Center
        ) {
            Text(
                text = "$quantity",
                fontSize = 14.sp,
                fontWeight = FontWeight.SemiBold,
                color = AppColors.TextDark
            )
        }
        StepperButton(icon = Icons.Default.Add, onClick = onIncrease, enabled = enabled)
    }
}

@Composable
private fun StepperButton(icon: androidx.compose.ui.graphics.vector.ImageVector, onClick: () -> Unit, enabled: Boolean) {
    Box(
        modifier = Modifier
            .background(AppColors.Border)
            .width(24.dp)
            .fillMaxHeight()
            .clickable(enabled = enabled, onClick = onClick),
        contentAlignment = Alignment.Center
    ) {
        Icon(imageVector = icon, contentDescription = null, tint = AppColors.TextDark, modifier = Modifier.size(10.dp))
    }
}
