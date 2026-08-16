package org.example.project.search.presentation.components

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.BasicTextField
import androidx.compose.foundation.text.KeyboardActions
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.ChevronLeft
import androidx.compose.material.icons.filled.Close
import androidx.compose.material.icons.filled.Search
import androidx.compose.material.icons.filled.SortByAlpha
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.LocalTextStyle
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.input.ImeAction
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import org.example.project.core.theme.AppColors

// Figma: "search field" (698:273) -- bg #E8E8E8, border #1B4332, radius 80px (pill penuh)
@Composable
fun SearchTopBar(
    query: String,
    onQueryChange: (String) -> Unit,
    onBack: () -> Unit,
    onSubmit: () -> Unit,
    onClear: () -> Unit,
    modifier: Modifier = Modifier,
    placeholder: String = "Cari sayuran favoritmu...",
    // Ikon sort/filter di kanan (hanya tampil di state "searching result", Figma 701:2399)
    onFilterClick: (() -> Unit)? = null
) {
    Row(
        modifier = modifier.fillMaxWidth().padding(vertical = 8.dp),
        verticalAlignment = Alignment.CenterVertically,
        horizontalArrangement = Arrangement.spacedBy(16.dp)
    ) {
        IconButton(onClick = onBack, modifier = Modifier.size(20.dp)) {
            Icon(Icons.Default.ChevronLeft, contentDescription = "Kembali", tint = AppColors.Text)
        }

        Row(
            modifier = Modifier
                .weight(1f)
                .height(40.dp)
                .background(color = Color(0xFFE8E8E8), shape = RoundedCornerShape(80.dp))
                .border(width = 1.dp, color = AppColors.Primary, shape = RoundedCornerShape(80.dp))
                .padding(horizontal = 16.dp, vertical = 12.dp),
            verticalAlignment = Alignment.CenterVertically,
            horizontalArrangement = Arrangement.spacedBy(8.dp)
        ) {
            Icon(Icons.Default.Search, contentDescription = "Cari", tint = AppColors.TextMuted, modifier = Modifier.size(20.dp))

            BasicTextField(
                value = query,
                onValueChange = onQueryChange,
                modifier = Modifier.weight(1f),
                singleLine = true,
                textStyle = LocalTextStyle.current.copy(fontSize = 12.sp, color = AppColors.Text),
                keyboardOptions = KeyboardOptions(imeAction = ImeAction.Search),
                keyboardActions = KeyboardActions(onSearch = { onSubmit() }),
                decorationBox = { innerTextField ->
                    if (query.isEmpty()) {
                        Text(placeholder, fontSize = 12.sp, color = AppColors.TextMuted)
                    }
                    innerTextField()
                }
            )

            if (query.isNotEmpty()) {
                Icon(
                    Icons.Default.Close,
                    contentDescription = "Hapus",
                    tint = AppColors.TextMuted,
                    modifier = Modifier.size(20.dp).clickable(onClick = onClear)
                )
            }
        }

        if (onFilterClick != null) {
            IconButton(onClick = onFilterClick, modifier = Modifier.size(24.dp)) {
                Icon(Icons.Default.SortByAlpha, contentDescription = "Urutkan/Filter", tint = AppColors.Text)
            }
        }
    }
}