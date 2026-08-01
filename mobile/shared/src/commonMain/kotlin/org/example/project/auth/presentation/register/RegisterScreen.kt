package org.example.project.auth.presentation.register

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import org.example.project.auth.domain.usecase.RegisterUseCase
import org.example.project.core.component.*
import org.example.project.core.preview.FakeAuthRepository
import org.example.project.core.theme.AppColors
import org.example.project.core.theme.AppShapePill
import org.example.project.core.theme.AppSpacing
import org.jetbrains.compose.ui.tooling.preview.Preview

// Radius field sesuai Figma (rounded-[24px]) -- lebih besar dari AppShape.medium (16.dp) biasa,
// dipakai lokal di sini saja supaya tidak mengubah tampilan field di layar lain (mis. Login).
private val RegisterFieldShape = RoundedCornerShape(24.dp)

@Composable
fun RegisterScreen(
    viewModel: RegisterViewModel,
    onRegisterSuccess: () -> Unit,
    onNavigateToLogin: () -> Unit
) {
    val state by viewModel.uiState.collectAsState()

    LaunchedEffect(state.isSuccess) {
        if (state.isSuccess) onRegisterSuccess()
    }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(AppColors.Neutral) // Figma: bg #F7F7F7
            .padding(horizontal = AppSpacing.lg, vertical = AppSpacing.lg)
    ) {
        // Figma: ikon + label "Kembali" berwarna abu (#8E8E93), bukan warna teks default
        BackButton(onClick = onNavigateToLogin, contentColor = AppColors.TextMuted)

        Spacer(Modifier.height(AppSpacing.xl))

        // Header -- Figma: "Sign Up " (Primary) + "Harvesta" (Tertiary), Bold 22sp
        Row {
            Text(
                "Sign Up ",
                style = MaterialTheme.typography.headlineSmall.copy(fontSize = 22.sp),
                color = AppColors.Primary
            )
            Text(
                "Harvesta",
                style = MaterialTheme.typography.headlineSmall.copy(fontSize = 22.sp),
                color = AppColors.Tertiary
            )
        }
        Spacer(Modifier.height(AppSpacing.sm))
        // Figma: paragraph Light 12sp, warna Color System/Surface/Darker (#535356) = AppColors.TextDark
        Text(
            "Buat akun untuk mulai terhubung dengan petani dan pembeli dalam satu platform.",
            style = MaterialTheme.typography.bodySmall,
            color = AppColors.TextDark
        )

        Spacer(Modifier.height(AppSpacing.lg))

        // Form -- HANYA 3 field: Nama Lengkap, Email, Password (TIDAK ada Konfirmasi Password)
        // Figma: border field #8E8E93 (= AppColors.TextMuted), radius 24dp -- lebih bulat dari default
        AppTextField(
            value = state.name,
            onValueChange = viewModel::onNameChange,
            label = "Nama Lengkap",
            shape = RegisterFieldShape
        )
        Spacer(Modifier.height(AppSpacing.md))
        AppTextField(
            value = state.email,
            onValueChange = viewModel::onEmailChange,
            label = "Email",
            shape = RegisterFieldShape
        )
        Spacer(Modifier.height(AppSpacing.md))
        PasswordField(
            value = state.password,
            onValueChange = viewModel::onPasswordChange,
            label = "Password",
            shape = RegisterFieldShape
        )

        state.errorMessage?.let {
            Spacer(Modifier.height(AppSpacing.sm))
            Text(it, color = MaterialTheme.colorScheme.error, style = MaterialTheme.typography.bodySmall)
        }

        Spacer(Modifier.height(AppSpacing.lg))

        // Figma: tombol Sign Up radius 900px (pill penuh) -> AppShapePill
        AppButton(text = "Sign Up", loading = state.isLoading, shape = AppShapePill, onClick = viewModel::submit)

        Spacer(Modifier.height(AppSpacing.md))
        DividerWithText(text = "or")
        Spacer(Modifier.height(AppSpacing.md))

        // Figma: border outline hitam, radius 24dp, tombol aktif (bukan disabled)
        GoogleButton(text = "Sign Up dengan Google", shape = RegisterFieldShape)

        Spacer(Modifier.weight(1f))

        Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.Center) {
            Text("Sudah punya akun? ", color = AppColors.TextMuted, style = MaterialTheme.typography.bodyMedium)
            TextButton(onClick = onNavigateToLogin) {
                Text("Login", color = AppColors.Primary, style = MaterialTheme.typography.bodyMedium, fontWeight = FontWeight.SemiBold)
            }
        }
    }
}

@Preview
@Composable
private fun RegisterScreenPreview() {
    var registered by remember { mutableStateOf(false) }
    val viewModel = remember {
        RegisterViewModel(RegisterUseCase(FakeAuthRepository())).apply {
            onNameChange("Preview User")
            onEmailChange("preview@email.com")
            onPasswordChange("password123")
        }
    }

    MaterialTheme {
        if (registered) {
            Box(Modifier.fillMaxSize(), contentAlignment = Alignment.Center) {
                Text("✅ Register berhasil (preview)")
            }
        } else {
            RegisterScreen(
                viewModel = viewModel,
                onRegisterSuccess = { registered = true },
                onNavigateToLogin = {}
            )
        }
    }
}