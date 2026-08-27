package org.example.project.payment.domain.repository

import org.example.project.payment.domain.model.PaymentDetail

// CATATAN CAKUPAN -- endpoint POST /transaksi (checkout) SENGAJA TIDAK ada di sini. Checkout
// sudah terhubung penuh lewat cart/domain/repository/CartRepository.checkout() (dipanggil dari
// CartViewModel.onCheckout, lihat cart/data/repository/CartRepositoryImpl.checkout), karena
// checkout secara alami milik alur Keranjang (butuh kelompokkan item per petani dari CartItem).
// Modul payment ini murni menangani apa yang terjadi SETELAH transaksi dibuat: menampilkan detail
// pembayaran (QRIS/rekening) & upload bukti bayar -- persis 2 endpoint di bawah. Id transaksi hasil
// checkout diteruskan dari CartViewModel ke sini lewat HomeNavHost (lihat CheckoutResult.id).
//
// POST /transaksi/{id}/validasi (TransaksiController@validasiPembayaran) JUGA sengaja tidak ada
// di sini -- endpoint itu khusus role 'petani' (di luar scope alur pembeli/UMKM yang dibangun).
interface PaymentRepository {

    // GET /transaksi/{id} (TransaksiController@show). Dipakai untuk memuat detail pembayaran
    // (termasuk QRIS/rekening petani) pertama kali layar dibuka, dan untuk refresh setelah upload
    // bukti (lihat PaymentRepositoryImpl.uploadBuktiPembayaran).
    suspend fun getPaymentDetail(transaksiId: Long): Result<PaymentDetail>

    // POST /transaksi/{id}/bukti (TransaksiController@uploadBukti), multipart field `bukti_pembayaran`.
    // Mengembalikan PaymentDetail YANG SUDAH DI-REFRESH penuh (bukan cuma field dari response upload),
    // karena endpoint ini di backend tidak me-load relasi petani/items (tidak ada ->load() di
    // uploadBukti) -- lihat catatan lengkap di PaymentRepositoryImpl.
    suspend fun uploadBuktiPembayaran(
        transaksiId: Long,
        imageBytes: ByteArray,
        fileName: String,
        mimeType: String
    ): Result<PaymentDetail>
}