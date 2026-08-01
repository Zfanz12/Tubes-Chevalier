package org.example.project.di

import org.example.project.auth.data.remote.AuthApiService
import org.example.project.auth.data.repository.AuthRepositoryImpl
import org.example.project.auth.domain.repository.AuthRepository
import org.example.project.auth.domain.usecase.LoginUseCase
import org.example.project.auth.domain.usecase.LogoutUseCase
import org.example.project.auth.domain.usecase.RegisterUseCase
import org.example.project.core.network.createHttpClient
import org.example.project.home.data.repository.HomeRepositoryImpl
import org.example.project.home.domain.repository.HomeRepository
import org.example.project.home.domain.usecase.GetCategoriesUseCase
import org.example.project.home.domain.usecase.GetCurrentUserUseCase
import org.example.project.home.domain.usecase.GetRecommendedProductsUseCase

object AppContainer {
    private val httpClient by lazy { createHttpClient() }
    private val authApiService by lazy { AuthApiService(httpClient) }

    val authRepository: AuthRepository by lazy { AuthRepositoryImpl(authApiService) }
    val loginUseCase: LoginUseCase by lazy { LoginUseCase(authRepository) }
    val registerUseCase: RegisterUseCase by lazy { RegisterUseCase(authRepository) }
    val logoutUseCase: LogoutUseCase by lazy { LogoutUseCase(authRepository) }

    // BARU
    private val homeRepository: HomeRepository by lazy { HomeRepositoryImpl() }
    val getCurrentUserUseCase: GetCurrentUserUseCase by lazy { GetCurrentUserUseCase(homeRepository) }
    val getCategoriesUseCase: GetCategoriesUseCase by lazy { GetCategoriesUseCase(homeRepository) }
    val getRecommendedProductsUseCase: GetRecommendedProductsUseCase by lazy { GetRecommendedProductsUseCase(homeRepository) }
}