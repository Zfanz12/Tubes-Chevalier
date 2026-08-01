package org.example.project.home.presentation.category

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.grid.GridCells
import androidx.compose.foundation.lazy.grid.LazyVerticalGrid
import androidx.compose.foundation.lazy.grid.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import org.example.project.core.theme.AppColors
import org.example.project.home.domain.model.Category
import org.example.project.home.presentation.components.HomeSearchBar

@Composable
fun CategoryListScreen(
    categories: List<Category>,
    onBack: () -> Unit,
    onCategoryClick: (Category) -> Unit = {}
) {
    Column(modifier = Modifier.fillMaxSize().background(AppColors.Background)) {
        Row(
            modifier = Modifier.fillMaxWidth().padding(horizontal = 24.dp, vertical = 16.dp),
            verticalAlignment = Alignment.CenterVertically
        ) {
            Text(
                "←",
                modifier = Modifier.clickable(onClick = onBack).padding(end = 12.dp),
                style = MaterialTheme.typography.titleLarge
            )
            Text("Kategori", style = MaterialTheme.typography.titleLarge, fontWeight = FontWeight.Bold)
        }

        Box(modifier = Modifier.padding(horizontal = 24.dp)) {
            HomeSearchBar(query = "", onQueryChange = {}, placeholder = "Cari sayuran")
        }

        Spacer(Modifier.height(16.dp))

        LazyVerticalGrid(
            columns = GridCells.Fixed(3),
            contentPadding = PaddingValues(horizontal = 24.dp, vertical = 8.dp),
            horizontalArrangement = Arrangement.spacedBy(10.dp),
            verticalArrangement = Arrangement.spacedBy(16.dp),
            modifier = Modifier.weight(1f)
        ) {
            items(categories) { category ->
                CategoryGridItem(category = category, onClick = { onCategoryClick(category) })
            }
        }
    }
}

@Composable
private fun CategoryGridItem(category: Category, onClick: () -> Unit) {
    Column(
        modifier = Modifier.fillMaxWidth().clickable(onClick = onClick),
        horizontalAlignment = Alignment.CenterHorizontally
    ) {
        Box(
            modifier = Modifier
                .size(96.dp)
                .clip(RoundedCornerShape(16.dp))
                .background(AppColors.White)
                .border(1.dp, AppColors.Border, RoundedCornerShape(16.dp))
        )
        Spacer(Modifier.height(8.dp))
        Text(category.name, style = MaterialTheme.typography.bodyMedium)
    }
}

@Preview
@Composable
private fun CategoryListScreenPreview() {
    MaterialTheme {
        CategoryListScreen(
            categories = listOf(
                Category("bayam", "Bayam"),
                Category("wortel", "Wortel"),
                Category("kubis", "Kubis"),
                Category("tomat", "Tomat"),
                Category("sawi", "Sawi"),
                Category("kangkung", "Kangkung")
            ),
            onBack = {}
        )
    }
}