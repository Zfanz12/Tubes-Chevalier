package org.example.project

import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Surface
import androidx.compose.runtime.*
import org.example.project.auth.presentation.login.LoginScreen
import org.example.project.auth.presentation.login.LoginViewModel
import org.example.project.auth.presentation.register.RegisterScreen
import org.example.project.auth.presentation.register.RegisterViewModel
import org.example.project.di.AppContainer

private enum class AuthScreen { LOGIN, REGISTER, HOME }

@Composable
fun App() {
    MaterialTheme {
        Surface {
            var screen by remember { mutableStateOf(AuthScreen.LOGIN) }

            when (screen) {
                AuthScreen.LOGIN -> LoginScreen(
                    viewModel = remember { LoginViewModel(AppContainer.loginUseCase) },
                    onLoginSuccess = { screen = AuthScreen.HOME },
                    onNavigateToRegister = { screen = AuthScreen.REGISTER }
                )
                AuthScreen.REGISTER -> RegisterScreen(
                    viewModel = remember { RegisterViewModel(AppContainer.registerUseCase) },
                    onRegisterSuccess = { screen = AuthScreen.LOGIN },
                    onNavigateToLogin = { screen = AuthScreen.LOGIN }
                )
                AuthScreen.HOME -> androidx.compose.material3.Text("Login berhasil! (Halaman Home menyusul)")
            }
        }
    }
}