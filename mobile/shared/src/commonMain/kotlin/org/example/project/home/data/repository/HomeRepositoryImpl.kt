package org.example.project.home.data.repository

import org.example.project.core.network.mapNetworkError
import org.example.project.home.data.remote.HomeApiService
import org.example.project.home.domain.model.Category
import org.example.project.home.domain.model.HomeUser
import org.example.project.home.domain.model.ProductPreview
import org.example.project.home.domain.model.StaticCategories
import org.example.project.home.domain.repository.HomeRepository
import org.example.project.search.data.mapper.toProductPreviews

// Terhubung ke backend Laravel sungguhan lewat HomeApiService (GET /user & GET /petani) --
// sebelumnya kelas ini mengembalikan data statis buatan (delay + list hardcode) sebagai
// placeholder sampai backend siap. Sekarang datanya real:
//   - getCurrentUser()        -> GET /user (butuh Bearer token dari sesi login)
//   - getRecommendedProducts() -> GET /petani, di-flatten per produk (sama seperti modul Search)
//   - getCategories()         -> backend belum punya endpoint kategori terpisah, jadi masih
//     memakai daftar kategori statis (StaticCategories) -- BUKAN data akun/transaksi, jadi ini
//     bukan bagian dari "fake scenario", murni daftar filter UI.
class HomeRepositoryImpl(private val api: HomeApiService) : HomeRepository {

    override suspend fun getCurrentUser(): Result<HomeUser> = runCatching {
        val user = api.getUser()
        HomeUser(
            name = user.name,
            location = user.alamat?.takeIf { it.isNotBlank() } ?: "Lokasi belum diatur"
        )
    }.mapNetworkError()

    override suspend fun getCategories(): Result<List<Category>> = runCatching {
        StaticCategories.list
    }

    override suspend fun getRecommendedProducts(): Result<List<ProductPreview>> = runCatching {
        api.getPetani().flatMap { it.toProductPreviews() }
    }.mapNetworkError()
}