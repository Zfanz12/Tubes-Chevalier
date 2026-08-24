package org.example.project.home.presentation.chat

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.ArrowBack
import androidx.compose.material.icons.filled.Send
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import org.example.project.core.theme.AppColors
import androidx.compose.foundation.layout.widthIn

private data class DummyMessage(
    val message: String,
    val isMine: Boolean,
    val time: String
)

@Composable
fun ChatScreen(
    onBack: () -> Unit
) {

    var input by remember {
        mutableStateOf("")
    }

    var messages by remember {

        mutableStateOf(
            listOf(

                DummyMessage(
                    message = "Halo Kak, ada yang bisa kami bantu?",
                    isMine = false,
                    time = "10:21"
                ),

                DummyMessage(
                    message = "Halo, saya mau tanya tentang produk yang tersedia.",
                    isMine = true,
                    time = "10:22"
                ),

                DummyMessage(
                    message = "Tentu Kak. Produk kami hari ini masih fresh dari petani.",
                    isMine = false,
                    time = "10:23"
                ),

                DummyMessage(
                    message = "Untuk tomat cherry masih tersedia?",
                    isMine = true,
                    time = "10:24"
                ),

                DummyMessage(
                    message = "Masih tersedia Kak. Stok saat ini 12 kg.",
                    isMine = false,
                    time = "10:25"
                )
            )
        )
    }


    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(AppColors.Background)
    ) {

        // =========================
        // TOP BAR
        // =========================

        Row(
            modifier = Modifier
                .fillMaxWidth()
                .background(AppColors.White)
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


            Box(
                modifier = Modifier
                    .size(42.dp)
                    .clip(CircleShape)
                    .background(AppColors.Secondary),
                contentAlignment = Alignment.Center
            ) {

                Text(
                    text = "TM",
                    color = AppColors.White,
                    fontWeight = FontWeight.Bold
                )
            }


            Spacer(
                modifier = Modifier.width(10.dp)
            )


            Column(
                modifier = Modifier.weight(1f)
            ) {

                Text(
                    text = "Tani Makmur",
                    style = MaterialTheme.typography.titleMedium,
                    fontWeight = FontWeight.Bold
                )

                Text(
                    text = "Online",
                    style = MaterialTheme.typography.labelSmall,
                    color = AppColors.Primary
                )
            }
        }


        // =========================
        // MESSAGES
        // =========================

        LazyColumn(
            modifier = Modifier
                .weight(1f)
                .fillMaxWidth()
                .padding(
                    horizontal = 14.dp
                ),
            verticalArrangement =
                Arrangement.spacedBy(8.dp),
            reverseLayout = false
        ) {

            item {
                Spacer(
                    modifier = Modifier.height(10.dp)
                )
            }


            items(messages) { message ->

                ChatBubble(
                    message = message
                )
            }


            item {
                Spacer(
                    modifier = Modifier.height(10.dp)
                )
            }
        }


        // =========================
        // INPUT
        // =========================

        Row(
            modifier = Modifier
                .fillMaxWidth()
                .background(AppColors.White)
                .padding(
                    horizontal = 12.dp,
                    vertical = 8.dp
                ),
            verticalAlignment =
                Alignment.CenterVertically
        ) {

            OutlinedTextField(

                value = input,

                onValueChange = {
                    input = it
                },

                modifier = Modifier.weight(1f),

                placeholder = {
                    Text(
                        text = "Tulis pesan..."
                    )
                },

                singleLine = true,

                shape =
                    RoundedCornerShape(22.dp)
            )


            Spacer(
                modifier = Modifier.width(6.dp)
            )


            IconButton(

                onClick = {

                    if (input.isNotBlank()) {

                        messages =
                            messages + DummyMessage(
                                message = input,
                                isMine = true,
                                time = "Sekarang"
                            )

                        input = ""
                    }
                }
            ) {

                Icon(
                    imageVector = Icons.Default.Send,
                    contentDescription = "Kirim",
                    tint = AppColors.Primary
                )
            }
        }
    }
}


@Composable
private fun ChatBubble(
    message: DummyMessage
) {

    Row(
        modifier = Modifier.fillMaxWidth(),
        horizontalArrangement =
            if (message.isMine) {
                Arrangement.End
            } else {
                Arrangement.Start
            }
    ) {

        Column(
            modifier = Modifier
                .widthIn(
                    min = 50.dp,
                    max = 290.dp
                )
                .clip(
                    RoundedCornerShape(
                        topStart = 16.dp,
                        topEnd = 16.dp,
                        bottomStart =
                            if (message.isMine) {
                                16.dp
                            } else {
                                4.dp
                            },
                        bottomEnd =
                            if (message.isMine) {
                                4.dp
                            } else {
                                16.dp
                            }
                    )
                )
                .background(
                    if (message.isMine) {
                        AppColors.Primary
                    } else {
                        AppColors.White
                    }
                )
                .padding(
                    horizontal = 14.dp,
                    vertical = 9.dp
                )
        ) {

            Text(
                text = message.message,
                style =
                    MaterialTheme.typography.bodySmall,
                color =
                    if (message.isMine) {
                        AppColors.White
                    } else {
                        AppColors.Text
                    }
            )


            Spacer(
                modifier = Modifier.height(3.dp)
            )


            Text(
                text = message.time,
                style =
                    MaterialTheme.typography.labelSmall,
                color =
                    if (message.isMine) {
                        AppColors.White
                    } else {
                        AppColors.Subtitle
                    }
            )
        }
    }
}