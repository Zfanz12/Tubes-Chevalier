package org.example.project.search.presentation.components

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import org.example.project.core.theme.AppColors
import org.example.project.search.domain.model.LocationSort
import org.example.project.search.domain.model.PriceSort
import org.example.project.search.domain.model.RatingSort
import org.example.project.search.domain.model.SearchFilterState

// Chip terpilih: bg Primary alpha 20%, border Primary, teks Primary.
// Chip tidak terpilih: border TextMuted, teks TextMuted. (Figma 703:2406 dst.)
@Composable
private fun FilterChip(label: String, selected: Boolean, onClick: () -> Unit) {
    Box(
        modifier = Modifier
            .background(
                color = if (selected) AppColors.Primary.copy(alpha = 0.2f) else androidx.compose.ui.graphics.Color.Transparent,
                shape = RoundedCornerShape(8.dp)
            )
            .border(
                width = 0.75.dp,
                color = if (selected) AppColors.Primary else AppColors.TextMuted,
                shape = RoundedCornerShape(8.dp)
            )
            .clickable(onClick = onClick)
            .padding(horizontal = 12.dp, vertical = 8.dp)
    ) {
        Text(
            label,
            color = if (selected) AppColors.Primary else AppColors.TextMuted,
            fontSize = 12.sp
        )
    }
}

@Composable
private fun FilterGroupTitle(text: String) {
    Text(text, color = AppColors.Text, fontSize = 16.sp, fontWeight = FontWeight.SemiBold)
}

@Composable
fun SearchFilterSheet(
    filter: SearchFilterState,
    onSelectRating: (RatingSort) -> Unit,
    onSelectPrice: (PriceSort) -> Unit,
    onSelectLocation: (LocationSort) -> Unit,
    onApply: () -> Unit,
    modifier: Modifier = Modifier
) {
    Column(
        modifier = modifier.fillMaxWidth().padding(horizontal = 24.dp, vertical = 12.dp),
        verticalArrangement = Arrangement.spacedBy(24.dp)
    ) {
        Column(verticalArrangement = Arrangement.spacedBy(12.dp)) {
            Column(verticalArrangement = Arrangement.spacedBy(8.dp)) {
                FilterGroupTitle("Rating")
                Row(horizontalArrangement = Arrangement.spacedBy(12.dp)) {
                    RatingSort.entries.forEach { option ->
                        FilterChip(option.label, filter.rating == option) { onSelectRating(option) }
                    }
                }
            }
            Column(verticalArrangement = Arrangement.spacedBy(8.dp)) {
                FilterGroupTitle("Harga")
                Row(horizontalArrangement = Arrangement.spacedBy(12.dp)) {
                    PriceSort.entries.forEach { option ->
                        FilterChip(option.label, filter.price == option) { onSelectPrice(option) }
                    }
                }
            }
            Column(verticalArrangement = Arrangement.spacedBy(8.dp)) {
                FilterGroupTitle("Lokasi")
                Row(horizontalArrangement = Arrangement.spacedBy(12.dp)) {
                    LocationSort.entries.forEach { option ->
                        FilterChip(option.label, filter.location == option) { onSelectLocation(option) }
                    }
                }
            }
        }

        Row(
            modifier = Modifier
                .fillMaxWidth()
                .background(AppColors.Primary, RoundedCornerShape(8.dp))
                .clickable(onClick = onApply)
                .padding(vertical = 12.dp),
            horizontalArrangement = Arrangement.Center
        ) {
            Text("Terapkan", color = AppColors.White, fontSize = 16.sp, fontWeight = FontWeight.SemiBold)
        }
    }
}