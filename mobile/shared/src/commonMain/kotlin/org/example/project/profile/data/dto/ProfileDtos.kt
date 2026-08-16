package org.example.project.profile.data.dto

import kotlinx.serialization.SerialName
import kotlinx.serialization.Serializable

// Bentuk field mengikuti App\Models\User (migrations: name, email, no_hp, role, latitude,
// longitude, alamat) -- lihat migrations/2026_07_25_093356_add_role_and_no_hp_to_users_table.php
@Serializable
data class UserProfileDto(
    val id: Long,
    val name: String,
    val email: String,
    @SerialName("no_hp") val noHp: String,
    val role: String,
    val alamat: String? = null,
    val latitude: Double? = null,
    val longitude: Double? = null
)

@Serializable
data class UpdateProfileRequestDto(
    val name: String,
    val email: String,
    @SerialName("no_hp") val noHp: String
)

@Serializable
data class UpdateProfileResponseDto(
    val success: Boolean = true,
    val message: String,
    val data: UserProfileDto? = null
)

@Serializable
data class UpdateAlamatRequestDto(
    val alamat: String,
    val latitude: Double? = null,
    val longitude: Double? = null
)

@Serializable
data class UpdateAlamatResponseDto(
    val success: Boolean = true,
    val message: String,
    val data: UserProfileDto? = null
)



