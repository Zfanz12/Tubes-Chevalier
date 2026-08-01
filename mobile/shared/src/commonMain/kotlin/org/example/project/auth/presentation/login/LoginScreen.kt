package org.example.project.auth.presentation.login

import androidx.compose.foundation.layout.*
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontWeight
import org.example.project.auth.domain.usecase.LoginUseCase
import org.example.project.core.component.*
import org.example.project.core.preview.FakeAuthRepository
import org.example.project.core.theme.AppColors
import org.example.project.core.theme.AppSpacing
import org.jetbrains.compose.ui.tooling.preview.Preview

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
        BackButton(onClick = onBackClick)

        Spacer(Modifier.height(AppSpacing.xl))

        // Header -- sesuai Figma: "Login Harvesta", TANPA logo/branding besar, TANPA "Lupa Password?"
        Text("Login Harvesta", style = MaterialTheme.typography.headlineSmall, color = AppColors.TextDark)
        Spacer(Modifier.height(AppSpacing.sm))
        Text(
            "Masuk untuk mengakses akun dan menikmati produk segar langsung dari petani.",
            style = MaterialTheme.typography.bodySmall,
            color = AppColors.TextMuted
        )

        Spacer(Modifier.height(AppSpacing.lg))

        AppTextField(value = state.email, onValueChange = viewModel::onEmailChange, label = "Email")
        Spacer(Modifier.height(AppSpacing.md))
        PasswordField(value = state.password, onValueChange = viewModel::onPasswordChange, label = "Password")

        state.errorMessage?.let {
            Spacer(Modifier.height(AppSpacing.sm))
            Text(it, color = MaterialTheme.colorScheme.error, style = MaterialTheme.typography.bodySmall)
        }

        Spacer(Modifier.height(AppSpacing.lg))

        AppButton(text = "Login", loading = state.isLoading, onClick = viewModel::submit)

        Spacer(Modifier.height(AppSpacing.md))
        DividerWithText(text = "or")
        Spacer(Modifier.height(AppSpacing.md))

        GoogleButton(text = "Sign In dengan Google")

        Spacer(Modifier.weight(1f))

        Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.Center) {
            Text("Belum punya akun? ", color = AppColors.TextMuted, style = MaterialTheme.typography.bodyMedium)
            TextButton(onClick = onNavigateToRegister) {
                Text("Sign Up", color = AppColors.Primary, style = MaterialTheme.typography.bodyMedium, fontWeight = FontWeight.SemiBold)
            }
        }
    }
}

@Preview
@Composable
private fun LoginScreenPreview() {
    var loggedIn by remember { mutableStateOf(false) }
    val viewModel = remember {
        LoginViewModel(LoginUseCase(FakeAuthRepository())).apply {
            onEmailChange("preview@email.com")
            onPasswordChange("password123")
        }
    }

    MaterialTheme {
        if (loggedIn) {
            Box(Modifier.fillMaxSize(), contentAlignment = Alignment.Center) {
                Text("✅ Login berhasil (preview)")
            }
        } else {
            LoginScreen(
                viewModel = viewModel,
                onLoginSuccess = { loggedIn = true },
                onNavigateToRegister = {}
            )
        }
    }
}