package org.example.project.core.theme

import androidx.compose.material3.Typography
import androidx.compose.ui.text.TextStyle
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.sp

// TODO: ganti FontFamily.Default dengan Font(Res.font.plus_jakarta_sans_*) begitu
// file .ttf sudah ditambahkan ke shared/src/commonMain/composeResources/font/
val PlusJakartaSans = FontFamily.Default

val AppTypography = Typography(
    displayLarge = TextStyle(   // Display
        fontFamily = PlusJakartaSans, fontWeight = FontWeight.Bold, fontSize = 40.sp, lineHeight = 48.sp
    ),
    headlineLarge = TextStyle(  // Heading 1
        fontFamily = PlusJakartaSans, fontWeight = FontWeight.Bold, fontSize = 32.sp, lineHeight = 40.sp
    ),
    headlineMedium = TextStyle( // Heading 2
        fontFamily = PlusJakartaSans, fontWeight = FontWeight.Bold, fontSize = 28.sp, lineHeight = 36.sp
    ),
    headlineSmall = TextStyle(  // Heading 3
        fontFamily = PlusJakartaSans, fontWeight = FontWeight.Bold, fontSize = 24.sp, lineHeight = 32.sp
    ),
    titleLarge = TextStyle(     // Title
        fontFamily = PlusJakartaSans, fontWeight = FontWeight.SemiBold, fontSize = 20.sp, lineHeight = 28.sp
    ),
    titleMedium = TextStyle(    // Subtitle
        fontFamily = PlusJakartaSans, fontWeight = FontWeight.Medium, fontSize = 18.sp, lineHeight = 26.sp
    ),
    bodyLarge = TextStyle(      // Body Large
        fontFamily = PlusJakartaSans, fontWeight = FontWeight.Normal, fontSize = 16.sp, lineHeight = 24.sp
    ),
    bodyMedium = TextStyle(     // Body
        fontFamily = PlusJakartaSans, fontWeight = FontWeight.Normal, fontSize = 14.sp, lineHeight = 20.sp
    ),
    bodySmall = TextStyle(      // Caption
        fontFamily = PlusJakartaSans, fontWeight = FontWeight.Light, fontSize = 12.sp, lineHeight = 16.sp
    ),
    labelSmall = TextStyle(     // Small
        fontFamily = PlusJakartaSans, fontWeight = FontWeight.Normal, fontSize = 10.sp, lineHeight = 14.sp
    )
)

object AppTextStyle {

    // H1 -- 2.5rem/40px, line-height 1.20/48px
    val h1Bold = TextStyle(fontFamily = PlusJakartaSans, fontWeight = FontWeight.Bold, fontSize = 40.sp, lineHeight = 48.sp)
    val h1Medium = TextStyle(fontFamily = PlusJakartaSans, fontWeight = FontWeight.Medium, fontSize = 40.sp, lineHeight = 48.sp)
    val h1Regular = TextStyle(fontFamily = PlusJakartaSans, fontWeight = FontWeight.Normal, fontSize = 40.sp, lineHeight = 48.sp)

    // H2 -- 2.25rem/36px, line-height 1.222/44px
    val h2Bold = TextStyle(fontFamily = PlusJakartaSans, fontWeight = FontWeight.Bold, fontSize = 36.sp, lineHeight = 44.sp)
    val h2Medium = TextStyle(fontFamily = PlusJakartaSans, fontWeight = FontWeight.Medium, fontSize = 36.sp, lineHeight = 44.sp)
    val h2Regular = TextStyle(fontFamily = PlusJakartaSans, fontWeight = FontWeight.Normal, fontSize = 36.sp, lineHeight = 44.sp)

    // H3 -- 2rem/32px, line-height 1.25/40px
    val h3Bold = TextStyle(fontFamily = PlusJakartaSans, fontWeight = FontWeight.Bold, fontSize = 32.sp, lineHeight = 40.sp)
    val h3Medium = TextStyle(fontFamily = PlusJakartaSans, fontWeight = FontWeight.Medium, fontSize = 32.sp, lineHeight = 40.sp)
    val h3Regular = TextStyle(fontFamily = PlusJakartaSans, fontWeight = FontWeight.Normal, fontSize = 32.sp, lineHeight = 40.sp)

    // H4 -- 1.5rem/24px, line-height 1.333/32px
    val h4Bold = TextStyle(fontFamily = PlusJakartaSans, fontWeight = FontWeight.Bold, fontSize = 24.sp, lineHeight = 32.sp)
    val h4Medium = TextStyle(fontFamily = PlusJakartaSans, fontWeight = FontWeight.Medium, fontSize = 24.sp, lineHeight = 32.sp)
    val h4Regular = TextStyle(fontFamily = PlusJakartaSans, fontWeight = FontWeight.Normal, fontSize = 24.sp, lineHeight = 32.sp)

    // H5 -- 1.25rem/20px, line-height 1.40/28px
    val h5Bold = TextStyle(fontFamily = PlusJakartaSans, fontWeight = FontWeight.Bold, fontSize = 20.sp, lineHeight = 28.sp)
    val h5Medium = TextStyle(fontFamily = PlusJakartaSans, fontWeight = FontWeight.Medium, fontSize = 20.sp, lineHeight = 28.sp)
    val h5Regular = TextStyle(fontFamily = PlusJakartaSans, fontWeight = FontWeight.Normal, fontSize = 20.sp, lineHeight = 28.sp)

    // H6 -- 1rem/16px, line-height 1.50/24px
    val h6Bold = TextStyle(fontFamily = PlusJakartaSans, fontWeight = FontWeight.Bold, fontSize = 16.sp, lineHeight = 24.sp)
    val h6Medium = TextStyle(fontFamily = PlusJakartaSans, fontWeight = FontWeight.Medium, fontSize = 16.sp, lineHeight = 24.sp)
    val h6Regular = TextStyle(fontFamily = PlusJakartaSans, fontWeight = FontWeight.Normal, fontSize = 16.sp, lineHeight = 24.sp)

    // Body -- 1rem/16px, line-height 1.50/24px
    val bodyBold = TextStyle(fontFamily = PlusJakartaSans, fontWeight = FontWeight.Bold, fontSize = 16.sp, lineHeight = 24.sp)
    val bodyMedium = TextStyle(fontFamily = PlusJakartaSans, fontWeight = FontWeight.Medium, fontSize = 16.sp, lineHeight = 24.sp)
    val bodyRegular = TextStyle(fontFamily = PlusJakartaSans, fontWeight = FontWeight.Normal, fontSize = 16.sp, lineHeight = 24.sp)

    // Small -- 0.875rem/14px, line-height 1.42/20px
    val smallBold = TextStyle(fontFamily = PlusJakartaSans, fontWeight = FontWeight.Bold, fontSize = 14.sp, lineHeight = 20.sp)
    val smallMedium = TextStyle(fontFamily = PlusJakartaSans, fontWeight = FontWeight.Medium, fontSize = 14.sp, lineHeight = 20.sp)
    val smallRegular = TextStyle(fontFamily = PlusJakartaSans, fontWeight = FontWeight.Normal, fontSize = 14.sp, lineHeight = 20.sp)
}