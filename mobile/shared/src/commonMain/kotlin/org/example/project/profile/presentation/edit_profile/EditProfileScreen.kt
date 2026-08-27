package org.example.project.profile.presentation.edit_profile

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.AccountBox
import androidx.compose.material.icons.filled.Edit
import androidx.compose.material.icons.filled.Email
import androidx.compose.material.icons.filled.Person
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.material3.Icon
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import org.example.project.core.presentation.component.AppButton
import org.example.project.core.preview.FakeProfileRepository
import org.example.project.core.theme.AppColors
import org.example.project.core.theme.AppShapePill
import org.example.project.core.theme.AppSpacing
import org.example.project.profile.domain.usecase.GetProfileUseCase
import org.example.project.profile.domain.usecase.UpdateProfileUseCase
import org.example.project.profile.presentation.components.ProfileFormField
import org.example.project.profile.presentation.components.ProfileTopBar

@Composable
fun EditProfileScreen(
    viewModel: EditProfileViewModel,
    onBackClick: () -> Unit,
    onSaved: () -> Unit
) {
    val state by viewModel.uiState.collectAsState()

    LaunchedEffect(state.isSuccess) {
        if (state.isSuccess) onSaved()
    }

    Column(modifier = Modifier.fillMaxSize().background(AppColors.Background)) {
        ProfileTopBar(title = "Informasi Pribadi", onBackClick = onBackClick)

        if (state.isLoading) {
            Box(Modifier.fillMaxSize(), contentAlignment = Alignment.Center) {
                CircularProgressIndicator(color = AppColors.Primary)
            }
            return@Column
        }

        Column(
            modifier = Modifier.weight(1f).fillMaxWidth().padding(AppSpacing.md),
            horizontalAlignment = Alignment.CenterHorizontally
        ) {
            Spacer(Modifier.height(AppSpacing.md))

            Box(contentAlignment = Alignment.BottomEnd) {
                Box(
                    modifier = Modifier
                        .size(96.dp)
                        .border(3.dp, AppColors.Primary, CircleShape)
                        .padding(4.dp)
                        .clip(CircleShape)
                        .background(AppColors.Neutral),
                    contentAlignment = Alignment.Center
                ) {
                    Text(
                        text = state.name.initials(),
                        style = MaterialTheme.typography.headlineMedium,
                        color = AppColors.Primary,
                        fontWeight = FontWeight.Bold
                    )
                }
                Box(
                    modifier = Modifier
                        .size(28.dp)
                        .clip(CircleShape)
                        .background(AppColors.Primary),
                    contentAlignment = Alignment.Center
                ) {
                    Icon(
                        Icons.Default.Edit,
                        contentDescription = "Ubah foto",
                        tint = AppColors.White,
                        modifier = Modifier.size(14.dp)
                    )
                }
            }

            Spacer(Modifier.height(AppSpacing.sm))

            Text(
                "Ketuk ikon kamera untuk mengubah foto",
                style = MaterialTheme.typography.bodySmall,
                color = AppColors.Subtitle,
                textAlign = TextAlign.Center
            )

            Spacer(Modifier.height(AppSpacing.lg))

            Column(
                modifier = Modifier
                    .fillMaxWidth()
                    .background(AppColors.White, shape = RoundedCornerShape(16.dp))
                    .padding(AppSpacing.md),
                verticalArrangement = Arrangement.spacedBy(AppSpacing.md)
            ) {
                ProfileFormField(
                    label = "Username",
                    value = state.username,
                    onValueChange = viewModel::onUsernameChange,
                    leadingIcon = Icons.Default.Person
                )
                ProfileFormField(
                    label = "Nama Lengkap",
                    value = state.name,
                    onValueChange = viewModel::onNameChange,
                    leadingIcon = Icons.Default.AccountBox
                )
                ProfileFormField(
                    label = "Alamat Email",
                    value = state.email,
                    onValueChange = viewModel::onEmailChange,
                    leadingIcon = Icons.Default.Email,
                    keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Email)
                )
                ProfileFormField(
                    label = "Nomor Handphone", value = state.noHp,
                    onValueChange = { }, readOnly = true, enabled = false,
                    placeholder = "Nomor HP terdaftar"
                )
            }

            state.errorMessage?.let {
                Spacer(Modifier.height(AppSpacing.sm))
                Text(it, color = MaterialTheme.colorScheme.error, style = MaterialTheme.typography.bodySmall)
            }
        }

        Column(modifier = Modifier.padding(AppSpacing.md)) {
            AppButton(
                text = "Simpan Perubahan",
                shape = AppShapePill,
                loading = state.isSaving,
                onClick = viewModel::submit
            )
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
private fun EditProfileScreenPreview() {
    val fakeRepo = remember { FakeProfileRepository() }
    val viewModel = remember { EditProfileViewModel(GetProfileUseCase(fakeRepo), UpdateProfileUseCase(fakeRepo)) }
    MaterialTheme {
        EditProfileScreen(viewModel = viewModel, onBackClick = {}, onSaved = {})
    }
}