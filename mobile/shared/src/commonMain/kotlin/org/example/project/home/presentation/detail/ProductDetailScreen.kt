package org.example.project.home.presentation.detail

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.ArrowBack
import androidx.compose.material.icons.filled.ChatBubbleOutline
import androidx.compose.material.icons.filled.FavoriteBorder
import androidx.compose.material.icons.filled.ShoppingCart
import androidx.compose.material.icons.filled.Star
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.HorizontalDivider
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import org.example.project.core.theme.AppColors
import org.example.project.core.util.formatRupiah
import org.example.project.home.domain.model.ProductPreview

@Composable
fun ProductDetailScreen(
    product: ProductPreview,
    onBack: () -> Unit,
    onChat: () -> Unit,
    onAddToCart: () -> Unit
) {
    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(AppColors.Background)
    ) {

        // =========================
        // TOP BAR
        // =========================

        Row(
            modifier = Modifier
                .fillMaxWidth()
                .background(AppColors.White)
                .padding(
                    horizontal = 8.dp,
                    vertical = 8.dp
                ),
            verticalAlignment = Alignment.CenterVertically
        ) {

            IconButton(
                onClick = onBack
            ) {
                Icon(
                    imageVector = Icons.Default.ArrowBack,
                    contentDescription = "Kembali",
                    tint = AppColors.Text
                )
            }

            Text(
                text = "Detail Produk",
                style = MaterialTheme.typography.titleMedium,
                fontWeight = FontWeight.Bold,
                modifier = Modifier.weight(1f)
            )

            IconButton(
                onClick = {}
            ) {
                Icon(
                    imageVector = Icons.Default.FavoriteBorder,
                    contentDescription = "Favorit",
                    tint = AppColors.Primary
                )
            }
        }

        // =========================
        // CONTENT
        // =========================

        Column(
            modifier = Modifier
                .weight(1f)
                .verticalScroll(rememberScrollState())
        ) {

            // =========================
            // PRODUCT IMAGE
            // =========================

            Box(
                modifier = Modifier
                    .fillMaxWidth()
                    .height(285.dp)
                    .background(AppColors.White),
                contentAlignment = Alignment.Center
            ) {

                /*
                 * Asset produk belum kita ubah.
                 * Untuk Phase A, gunakan placeholder.
                 * Nanti tinggal diganti AsyncImage/Image resource.
                 */
                Box(
                    modifier = Modifier
                        .size(250.dp)
                        .clip(
                            RoundedCornerShape(18.dp)
                        )
                        .background(AppColors.Border),
                    contentAlignment = Alignment.Center
                ) {

                    Text(
                        text = product.name,
                        style = MaterialTheme.typography.titleMedium,
                        fontWeight = FontWeight.Bold,
                        color = AppColors.Primary
                    )
                }
            }


            // =========================
            // PRODUCT INFORMATION
            // =========================

            Column(
                modifier = Modifier.padding(20.dp)
            ) {

                Row(
                    modifier = Modifier.fillMaxWidth(),
                    verticalAlignment = Alignment.Top
                ) {

                    Column(
                        modifier = Modifier.weight(1f)
                    ) {

                        Text(
                            text = product.name,
                            style = MaterialTheme.typography.headlineSmall,
                            fontWeight = FontWeight.Bold,
                            color = AppColors.Text
                        )

                        Spacer(
                            modifier = Modifier.height(4.dp)
                        )

                        Text(
                            text = "Stok: ${product.stock.toInt()} ${product.unit}",
                            style = MaterialTheme.typography.bodySmall,
                            color = AppColors.Subtitle
                        )
                    }

                    if (product.isOrganic) {
                        Box(
                            modifier = Modifier
                                .clip(
                                    RoundedCornerShape(20.dp)
                                )
                                .background(AppColors.Primary)
                                .padding(
                                    horizontal = 12.dp,
                                    vertical = 6.dp
                                )
                        ) {
                            Text(
                                text = "Organik",
                                style = MaterialTheme.typography.labelSmall,
                                color = AppColors.White,
                                fontWeight = FontWeight.SemiBold
                            )
                        }
                    }
                }


                Spacer(
                    modifier = Modifier.height(8.dp)
                )


                Text(
                    text = "${formatRupiah(product.price)}/${product.unit}",
                    style = MaterialTheme.typography.titleLarge,
                    color = AppColors.Primary,
                    fontWeight = FontWeight.Bold
                )


                Spacer(
                    modifier = Modifier.height(6.dp)
                )


                Text(
                    text = "Tanggal Panen: 12 Okt 2026",
                    style = MaterialTheme.typography.bodySmall,
                    color = AppColors.Subtitle
                )


                Spacer(
                    modifier = Modifier.height(8.dp)
                )


                Row(
                    verticalAlignment = Alignment.CenterVertically
                ) {

                    Icon(
                        imageVector = Icons.Default.Star,
                        contentDescription = null,
                        modifier = Modifier.size(18.dp),
                        tint = AppColors.Warning
                    )

                    Spacer(
                        modifier = Modifier.width(4.dp)
                    )

                    Text(
                        text = "${product.rating}/5.0",
                        fontWeight = FontWeight.SemiBold
                    )

                    Text(
                        text = " • 52 penilaian",
                        color = AppColors.Subtitle,
                        style = MaterialTheme.typography.bodySmall
                    )
                }


                HorizontalDivider(
                    modifier = Modifier.padding(
                        vertical = 18.dp
                    ),
                    color = AppColors.Border
                )


                // =========================
                // DESKRIPSI
                // =========================

                Text(
                    text = "Deskripsi",
                    style = MaterialTheme.typography.titleMedium,
                    fontWeight = FontWeight.Bold,
                    color = AppColors.Primary
                )

                Spacer(
                    modifier = Modifier.height(8.dp)
                )

                Text(
                    text = """
                        ${product.name} merupakan produk segar
                        yang diberdayakan langsung dari petani lokal.
                        
                        Produk dipanen dengan memperhatikan
                        kualitas dan kesegaran agar tetap baik
                        sampai diterima oleh pelanggan.
                    """.trimIndent(),
                    style = MaterialTheme.typography.bodySmall,
                    color = AppColors.TextDark
                )

                Text(
                    text = "Selengkapnya",
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(top = 8.dp),
                    textAlign = androidx.compose.ui.text.style.TextAlign.Center,
                    style = MaterialTheme.typography.labelMedium,
                    fontWeight = FontWeight.SemiBold,
                    color = AppColors.Primary
                )


                HorizontalDivider(
                    modifier = Modifier.padding(
                        vertical = 18.dp
                    ),
                    color = AppColors.Border
                )


                // =========================
                // FARMER
                // =========================

                Text(
                    text = "Petani",
                    style = MaterialTheme.typography.titleMedium,
                    fontWeight = FontWeight.Bold,
                    color = AppColors.Primary
                )

                Spacer(
                    modifier = Modifier.height(10.dp)
                )

                Card(
                    modifier = Modifier.fillMaxWidth(),
                    colors = CardDefaults.cardColors(
                        containerColor = AppColors.White
                    ),
                    shape = RoundedCornerShape(14.dp)
                ) {

                    Row(
                        modifier = Modifier.padding(14.dp),
                        verticalAlignment = Alignment.CenterVertically
                    ) {

                        Box(
                            modifier = Modifier
                                .size(48.dp)
                                .clip(CircleShape)
                                .background(AppColors.Secondary),
                            contentAlignment = Alignment.Center
                        ) {

                            Text(
                                text = product.farmerName
                                    .take(1)
                                    .uppercase(),
                                color = AppColors.White,
                                fontWeight = FontWeight.Bold
                            )
                        }

                        Spacer(
                            modifier = Modifier.width(12.dp)
                        )

                        Column(
                            modifier = Modifier.weight(1f)
                        ) {

                            Text(
                                text = product.farmerName,
                                fontWeight = FontWeight.Bold
                            )

                            Spacer(
                                modifier = Modifier.height(3.dp)
                            )

                            Text(
                                text = "Lembang, Bandung Barat",
                                style = MaterialTheme.typography.bodySmall,
                                color = AppColors.Subtitle
                            )

                            Text(
                                text = "${product.distanceKm} km dari Anda",
                                style = MaterialTheme.typography.bodySmall,
                                color = AppColors.Subtitle
                            )
                        }

                        Text(
                            text = "Kunjungi Toko",
                            style = MaterialTheme.typography.labelSmall,
                            fontWeight = FontWeight.Bold,
                            color = AppColors.Primary
                        )
                    }
                }


                // =========================
                // ULASAN
                // =========================

                Spacer(
                    modifier = Modifier.height(20.dp)
                )

                Row(
                    modifier = Modifier.fillMaxWidth(),
                    verticalAlignment = Alignment.CenterVertically
                ) {

                    Text(
                        text = "Ulasan Pembeli",
                        style = MaterialTheme.typography.titleMedium,
                        fontWeight = FontWeight.Bold,
                        color = AppColors.Primary,
                        modifier = Modifier.weight(1f)
                    )

                    Box(
                        modifier = Modifier
                            .clip(
                                RoundedCornerShape(6.dp)
                            )
                            .background(AppColors.Primary)
                            .padding(
                                horizontal = 8.dp,
                                vertical = 4.dp
                            )
                    ) {

                        Text(
                            text = "4.8",
                            color = AppColors.White,
                            fontWeight = FontWeight.Bold,
                            style = MaterialTheme.typography.labelSmall
                        )
                    }
                }


                Spacer(
                    modifier = Modifier.height(8.dp)
                )


                DetailReview(
                    name = "Andini Putri",
                    date = "2 jam yang lalu",
                    text = "Bayamnya segar banget, masih ada akar dan tanah sedikit. Packaging rapi pakai kertas."
                )

                DetailReview(
                    name = "A****** p*****",
                    date = "11/07/2026",
                    text = "Bayamnya segar banget dan tanah sedikit. Packing rapi dan eco-friendly."
                )

                DetailReview(
                    name = "Andini Putri",
                    date = "05/07/2026",
                    text = "Produknya sesuai pesanan dan masih fresh ketika sampai."
                )


                Text(
                    text = "Selengkapnya",
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(
                            vertical = 12.dp
                        ),
                    textAlign = androidx.compose.ui.text.style.TextAlign.Center,
                    style = MaterialTheme.typography.labelMedium,
                    fontWeight = FontWeight.SemiBold,
                    color = AppColors.Primary
                )


                // =========================
                // PRODUK SERUPA
                // =========================

                HorizontalDivider(
                    color = AppColors.Border
                )

                Spacer(
                    modifier = Modifier.height(18.dp)
                )

                Text(
                    text = "Produk Serupa",
                    style = MaterialTheme.typography.titleMedium,
                    fontWeight = FontWeight.Bold,
                    color = AppColors.Primary
                )

                Text(
                    text = "Temukan pilihan serupa untuk kebutuhanmu",
                    style = MaterialTheme.typography.bodySmall,
                    color = AppColors.Subtitle
                )

                Spacer(
                    modifier = Modifier.height(10.dp)
                )

                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.spacedBy(10.dp)
                ) {

                    SimilarProductCard(
                        name = "Wortel Lokal",
                        modifier = Modifier.weight(1f)
                    )

                    SimilarProductCard(
                        name = "Bayam Organik",
                        modifier = Modifier.weight(1f)
                    )
                }

                Spacer(
                    modifier = Modifier.height(20.dp)
                )
            }
        }


        // =========================
        // BOTTOM ACTION
        // =========================

        Row(
            modifier = Modifier
                .fillMaxWidth()
                .background(AppColors.White)
                .padding(
                    horizontal = 14.dp,
                    vertical = 10.dp
                ),
            horizontalArrangement = Arrangement.spacedBy(10.dp),
            verticalAlignment = Alignment.CenterVertically
        ) {

            IconButton(
                onClick = onChat
            ) {
                Icon(
                    imageVector = Icons.Default.ChatBubbleOutline,
                    contentDescription = "Chat",
                    tint = AppColors.Primary
                )
            }

            IconButton(
                onClick = onAddToCart
            ) {
                Icon(
                    imageVector = Icons.Default.ShoppingCart,
                    contentDescription = "Keranjang",
                    tint = AppColors.Primary
                )
            }

            Button(
                onClick = onAddToCart,
                modifier = Modifier
                    .weight(1f)
                    .height(48.dp),
                shape = RoundedCornerShape(14.dp),
                colors = ButtonDefaults.buttonColors(
                    containerColor = AppColors.Primary
                )
            ) {

                Text(
                    text = "Beli Sekarang",
                    fontWeight = FontWeight.Bold
                )
            }
        }
    }
}


@Composable
private fun DetailReview(
    name: String,
    date: String,
    text: String
) {

    Column(
        modifier = Modifier
            .fillMaxWidth()
            .padding(
                vertical = 10.dp
            )
    ) {

        Row(
            verticalAlignment = Alignment.CenterVertically
        ) {

            Box(
                modifier = Modifier
                    .size(30.dp)
                    .clip(CircleShape)
                    .background(AppColors.Secondary),
                contentAlignment = Alignment.Center
            ) {

                Text(
                    text = name
                        .take(1)
                        .uppercase(),
                    color = AppColors.White,
                    fontWeight = FontWeight.Bold,
                    style = MaterialTheme.typography.labelSmall
                )
            }

            Spacer(
                modifier = Modifier.width(8.dp)
            )

            Column(
                modifier = Modifier.weight(1f)
            ) {

                Text(
                    text = name,
                    fontWeight = FontWeight.SemiBold,
                    style = MaterialTheme.typography.bodySmall
                )

                Text(
                    text = date,
                    style = MaterialTheme.typography.labelSmall,
                    color = AppColors.Subtitle
                )
            }
        }

        Spacer(
            modifier = Modifier.height(6.dp)
        )

        Text(
            text = text,
            style = MaterialTheme.typography.bodySmall,
            color = AppColors.TextDark
        )

        HorizontalDivider(
            modifier = Modifier.padding(
                top = 10.dp
            ),
            color = AppColors.Border
        )
    }
}


@Composable
private fun SimilarProductCard(
    name: String,
    modifier: Modifier = Modifier
) {

    Card(
        modifier = modifier,
        colors = CardDefaults.cardColors(
            containerColor = AppColors.White
        ),
        shape = RoundedCornerShape(12.dp)
    ) {

        Column {

            Box(
                modifier = Modifier
                    .fillMaxWidth()
                    .height(105.dp)
                    .background(AppColors.Border),
                contentAlignment = Alignment.Center
            ) {

                Text(
                    text = name,
                    style = MaterialTheme.typography.bodySmall,
                    fontWeight = FontWeight.SemiBold,
                    color = AppColors.Primary
                )
            }

            Column(
                modifier = Modifier.padding(8.dp)
            ) {

                Text(
                    text = name,
                    style = MaterialTheme.typography.bodySmall,
                    fontWeight = FontWeight.SemiBold
                )

                Spacer(
                    modifier = Modifier.height(4.dp)
                )

                Text(
                    text = "Rp 12.500/kg",
                    color = AppColors.Primary,
                    fontWeight = FontWeight.Bold,
                    style = MaterialTheme.typography.bodySmall
                )

                Spacer(
                    modifier = Modifier.height(7.dp)
                )

                Box(
                    modifier = Modifier
                        .fillMaxWidth()
                        .clip(
                            RoundedCornerShape(10.dp)
                        )
                        .background(AppColors.Primary)
                        .padding(
                            vertical = 7.dp
                        ),
                    contentAlignment = Alignment.Center
                ) {

                    Icon(
                        imageVector = Icons.Default.ShoppingCart,
                        contentDescription = "Tambahkan",
                        tint = AppColors.White,
                        modifier = Modifier.size(16.dp)
                    )
                }
            }
        }
    }
}