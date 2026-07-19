package org.example.project.auth.presentation.navigation

import androidx.compose.runtime.*
import org.example.project.auth.presentation.login.LoginScreen
import org.example.project.auth.presentation.login.LoginViewModel
import org.example.project.auth.presentation.register.RegisterScreen
import org.example.project.auth.presentation.register.RegisterViewModel
import androidx.compose.runtime.saveable.rememberSaveable

@Composable
fun AuthNavigation(
    loginViewModel: LoginViewModel,
    registerViewModel: RegisterViewModel,
    onLoginSuccess: () -> Unit
) {

    var currentScreen by rememberSaveable {
        mutableStateOf(Screen.LOGIN)
    }

    when (currentScreen) {

        Screen.LOGIN -> {

            LoginScreen(

                viewModel = loginViewModel,

                onLoginSuccess = onLoginSuccess,

                onNavigateToRegister = {

                    currentScreen = Screen.REGISTER

                }

            )

        }

        Screen.REGISTER -> {

            RegisterScreen(

                viewModel = registerViewModel,

                onRegisterSuccess = {

                    currentScreen = Screen.LOGIN

                },

                onNavigateToLogin = {

                    currentScreen = Screen.LOGIN

                }

            )

        }

    }

}