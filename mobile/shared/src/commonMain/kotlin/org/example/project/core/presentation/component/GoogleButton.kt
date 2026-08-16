package org.example.project.core.presentation.component

import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.OutlinedButton
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Shape

@Composable
fun GoogleButton(
    modifier: Modifier = Modifier,
    enabled: Boolean = true,
    shape: Shape = ButtonDefaults.outlinedShape,
    onClick: () -> Unit = {},
    text: String
) {

    OutlinedButton(
        onClick = onClick,
        modifier = modifier.fillMaxWidth(),
        enabled = enabled,
        shape = shape
    ) {

        // FIX: sebelumnya teks di-hardcode "Masuk dengan Google" dan mengabaikan
        // parameter `text` yang dikirim pemanggil (bug, ketahuan saat cocokkan ke Figma
        // Sign Up yang mengirim "Sign Up dengan Google").
        Text(text)

    }

}