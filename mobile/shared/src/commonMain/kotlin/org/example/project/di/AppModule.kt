package org.example.project.di

import org.example.project.auth.data.remote.AuthApiService
import org.example.project.auth.data.repository.AuthRepositoryImpl
import org.example.project.auth.domain.usecase.LoginUseCase
import org.example.project.auth.domain.usecase.RegisterUseCase
import org.example.project.auth.presentation.login.LoginViewModel
import org.example.project.auth.presentation.register.RegisterViewModel
import org.example.project.core.network.createHttpClient

object AppModule {

    // Network
    private val httpClient by lazy {
        createHttpClient()
    }

    // API
    private val authApiService by lazy {
        AuthApiService(httpClient)
    }

    // Repository
    private val authRepository by lazy {
        AuthRepositoryImpl(authApiService)
    }

    // UseCase
    private val loginUseCase by lazy {
        LoginUseCase(authRepository)
    }

    private val registerUseCase by lazy {
        RegisterUseCase(authRepository)
    }

    // ViewModel
    val loginViewModel by lazy {
        LoginViewModel(loginUseCase)
    }

    val registerViewModel by lazy {
        RegisterViewModel(registerUseCase)
    }
}