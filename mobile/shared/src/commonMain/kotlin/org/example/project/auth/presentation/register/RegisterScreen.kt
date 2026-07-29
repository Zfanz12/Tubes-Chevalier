package org.example.project.auth.presentation.register

import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import org.example.project.core.component.AppButton
import org.example.project.core.component.AppTextField
import org.example.project.core.component.DividerWithText
import org.example.project.core.component.GoogleButton
import org.example.project.core.component.PasswordField
import org.example.project.core.theme.AppColors

@Composable
fun RegisterScreen(
    viewModel: RegisterViewModel,
    onRegisterSuccess: () -> Unit,
    onNavigateToLogin: () -> Unit
) {

    val state by viewModel.uiState.collectAsState()

    LaunchedEffect(state.isSuccess) {
        if (state.isSuccess) {
            onRegisterSuccess()
        }
    }

    Scaffold { padding ->

        Column(
            modifier = Modifier
                .padding(padding)
                .fillMaxSize()
                .verticalScroll(rememberScrollState())
                .padding(horizontal = 24.dp),

            horizontalAlignment = Alignment.CenterHorizontally
        ) {

            Spacer(modifier = Modifier.height(48.dp))

            Text(
                text = "🌿",
                style = MaterialTheme.typography.displaySmall
            )

            Spacer(modifier = Modifier.height(12.dp))

            Text(
                text = "HARVESTA",
                style = MaterialTheme.typography.headlineMedium,
                fontWeight = FontWeight.Bold,
                color = AppColors.Primary
            )

            Spacer(modifier = Modifier.height(28.dp))

            Text(
                text = "Buat Akun",
                style = MaterialTheme.typography.headlineSmall,
                fontWeight = FontWeight.Bold
            )

            Spacer(modifier = Modifier.height(6.dp))

            Text(
                text = "Daftar untuk mulai menggunakan Harvesta",
                style = MaterialTheme.typography.bodyMedium,
                color = AppColors.Subtitle
            )

            Spacer(modifier = Modifier.height(28.dp))

            AppTextField(
                value = state.name,
                onValueChange = viewModel::onNameChange,
                label = "Nama Lengkap"
            )

            Spacer(modifier = Modifier.height(16.dp))

            AppTextField(
                value = state.email,
                onValueChange = viewModel::onEmailChange,
                label = "Email"
            )

            Spacer(modifier = Modifier.height(16.dp))

            PasswordField(
                value = state.password,
                onValueChange = viewModel::onPasswordChange,
                label = "Password"
            )

            Spacer(modifier = Modifier.height(16.dp))

            PasswordField(
                value = state.passwordConfirmation,
                onValueChange = viewModel::onPasswordConfirmationChange,
                label = "Konfirmasi Password"
            )

            state.errorMessage?.let {

                Spacer(modifier = Modifier.height(12.dp))

                Text(
                    text = it,
                    color = MaterialTheme.colorScheme.error
                )

            }

            Spacer(modifier = Modifier.height(20.dp))

            AppButton(
                modifier = Modifier
                    .fillMaxWidth()
                    .height(54.dp),

                text = "DAFTAR",

                loading = state.isLoading,

                onClick = {
                    viewModel.submit()
                }
            )

            Spacer(modifier = Modifier.height(24.dp))

            DividerWithText()

            Spacer(modifier = Modifier.height(24.dp))

            GoogleButton()

            Spacer(modifier = Modifier.height(24.dp))

            Row(
                verticalAlignment = Alignment.CenterVertically
            ) {

                Text("Sudah punya akun?")

                TextButton(
                    onClick = onNavigateToLogin
                ) {

                    Text("Masuk")

                }

            }

            Spacer(modifier = Modifier.height(32.dp))

        }

    }

}