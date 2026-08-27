package org.example.project.profile.presentation.about

import androidx.compose.foundation.Image
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.alpha
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import org.jetbrains.compose.resources.painterResource
import org.example.project.core.theme.AppColors
import org.example.project.core.theme.AppSpacing
import org.example.project.core.theme.HarvestaTheme
import org.example.project.profile.presentation.components.ProfileTopBar
import tubes_cheva_mobile.shared.generated.resources.Res
import tubes_cheva_mobile.shared.generated.resources.bg_harvesta
import tubes_cheva_mobile.shared.generated.resources.harvesta_logo

@Composable
fun AboutScreen(onBackClick: () -> Unit) {
    Column(modifier = Modifier.fillMaxSize().background(AppColors.Background)) {
        ProfileTopBar(title = "Tentang Harvesta", onBackClick = onBackClick)

        Box(
            modifier = Modifier.fillMaxWidth(),
            contentAlignment = Alignment.Center
        ) {
            Image(
                painter = painterResource(Res.drawable.bg_harvesta),
                contentDescription = null,
                modifier = Modifier.matchParentSize().alpha(0.35f),
                contentScale = ContentScale.Crop
            )

            Column(
                modifier = Modifier.padding(vertical = AppSpacing.lg),
                horizontalAlignment = Alignment.CenterHorizontally
            ) {
                Image(
                    painter = painterResource(Res.drawable.harvesta_logo),
                    contentDescription = "Logo Harvesta",
                    modifier = Modifier.size(216.dp)
                )
                Spacer(Modifier.height(AppSpacing.sm))
                Text(
                    "Marketplace Hasil Pertanian Langsung dari Petani",
                    style = MaterialTheme.typography.bodyMedium,
                    color = AppColors.Primary,
                    fontWeight = FontWeight.SemiBold,
                    textAlign = TextAlign.Center,
                    modifier = Modifier.padding(horizontal = AppSpacing.lg)
                )
            }
        }

        Column(modifier = Modifier.fillMaxWidth().padding(AppSpacing.md)) {
            Row {
                Text("Tentang ", style = MaterialTheme.typography.headlineSmall, fontWeight = FontWeight.Bold, color = AppColors.Primary)
                Text("Harvesta", style = MaterialTheme.typography.headlineSmall, fontWeight = FontWeight.Bold, color = AppColors.Tertiary)
            }

            Spacer(Modifier.height(AppSpacing.sm))

            Text(
                "Harvesta adalah platform marketplace hasil pertanian yang memungkinkan petani menjual produknya langsung kepada konsumen tanpa melalui rantai distribusi yang panjang. Melalui Harvesta, pembeli dapat menemukan produk segar dari berbagai petani dengan informasi harga, stok, dan asal produk yang lebih transparan.",
                style = MaterialTheme.typography.bodyMedium,
                color = AppColors.Subtitle
            )
        }
    }
}

@Preview
@Composable
private fun AboutScreenPreview() {
    HarvestaTheme {
        AboutScreen(onBackClick = {})
    }
}