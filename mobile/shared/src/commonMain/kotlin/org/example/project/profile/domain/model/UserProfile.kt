package org.example.project.profile.domain.model

data class UserProfile(
    val id: Long,
    val name: String,
    val email: String,
    val noHp: String,
    val role: String,
    val alamat: String?,
    val latitude: Double?,
    val longitude: Double?
)