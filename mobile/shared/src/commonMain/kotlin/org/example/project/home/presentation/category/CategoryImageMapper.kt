package org.example.project.home.presentation.category

import org.jetbrains.compose.resources.DrawableResource
import tubes_cheva_mobile.shared.generated.resources.Res
import tubes_cheva_mobile.shared.generated.resources.bayam
import tubes_cheva_mobile.shared.generated.resources.brokoli
import tubes_cheva_mobile.shared.generated.resources.buncis
import tubes_cheva_mobile.shared.generated.resources.jagung
import tubes_cheva_mobile.shared.generated.resources.kangkung
import tubes_cheva_mobile.shared.generated.resources.kol
import tubes_cheva_mobile.shared.generated.resources.kubis
import tubes_cheva_mobile.shared.generated.resources.sawi
import tubes_cheva_mobile.shared.generated.resources.seledri
import tubes_cheva_mobile.shared.generated.resources.timun
import tubes_cheva_mobile.shared.generated.resources.tomat
import tubes_cheva_mobile.shared.generated.resources.wortel

// Pemetaan id kategori (lihat StaticCategories.kt) -> file gambar di composeResources/drawable/.
// Nama function Res.drawable.<nama> otomatis di-generate dari NAMA FILE gambar tanpa ekstensi,
// jadi setiap key di sini HARUS sama persis dengan Category.id di StaticCategories.kt, dan setiap
// Res.drawable.<x> HARUS sama persis dengan nama file gambar (mis. "bayam.png" -> Res.drawable.bayam).
fun categoryImageRes(categoryId: String): DrawableResource? = when (categoryId) {
    "bayam" -> Res.drawable.bayam
    "wortel" -> Res.drawable.wortel
    "kubis" -> Res.drawable.kubis
    "brokoli" -> Res.drawable.brokoli
    "buncis" -> Res.drawable.buncis
    "jagung" -> Res.drawable.jagung
    "kangkung" -> Res.drawable.kangkung
    "kol" -> Res.drawable.kol
    "sawi" -> Res.drawable.sawi
    "seledri" -> Res.drawable.seledri
    "timun" -> Res.drawable.timun
    "tomat" -> Res.drawable.tomat
    else -> null
}