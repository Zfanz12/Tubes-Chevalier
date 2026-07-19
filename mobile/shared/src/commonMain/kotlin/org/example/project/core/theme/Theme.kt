package org.example.project.core.theme

import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.lightColorScheme
import androidx.compose.runtime.Composable

private val ColorScheme = lightColorScheme(

    primary = AppColors.Primary,

    secondary = AppColors.PrimaryLight,

    background = AppColors.Background,

    surface = AppColors.White

)

@Composable
fun HarvestaTheme(
    content: @Composable () -> Unit
) {

    MaterialTheme(

        colorScheme = ColorScheme,

        typography = AppTypography,

        shapes = AppShape,

        content = content

    )

}