package org.example.project.core.presentation.component

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.window.Dialog
import org.example.project.core.theme.AppColors
import org.example.project.core.theme.AppShapePill
import org.example.project.core.theme.AppSpacing

/**
 * Popup konfirmasi generik bergaya Harvesta -- dipakai untuk konfirmasi Logout, Hapus Alamat,
 * Simpan Alamat Baru, dan Simpan Perubahan Alamat, sesuai frame konfirmasi pada Figma:
 * judul bold di tengah, subjudul abu-abu di tengah, lalu dua tombol pill selebar sama besar
 * bersisian (tombol "Batal"/"Tidak" abu-abu solid, tombol aksi merah/hijau tua solid).
 *
 * - [confirmText] & [onConfirm]: tombol pill solid di kanan (mis. "Keluar", "Hapus", "Simpan").
 * - [dismissText] & [onDismiss]: tombol pill abu-abu solid di kiri (mis. "Batal", "Tidak").
 * - [isDestructive]: true untuk aksi berbahaya (Logout, Hapus) -> tombol kanan merah
 *   (AppColors.Error). false untuk aksi simpan -> tombol kanan hijau tua (AppColors.Primary).
 */
@Composable
fun AppConfirmDialog(
    title: String,
    message: String,
    confirmText: String,
    dismissText: String,
    onConfirm: () -> Unit,
    onDismiss: () -> Unit,
    isDestructive: Boolean = false
) {
    val confirmColor = if (isDestructive) AppColors.Error else AppColors.Primary

    Dialog(onDismissRequest = onDismiss) {
        Surface(
            shape = RoundedCornerShape(20.dp),
            color = AppColors.White
        ) {
            Column(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(horizontal = AppSpacing.lg, vertical = AppSpacing.lg),
                horizontalAlignment = Alignment.CenterHorizontally
            ) {
                Text(
                    text = title,
                    style = MaterialTheme.typography.titleLarge,
                    fontWeight = FontWeight.Bold,
                    color = AppColors.Text,
                    textAlign = TextAlign.Center,
                    modifier = Modifier.fillMaxWidth()
                )

                Spacer(Modifier.height(AppSpacing.sm))

                Text(
                    text = message,
                    style = MaterialTheme.typography.bodyMedium,
                    color = AppColors.Subtitle,
                    textAlign = TextAlign.Center,
                    modifier = Modifier.fillMaxWidth()
                )

                Spacer(Modifier.height(AppSpacing.lg))

                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.spacedBy(AppSpacing.sm)
                ) {
                    TextButton(
                        onClick = onDismiss,
                        modifier = Modifier.weight(1f).height(48.dp),
                        shape = AppShapePill,
                        colors = ButtonDefaults.textButtonColors(
                            containerColor = AppColors.Border,
                            contentColor = AppColors.Hint
                        )
                    ) {
                        Text(dismissText, fontWeight = FontWeight.SemiBold)
                    }
                    TextButton(
                        onClick = onConfirm,
                        modifier = Modifier.weight(1f).height(48.dp),
                        shape = AppShapePill,
                        colors = ButtonDefaults.textButtonColors(
                            containerColor = confirmColor,
                            contentColor = AppColors.White
                        )
                    ) {
                        Text(confirmText, fontWeight = FontWeight.SemiBold)
                    }
                }
            }
        }
    }
}