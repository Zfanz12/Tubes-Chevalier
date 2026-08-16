package org.example.project.profile.presentation.about

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import org.example.project.core.theme.AppColors
import org.example.project.core.theme.AppSpacing
import org.example.project.core.theme.HarvestaTheme
import org.example.project.profile.presentation.components.ProfileTopBar

@Composable
fun AboutScreen(onBackClick: () -> Unit) {
    Column(modifier = Modifier.fillMaxSize().background(AppColors.Background)) {
        ProfileTopBar(title = "Tentang Harvesta", onBackClick = onBackClick)

        // Hero pada Figma memakai foto hasil panen sebagai latar. Belum ada aset foto di
        // composeResources project ini, jadi sementara memakai gradasi hijau bermerek + wordmark
        // sebagai pengganti -- ganti Box ini dengan Image(painterResource(Res.drawable.about_hero))
        // begitu asetnya tersedia.
        Box(
            modifier = Modifier
                .fillMaxWidth()
                .height(220.dp)
                .background(
                    Brush.verticalGradient(listOf(AppColors.Primary, AppColors.Primary.copy(alpha = 0.85f)))
                ),
            contentAlignment = Alignment.Center
        ) {
            Column(horizontalAlignment = Alignment.CenterHorizontally) {
                Box(
                    modifier = Modifier.size(56.dp).background(AppColors.White, RoundedCornerShape(16.dp)),
                    contentAlignment = Alignment.Center
                ) {
                    Text("H", style = MaterialTheme.typography.headlineMedium, color = AppColors.Primary, fontWeight = FontWeight.Bold)
                }
                Spacer(Modifier.height(AppSpacing.sm))
                Text(
                    "Harvesta",
                    style = MaterialTheme.typography.headlineMedium,
                    color = AppColors.White,
                    fontWeight = FontWeight.Bold
                )
                Spacer(Modifier.height(AppSpacing.xs))
                Text(
                    "Marketplace Hasil Pertanian Langsung dari Petani",
                    style = MaterialTheme.typography.bodyMedium,
                    color = AppColors.White,
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