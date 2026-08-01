package org.example.project.home.presentation.components

import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.Assignment
import androidx.compose.material.icons.filled.Home
import androidx.compose.material.icons.filled.Notifications
import androidx.compose.material.icons.filled.Person
import androidx.compose.material3.Icon
import androidx.compose.material3.NavigationBar
import androidx.compose.material3.NavigationBarItem
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable

enum class BottomNavItem { HOME, ORDER, NOTIFICATION, PROFILE }

@Composable
fun BottomNavBar(
    selectedItem: BottomNavItem,
    onItemSelected: (BottomNavItem) -> Unit
) {
    NavigationBar {
        NavigationBarItem(
            selected = selectedItem == BottomNavItem.HOME,
            onClick = { onItemSelected(BottomNavItem.HOME) },
            icon = { Icon(Icons.Default.Home, contentDescription = "Home") },
            label = { Text("Home") }
        )
        NavigationBarItem(
            selected = selectedItem == BottomNavItem.ORDER,
            onClick = { onItemSelected(BottomNavItem.ORDER) },
            icon = { Icon(Icons.AutoMirrored.Filled.Assignment, contentDescription = "Order") },
            label = { Text("Order") }
        )
        NavigationBarItem(
            selected = selectedItem == BottomNavItem.NOTIFICATION,
            onClick = { onItemSelected(BottomNavItem.NOTIFICATION) },
            icon = { Icon(Icons.Default.Notifications, contentDescription = "Notifikasi") },
            label = { Text("Notifikasi") }
        )
        NavigationBarItem(
            selected = selectedItem == BottomNavItem.PROFILE,
            onClick = { onItemSelected(BottomNavItem.PROFILE) },
            icon = { Icon(Icons.Default.Person, contentDescription = "Profile") },
            label = { Text("Profile") }
        )
    }
}