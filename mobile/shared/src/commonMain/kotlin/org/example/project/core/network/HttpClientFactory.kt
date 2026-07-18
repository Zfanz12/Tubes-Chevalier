package org.example.project.core.network

import io.ktor.client.HttpClient
import io.ktor.client.plugins.HttpTimeout
import io.ktor.client.plugins.auth.Auth
import io.ktor.client.plugins.auth.providers.BearerTokens
import io.ktor.client.plugins.auth.providers.bearer
import io.ktor.client.plugins.contentnegotiation.ContentNegotiation
import io.ktor.client.plugins.defaultRequest
import io.ktor.client.plugins.logging.LogLevel
import io.ktor.client.plugins.logging.Logging
import io.ktor.http.ContentType
import io.ktor.http.contentType
import io.ktor.serialization.kotlinx.json.json
import kotlinx.serialization.json.Json
import org.example.project.core.storage.SessionStorage

fun createHttpClient(): HttpClient = HttpClient(provideHttpClientEngine()) {
    expectSuccess = false

    install(ContentNegotiation) {
        json(Json {
            ignoreUnknownKeys = true
            isLenient = true
        })
    }

    install(Logging) {
        level = LogLevel.INFO
    }

    install(HttpTimeout) {
        requestTimeoutMillis = 15_000
        connectTimeoutMillis = 15_000
    }

    // Sanctum: token dikirim sebagai Bearer di header Authorization
    install(Auth) {
        bearer {
            loadTokens {
                SessionStorage.getToken()?.let { BearerTokens(accessToken = it, refreshToken = "") }
            }
        }
    }

    defaultRequest {
        contentType(ContentType.Application.Json)
    }
}