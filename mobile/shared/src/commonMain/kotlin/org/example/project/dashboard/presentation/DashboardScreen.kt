package org.example.project.dashboard.presentation

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.Scaffold
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import androidx.compose.ui.graphics.Color
import org.example.project.core.theme.AppColors
import org.example.project.dashboard.presentation.components.BottomNavBar
import org.example.project.dashboard.presentation.components.BottomNavItem
import org.example.project.dashboard.presentation.components.DashboardTopBar
import org.example.project.dashboard.presentation.components.GreetingHeader
import org.example.project.dashboard.presentation.components.SectionTitle
import org.example.project.dashboard.presentation.components.StatusCard
import org.example.project.dashboard.presentation.components.SummaryCard
import org.example.project.dashboard.presentation.components.SummaryStatCard
import org.example.project.dashboard.presentation.components.TransactionCard

@Composable
fun DashboardScreen(
    viewModel: DashboardViewModel
) {

    val state = viewModel.uiState

    Scaffold(
        containerColor = AppColors.Background,
        bottomBar = {
            BottomNavBar(
                selectedItem = BottomNavItem.HOME,
                onItemSelected = {
                    // TODO: Navigation nanti -- nunggu sambungin ke backend ntar
                }
            )
        }
    ) { paddingValues ->

        Column(
            modifier = Modifier
                .fillMaxSize()
                .verticalScroll(rememberScrollState())
                .padding(paddingValues)
                .padding(16.dp)
        ) {

            DashboardTopBar(
                username = state.username,
                date = "Sabtu, 26 Juli 2026"
            )

            Spacer(Modifier.height(20.dp))

            SummaryCard(
                title = "Pendapatan Hari Ini",
                value = state.totalRevenue,
                subtitle = "↑15% dari hari sebelumnya"
            )

            Spacer(Modifier.height(16.dp))

            Row(
                horizontalArrangement = Arrangement.spacedBy(12.dp)
            ) {

                androidx.compose.foundation.layout.Box(
                    modifier = Modifier.weight(1f)
                ) {

                    SummaryStatCard(
                        title = "Pembeli",
                        value = state.totalBuyers.toString()
                    )

                }

                androidx.compose.foundation.layout.Box(
                    modifier = Modifier.weight(1f)
                ) {

                    SummaryStatCard(
                        title = "Keuntungan",
                        value = state.totalProfit
                    )

                }

            }

            Spacer(Modifier.height(24.dp))

            SectionTitle("Status Pesanan")

            StatusCard(
                title = "Menunggu",
                total = 2,
                indicatorColor = Color(0xFFFF9800)
            )

            Spacer(Modifier.height(16.dp))

            StatusCard(
                title = "Diproses",
                total = 29,
                indicatorColor = Color(0xFF2196F3)
            )

            Spacer(Modifier.height(16.dp))

            StatusCard(
                title = "Selesai",
                total = 273,
                indicatorColor = Color(0xFF4CAF50)
            )

            Spacer(Modifier.height(32.dp))

            SectionTitle(
                title = "Transaksi Terbaru"
            )

            Spacer(Modifier.height(12.dp))

            TransactionCard(
                invoice = "INV-12345",
                customer = "Reza Rahardian",
                total = "Rp130.000",
                status = "Menunggu"
            )

            Spacer(Modifier.height(12.dp))

            TransactionCard(
                invoice = "INV-12346",
                customer = "A**** Y****",
                total = "Rp75.000",
                status = "Diproses"
            )

            Spacer(Modifier.height(12.dp))

            TransactionCard(
                invoice = "INV-12347",
                customer = "Budi Santoso",
                total = "Rp210.000",
                status = "Selesai"
            )
        }

    }

}