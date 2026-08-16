package org.example.project.profile.presentation.navigation

import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import org.example.project.auth.domain.usecase.LogoutUseCase
import org.example.project.profile.domain.usecase.GetProfileUseCase
import org.example.project.profile.domain.usecase.UpdateAlamatUseCase
import org.example.project.profile.domain.usecase.UpdateProfileUseCase
import org.example.project.profile.presentation.about.AboutScreen
import org.example.project.profile.presentation.alamat_pengiriman.AlamatPengirimanScreen
import org.example.project.profile.presentation.alamat_pengiriman.AlamatPengirimanViewModel
import org.example.project.profile.presentation.edit_alamat.EditAlamatScreen
import org.example.project.profile.presentation.edit_alamat.EditAlamatViewModel
import org.example.project.profile.presentation.edit_profile.EditProfileScreen
import org.example.project.profile.presentation.edit_profile.EditProfileViewModel
import org.example.project.profile.presentation.help.HelpScreen
import org.example.project.profile.presentation.profile.ProfileScreen
import org.example.project.profile.presentation.profile.ProfileViewModel
import org.example.project.profile.presentation.tambah_alamat.TambahAlamatScreen
import org.example.project.profile.presentation.tambah_alamat.TambahAlamatViewModel

@Composable
fun ProfileNavHost(
    getProfileUseCase: GetProfileUseCase,
    updateProfileUseCase: UpdateProfileUseCase,
    updateAlamatUseCase: UpdateAlamatUseCase,
    logoutUseCase: LogoutUseCase,
    onLoggedOut: () -> Unit
) {
    var destination by rememberSaveable { mutableStateOf(ProfileDestination.PROFILE) }
    var selectedAlamatId by rememberSaveable { mutableStateOf<String?>(null) }

    val profileViewModel = remember { ProfileViewModel(getProfileUseCase, logoutUseCase) }
    val editProfileViewModel = remember { EditProfileViewModel(getProfileUseCase, updateProfileUseCase) }
    val alamatPengirimanViewModel = remember { AlamatPengirimanViewModel(getProfileUseCase, updateAlamatUseCase) }

    when (destination) {
        ProfileDestination.PROFILE -> ProfileScreen(
            viewModel = profileViewModel,
            onNavigateToEditProfile = { destination = ProfileDestination.EDIT_PROFILE },
            onNavigateToEditAlamat = { destination = ProfileDestination.ALAMAT_PENGIRIMAN },
            onNavigateToHelp = { destination = ProfileDestination.HELP },
            onNavigateToAbout = { destination = ProfileDestination.ABOUT },
            onLoggedOut = onLoggedOut
        )

        ProfileDestination.EDIT_PROFILE -> EditProfileScreen(
            viewModel = editProfileViewModel,
            onBackClick = { destination = ProfileDestination.PROFILE },
            onSaved = {
                profileViewModel.loadProfile()
                destination = ProfileDestination.PROFILE
            }
        )

        ProfileDestination.ALAMAT_PENGIRIMAN -> AlamatPengirimanScreen(
            viewModel = alamatPengirimanViewModel,
            onBackClick = { destination = ProfileDestination.PROFILE },
            onTambahAlamat = { destination = ProfileDestination.TAMBAH_ALAMAT },
            onUbahAlamat = { id ->
                selectedAlamatId = id
                destination = ProfileDestination.EDIT_ALAMAT
            }
        )

        ProfileDestination.TAMBAH_ALAMAT -> {
            val tambahAlamatViewModel = remember(destination) { TambahAlamatViewModel() }
            TambahAlamatScreen(
                viewModel = tambahAlamatViewModel,
                onBackClick = { destination = ProfileDestination.ALAMAT_PENGIRIMAN },
                onSaved = { alamatBaru ->
                    alamatPengirimanViewModel.upsert(alamatBaru)
                    destination = ProfileDestination.ALAMAT_PENGIRIMAN
                }
            )
        }

        ProfileDestination.EDIT_ALAMAT -> {
            val editAlamatViewModel = remember(selectedAlamatId) {
                EditAlamatViewModel(getProfileUseCase, updateAlamatUseCase, alamatPengirimanViewModel.alamat(selectedAlamatId.orEmpty()))
            }
            EditAlamatScreen(
                viewModel = editAlamatViewModel,
                onBackClick = { destination = ProfileDestination.ALAMAT_PENGIRIMAN },
                onSaved = { alamatTerbaru ->
                    alamatPengirimanViewModel.upsert(alamatTerbaru)
                    destination = ProfileDestination.ALAMAT_PENGIRIMAN
                }
            )
        }

        ProfileDestination.HELP -> HelpScreen(onBackClick = { destination = ProfileDestination.PROFILE })

        ProfileDestination.ABOUT -> AboutScreen(onBackClick = { destination = ProfileDestination.PROFILE })
    }
}