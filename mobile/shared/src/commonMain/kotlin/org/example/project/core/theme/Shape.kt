package org.example.project.core.theme

import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.Shapes
import androidx.compose.ui.unit.dp

val AppShape = Shapes(

    extraSmall = RoundedCornerShape(8.dp),

    small = RoundedCornerShape(12.dp),

    medium = RoundedCornerShape(16.dp),

    large = RoundedCornerShape(24.dp)

)

// Radius pill (80px) -- dipakai langsung via Modifier.clip(AppShapePill) untuk badge status,
// chip persentase, dan tombol bulat penuh. Di luar Shapes() di atas karena Material3 Shapes
// hanya menampung 5 slot standar (extraSmall..extraLarge), sedangkan pill dipakai ad-hoc di
// banyak komponen custom (lihat ProductCard, status badge di Dashboard Figma).
val AppShapePill = RoundedCornerShape(80.dp)