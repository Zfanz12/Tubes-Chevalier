package org.example.project.di

import org.example.project.auth.data.remote.AuthApiService
import org.example.project.auth.data.repository.AuthRepositoryImpl
import org.example.project.auth.domain.repository.AuthRepository
import org.example.project.auth.domain.usecase.LoginUseCase
import org.example.project.auth.domain.usecase.LogoutUseCase
import org.example.project.auth.domain.usecase.RegisterUseCase
import org.example.project.core.network.createHttpClient

// Container DI sederhana, cukup untuk skala Tubes.
// Kalau nanti fitur bertambah banyak, tinggal migrasi ke Koin memakai kelas yang sama.
object AppContainer {
    private val httpClient by lazy { createHttpClient() }
    private val authApiService by lazy { AuthApiService(httpClient) }

    val authRepository: AuthRepository by lazy { AuthRepositoryImpl(authApiService) }

    val loginUseCase: LoginUseCase by lazy { LoginUseCase(authRepository) }
    val registerUseCase: RegisterUseCase by lazy { RegisterUseCase(authRepository) }
    val logoutUseCase: LogoutUseCase by lazy { LogoutUseCase(authRepository) }
}