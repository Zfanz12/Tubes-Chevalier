package org.example.project.dashboard.presentation.components

import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import org.example.project.core.theme.AppColors

@Composable
fun DashboardTopBar(
    username: String,
    date: String
) {

    Row(
        modifier = Modifier
            .fillMaxWidth()
            .padding(vertical = 8.dp),
        horizontalArrangement = Arrangement.SpaceBetween,
        verticalAlignment = Alignment.Top
    ) {

        Column(
            modifier = Modifier.weight(1f)
        ) {

            Text(
                text = "Halo, $username 👋",
                style = MaterialTheme.typography.headlineSmall,
                fontWeight = FontWeight.Bold,
                color = AppColors.Text
            )

            Spacer(modifier = Modifier.height(4.dp))

            Text(
                text = "Selamat datang kembali",
                style = MaterialTheme.typography.bodyMedium,
                color = AppColors.Subtitle
            )

            Spacer(modifier = Modifier.height(6.dp))

            Text(
                text = date,
                style = MaterialTheme.typography.bodySmall,
                color = AppColors.Subtitle
            )

        }

        Card(
            shape = CircleShape,
            colors = CardDefaults.cardColors(
                containerColor = AppColors.White
            ),
            elevation = CardDefaults.cardElevation(3.dp)
        ) {

            Box(
                modifier = Modifier.padding(12.dp),
                contentAlignment = Alignment.Center
            ) {
                // Sementara gunakan emoji
                Text(
                    text = "🔔",
                    style = MaterialTheme.typography.titleMedium
                )
            }

        }

    }

}