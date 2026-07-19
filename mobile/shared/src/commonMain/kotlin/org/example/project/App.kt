package org.example.project

import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Surface
import androidx.compose.runtime.*
import org.example.project.auth.presentation.login.LoginScreen
import org.example.project.auth.presentation.login.LoginViewModel
import org.example.project.auth.presentation.register.RegisterScreen
import org.example.project.auth.presentation.register.RegisterViewModel
import org.example.project.di.AppContainer
import org.example.project.core.storage.SessionStorage
import org.example.project.home.presentation.HomeScreen
import org.example.project.home.presentation.HomeViewModel

private enum class AuthScreen {
    LOGIN,
    REGISTER,
    HOME
}

@Composable
fun App() {

    var screen by remember {
        mutableStateOf(
            if (SessionStorage.getToken() != null)
                AuthScreen.HOME
            else
                AuthScreen.LOGIN
        )
    }

    val loginViewModel = remember {
        LoginViewModel(AppContainer.loginUseCase)
    }

    val registerViewModel = remember {
        RegisterViewModel(AppContainer.registerUseCase)
    }
    val homeViewModel = remember {
        HomeViewModel()
    }

    MaterialTheme {

        Surface {

            when (screen) {

                AuthScreen.LOGIN -> {

                    LoginScreen(
                        viewModel = loginViewModel,
                        onLoginSuccess = {
                            screen = AuthScreen.HOME
                        },
                        onNavigateToRegister = {
                            screen = AuthScreen.REGISTER
                        }
                    )

                }

                AuthScreen.REGISTER -> {

                    RegisterScreen(
                        viewModel = registerViewModel,
                        onRegisterSuccess = {
                            screen = AuthScreen.LOGIN
                        },
                        onNavigateToLogin = {
                            screen = AuthScreen.LOGIN
                        }
                    )

                }

                AuthScreen.HOME -> {
                    HomeScreen(
                        viewModel = homeViewModel,
                        onLogout = {
                            SessionStorage.clearToken()
                            screen = AuthScreen.LOGIN
                        }
                    )
                }

            }

        }

    }

}