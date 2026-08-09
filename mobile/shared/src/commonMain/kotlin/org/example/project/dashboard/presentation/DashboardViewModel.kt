package org.example.project.dashboard.presentation

import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.setValue

class DashboardViewModel {

    var uiState by mutableStateOf(DashboardUiState())
        private set

}