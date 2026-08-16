package org.example.project.auth.data.dto

import kotlinx.serialization.SerialName
import kotlinx.serialization.Serializable

// MVP: register passwordless -- hanya name + no_hp + role (lihat API_DOCUMENTATION.md
// bagian "Authentication (OTP WhatsApp)"). Tidak ada email/password/alamat/koordinat lagi.
@Serializable
data class RegisterRequestDto(
    val name: String,
    @SerialName("no_hp") val noHp: String,
    val role: String
)

@Serializable
data class RegisterResponseDto(
    val success: Boolean = true,
    val message: String,
    val data: RegisteredUserDto? = null
)

@Serializable
data class RegisteredUserDto(
    val id: Long,
    val name: String,
    @SerialName("no_hp") val noHp: String,
    val role: String
)

@Serializable
data class SendOtpRequestDto(@SerialName("no_hp") val noHp: String)

@Serializable
data class SendOtpResponseDto(val success: Boolean = true, val message: String)

@Serializable
data class LoginRequestDto(
    @SerialName("no_hp") val noHp: String,
    @SerialName("otp_code") val otpCode: String
)

@Serializable
data class LoginResponseDto(
    val success: Boolean = true,
    val message: String,
    val token: String? = null,
    val user: UserDto? = null
)

@Serializable
data class UserDto(
    val id: Long,
    val name: String,
    @SerialName("no_hp") val noHp: String,
    val role: String
)

@Serializable
data class ApiErrorResponseDto(
    val message: String? = null,
    val errors: Map<String, List<String>>? = null
)