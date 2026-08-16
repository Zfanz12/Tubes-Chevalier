package org.example.project.auth.presentation.login

import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.input.KeyboardType
import org.example.project.auth.domain.usecase.LoginUseCase
import org.example.project.auth.domain.usecase.RequestOtpUseCase
import org.example.project.core.preview.FakeAuthRepository
import org.example.project.core.theme.AppColors
import org.example.project.core.theme.AppSpacing
import androidx.compose.ui.tooling.preview.Preview
import org.example.project.core.presentation.component.AppButton
import org.example.project.core.presentation.component.AppTextField
import org.example.project.core.presentation.component.BackButton
import org.example.project.core.theme.HarvestaTheme

@Composable
fun LoginScreen(
    viewModel: LoginViewModel,
    onLoginSuccess: () -> Unit,
    onNavigateToRegister: () -> Unit,
    onBackClick: () -> Unit = {}
) {
    val state by viewModel.uiState.collectAsState()

    LaunchedEffect(state.isSuccess) {
        if (state.isSuccess) onLoginSuccess()
    }

    Column(
        modifier = Modifier.fillMaxSize().padding(horizontal = AppSpacing.lg, vertical = AppSpacing.lg)
    ) {
        BackButton(onClick = if (state.stage == LoginStage.OTP) viewModel::changePhoneNumber else onBackClick)

        Spacer(Modifier.height(AppSpacing.xl))

        Text("Login Harvesta", style = MaterialTheme.typography.headlineSmall, color = AppColors.TextDark)
        Spacer(Modifier.height(AppSpacing.sm))
        Text(
            if (state.stage == LoginStage.PHONE)
                "Masuk pakai nomor WhatsApp -- tanpa password, kami kirim kode OTP ke WhatsApp Anda."
            else
                "Masukkan 4-6 digit kode OTP yang dikirim ke WhatsApp ${state.noHp}.",
            style = MaterialTheme.typography.bodySmall,
            color = AppColors.TextMuted
        )

        Spacer(Modifier.height(AppSpacing.lg))

        when (state.stage) {
            LoginStage.PHONE -> {
                AppTextField(
                    value = state.noHp,
                    onValueChange = viewModel::onNoHpChange,
                    label = "Nomor WhatsApp",
                    keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Phone)
                )
            }
            LoginStage.OTP -> {
                AppTextField(
                    value = state.otpCode,
                    onValueChange = viewModel::onOtpCodeChange,
                    label = "Kode OTP",
                    keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.NumberPassword)
                )
                Spacer(Modifier.height(AppSpacing.sm))
                Row(horizontalArrangement = Arrangement.SpaceBetween, modifier = Modifier.fillMaxWidth()) {
                    Text(
                        "Ganti nomor", color = AppColors.TextMuted, style = MaterialTheme.typography.bodySmall,
                        modifier = Modifier.clickable(onClick = viewModel::changePhoneNumber)
                    )
                    Text(
                        "Kirim ulang OTP", color = AppColors.Primary, style = MaterialTheme.typography.bodySmall,
                        fontWeight = FontWeight.SemiBold,
                        modifier = Modifier.clickable(onClick = viewModel::resendOtp)
                    )
                }
            }
        }

        state.infoMessage?.let {
            Spacer(Modifier.height(AppSpacing.sm))
            Text(it, color = AppColors.Success, style = MaterialTheme.typography.bodySmall)
        }
        state.errorMessage?.let {
            Spacer(Modifier.height(AppSpacing.sm))
            Text(it, color = MaterialTheme.colorScheme.error, style = MaterialTheme.typography.bodySmall)
        }

        Spacer(Modifier.height(AppSpacing.lg))

        when (state.stage) {
            LoginStage.PHONE -> AppButton(text = "Kirim OTP", loading = state.isLoading, onClick = viewModel::sendOtp)
            LoginStage.OTP -> AppButton(text = "Masuk", loading = state.isLoading, onClick = viewModel::submit)
        }

        Spacer(Modifier.weight(1f))

        Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.Center) {
            Text("Belum punya akun? ", color = AppColors.TextMuted, style = MaterialTheme.typography.bodyMedium)
            Text(
                "Sign Up", color = AppColors.Primary, style = MaterialTheme.typography.bodyMedium,
                fontWeight = FontWeight.SemiBold,
                modifier = Modifier.clickable(onClick = onNavigateToRegister)
            )
        }
    }
}

@Preview
@Composable
private fun LoginScreenPreview() {
    var loggedIn by remember { mutableStateOf(false) }
    val fakeRepo = remember { FakeAuthRepository() }
    val viewModel = remember {
        LoginViewModel(RequestOtpUseCase(fakeRepo), LoginUseCase(fakeRepo)).apply {
            onNoHpChange("081234567890")
        }
    }

    HarvestaTheme {
        if (loggedIn) {
            Box(Modifier.fillMaxSize(), contentAlignment = Alignment.Center) {
                Text("✅ Login berhasil (preview)")
            }
        } else {
            LoginScreen(viewModel = viewModel, onLoginSuccess = { loggedIn = true }, onNavigateToRegister = {})
        }
    }
}