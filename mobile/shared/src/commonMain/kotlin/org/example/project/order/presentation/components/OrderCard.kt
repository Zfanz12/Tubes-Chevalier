package org.example.project.order.presentation.components

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.Button
import androidx.compose.material3.HorizontalDivider
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedButton
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import org.example.project.core.theme.AppColors
import org.example.project.core.theme.AppShape
import org.example.project.core.theme.AppShapePill
import org.example.project.core.theme.AppSpacing
import org.example.project.core.util.formatRupiah
import org.example.project.order.domain.model.Order
import org.example.project.order.domain.model.OrderStatus
import org.example.project.order.domain.model.PaymentStatus

private fun statusLabel(order: Order): String = when {
    order.paymentStatus == PaymentStatus.UNPAID && order.status == OrderStatus.PENDING -> "Belum Bayar"
    order.status == OrderStatus.PREPARING -> "Diproses"
    order.status == OrderStatus.SHIPPING -> "Dikirim"
    order.status == OrderStatus.COMPLETED -> "Selesai"
    else -> "Menunggu"
}

private fun statusColor(order: Order) = when {
    order.paymentStatus == PaymentStatus.UNPAID && order.status == OrderStatus.PENDING -> AppColors.Danger
    order.status == OrderStatus.PREPARING -> AppColors.Warning
    order.status == OrderStatus.SHIPPING -> AppColors.Info
    order.status == OrderStatus.COMPLETED -> AppColors.Success
    else -> AppColors.Subtitle
}

// Figma 367-4455 (Semua) / 382-5023 (Belum Bayar) / 382-5424 (Diproses) / 472-11758 (Dikirim) --
// satu kartu = satu transaksi (kode_transaksi), karena 1 Transaksi backend memang selalu berasal
// dari 1 petani saja (lihat TransaksiController@store: semua item harus dari petani_id yang sama).
@Composable
fun OrderCard(
    order: Order,
    onPayClick: (Order) -> Unit,
    onTrackClick: (Order) -> Unit,
    onRateClick: (Order) -> Unit,
    modifier: Modifier = Modifier
) {
    Column(
        modifier = modifier
            .fillMaxWidth()
            .clip(AppShape.medium)
            .background(AppColors.White)
            .border(1.dp, AppColors.Border, AppShape.medium)
            .padding(AppSpacing.md)
    ) {
        // Header: nama toko/petani + label status
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically
        ) {
            Text(
                text = order.farmerName,
                style = MaterialTheme.typography.bodyLarge,
                fontWeight = FontWeight.Bold,
                color = AppColors.Text
            )
            Text(
                text = statusLabel(order),
                style = MaterialTheme.typography.bodySmall,
                fontWeight = FontWeight.SemiBold,
                color = statusColor(order),
                modifier = Modifier
                    .clip(AppShapePill)
                    .background(statusColor(order).copy(alpha = 0.12f))
                    .padding(horizontal = AppSpacing.sm, vertical = 4.dp)
            )
        }

        Spacer(Modifier.height(AppSpacing.sm))
        HorizontalDivider(color = AppColors.Border)
        Spacer(Modifier.height(AppSpacing.sm))

        // Daftar item dalam transaksi ini
        order.items.forEach { item ->
            Row(
                modifier = Modifier.fillMaxWidth().padding(vertical = 6.dp),
                verticalAlignment = Alignment.CenterVertically
            ) {
                // TODO: ganti dengan AsyncImage saat backend menyediakan URL gambar produk
                // (kolom `gambar` belum ada di tabel produks -- lihat migrations create_produks_table)
                Box(
                    modifier = Modifier.size(48.dp).clip(RoundedCornerShape(10.dp)).background(AppColors.Border)
                )
                Spacer(Modifier.width(AppSpacing.sm))
                Column(modifier = Modifier.weight(1f)) {
                    Text(item.namaBarang, style = MaterialTheme.typography.bodyMedium, fontWeight = FontWeight.Medium)
                    Text(
                        "${item.jumlahKg} kg x ${formatRupiah(item.hargaSatuan)}",
                        style = MaterialTheme.typography.bodySmall,
                        color = AppColors.Subtitle
                    )
                }
                Text(formatRupiah(item.subtotal), style = MaterialTheme.typography.bodyMedium, fontWeight = FontWeight.Medium)
            }
        }

        Spacer(Modifier.height(AppSpacing.sm))
        HorizontalDivider(color = AppColors.Border)
        Spacer(Modifier.height(AppSpacing.sm))

        // Total belanja
        Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceBetween) {
            Text("Total Belanja", style = MaterialTheme.typography.bodyMedium, color = AppColors.Subtitle)
            Text(
                formatRupiah(order.totalHarga),
                style = MaterialTheme.typography.bodyLarge,
                fontWeight = FontWeight.Bold,
                color = AppColors.Primary
            )
        }

        Spacer(Modifier.height(AppSpacing.sm))

        // Aksi sesuai status -- lihat OrderViewModel.filterByTab untuk penjelasan pemetaan status
        when {
            order.paymentStatus == PaymentStatus.UNPAID && order.status == OrderStatus.PENDING -> {
                Text(
                    "Selesaikan pembayaran agar pesanan segera diproses penjual.",
                    style = MaterialTheme.typography.bodySmall,
                    color = AppColors.Danger
                )
                Spacer(Modifier.height(AppSpacing.sm))
                Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.spacedBy(AppSpacing.sm)) {
                    OutlinedButton(onClick = { onPayClick(order) }, modifier = Modifier.weight(1f)) {
                        Text("Ubah Pembayaran")
                    }
                    Button(onClick = { onPayClick(order) }, modifier = Modifier.weight(1f)) {
                        Text("Bayar")
                    }
                }
            }

            order.status == OrderStatus.PREPARING -> {
                OrderInfoRow(text = "Pesananmu sedang disiapkan oleh penjual.") {
                    OutlinedButton(onClick = { onTrackClick(order) }) { Text("Lacak") }
                }
            }

            order.status == OrderStatus.SHIPPING -> {
                OrderInfoRow(text = "Pesananmu sedang dalam pengiriman.") {
                    OutlinedButton(onClick = { onTrackClick(order) }) { Text("Lacak") }
                }
            }

            order.status == OrderStatus.COMPLETED -> {
                if (order.rating == null) {
                    OrderInfoRow(text = "Pesanan selesai. Yuk beri nilai untuk penjual.") {
                        OutlinedButton(onClick = { onRateClick(order) }) { Text("Beri Nilai") }
                    }
                } else {
                    Text(
                        "Rating kamu: ${"★".repeat(order.rating)}${"☆".repeat(5 - order.rating)}",
                        style = MaterialTheme.typography.bodySmall,
                        color = AppColors.Warning
                    )
                }
            }
        }
    }
}

@Composable
private fun OrderInfoRow(text: String, action: @Composable () -> Unit) {
    Row(
        modifier = Modifier.fillMaxWidth(),
        horizontalArrangement = Arrangement.SpaceBetween,
        verticalAlignment = Alignment.CenterVertically
    ) {
        Text(
            text,
            style = MaterialTheme.typography.bodySmall,
            color = AppColors.Subtitle,
            modifier = Modifier.weight(1f)
        )
        Spacer(Modifier.width(AppSpacing.sm))
        action()
    }
}