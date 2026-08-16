package org.example.project.auth.presentation.register

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import org.example.project.auth.domain.usecase.RegisterUseCase
import org.example.project.core.presentation.component.*
import org.example.project.core.preview.FakeAuthRepository
import org.example.project.core.theme.AppColors
import org.example.project.core.theme.AppShapePill
import org.example.project.core.theme.AppSpacing
import androidx.compose.ui.tooling.preview.Preview
import org.example.project.core.theme.HarvestaTheme

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

        // MVP: passwordless (WhatsApp OTP) -- form register HANYA 2 kolom: Nama Lengkap
        // dan Nomor WhatsApp. Tidak ada email, password, alamat, koordinat, ATAUPUN pilihan
        // role lagi -- aplikasi mobile ini khusus sisi UMKM, jadi role otomatis "umkm"
        // (lihat RegisterViewModel.fixedRole). Sisi Petani ditangani di kanal terpisah.
        // Figma: border field #8E8E93 (= AppColors.TextMuted), radius 24dp -- lebih bulat dari default
        AppTextField(
            value = state.name,
            onValueChange = viewModel::onNameChange,
            label = "Nama Lengkap",
            placeholder = "Masukkan Nama Lengkap",
            shape = RegisterFieldShape
        )

        Spacer(Modifier.height(AppSpacing.md))

        AppTextField(
            value = state.noHp,
            onValueChange = viewModel::onNoHpChange,
            label = "Nomor WhatsApp",
            placeholder = "Masukkan Nomor Handphone",
            shape = RegisterFieldShape,
            keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Phone)
        )

        state.errorMessage?.let {
            Spacer(Modifier.height(AppSpacing.sm))
            Text(it, color = MaterialTheme.colorScheme.error, style = MaterialTheme.typography.bodySmall)
        }

        Spacer(Modifier.height(AppSpacing.lg))

        // Figma: tombol Sign Up radius 900px (pill penuh) -> AppShapePill
        AppButton(text = "Sign Up", loading = state.isLoading, shape = AppShapePill, onClick = viewModel::submit)

        // Sebelumnya Modifier.weight(1f) -- mendorong teks ini sampai ke bawah layar karena
        // Column ini fillMaxSize(). Sesuai Figma (node 382-xxxx Sign Up), teksnya menempel
        // tepat di bawah tombol Sign Up, jadi cukup spacing tetap seperti jarak antar elemen lain.
        Spacer(Modifier.height(AppSpacing.lg))

        Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.Center) {
            Text("Sudah punya akun? ", color = AppColors.TextMuted, style = MaterialTheme.typography.bodyMedium)
            Text(
                "Login", color = AppColors.Primary, style = MaterialTheme.typography.bodyMedium,
                fontWeight = FontWeight.SemiBold,
                modifier = Modifier.clickable(onClick = onNavigateToLogin)
            )
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
            onNoHpChange("081234567890")
        }
    }

    HarvestaTheme {
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