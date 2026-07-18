package org.example.project.auth.domain.model

data class AuthSession(
    val user: AuthUser,
    val accessToken: String,
    val tokenType: String
)