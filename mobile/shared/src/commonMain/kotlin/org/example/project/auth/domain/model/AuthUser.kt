package org.example.project.auth.domain.model

data class AuthUser(
    val id: Long,
    val name: String,
    val noHp: String,
    val role: String
)