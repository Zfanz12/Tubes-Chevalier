package org.example.project.auth.presentation.login

import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import org.example.project.core.presentation.component.AppButton
import org.example.project.core.presentation.component.AppTextField
import org.example.project.core.presentation.component.BackButton
import org.example.project.core.theme.AppColors
import org.example.project.core.theme.AppSpacing


@Composable
fun LoginScreen(
    viewModel: LoginViewModel,
    onLoginSuccess: () -> Unit,
    onNavigateToRegister: () -> Unit,
    onBackClick: () -> Unit = {}
) {

    val state by viewModel.uiState.collectAsState()


    /*
     * ==========================
     * SUCCESS
     * ==========================
     */

    if (state.isSuccess) {

        onLoginSuccess()

        return
    }


    /*
     * ==========================
     * MAIN
     * ==========================
     */

    Column(

        modifier = Modifier
            .fillMaxSize()
            .padding(
                horizontal = 24.dp,
                vertical = 20.dp
            )

    ) {


        /*
         * ==========================
         * BACK
         * ==========================
         */

        BackButton(
            onClick = {

                if (state.stage == LoginStage.OTP) {

                    viewModel.changePhoneNumber()

                } else {

                    onBackClick()

                }

            },

            label = "Kembali",

            contentColor = AppColors.Primary

        )


        Spacer(
            modifier = Modifier.height(36.dp)
        )


        /*
         * ==========================
         * HEADER
         * ==========================
         */

        Text(

            text =
                if (state.stage == LoginStage.PHONE) {
                    "Login Harvesta"
                } else {
                    "Verifikasi WhatsApp"
                },

            style = MaterialTheme.typography.headlineMedium,

            fontWeight = FontWeight.Bold,

            color = AppColors.Primary

        )


        Spacer(
            modifier = Modifier.height(10.dp)
        )


        Text(

            text =
                if (state.stage == LoginStage.PHONE) {

                    "Masuk menggunakan nomor WhatsApp untuk melanjutkan ke Harvesta."

                } else {

                    "Masukkan kode OTP yang dikirim ke WhatsApp ${state.noHp}."

                },

            style = MaterialTheme.typography.bodyMedium,

            color = AppColors.Subtitle

        )


        Spacer(
            modifier = Modifier.height(32.dp)
        )


        /*
         * ==========================
         * FORM
         * ==========================
         */

        when (state.stage) {

            LoginStage.PHONE -> {

                Text(

                    text = "Nomor WhatsApp",

                    style = MaterialTheme.typography.labelLarge,

                    fontWeight = FontWeight.SemiBold,

                    color = AppColors.Text

                )


                Spacer(
                    modifier = Modifier.height(8.dp)
                )


                AppTextField(

                    value = state.noHp,

                    onValueChange = viewModel::onNoHpChange,

                    label = "Nomor WhatsApp",

                    placeholder = "Contoh: 081234567890",

                    keyboardOptions =
                        KeyboardOptions(
                            keyboardType = KeyboardType.Phone
                        ),

                    shape =
                        RoundedCornerShape(14.dp)

                )

            }


            LoginStage.OTP -> {

                Text(

                    text = "Kode OTP",

                    style = MaterialTheme.typography.labelLarge,

                    fontWeight = FontWeight.SemiBold,

                    color = AppColors.Text

                )


                Spacer(
                    modifier = Modifier.height(8.dp)
                )


                AppTextField(

                    value = state.otpCode,

                    onValueChange = viewModel::onOtpCodeChange,

                    label = "Kode OTP",

                    placeholder = "Masukkan kode OTP",

                    keyboardOptions =
                        KeyboardOptions(
                            keyboardType =
                                KeyboardType.Number
                        ),

                    shape =
                        RoundedCornerShape(14.dp)

                )


                Spacer(
                    modifier = Modifier.height(12.dp)
                )


                Row(

                    modifier =
                        Modifier.fillMaxWidth(),

                    horizontalArrangement =
                        Arrangement.SpaceBetween

                ) {

                    Text(

                        text = "Ganti nomor",

                        color = AppColors.TextMuted,

                        style =
                            MaterialTheme.typography.bodySmall,

                        modifier =
                            Modifier.clickable {

                                viewModel.changePhoneNumber()

                            }

                    )


                    Text(

                        text = "Kirim ulang OTP",

                        color = AppColors.Primary,

                        style =
                            MaterialTheme.typography.bodySmall,

                        fontWeight =
                            FontWeight.SemiBold,

                        modifier =
                            Modifier.clickable {

                                viewModel.resendOtp()

                            }

                    )

                }

            }

        }


        /*
         * ==========================
         * MESSAGE
         * ==========================
         */

        state.infoMessage?.let { message ->

            Spacer(
                modifier = Modifier.height(12.dp)
            )

            Text(

                text = message,

                color = AppColors.Success,

                style =
                    MaterialTheme.typography.bodySmall

            )

        }


        state.errorMessage?.let { message ->

            Spacer(
                modifier = Modifier.height(12.dp)
            )

            Text(

                text = message,

                color = AppColors.Error,

                style =
                    MaterialTheme.typography.bodySmall

            )

        }


        Spacer(
            modifier = Modifier.height(28.dp)
        )


        /*
         * ==========================
         * ACTION
         * ==========================
         */

        when (state.stage) {

            LoginStage.PHONE -> {

                AppButton(

                    text = "Kirim OTP",

                    loading = state.isLoading,

                    shape =
                        RoundedCornerShape(14.dp),

                    onClick = {

                        viewModel.sendOtp()

                    }

                )

            }


            LoginStage.OTP -> {

                AppButton(

                    text = "Masuk",

                    loading = state.isLoading,

                    shape =
                        RoundedCornerShape(14.dp),

                    onClick = {

                        viewModel.submit()

                    }

                )

            }

        }


        Spacer(
            modifier = Modifier.weight(1f)
        )


        /*
         * ==========================
         * REGISTER
         * ==========================
         */

        Row(
            modifier =
                Modifier.fillMaxWidth(),
            horizontalArrangement =
                Arrangement.Center,
            verticalAlignment =
                Alignment.CenterVertically
        ) {
            Text(
                text = "Belum punya akun? ",
                color = AppColors.TextMuted,
                style =
                    MaterialTheme.typography.bodyMedium
            )
            Text(
                text = "Daftar",
                color = AppColors.Primary,
                style =
                    MaterialTheme.typography.bodyMedium,
                fontWeight =
                    FontWeight.Bold,
                modifier =
                    Modifier.clickable {
                        onNavigateToRegister()
                    }
            )
        }
        Spacer(
            modifier = Modifier.height(8.dp)
        )

    }

}