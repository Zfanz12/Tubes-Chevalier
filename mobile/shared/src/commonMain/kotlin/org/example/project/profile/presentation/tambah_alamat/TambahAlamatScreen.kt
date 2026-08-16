package org.example.project.profile.presentation.tambah_alamat

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.tooling.preview.Preview
import org.example.project.core.presentation.component.AppButton
import org.example.project.core.presentation.component.AppConfirmDialog
import org.example.project.core.theme.AppColors
import org.example.project.core.theme.AppShapePill
import org.example.project.core.theme.AppSpacing
import org.example.project.profile.presentation.alamat_pengiriman.AlamatItem
import org.example.project.profile.presentation.components.ProfileFormField
import org.example.project.profile.presentation.components.ProfileTopBar

@Composable
fun TambahAlamatScreen(
    viewModel: TambahAlamatViewModel,
    onBackClick: () -> Unit,
    onSaved: (AlamatItem) -> Unit
) {
    val state by viewModel.uiState.collectAsState()

    Column(modifier = Modifier.fillMaxSize().background(AppColors.White)) {
        ProfileTopBar(title = "Alamat Baru", onBackClick = onBackClick)

        Column(
            modifier = Modifier.weight(1f).fillMaxWidth().padding(AppSpacing.md),
            verticalArrangement = Arrangement.spacedBy(AppSpacing.md)
        ) {
            ProfileFormField(
                label = "Alamat Lengkap",
                value = state.alamatLengkap,
                onValueChange = viewModel::onAlamatLengkapChange,
                placeholder = "Masukkan alamat lengkap",
                singleLine = false,
                minLines = 5
            )
            ProfileFormField(
                label = "Catatan",
                value = state.catatan,
                onValueChange = viewModel::onCatatanChange,
                placeholder = "Tambahkan patokan"
            )
            ProfileFormField(
                label = "Nama Penerima",
                value = state.namaPenerima,
                onValueChange = viewModel::onNamaPenerimaChange,
                placeholder = "Masukkan nama penerima"
            )
            ProfileFormField(
                label = "Nomor HP Penerima",
                value = state.noHpPenerima,
                onValueChange = viewModel::onNoHpPenerimaChange,
                placeholder = "Masukan nomor HP penerima",
                keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Phone)
            )

            state.errorMessage?.let {
                Text(it, color = MaterialTheme.colorScheme.error, style = MaterialTheme.typography.bodySmall)
            }
        }

        Column(modifier = Modifier.padding(AppSpacing.md)) {
            AppButton(
                text = "Simpan Alamat",
                shape = AppShapePill,
                onClick = viewModel::onSimpanClicked
            )
        }
    }

    // Popup konfirmasi "Simpan Alamat Baru?" (frame konfirmasi pada Figma)
    if (state.showConfirmDialog) {
        AppConfirmDialog(
            title = "Simpan Alamat Baru?",
            message = "Alamat baru akan disimpan",
            confirmText = "Simpan",
            dismissText = "Tidak",
            onDismiss = viewModel::onDismissConfirmDialog,
            onConfirm = { onSaved(viewModel.onConfirmSimpan()) }
        )
    }
}

@Preview
@Composable
private fun TambahAlamatScreenPreview() {
    val viewModel = remember { TambahAlamatViewModel() }
    MaterialTheme {
        TambahAlamatScreen(viewModel = viewModel, onBackClick = {}, onSaved = {})
    }
}