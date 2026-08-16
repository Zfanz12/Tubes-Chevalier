package org.example.project.profile.presentation.edit_alamat

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.tooling.preview.Preview
import org.example.project.core.presentation.component.AppButton
import org.example.project.core.presentation.component.AppConfirmDialog
import org.example.project.core.preview.FakeProfileRepository
import org.example.project.core.theme.AppColors
import org.example.project.core.theme.AppShapePill
import org.example.project.core.theme.AppSpacing
import org.example.project.profile.presentation.alamat_pengiriman.AlamatItem
import org.example.project.profile.presentation.components.ProfileFormField
import org.example.project.profile.presentation.components.ProfileTopBar

@Composable
fun EditAlamatScreen(
    viewModel: EditAlamatViewModel,
    onBackClick: () -> Unit,
    onSaved: (AlamatItem) -> Unit
) {
    val state by viewModel.uiState.collectAsState()

    LaunchedEffect(state.isSuccess) {
        if (state.isSuccess) {
            onSaved(
                AlamatItem(
                    id = state.id,
                    namaPenerima = state.namaPenerima,
                    noHpPenerima = state.noHpPenerima,
                    alamatLengkap = state.alamatLengkap,
                    catatan = state.catatan,
                    isUtama = state.isUtama
                )
            )
        }
    }

    Column(modifier = Modifier.fillMaxSize().background(AppColors.White)) {
        ProfileTopBar(title = "Ubah Alamat", onBackClick = onBackClick)

        if (state.isLoading) {
            Box(Modifier.fillMaxSize(), contentAlignment = Alignment.Center) {
                CircularProgressIndicator(color = AppColors.Primary)
            }
            return@Column
        }

        Column(
            modifier = Modifier.weight(1f).fillMaxWidth().padding(AppSpacing.md),
            verticalArrangement = Arrangement.spacedBy(AppSpacing.md)
        ) {
            ProfileFormField(
                label = "Alamat Lengkap",
                value = state.alamatLengkap,
                onValueChange = viewModel::onAlamatLengkapChange,
                singleLine = false,
                minLines = 4
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
                onValueChange = viewModel::onNamaPenerimaChange
            )
            ProfileFormField(
                label = "Nomor HP Penerima",
                value = state.noHpPenerima,
                onValueChange = viewModel::onNoHpPenerimaChange,
                keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Phone)
            )

            state.errorMessage?.let {
                Text(it, color = MaterialTheme.colorScheme.error, style = MaterialTheme.typography.bodySmall)
            }
        }

        Column(modifier = Modifier.padding(AppSpacing.md)) {
            AppButton(
                text = "Simpan Perubahan",
                shape = AppShapePill,
                loading = state.isSaving,
                onClick = viewModel::onSimpanClicked
            )
        }
    }

    if (state.showConfirmDialog) {
        AppConfirmDialog(
            title = "Simpan Perubahan Alamat?",
            message = "Pastikan alamat, nama, dan nomor HP penerima sudah benar sebelum disimpan.",
            confirmText = if (state.isSaving) "Menyimpan..." else "Simpan",
            dismissText = "Tidak",
            onDismiss = viewModel::onDismissConfirmDialog,
            onConfirm = viewModel::onConfirmSimpan
        )
    }
}

@Preview
@Composable
private fun EditAlamatScreenPreview() {
    val fakeRepo = remember { FakeProfileRepository() }
    val viewModel = remember {
        EditAlamatViewModel(
            org.example.project.profile.domain.usecase.GetProfileUseCase(fakeRepo),
            org.example.project.profile.domain.usecase.UpdateAlamatUseCase(fakeRepo)
        )
    }
    MaterialTheme {
        EditAlamatScreen(viewModel = viewModel, onBackClick = {}, onSaved = {})
    }
}