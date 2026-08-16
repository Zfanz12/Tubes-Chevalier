package org.example.project.profile.domain.usecase

import org.example.project.profile.domain.model.UserProfile
import org.example.project.profile.domain.repository.ProfileRepository

class GetProfileUseCase(private val repository: ProfileRepository) {
    suspend operator fun invoke(): Result<UserProfile> = repository.getProfile()
}

class UpdateProfileUseCase(private val repository: ProfileRepository) {
    suspend operator fun invoke(name: String, email: String, noHp: String): Result<UserProfile> {
        if (name.isBlank() || email.isBlank() || noHp.isBlank()) {
            return Result.failure(IllegalArgumentException("Nama, email, dan no. HP wajib diisi"))
        }
        return repository.updateProfile(name, email, noHp)
    }
}

class UpdateAlamatUseCase(private val repository: ProfileRepository) {
    suspend operator fun invoke(alamat: String, latitude: Double?, longitude: Double?): Result<UserProfile> {
        if (alamat.isBlank()) {
            return Result.failure(IllegalArgumentException("Alamat wajib diisi"))
        }
        return repository.updateAlamat(alamat, latitude, longitude)
    }
}
