package org.example.project.auth.presentation.login

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
fun LoginScreen(
    viewModel: LoginViewModel,
    onLoginSuccess: () -> Unit,
    onNavigateToRegister: () -> Unit
) {

    val state by viewModel.uiState.collectAsState()

    LaunchedEffect(state.isSuccess) {
        if (state.isSuccess) {
            onLoginSuccess()
        }
    }

    Scaffold {

            padding ->

        Column(

            modifier = Modifier

                .padding(padding)

                .fillMaxSize()

                .verticalScroll(rememberScrollState())

                .padding(horizontal = 24.dp),

            horizontalAlignment = Alignment.CenterHorizontally

        ) {

            Spacer(Modifier.height(56.dp))

            Text(

                text = "🌿",

                style = MaterialTheme.typography.displaySmall

            )

            Spacer(Modifier.height(12.dp))

            Text(

                text = "HARVESTA",

                style = MaterialTheme.typography.headlineMedium,

                fontWeight = FontWeight.Bold,

                color = AppColors.Primary

            )

            Spacer(Modifier.height(32.dp))

            Text(

                "Selamat Datang",

                style = MaterialTheme.typography.headlineSmall,

                fontWeight = FontWeight.Bold

            )

            Spacer(Modifier.height(6.dp))

            Text(

                "Masuk untuk melanjutkan",

                style = MaterialTheme.typography.bodyMedium,

                color = AppColors.Subtitle

            )

            Spacer(Modifier.height(32.dp))

            AppTextField(

                value = state.email,

                onValueChange = viewModel::onEmailChange,

                label = "Email"

            )

            Spacer(Modifier.height(16.dp))

            PasswordField(

                value = state.password,

                onValueChange = viewModel::onPasswordChange

            )

            Spacer(Modifier.height(8.dp))

            Row(

                modifier = Modifier.fillMaxWidth(),

                horizontalArrangement = Arrangement.End

            ) {

                TextButton(

                    onClick = { }

                ) {

                    Text("Lupa Password?")

                }

            }

            state.errorMessage?.let {

                Spacer(Modifier.height(8.dp))

                Text(

                    text = it,

                    color = MaterialTheme.colorScheme.error

                )

            }

            Spacer(Modifier.height(16.dp))

            AppButton(

                modifier = Modifier

                    .fillMaxWidth()

                    .height(54.dp),

                text = "LOGIN",

                loading = state.isLoading,

                onClick = {

                    viewModel.submit()

                }

            )

            Spacer(Modifier.height(24.dp))

            DividerWithText()

            Spacer(Modifier.height(24.dp))

            GoogleButton()

            Spacer(Modifier.height(24.dp))

            Row(

                verticalAlignment = Alignment.CenterVertically

            ) {

                Text(

                    "Belum punya akun?"

                )

                TextButton(

                    onClick = onNavigateToRegister

                ) {

                    Text(

                        "Daftar"

                    )

                }

            }

            Spacer(Modifier.height(32.dp))

        }

    }

}