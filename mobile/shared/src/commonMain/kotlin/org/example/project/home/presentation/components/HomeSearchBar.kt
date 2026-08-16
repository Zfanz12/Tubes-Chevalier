package org.example.project.home.presentation.components

import androidx.compose.foundation.clickable
import androidx.compose.foundation.interaction.MutableInteractionSource
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Search
import androidx.compose.material.icons.filled.Tune
import androidx.compose.material3.Icon
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.remember
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import androidx.compose.foundation.layout.Box

@Composable
fun HomeSearchBar(
    query: String,
    onQueryChange: (String) -> Unit,
    placeholder: String = "Cari sayuran...",
    modifier: Modifier = Modifier,
    // Kalau diisi: field jadi read-only, tap di mana saja membuka SearchScreen penuh
    // (pola umum "fake search bar" di halaman utama). Default null = tetap bisa diketik
    // langsung seperti sebelumnya (dipakai untuk filter ringan di Home sendiri kalau perlu).
    onClick: (() -> Unit)? = null
) {
    Box(modifier = modifier.fillMaxWidth()) {
        OutlinedTextField(
            value = query,
            onValueChange = onQueryChange,
            modifier = Modifier.fillMaxWidth(),
            placeholder = { Text(placeholder) },
            leadingIcon = { Icon(imageVector = Icons.Default.Search, contentDescription = "Cari") },
            trailingIcon = { Icon(imageVector = Icons.Default.Tune, contentDescription = "Filter") },
            singleLine = true,
            readOnly = onClick != null,
            shape = RoundedCornerShape(16.dp)
        )

        // Overlay transparan menangkap tap sebelum sampai ke text field di baliknya,
        // supaya OutlinedTextField tidak perlu di-disable (biar tetap terlihat aktif/tidak abu-abu).
        if (onClick != null) {
            Box(
                modifier = Modifier
                    .matchParentSize()
                    .clickable(
                        interactionSource = remember { MutableInteractionSource() },
                        indication = null,
                        onClick = onClick
                    )
            )
        }
    }
}