package org.example.project.auth.domain.usecase

import org.example.project.auth.domain.repository.AuthRepository

class RegisterUseCase(private val repository: AuthRepository) {
    suspend operator fun invoke(name: String, noHp: String, role: String): Result<Unit> {
        if (name.isBlank() || noHp.isBlank()) {
            return Result.failure(IllegalArgumentException("Nama dan nomor WhatsApp wajib diisi"))
        }
        if (role != "petani" && role != "umkm") {
            return Result.failure(IllegalArgumentException("Pilih jenis akun: Petani atau UMKM"))
        }
        return repository.register(name, noHp, role)
    }
}