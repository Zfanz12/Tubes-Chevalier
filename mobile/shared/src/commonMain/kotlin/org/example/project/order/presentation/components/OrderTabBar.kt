package org.example.project.order.presentation.components

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.horizontalScroll
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import org.example.project.core.theme.AppColors
import org.example.project.core.theme.AppShapePill
import org.example.project.core.theme.AppSpacing
import org.example.project.order.domain.model.OrderTab

// Figma 367-4455 / 382-5023 / 382-5424 / 472-11758 -- baris tab "Semua / Belum Bayar / Diproses /
// Dikirim / Selesai / Dibatalkan" yang bisa di-scroll horizontal, dengan chip aktif berwarna Primary.
@Composable
fun OrderTabBar(
    selectedTab: OrderTab,
    onTabSelected: (OrderTab) -> Unit,
    modifier: Modifier = Modifier
) {
    Row(
        modifier = modifier
            .fillMaxWidth()
            .horizontalScroll(rememberScrollState())
            .padding(horizontal = AppSpacing.lg, vertical = AppSpacing.sm),
    ) {
        OrderTab.entries.forEach { tab ->
            val selected = tab == selectedTab
            Text(
                text = tab.label,
                style = MaterialTheme.typography.bodyMedium,
                fontWeight = if (selected) FontWeight.SemiBold else FontWeight.Normal,
                color = if (selected) AppColors.White else AppColors.Subtitle,
                modifier = Modifier
                    .padding(end = AppSpacing.sm)
                    .clip(AppShapePill)
                    .background(if (selected) AppColors.Primary else AppColors.Neutral)
                    .clickable { onTabSelected(tab) }
                    .padding(horizontal = AppSpacing.md, vertical = 8.dp)
            )
        }
    }
}