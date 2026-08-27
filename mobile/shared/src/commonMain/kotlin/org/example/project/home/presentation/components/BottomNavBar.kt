package org.example.project.home.presentation.components

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.RowScope
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.Assignment
import androidx.compose.material.icons.filled.Home
import androidx.compose.material.icons.filled.Notifications
import androidx.compose.material.icons.filled.Person
import androidx.compose.material3.Icon
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import org.example.project.core.theme.AppColors

enum class BottomNavItem { HOME, ORDER, NOTIFICATION, PROFILE }

private data class NavItemSpec(
    val item: BottomNavItem,
    val icon: ImageVector,
    val label: String
)

private val navItems = listOf(
    NavItemSpec(BottomNavItem.HOME, Icons.Default.Home, "Home"),
    NavItemSpec(BottomNavItem.ORDER, Icons.AutoMirrored.Filled.Assignment, "Order"),
    NavItemSpec(BottomNavItem.NOTIFICATION, Icons.Default.Notifications, "Notifikasi"),
    NavItemSpec(BottomNavItem.PROFILE, Icons.Default.Person, "Profile")
)

/**
 * Bottom navigation bar custom -- kartu putih dengan sudut atas membulat, tanpa indikator pill
 * di belakang ikon. Item aktif berwarna hijau tua (AppColors.Primary) & tebal, item non-aktif
 * abu-abu (AppColors.Hint).
 */
@Composable
fun BottomNavBar(
    selectedItem: BottomNavItem,
    onItemSelected: (BottomNavItem) -> Unit
) {
    Row(
        modifier = Modifier
            .fillMaxWidth()
            .clip(RoundedCornerShape(topStart = 24.dp, topEnd = 24.dp))
            .background(AppColors.White)
            .padding(top = 12.dp, bottom = 16.dp),
        horizontalArrangement = Arrangement.SpaceEvenly
    ) {
        navItems.forEach { spec ->
            BottomNavItemContent(
                spec = spec,
                selected = selectedItem == spec.item,
                onClick = { onItemSelected(spec.item) }
            )
        }
    }
}

@Composable
private fun RowScope.BottomNavItemContent(
    spec: NavItemSpec,
    selected: Boolean,
    onClick: () -> Unit
) {
    val tint = if (selected) AppColors.Primary else AppColors.Hint

    Column(
        modifier = Modifier
            .weight(1f)
            .clickable(onClick = onClick),
        horizontalAlignment = Alignment.CenterHorizontally
    ) {
        Icon(
            imageVector = spec.icon,
            contentDescription = spec.label,
            tint = tint,
            modifier = Modifier.size(24.dp)
        )
        Spacer(Modifier.height(4.dp))
        Text(
            text = spec.label,
            style = MaterialTheme.typography.labelMedium,
            fontWeight = if (selected) FontWeight.Bold else FontWeight.Normal,
            color = tint
        )
    }
}