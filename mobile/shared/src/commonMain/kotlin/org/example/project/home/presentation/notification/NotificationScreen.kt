package org.example.project.home.presentation.notification

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.statusBarsPadding
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.ArrowBack
import androidx.compose.material.icons.filled.LocalShipping
import androidx.compose.material.icons.filled.Notifications
import androidx.compose.material.icons.filled.ShoppingCart
import androidx.compose.material.icons.filled.Star
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import org.example.project.core.theme.AppColors

private data class DummyNotification(
    val title: String,
    val description: String,
    val time: String,
    val type: NotificationType,
    val unread: Boolean
)

private enum class NotificationType {
    ORDER,
    PROMO,
    REVIEW,
    SYSTEM
}

@Composable
fun NotificationScreen(
    onBack: () -> Unit
) {

    val notifications = listOf(

        DummyNotification(
            title = "Pesanan sedang dikirim",
            description = "Pesanan #HV-1024 sedang dalam perjalanan.",
            time = "10 menit lalu",
            type = NotificationType.ORDER,
            unread = true
        ),

        DummyNotification(
            title = "Pesanan berhasil dikonfirmasi",
            description = "Petani telah mengonfirmasi pesananmu.",
            time = "1 jam lalu",
            type = NotificationType.ORDER,
            unread = true
        ),

        DummyNotification(
            title = "Promo khusus untukmu",
            description = "Dapatkan potongan harga untuk produk organik.",
            time = "3 jam lalu",
            type = NotificationType.PROMO,
            unread = false
        ),

        DummyNotification(
            title = "Jangan lupa beri ulasan",
            description = "Bagikan pengalamanmu setelah menerima pesanan.",
            time = "Kemarin",
            type = NotificationType.REVIEW,
            unread = false
        ),

        DummyNotification(
            title = "Selamat datang di Harvesta",
            description = "Temukan produk segar langsung dari petani lokal.",
            time = "Kemarin",
            type = NotificationType.SYSTEM,
            unread = false
        )
    )

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(AppColors.Background)
    ) {

        Row(
            modifier = Modifier
                .fillMaxWidth()
                .background(AppColors.White)
                .statusBarsPadding()
                .padding(
                    horizontal = 8.dp,
                    vertical = 8.dp
                ),
            verticalAlignment = Alignment.CenterVertically
        ) {

            IconButton(
                onClick = onBack
            ) {
                Icon(
                    imageVector = Icons.Default.ArrowBack,
                    contentDescription = "Kembali",
                    tint = AppColors.Text
                )
            }

            Text(
                text = "Notifikasi",
                style = MaterialTheme.typography.titleLarge,
                fontWeight = FontWeight.Bold,
                modifier = Modifier.weight(1f)
            )

            Text(
                text = "Tandai semua",
                style = MaterialTheme.typography.labelMedium,
                color = AppColors.Primary,
                fontWeight = FontWeight.SemiBold
            )
        }

        LazyColumn(
            modifier = Modifier
                .fillMaxSize()
                .padding(
                    horizontal = 14.dp
                ),
            verticalArrangement = Arrangement.spacedBy(8.dp)
        ) {

            item {
                Spacer(
                    modifier = Modifier.height(8.dp)
                )
            }

            items(notifications) { notification ->

                NotificationItem(
                    notification = notification
                )
            }

            item {
                Spacer(
                    modifier = Modifier.height(20.dp)
                )
            }
        }
    }
}


@Composable
private fun NotificationItem(
    notification: DummyNotification
) {

    Row(
        modifier = Modifier
            .fillMaxWidth()
            .clip(
                RoundedCornerShape(14.dp)
            )
            .background(
                if (notification.unread) {
                    AppColors.Secondary
                } else {
                    AppColors.White
                }
            )
            .padding(14.dp),
        verticalAlignment = Alignment.Top
    ) {

        NotificationIcon(
            type = notification.type
        )

        Spacer(
            modifier = Modifier.width(12.dp)
        )

        Column(
            modifier = Modifier.weight(1f)
        ) {

            Row(
                modifier = Modifier.fillMaxWidth(),
                verticalAlignment = Alignment.CenterVertically
            ) {

                Text(
                    text = notification.title,
                    style = MaterialTheme.typography.bodyMedium,
                    fontWeight = FontWeight.Bold,
                    modifier = Modifier.weight(1f)
                )

                if (notification.unread) {

                    Spacer(
                        modifier = Modifier.width(6.dp)
                    )

                    Spacer(
                        modifier = Modifier
                            .size(7.dp)
                            .clip(CircleShape)
                            .background(AppColors.Primary)
                    )
                }
            }

            Spacer(
                modifier = Modifier.height(4.dp)
            )

            Text(
                text = notification.description,
                style = MaterialTheme.typography.bodySmall,
                color = AppColors.Subtitle
            )

            Spacer(
                modifier = Modifier.height(5.dp)
            )

            Text(
                text = notification.time,
                style = MaterialTheme.typography.labelSmall,
                color = AppColors.Subtitle
            )
        }
    }
}


@Composable
private fun NotificationIcon(
    type: NotificationType
) {

    val icon = when (type) {

        NotificationType.ORDER ->
            Icons.Default.LocalShipping

        NotificationType.PROMO ->
            Icons.Default.ShoppingCart

        NotificationType.REVIEW ->
            Icons.Default.Star

        NotificationType.SYSTEM ->
            Icons.Default.Notifications
    }

    Row(
        modifier = Modifier
            .size(44.dp)
            .clip(CircleShape)
            .background(AppColors.Secondary),
        verticalAlignment = Alignment.CenterVertically,
        horizontalArrangement = Arrangement.Center
    ) {

        Icon(
            imageVector = icon,
            contentDescription = null,
            tint = AppColors.White,
            modifier = Modifier.size(21.dp)
        )
    }
}