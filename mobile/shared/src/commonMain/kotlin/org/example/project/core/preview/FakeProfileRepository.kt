package org.example.project.core.preview

import kotlinx.coroutines.delay
import org.example.project.profile.domain.model.UserProfile
import org.example.project.profile.domain.repository.ProfileRepository

class FakeProfileRepository : ProfileRepository {

    private var current = UserProfile(
        id = 1,
        name = "Dewi Pertiwi",
        email = "dewi.pertiwi@gmail.com",
        noHp = "081234567890",
        role = "petani",
        alamat = "Jl. Kebun Raya No. 12, Cibinong, Bogor",
        latitude = -6.4817,
        longitude = 106.8540
    )

    override suspend fun getProfile(): Result<UserProfile> {
        delay(200)
        return Result.success(current)
    }

    override suspend fun updateProfile(name: String, email: String, noHp: String): Result<UserProfile> {
        delay(300)
        current = current.copy(name = name, email = email, noHp = noHp)
        return Result.success(current)
    }

    override suspend fun updateAlamat(alamat: String, latitude: Double?, longitude: Double?): Result<UserProfile> {
        delay(300)
        current = current.copy(alamat = alamat, latitude = latitude, longitude = longitude)
        return Result.success(current)
    }
}