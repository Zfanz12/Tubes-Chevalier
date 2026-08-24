package org.example.project.welcome.presentation

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.pager.HorizontalPager
import androidx.compose.foundation.pager.rememberPagerState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import kotlinx.coroutines.launch
import org.example.project.core.theme.AppColors


private data class WelcomeSlide(
    val title: String,
    val body: String,
    val symbol: String
)


@Composable
fun WelcomeScreen(
    onStart: () -> Unit,
    onLogin: () -> Unit
) {

    val slides = listOf(

        WelcomeSlide(
            title = "Selamat Datang di Harvesta",
            body = "Nikmati hasil panen segar langsung dari petani lokal dan dukung pertumbuhan UMKM pertanian Indonesia.",
            symbol = "H"
        ),

        WelcomeSlide(
            title = "Fresh Harvest, Straight from Farmers",
            body = "Temukan sayuran, buah, dan hasil tani segar langsung dari petani lokal. Nikmati kualitas sekaligus mendukung usaha mereka.",
            symbol = "🌱"
        ),

        WelcomeSlide(
            title = "Shop Fresh with Ease",
            body = "Jelajahi produk, pesan hanya dalam beberapa langkah, lacak pesanan, dan dapatkan hasil panen segar sampai ke rumah.",
            symbol = "🛒"
        ),

        WelcomeSlide(
            title = "Support Local Farmers",
            body = "Setiap pesanan membantu petani mendapatkan pasar yang lebih luas dan membuat produk segar lebih mudah dijangkau.",
            symbol = "🤝"
        )

    )


    val pagerState = rememberPagerState(
        initialPage = 0,
        pageCount = {
            slides.size
        }
    )

    val scope = rememberCoroutineScope()


    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(AppColors.White)
    ) {


        // ==========================================
        // TOP BAR
        // ==========================================

        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(
                    horizontal = 20.dp,
                    vertical = 18.dp
                ),

            horizontalArrangement = Arrangement.End,

            verticalAlignment = Alignment.CenterVertically
        ) {

            if (pagerState.currentPage > 0) {

                TextButton(
                    onClick = onLogin
                ) {

                    Text(
                        text = "Lewati",
                        color = AppColors.Subtitle
                    )

                }

            }

        }


        // ==========================================
        // SLIDES
        // ==========================================

        HorizontalPager(
            state = pagerState,

            modifier = Modifier
                .weight(1f)
                .fillMaxWidth()
        ) { page ->

            val slide = slides[page]

            Column(

                modifier = Modifier
                    .fillMaxSize()
                    .padding(
                        horizontal = 32.dp
                    ),

                horizontalAlignment = Alignment.CenterHorizontally,

                verticalArrangement = Arrangement.Center

            ) {


                // ==================================
                // TEMPORARY ASSET PLACEHOLDER
                // ==================================

                Box(

                    modifier = Modifier
                        .size(230.dp)
                        .clip(
                            RoundedCornerShape(70.dp)
                        )
                        .background(
                            AppColors.Background
                        ),

                    contentAlignment = Alignment.Center

                ) {

                    Text(

                        text = slide.symbol,

                        style = MaterialTheme.typography.displayLarge,

                        fontWeight = FontWeight.Bold,

                        color = AppColors.Primary

                    )

                }


                Spacer(
                    modifier = Modifier.height(42.dp)
                )


                // ==================================
                // TITLE
                // ==================================

                Text(

                    text = slide.title,

                    style = MaterialTheme.typography.headlineSmall,

                    fontWeight = FontWeight.Bold,

                    color = AppColors.Primary,

                    textAlign = TextAlign.Center

                )


                Spacer(
                    modifier = Modifier.height(14.dp)
                )


                // ==================================
                // DESCRIPTION
                // ==================================

                Text(

                    text = slide.body,

                    style = MaterialTheme.typography.bodyMedium,

                    color = AppColors.Subtitle,

                    textAlign = TextAlign.Center

                )

            }

        }


        // ==========================================
        // PAGE INDICATOR
        // ==========================================

        Row(

            modifier = Modifier
                .fillMaxWidth()
                .padding(
                    bottom = 18.dp
                ),

            horizontalArrangement = Arrangement.Center

        ) {

            repeat(slides.size) { index ->

                val selected =
                    index == pagerState.currentPage

                Box(

                    modifier = Modifier
                        .padding(horizontal = 4.dp)
                        .height(8.dp)
                        .width(
                            if (selected) {
                                24.dp
                            } else {
                                8.dp
                            }
                        )
                        .clip(CircleShape)
                        .background(
                            if (selected) {
                                AppColors.Primary
                            } else {
                                Color.LightGray
                            }
                        )

                )

            }

        }


        // ==========================================
        // BUTTON AREA
        // ==========================================

        Column(

            modifier = Modifier
                .fillMaxWidth()
                .padding(
                    horizontal = 24.dp,
                    vertical = 16.dp
                )

        ) {

            // --------------------------------------
            // FIRST PAGE
            // --------------------------------------

            if (pagerState.currentPage == 0) {

                Button(

                    onClick = {

                        scope.launch {

                            pagerState.animateScrollToPage(
                                1
                            )

                        }

                    },

                    modifier = Modifier
                        .fillMaxWidth()
                        .height(50.dp),

                    shape = RoundedCornerShape(14.dp),

                    colors = ButtonDefaults.buttonColors(
                        containerColor = AppColors.Primary
                    )

                ) {

                    Text(
                        text = "Mulai"
                    )

                }


                Spacer(
                    modifier = Modifier.height(10.dp)
                )


                OutlinedButton(

                    onClick = onLogin,

                    modifier = Modifier
                        .fillMaxWidth()
                        .height(50.dp),

                    shape = RoundedCornerShape(14.dp)

                ) {

                    Text(
                        text = "Login",
                        color = AppColors.Primary
                    )

                }

            }

            // --------------------------------------
            // OTHER PAGES
            // --------------------------------------

            else {

                Button(

                    onClick = {

                        scope.launch {

                            if (
                                pagerState.currentPage
                                < slides.lastIndex
                            ) {

                                pagerState.animateScrollToPage(
                                    pagerState.currentPage + 1
                                )

                            } else {

                                onStart()

                            }

                        }

                    },

                    modifier = Modifier
                        .fillMaxWidth()
                        .height(50.dp),

                    shape = RoundedCornerShape(14.dp),

                    colors = ButtonDefaults.buttonColors(
                        containerColor = AppColors.Primary
                    )

                ) {

                    Text(

                        text =
                            if (
                                pagerState.currentPage
                                == slides.lastIndex
                            ) {
                                "Mulai Belanja"
                            } else {
                                "Selanjutnya"
                            }

                    )

                }

            }

        }

    }

}