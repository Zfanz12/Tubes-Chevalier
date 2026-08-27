package org.example.project.profile.domain.repository

import org.example.project.profile.domain.model.UserProfile

interface ProfileRepository {

    suspend fun getProfile(): Result<UserProfile>

    suspend fun updateProfile(name: String, email: String, noHp: String): Result<UserProfile>

    suspend fun updateAlamat(alamat: String, latitude: Double?, longitude: Double?): Result<UserProfile>

}