package org.example.project.dashboard.presentation.components

import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.NavigationBar
import androidx.compose.material3.NavigationBarItem
import androidx.compose.material3.NavigationBarItemDefaults
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import org.example.project.core.theme.AppColors

enum class BottomNavItem(
    val label: String,
    val emoji: String
) {
    HOME("Home", "🏠"),
    ORDERS("Orders", "📦"),
    ANALYTICS("Analytics", "📊"),
    PROFILE("Profile", "👤")
}

@Composable
fun BottomNavBar(
    selectedItem: BottomNavItem,
    onItemSelected: (BottomNavItem) -> Unit
) {

    NavigationBar(
        containerColor = AppColors.White
    ) {

        BottomNavItem.entries.forEach { item ->

            NavigationBarItem(
                selected = item == selectedItem,
                onClick = { onItemSelected(item) },

                icon = {
                    Text(
                        text = item.emoji,
                        style = MaterialTheme.typography.titleLarge
                    )
                },

                label = {
                    Text(item.label)
                },

                colors = NavigationBarItemDefaults.colors(
                    selectedIconColor = AppColors.Primary,
                    selectedTextColor = AppColors.Primary,
                    indicatorColor = AppColors.PrimaryLight.copy(alpha = 0.2f),
                    unselectedIconColor = AppColors.Subtitle,
                    unselectedTextColor = AppColors.Subtitle
                )

            )

        }

    }

}