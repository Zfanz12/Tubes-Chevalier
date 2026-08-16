package org.example.project.profile.presentation.profile

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.HelpOutline
import androidx.compose.material.icons.automirrored.filled.Logout
import androidx.compose.material.icons.filled.ChevronRight
import androidx.compose.material.icons.filled.Info
import androidx.compose.material.icons.filled.LocationOn
import androidx.compose.material.icons.filled.Person
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.material3.Icon
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedButton
import androidx.compose.material3.Text
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import org.example.project.auth.domain.usecase.LogoutUseCase
import org.example.project.core.presentation.component.AppConfirmDialog
import org.example.project.core.preview.FakeProfileRepository
import org.example.project.core.theme.AppColors
import org.example.project.core.theme.AppShapePill
import org.example.project.core.theme.AppSpacing
import org.example.project.profile.domain.usecase.GetProfileUseCase

@Composable
fun ProfileScreen(
    viewModel: ProfileViewModel,
    onNavigateToEditProfile: () -> Unit,
    onNavigateToEditAlamat: () -> Unit,
    onNavigateToHelp: () -> Unit,
    onNavigateToAbout: () -> Unit,
    onLoggedOut: () -> Unit
) {
    val state by viewModel.uiState.collectAsState()

    LaunchedEffect(state.isLoggedOut) {
        if (state.isLoggedOut) onLoggedOut()
    }

    Column(modifier = Modifier.fillMaxSize().background(AppColors.Background)) {

        if (state.isLoading && state.profile == null) {
            Box(Modifier.fillMaxSize(), contentAlignment = Alignment.Center) {
                CircularProgressIndicator(color = AppColors.Primary)
            }
            return@Column
        }

        Column(
            modifier = Modifier
                .weight(1f)
                .fillMaxWidth()
                .padding(horizontal = AppSpacing.md),
            horizontalAlignment = Alignment.CenterHorizontally
        ) {
            Spacer(Modifier.height(AppSpacing.lg))

            Box(
                modifier = Modifier
                    .size(96.dp)
                    .clip(CircleShape)
                    .border(3.dp, AppColors.Primary, CircleShape)
                    .padding(4.dp)
                    .clip(CircleShape)
                    .background(AppColors.Neutral),
                contentAlignment = Alignment.Center
            ) {
                val name = state.profile?.name.orEmpty()
                if (name.isNotBlank()) {
                    Text(
                        text = name.initials(),
                        style = MaterialTheme.typography.headlineSmall,
                        color = AppColors.Primary,
                        fontWeight = FontWeight.Bold
                    )
                } else {
                    Icon(Icons.Default.Person, contentDescription = null, tint = AppColors.Primary, modifier = Modifier.size(40.dp))
                }
            }

            Spacer(Modifier.height(AppSpacing.sm))

            Text(
                text = state.profile?.name ?: "Memuat...",
                style = MaterialTheme.typography.titleLarge,
                fontWeight = FontWeight.Bold,
                color = AppColors.Primary
            )

            Spacer(Modifier.height(2.dp))

            Text(
                text = state.profile?.email.orEmpty(),
                style = MaterialTheme.typography.bodyMedium,
                color = AppColors.Subtitle
            )

            Spacer(Modifier.height(AppSpacing.lg))

            state.errorMessage?.let {
                Text(it, color = MaterialTheme.colorScheme.error, style = MaterialTheme.typography.bodySmall)
                Spacer(Modifier.height(AppSpacing.sm))
            }

            SectionLabel("Profil")
            MenuCard {
                MenuItem(icon = Icons.Default.Person, label = "Informasi Pribadi", onClick = onNavigateToEditProfile)
                MenuItem(icon = Icons.Default.LocationOn, label = "Alamat Pengiriman", onClick = onNavigateToEditAlamat)
            }

            Spacer(Modifier.height(AppSpacing.md))

            SectionLabel("Lainnya")
            MenuCard {
                MenuItem(icon = Icons.AutoMirrored.Filled.HelpOutline, label = "Bantuan", onClick = onNavigateToHelp)
                MenuItem(icon = Icons.Default.Info, label = "Tentang Harvesta", onClick = onNavigateToAbout, showDivider = false)
            }

            Spacer(Modifier.height(AppSpacing.lg))

            OutlinedButton(
                onClick = viewModel::onLogoutClicked,
                modifier = Modifier.fillMaxWidth(),
                shape = AppShapePill,
                border = androidx.compose.foundation.BorderStroke(1.dp, AppColors.Error)
            ) {
                Icon(Icons.AutoMirrored.Filled.Logout, contentDescription = null, tint = AppColors.Error)
                Spacer(Modifier.width(AppSpacing.sm))
                Text("Logout", color = AppColors.Error, fontWeight = FontWeight.SemiBold)
            }

            Spacer(Modifier.height(AppSpacing.lg))
        }
    }

    // Popup konfirmasi logout (frame "Konfirmasi Logout" pada Figma)
    if (state.showLogoutDialog) {
        AppConfirmDialog(
            title = "Keluar dari Akun?",
            message = "Anda akan keluar dari akun Harvesta",
            confirmText = "Keluar",
            dismissText = "Batal",
            isDestructive = true,
            onDismiss = viewModel::onDismissLogoutDialog,
            onConfirm = { viewModel.onConfirmLogout(onLoggedOut) }
        )
    }
}

@Composable
private fun SectionLabel(text: String) {
    Row(modifier = Modifier.fillMaxWidth().padding(bottom = AppSpacing.sm)) {
        Text(
            text = text,
            style = MaterialTheme.typography.bodyMedium,
            fontWeight = FontWeight.Bold,
            color = AppColors.Text
        )
    }
}

@Composable
private fun MenuCard(content: @Composable ColumnScope.() -> Unit) {
    Column(
        modifier = Modifier.fillMaxWidth().background(AppColors.White, RoundedCornerShape(16.dp)),
        content = content
    )
}

@Composable
private fun MenuItem(
    icon: androidx.compose.ui.graphics.vector.ImageVector,
    label: String,
    showDivider: Boolean = true,
    onClick: () -> Unit
) {
    Column {
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .clickable(onClick = onClick)
                .padding(horizontal = AppSpacing.md, vertical = AppSpacing.sm + 4.dp),
            verticalAlignment = Alignment.CenterVertically
        ) {
            Box(
                modifier = Modifier.size(40.dp).clip(CircleShape).background(AppColors.Neutral),
                contentAlignment = Alignment.Center
            ) {
                Icon(icon, contentDescription = null, tint = AppColors.Text, modifier = Modifier.size(18.dp))
            }
            Spacer(Modifier.width(AppSpacing.sm + 4.dp))
            Text(
                label,
                style = MaterialTheme.typography.bodyLarge,
                fontWeight = FontWeight.SemiBold,
                color = AppColors.Text,
                modifier = Modifier.weight(1f)
            )
            Icon(Icons.Default.ChevronRight, contentDescription = null, tint = AppColors.Hint)
        }
        if (showDivider) {
            Box(Modifier.fillMaxWidth().height(1.dp).background(AppColors.Border))
        }
    }
}

private fun String.initials(): String {
    val parts = trim().split(Regex("\\s+")).filter { it.isNotBlank() }
    if (parts.isEmpty()) return "U"
    return parts.take(2).joinToString("") { it.first().uppercaseChar().toString() }
}

@Preview
@Composable
private fun ProfileScreenPreview() {
    val fakeRepo = remember { FakeProfileRepository() }
    val viewModel = remember {
        ProfileViewModel(GetProfileUseCase(fakeRepo), LogoutUseCase(org.example.project.core.preview.FakeAuthRepository()))
    }
    MaterialTheme {
        ProfileScreen(
            viewModel = viewModel,
            onNavigateToEditProfile = {},
            onNavigateToEditAlamat = {},
            onNavigateToHelp = {},
            onNavigateToAbout = {},
            onLoggedOut = {}
        )
    }
}