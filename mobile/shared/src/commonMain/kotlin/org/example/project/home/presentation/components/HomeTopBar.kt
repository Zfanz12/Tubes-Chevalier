package org.example.project.home.presentation.components

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Notifications
import androidx.compose.material.icons.filled.ShoppingCart
import androidx.compose.material3.Icon
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.unit.dp
import org.example.project.core.theme.AppColors

@Composable
fun HomeTopBar(
    userName: String,
    location: String,
    onCartClick: () -> Unit = {},
    onNotificationClick: () -> Unit = {},
    onProfileClick: () -> Unit = {}
) {

    Row(

        modifier = Modifier
            .fillMaxWidth()
            .padding(
                horizontal = 24.dp,
                vertical = 12.dp
            ),

        horizontalArrangement =
            Arrangement.SpaceBetween,

        verticalAlignment =
            Alignment.CenterVertically

    ) {

        /*
         * PROFILE
         */

        Row(
            verticalAlignment =
                Alignment.CenterVertically
        ) {

            Box(

                modifier = Modifier
                    .size(42.dp)
                    .clip(CircleShape)
                    .background(
                        AppColors.Secondary
                    )
                    .clickable(
                        onClick = onProfileClick
                    ),

                contentAlignment =
                    Alignment.Center

            ) {

                Text(
                    text =
                        userName
                            .firstOrNull()
                            ?.uppercase()
                            ?: "H",

                    color =
                        AppColors.White,

                    fontWeight =
                        androidx.compose.ui.text.font.FontWeight.Bold
                )

            }


            Spacer(
                Modifier.width(12.dp)
            )


            Column {

                Text(

                    text = "Hi, $userName",

                    style =
                        MaterialTheme.typography.titleSmall,

                    fontWeight =
                        androidx.compose.ui.text.font.FontWeight.SemiBold

                )


                Text(

                    text = location,

                    style =
                        MaterialTheme.typography.bodySmall,

                    color =
                        AppColors.Subtitle

                )

            }

        }


        /*
         * ACTIONS
         */

        Row {

            Icon(

                imageVector =
                    Icons.Default.ShoppingCart,

                contentDescription =
                    "Keranjang",

                tint =
                    AppColors.Primary,

                modifier = Modifier
                    .size(42.dp)
                    .padding(9.dp)
                    .clickable(
                        onClick = onCartClick
                    )

            )


            Icon(

                imageVector =
                    Icons.Default.Notifications,

                contentDescription =
                    "Notifikasi",

                tint =
                    AppColors.Primary,

                modifier = Modifier
                    .size(42.dp)
                    .padding(9.dp)
                    .clickable(
                        onClick = onNotificationClick
                    )

            )

        }

    }
}