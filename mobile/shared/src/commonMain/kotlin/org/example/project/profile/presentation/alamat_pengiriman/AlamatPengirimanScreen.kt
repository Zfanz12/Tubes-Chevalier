package org.example.project.profile.presentation.alamat_pengiriman

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.runtime.remember
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import org.example.project.core.presentation.component.AppButton
import org.example.project.core.presentation.component.AppConfirmDialog
import org.example.project.core.preview.FakeProfileRepository
import org.example.project.core.theme.AppColors
import org.example.project.core.theme.AppShapePill
import org.example.project.core.theme.AppSpacing
import org.example.project.profile.domain.usecase.GetProfileUseCase
import org.example.project.profile.domain.usecase.UpdateAlamatUseCase
import org.example.project.profile.presentation.components.ProfileTopBar

@Composable
fun AlamatPengirimanScreen(
    viewModel: AlamatPengirimanViewModel,
    onBackClick: () -> Unit,
    onTambahAlamat: () -> Unit,
    onUbahAlamat: (String) -> Unit
) {
    val state by viewModel.uiState.collectAsState()

    Column(modifier = Modifier.fillMaxSize().background(AppColors.Background)) {
        ProfileTopBar(title = "Alamat Pengiriman", onBackClick = onBackClick)

        if (state.isLoading) {
            Box(Modifier.fillMaxSize(), contentAlignment = Alignment.Center) {
                CircularProgressIndicator(color = AppColors.Primary)
            }
            return@Column
        }

        Column(modifier = Modifier.weight(1f).padding(horizontal = AppSpacing.md)) {
            Spacer(Modifier.height(AppSpacing.md))

            Text(
                "Pilih alamat pengiriman utama untuk memudahkan proses transaksi Anda.",
                style = MaterialTheme.typography.bodyMedium,
                color = AppColors.Subtitle
            )

            Spacer(Modifier.height(AppSpacing.md))

            state.errorMessage?.let {
                Text(it, color = MaterialTheme.colorScheme.error, style = MaterialTheme.typography.bodySmall)
                Spacer(Modifier.height(AppSpacing.sm))
            }

            LazyColumn(verticalArrangement = Arrangement.spacedBy(AppSpacing.md)) {
                items(state.daftarAlamat, key = { it.id }) { alamat ->
                    AlamatCard(
                        alamat = alamat,
                        onUbahClick = { onUbahAlamat(alamat.id) },
                        onHapusClick = { viewModel.onHapusClicked(alamat.id) },
                        onCardClick = { if (!alamat.isUtama) viewModel.jadikanUtama(alamat.id) }
                    )
                }
                item { Spacer(Modifier.height(AppSpacing.md)) }
            }
        }

        Column(modifier = Modifier.padding(AppSpacing.md)) {
            AppButton(text = "Tambah Alamat Baru", shape = AppShapePill, onClick = onTambahAlamat)
        }
    }

    // Popup konfirmasi "Hapus Alamat" (frame konfirmasi pada Figma)
    state.alamatToDelete?.let {
        AppConfirmDialog(
            title = "Hapus Alamat?",
            message = "Alamat akan dihapus dari data Harvesta",
            confirmText = "Hapus",
            dismissText = "Batal",
            isDestructive = true,
            onDismiss = viewModel::onDismissHapusDialog,
            onConfirm = viewModel::onConfirmHapus
        )
    }
}

@Composable
private fun AlamatCard(
    alamat: AlamatItem,
    onUbahClick: () -> Unit,
    onHapusClick: () -> Unit,
    onCardClick: () -> Unit
) {
    Column(
        modifier = Modifier
            .fillMaxWidth()
            .clip(RoundedCornerShape(16.dp))
            .background(AppColors.White)
            .then(
                if (alamat.isUtama) Modifier.border(1.5.dp, AppColors.Primary, RoundedCornerShape(16.dp))
                else Modifier.border(1.dp, AppColors.Border, RoundedCornerShape(16.dp))
            )
            .clickable(onClick = onCardClick)
    ) {
        Column(modifier = Modifier.padding(AppSpacing.md)) {
            Row(verticalAlignment = Alignment.CenterVertically) {
                Text(
                    alamat.namaPenerima,
                    style = MaterialTheme.typography.bodyLarge,
                    fontWeight = FontWeight.Bold,
                    color = AppColors.Primary
                )
                Spacer(Modifier.width(AppSpacing.sm))
                Text(
                    alamat.noHpPenerima,
                    style = MaterialTheme.typography.bodyMedium,
                    color = AppColors.Text
                )
                Spacer(Modifier.weight(1f))
                if (alamat.isUtama) {
                    Box(
                        modifier = Modifier
                            .clip(AppShapePill)
                            .background(AppColors.Primary)
                            .padding(horizontal = AppSpacing.sm + 2.dp, vertical = 4.dp)
                    ) {
                        Text(
                            "Utama",
                            style = MaterialTheme.typography.labelSmall,
                            color = AppColors.White,
                            fontWeight = FontWeight.SemiBold
                        )
                    }
                }
            }
            Spacer(Modifier.height(AppSpacing.sm))
            Text(
                alamat.alamatLengkap,
                style = MaterialTheme.typography.bodyMedium,
                color = AppColors.Subtitle
            )
        }

        Box(Modifier.fillMaxWidth().height(1.dp).background(AppColors.Border))

        Row(modifier = Modifier.padding(horizontal = AppSpacing.md, vertical = AppSpacing.sm + 2.dp)) {
            Text(
                "Ubah Alamat",
                style = MaterialTheme.typography.bodyMedium,
                fontWeight = FontWeight.SemiBold,
                color = AppColors.Primary,
                modifier = Modifier.clickable(onClick = onUbahClick)
            )
            Spacer(Modifier.width(AppSpacing.lg))
            Text(
                "Hapus Alamat",
                style = MaterialTheme.typography.bodyMedium,
                fontWeight = FontWeight.SemiBold,
                color = AppColors.Error,
                modifier = Modifier.clickable(onClick = onHapusClick)
            )
        }
    }
}

@Preview
@Composable
private fun AlamatPengirimanScreenPreview() {
    val fakeRepo = remember { FakeProfileRepository() }
    val viewModel = remember {
        AlamatPengirimanViewModel(GetProfileUseCase(fakeRepo), UpdateAlamatUseCase(fakeRepo))
    }
    MaterialTheme {
        AlamatPengirimanScreen(
            viewModel = viewModel,
            onBackClick = {},
            onTambahAlamat = {},
            onUbahAlamat = {}
        )
    }
}