package org.example.project.home.presentation

import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.setValue

class HomeViewModel {

    var uiState by mutableStateOf(HomeUiState())
        private set

    fun loadDummyUser() {
        uiState = uiState.copy(
            username = "User",
            email = "user@email.com"
        )
    }
}