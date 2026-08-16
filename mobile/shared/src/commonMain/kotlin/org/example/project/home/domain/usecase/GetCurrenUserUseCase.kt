package org.example.project.home.domain.usecase

import org.example.project.home.domain.model.HomeUser
import org.example.project.home.domain.repository.HomeRepository

class GetCurrentUserUseCase(private val repository: HomeRepository) {
    suspend operator fun invoke(): Result<HomeUser> = repository.getCurrentUser()
}