package org.example.project.home.presentation.components

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyRow
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.MoreHoriz
import androidx.compose.material3.Icon
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import org.example.project.core.theme.AppColors
import org.example.project.home.domain.model.Category

@Composable
fun CategorySection(
    categories: List<Category>,
    onSeeAllClick: () -> Unit,
    onCategoryClick: (Category) -> Unit = {}
) {
    Column {
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically
        ) {
            Text("Kategori", style = MaterialTheme.typography.titleMedium, fontWeight = FontWeight.Bold)
            TextButton(onClick = onSeeAllClick) {
                Text("Lihat Semua", color = AppColors.Primary)
            }
        }
        Spacer(Modifier.height(12.dp))
        LazyRow(horizontalArrangement = Arrangement.spacedBy(16.dp)) {
            items(categories.take(5)) { category ->
                CategoryChip(category = category, onClick = { onCategoryClick(category) })
            }
            item {
                CategoryChip(category = Category("more", "Lainnya"), onClick = onSeeAllClick, isMore = true)
            }
        }
    }
}

@Composable
private fun CategoryChip(category: Category, onClick: () -> Unit, isMore: Boolean = false) {
    Column(
        modifier = Modifier.width(84.dp).clickable(onClick = onClick),
        horizontalAlignment = Alignment.CenterHorizontally
    ) {
        Box(
            modifier = Modifier.size(52.dp).clip(RoundedCornerShape(16.dp)).background(AppColors.Neutral),
            contentAlignment = Alignment.Center
        ) {
            if (isMore) {
                Icon(imageVector = Icons.Default.MoreHoriz, contentDescription = "Lainnya", tint = AppColors.Primary)
            }
        }
        Spacer(Modifier.height(8.dp))
        Text(category.name, style = MaterialTheme.typography.bodySmall, maxLines = 1)
    }
}