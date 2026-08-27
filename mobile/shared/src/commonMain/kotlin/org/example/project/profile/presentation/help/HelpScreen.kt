package org.example.project.profile.presentation.help

import androidx.compose.animation.animateContentSize
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.ExpandLess
import androidx.compose.material.icons.filled.ExpandMore
import androidx.compose.material.icons.filled.Search
import androidx.compose.material3.Icon
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.OutlinedTextFieldDefaults
import androidx.compose.material3.Text
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import org.example.project.core.theme.AppColors
import org.example.project.core.theme.AppShapePill
import org.example.project.core.theme.AppSpacing
import org.example.project.core.theme.HarvestaTheme
import org.example.project.profile.presentation.components.ProfileTopBar

@Composable
fun HelpScreen(
    viewModel: HelpViewModel = remember { HelpViewModel() },
    onBackClick: () -> Unit
) {
    val state by viewModel.uiState.collectAsState()

    Column(modifier = Modifier.fillMaxSize().background(AppColors.White)) {
        ProfileTopBar(title = "Bantuan", onBackClick = onBackClick)

        Column(modifier = Modifier.weight(1f).fillMaxWidth().padding(AppSpacing.md)) {
            OutlinedTextField(
                value = state.searchQuery,
                onValueChange = viewModel::onSearchQueryChange,
                modifier = Modifier.fillMaxWidth(),
                placeholder = { Text("Apa yang ingin diketahui", color = AppColors.Hint) },
                leadingIcon = { Icon(Icons.Default.Search, contentDescription = null, tint = AppColors.Subtitle) },
                singleLine = true,
                shape = AppShapePill,
                colors = OutlinedTextFieldDefaults.colors(
                    focusedContainerColor = AppColors.Border,
                    unfocusedContainerColor = AppColors.Border,
                    focusedBorderColor = AppColors.Border,
                    unfocusedBorderColor = AppColors.Border
                )
            )

            Spacer(Modifier.height(AppSpacing.md))

            LazyColumn(
                modifier = Modifier.weight(1f),
                verticalArrangement = Arrangement.spacedBy(AppSpacing.sm)
            ) {
                items(state.filteredFaqs, key = { it.id }) { faq ->
                    FaqCard(
                        faq = faq,
                        expanded = state.expandedId == faq.id,
                        onClick = { viewModel.onFaqClick(faq.id) }
                    )
                }
                item {
                    Spacer(Modifier.height(AppSpacing.sm))
                    OutlinedTextField(
                        value = state.pertanyaanLain,
                        onValueChange = viewModel::onPertanyaanLainChange,
                        modifier = Modifier.fillMaxWidth(),
                        placeholder = { Text("Pertanyaan lainnya\u2026", color = AppColors.Hint) },
                        shape = RoundedCornerShape(14.dp),
                        colors = OutlinedTextFieldDefaults.colors(
                            focusedBorderColor = AppColors.Border,
                            unfocusedBorderColor = AppColors.Border
                        )
                    )
                }
            }
        }
    }
}

@Composable
private fun FaqCard(faq: FaqItem, expanded: Boolean, onClick: () -> Unit) {
    Column(
        modifier = Modifier
            .fillMaxWidth()
            .border(1.dp, AppColors.Border, RoundedCornerShape(14.dp))
            .clickable(onClick = onClick)
            .animateContentSize()
            .padding(AppSpacing.md)
    ) {
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically
        ) {
            Text(
                faq.question,
                style = MaterialTheme.typography.bodyLarge,
                fontWeight = FontWeight.SemiBold,
                color = AppColors.Text,
                modifier = Modifier.weight(1f)
            )
            Icon(
                imageVector = if (expanded) Icons.Default.ExpandLess else Icons.Default.ExpandMore,
                contentDescription = null,
                tint = AppColors.Text
            )
        }
        if (expanded) {
            Spacer(Modifier.height(AppSpacing.sm))
            Box(Modifier.fillMaxWidth().height(1.dp).background(AppColors.Border))
            Spacer(Modifier.height(AppSpacing.sm))
            Text(faq.answerText, style = MaterialTheme.typography.bodyMedium, color = AppColors.Subtitle)
            faq.linkText?.let {
                Text(it, style = MaterialTheme.typography.bodyMedium, color = AppColors.Info)
            }
        }
    }
}

@Preview
@Composable
private fun HelpScreenPreview() {
    HarvestaTheme {
        HelpScreen(onBackClick = {})
    }
}