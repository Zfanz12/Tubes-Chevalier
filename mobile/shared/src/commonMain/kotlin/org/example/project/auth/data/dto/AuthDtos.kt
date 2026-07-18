package org.example.project.auth.data.dto

import kotlinx.serialization.SerialName
import kotlinx.serialization.Serializable

@Serializable
data class LoginRequestDto(
    val email: String,
    val password: String
)

@Serializable
data class RegisterRequestDto(
    val name: String,
    val email: String,
    val password: String,
    @SerialName("password_confirmation") val passwordConfirmation: String
)

@Serializable
data class UserDto(
    val id: Long,
    val name: String,
    val email: String
)

@Serializable
data class AuthResponseDto(
    val message: String,
    @SerialName("access_token") val accessToken: String,
    @SerialName("token_type") val tokenType: String,
    val user: UserDto
)

@Serializable
data class ApiErrorResponseDto(
    val message: String? = null,
    val errors: Map<String, List<String>>? = null
)