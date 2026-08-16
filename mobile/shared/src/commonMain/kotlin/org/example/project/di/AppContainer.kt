package org.example.project.di

import org.example.project.auth.data.remote.AuthApiService
import org.example.project.auth.data.repository.AuthRepositoryImpl
import org.example.project.auth.domain.repository.AuthRepository
import org.example.project.auth.domain.usecase.LoginUseCase
import org.example.project.auth.domain.usecase.LogoutUseCase
import org.example.project.auth.domain.usecase.RegisterUseCase
import org.example.project.auth.domain.usecase.RequestOtpUseCase
import org.example.project.cart.data.remote.CartApiService
import org.example.project.cart.data.repository.CartRepositoryImpl
import org.example.project.cart.domain.repository.CartRepository
import org.example.project.cart.domain.usecase.AddToCartUseCase
import org.example.project.cart.domain.usecase.CheckoutCartUseCase
import org.example.project.cart.domain.usecase.GetSimilarProductsUseCase
import org.example.project.cart.domain.usecase.ObserveCartItemsUseCase
import org.example.project.cart.domain.usecase.RemoveCartItemUseCase
import org.example.project.cart.domain.usecase.SetCartItemSelectedUseCase
import org.example.project.cart.domain.usecase.SetCartSelectAllUseCase
import org.example.project.cart.domain.usecase.SetCartStoreSelectedUseCase
import org.example.project.cart.domain.usecase.UpdateCartQuantityUseCase
import org.example.project.core.network.createHttpClient
import org.example.project.home.data.repository.HomeRepositoryImpl
import org.example.project.home.domain.repository.HomeRepository
import org.example.project.home.domain.usecase.GetCategoriesUseCase
import org.example.project.home.domain.usecase.GetCurrentUserUseCase
import org.example.project.home.domain.usecase.GetRecommendedProductsUseCase
import org.example.project.order.data.remote.OrderApiService
import org.example.project.order.data.repository.OrderRepositoryImpl
import org.example.project.order.domain.repository.OrderRepository
import org.example.project.order.domain.usecase.GetOrdersUseCase
import org.example.project.order.domain.usecase.RateOrderUseCase
import org.example.project.profile.data.remote.ProfileApiService
import org.example.project.profile.data.repository.ProfileRepositoryImpl
import org.example.project.profile.domain.repository.ProfileRepository
import org.example.project.profile.domain.usecase.GetProfileUseCase
import org.example.project.profile.domain.usecase.UpdateAlamatUseCase
import org.example.project.profile.domain.usecase.UpdateProfileUseCase
import org.example.project.search.data.remote.SearchApiService
import org.example.project.search.data.repository.SearchRepositoryImpl
import org.example.project.search.domain.repository.SearchRepository
import org.example.project.search.domain.usecase.GetRecommendedSearchItemsUseCase
import org.example.project.search.domain.usecase.GetSearchSuggestionsUseCase
import org.example.project.search.domain.usecase.SearchProductsUseCase
import kotlin.getValue

object AppContainer {
    private val httpClient by lazy { createHttpClient() }
    private val authApiService by lazy { AuthApiService(httpClient) }

    val authRepository: AuthRepository by lazy { AuthRepositoryImpl(authApiService) }
    val loginUseCase: LoginUseCase by lazy { LoginUseCase(authRepository) }
    val registerUseCase: RegisterUseCase by lazy { RegisterUseCase(authRepository) }
    val requestOtpUseCase: RequestOtpUseCase by lazy { RequestOtpUseCase(authRepository) }
    val logoutUseCase: LogoutUseCase by lazy { LogoutUseCase(authRepository) }

    private val homeRepository: HomeRepository by lazy { HomeRepositoryImpl() }
    val getCurrentUserUseCase: GetCurrentUserUseCase by lazy { GetCurrentUserUseCase(homeRepository) }
    val getCategoriesUseCase: GetCategoriesUseCase by lazy { GetCategoriesUseCase(homeRepository) }
    val getRecommendedProductsUseCase: GetRecommendedProductsUseCase by lazy { GetRecommendedProductsUseCase(homeRepository) }

    private val searchApiService by lazy { SearchApiService(httpClient) }
    private val searchRepository: SearchRepository by lazy { SearchRepositoryImpl(searchApiService) }
    val getRecommendedSearchItemsUseCase: GetRecommendedSearchItemsUseCase by lazy { GetRecommendedSearchItemsUseCase(searchRepository) }
    val getSearchSuggestionsUseCase: GetSearchSuggestionsUseCase by lazy { GetSearchSuggestionsUseCase(searchRepository) }
    val searchProductsUseCase: SearchProductsUseCase by lazy { SearchProductsUseCase(searchRepository) }
    private val profileApiService by lazy { ProfileApiService(httpClient) }
    private val profileRepository: ProfileRepository by lazy { ProfileRepositoryImpl(profileApiService) }
    val getProfileUseCase: GetProfileUseCase by lazy { GetProfileUseCase(profileRepository) }
    val updateProfileUseCase: UpdateProfileUseCase by lazy { UpdateProfileUseCase(profileRepository) }
    val updateAlamatUseCase: UpdateAlamatUseCase by lazy { UpdateAlamatUseCase(profileRepository) }

    // Fitur Keranjang -- lihat catatan arsitektur lengkap di cart/domain/model/CartItem.kt
    // (backend belum punya endpoint cart, sehingga isi keranjang murni state lokal, sedangkan
    // "Produk Serupa" & checkout betul-betul terhubung ke GET /petani & POST /transaksi).
    private val cartApiService by lazy { CartApiService(httpClient) }
    val cartRepository: CartRepository by lazy { CartRepositoryImpl(cartApiService) }
    val observeCartItemsUseCase: ObserveCartItemsUseCase by lazy { ObserveCartItemsUseCase(cartRepository) }
    val addToCartUseCase: AddToCartUseCase by lazy { AddToCartUseCase(cartRepository) }
    val updateCartQuantityUseCase: UpdateCartQuantityUseCase by lazy { UpdateCartQuantityUseCase(cartRepository) }
    val removeCartItemUseCase: RemoveCartItemUseCase by lazy { RemoveCartItemUseCase(cartRepository) }
    val setCartItemSelectedUseCase: SetCartItemSelectedUseCase by lazy { SetCartItemSelectedUseCase(cartRepository) }
    val setCartStoreSelectedUseCase: SetCartStoreSelectedUseCase by lazy { SetCartStoreSelectedUseCase(cartRepository) }
    val setCartSelectAllUseCase: SetCartSelectAllUseCase by lazy { SetCartSelectAllUseCase(cartRepository) }
    val getSimilarProductsUseCase: GetSimilarProductsUseCase by lazy { GetSimilarProductsUseCase(cartRepository) }
    val checkoutCartUseCase: CheckoutCartUseCase by lazy { CheckoutCartUseCase(cartRepository) }

    private val orderApiService by lazy { OrderApiService(httpClient) }
    private val orderRepository: OrderRepository by lazy { OrderRepositoryImpl(orderApiService) }
    val getOrdersUseCase: GetOrdersUseCase by lazy { GetOrdersUseCase(orderRepository) }
    val rateOrderUseCase: RateOrderUseCase by lazy { RateOrderUseCase(orderRepository) }
}