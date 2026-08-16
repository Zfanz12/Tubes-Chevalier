package org.example.project.profile.data.repository

import org.example.project.core.network.AppError
import org.example.project.core.network.mapNetworkError
import org.example.project.profile.data.dto.UpdateAlamatRequestDto
import org.example.project.profile.data.dto.UpdateProfileRequestDto
import org.example.project.profile.data.dto.UserProfileDto
import org.example.project.profile.data.remote.ProfileApiService
import org.example.project.profile.domain.model.UserProfile
import org.example.project.profile.domain.repository.ProfileRepository

class ProfileRepositoryImpl(private val api: ProfileApiService) : ProfileRepository {

    override suspend fun getProfile(): Result<UserProfile> = runCatching {
        api.getProfile().toDomain()
    }.mapNetworkError()

    override suspend fun updateProfile(name: String, email: String, noHp: String): Result<UserProfile> = runCatching {
        val dto = api.updateProfile(UpdateProfileRequestDto(name, email, noHp))
        (dto.data ?: throw AppError.Unknown(dto.message)).toDomain()
    }.mapNetworkError()

    override suspend fun updateAlamat(alamat: String, latitude: Double?, longitude: Double?): Result<UserProfile> = runCatching {
        val dto = api.updateAlamat(UpdateAlamatRequestDto(alamat, latitude, longitude))
        (dto.data ?: throw AppError.Unknown(dto.message)).toDomain()
    }.mapNetworkError()

    private fun UserProfileDto.toDomain() = UserProfile(
        id = id,
        name = name,
        email = email,
        noHp = noHp,
        role = role,
        alamat = alamat,
        latitude = latitude,
        longitude = longitude
    )
}