package org.example.project.order.presentation.components

import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.padding
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Star
import androidx.compose.material.icons.filled.StarBorder
import androidx.compose.material3.AlertDialog
import androidx.compose.material3.Icon
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import org.example.project.core.theme.AppColors

// Dipakai saat tombol "Beri Nilai" di kartu status Selesai ditekan -- mengirim ke
// POST /transaksi/{id}/rate lewat RateOrderUseCase (TransaksiController@rateTransaksi).
@Composable
fun RateOrderDialog(
    isSubmitting: Boolean,
    onDismiss: () -> Unit,
    onSubmit: (Int) -> Unit
) {
    var selectedStars by remember { mutableStateOf(5) }

    AlertDialog(
        onDismissRequest = onDismiss,
        title = { Text("Beri Nilai Penjual") },
        text = {
            Row {
                for (star in 1..5) {
                    Icon(
                        imageVector = if (star <= selectedStars) Icons.Default.Star else Icons.Default.StarBorder,
                        contentDescription = "Bintang $star",
                        tint = AppColors.Warning,
                        modifier = Modifier
                            .padding(end = 4.dp)
                            .clickable { selectedStars = star }
                    )
                }
            }
        },
        confirmButton = {
            TextButton(enabled = !isSubmitting, onClick = { onSubmit(selectedStars) }) {
                Text(if (isSubmitting) "Mengirim..." else "Kirim")
            }
        },
        dismissButton = {
            TextButton(enabled = !isSubmitting, onClick = onDismiss) { Text("Batal") }
        }
    )
}