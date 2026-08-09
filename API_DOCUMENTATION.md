# API Documentation - Harvesta API

Dokumentasi ini mencakup seluruh endpoint API untuk project Harvesta (Tubes Chevalier).  
Base URL default: `http://localhost/api` (atau sesuai konfigurasi Laravel local server Anda).

---

## Daftar Isi
1. [Authentication (OTP WhatsApp)](#1-authentication-otp-whatsapp)
2. [Profil Petani & Katalog Produk](#2-profil-petani--katalog-produk)
3. [Transaksi (Order & Pembayaran)](#3-transaksi-order--pembayaran)
4. [Buku Kas Digital](#4-buku-kas-digital)
5. [Harga Pasar Harian](#5-harga-pasar-harian)

---

## 1. Authentication (OTP WhatsApp)

Flow pendaftaran & login menggunakan passwordless OTP WhatsApp.

### **Register**
* **Endpoint:** `POST /register`
* **Headers:** `Accept: application/json`
* **Body (JSON):**
  ```json
  {
    "name": "Kantin Sukses",
    "email": "kantinsukses@gmail.com",
    "no_hp": "081234567890",
    "password": "password123",
    "role": "umkm",
    "latitude": -6.9750,
    "longitude": 107.6310,
    "alamat": "Kantin Gedung Selaru Telkom University"
  }
  ```
* **Keterangan:** Role yang didukung adalah `umkm`, `petani`, dan `admin`.
* **Response (201 Created):**
  ```json
  {
    "success": true,
    "message": "Registrasi berhasil",
    "data": {
      "name": "Kantin Sukses",
      "email": "kantinsukses@gmail.com",
      "no_hp": "081234567890",
      "role": "umkm",
      "latitude": -6.975,
      "longitude": 107.631,
      "alamat": "Kantin Gedung Selaru Telkom University",
      "updated_at": "2026-08-09T13:30:00.000000Z",
      "created_at": "2026-08-09T13:30:00.000000Z",
      "id": 1
    }
  }
  ```

### **Kirim OTP (Request OTP)**
* **Endpoint:** `POST /send-otp`
* **Headers:** `Accept: application/json`
* **Body (JSON):**
  ```json
  {
    "no_hp": "081234567890"
  }
  ```
* **Keterangan:** Mengirimkan 4/6 digit kode OTP ke nomor WhatsApp yang terdaftar. (Dalam mode lokal, kode OTP disimpan pada user record).
* **Response (200 OK):**
  ```json
  {
    "success": true,
    "message": "OTP berhasil dikirim ke WhatsApp Anda"
  }
  ```

### **Login via OTP**
* **Endpoint:** `POST /login`
* **Headers:** `Accept: application/json`
* **Body (JSON):**
  ```json
  {
    "no_hp": "081234567890",
    "otp_code": "1234"
  }
  ```
* **Response (200 OK):**
  ```json
  {
    "success": true,
    "message": "Login berhasil",
    "token": "1|xxxxxxxxxxxxxxxxxxxxxxxxxxxx",
    "user": {
      "id": 1,
      "name": "Kantin Sukses",
      "email": "kantinsukses@gmail.com",
      "no_hp": "081234567890",
      "role": "umkm"
    }
  }
  ```

### **Logout**
* **Endpoint:** `POST /logout`
* **Headers:** 
  * `Accept: application/json`
  * `Authorization: Bearer <token>`
* **Response (200 OK):**
  ```json
  {
    "success": true,
    "message": "Logout berhasil"
  }
  ```

---

## 2. Profil Petani & Katalog Produk

### **Get List Petani Terdekat (Berdasarkan Radius GPS)**
* **Endpoint:** `GET /petani`
* **Keterangan:** Mengambil daftar petani terdekat yang disortir berdasarkan jarak GPS terdekat dari koordinat pengirim (UMKM).
* **Query Parameters:**
  * `latitude` (required, float) - koordinat latitude UMKM
  * `longitude` (required, float) - koordinat longitude UMKM
* **Response (200 OK):**
  ```json
  [
    {
      "id": 1,
      "user_id": 2,
      "nama": "Tani Jaya Budi",
      "radius": "1.5 km",
      "rating": 5,
      "logistik": "Kurir Mandiri",
      "rekening": "BCA 123456789",
      "qris_image": "/storage/qris/qris_barcode.png",
      "created_at": "2026-08-09T13:30:00.000000Z",
      "updated_at": "2026-08-09T13:30:00.000000Z",
      "distance_val": 0.09823091
    }
  ]
  ```

### **Update Profil & QRIS Petani**
* **Endpoint:** `POST /petani/profile`
* **Headers:** 
  * `Accept: application/json`
  * `Authorization: Bearer <token>`
* **Body (Multipart/Form-Data):**
  * `rekening` (string) - Nomor rekening pembayaran
  * `qris_image` (file, image) - Gambar barcode QRIS petani
  * `logistik` (string) - Keterangan logistik/pengiriman
  * `latitude` (float) - Update koordinat latitude
  * `longitude` (float) - Update koordinat longitude
* **Response (200 OK):**
  ```json
  {
    "success": true,
    "message": "Profil petani berhasil diperbarui",
    "data": {
      "id": 1,
      "user_id": 2,
      "nama": "Tani Jaya Budi",
      "radius": "1.5 km",
      "rating": 5,
      "logistik": "Bisa diantar",
      "rekening": "Mandiri 987654321",
      "qris_image": "qris/xxxxxxxx.png"
    }
  }
  ```

### **Tambah Produk Baru (Khusus Petani)**
* **Endpoint:** `POST /produk`
* **Headers:** 
  * `Accept: application/json`
  * `Authorization: Bearer <token>`
* **Body (JSON):**
  ```json
  {
    "nama_barang": "Cabai Rawit Merah",
    "stok": 15.5,
    "harga": 45000
  }
  ```
* **Response (201 Created):**
  ```json
  {
    "success": true,
    "message": "Produk berhasil ditambahkan",
    "data": {
      "petani_id": 1,
      "nama_barang": "Cabai Rawit Merah",
      "stok": 15.5,
      "harga": 45000,
      "updated_at": "2026-08-09T13:35:00.000000Z",
      "created_at": "2026-08-09T13:35:00.000000Z",
      "id": 3
    }
  }
  ```

### **Update Produk (Khusus Petani)**
* **Endpoint:** `PUT /produk/{id}`
* **Headers:** 
  * `Accept: application/json`
  * `Authorization: Bearer <token>`
* **Body (JSON):**
  ```json
  {
    "stok": 20,
    "harga": 42000
  }
  ```
* **Response (200 OK):**
  ```json
  {
    "success": true,
    "message": "Produk berhasil diperbarui",
    "data": {
      "id": 3,
      "petani_id": 1,
      "nama_barang": "Cabai Rawit Merah",
      "stok": 20,
      "harga": 42000
    }
  }
  ```

### **Hapus Produk (Khusus Petani)**
* **Endpoint:** `DELETE /produk/{id}`
* **Headers:** 
  * `Accept: application/json`
  * `Authorization: Bearer <token>`
* **Response (200 OK):**
  ```json
  {
    "success": true,
    "message": "Produk berhasil dihapus"
  }
  ```

---

## 3. Transaksi (Order & Pembayaran)

Proses checkout efisien (3-Klik) dan validasi pembayaran.

### **Checkout / Buat Transaksi Baru (UMKM)**
* **Endpoint:** `POST /transaksi`
* **Headers:** 
  * `Accept: application/json`
  * `Authorization: Bearer <token>`
* **Body (JSON):**
  ```json
  {
    "petani_id": 1,
    "metode_pembayaran": "qris",
    "metode_pengiriman": "pickup",
    "items": [
      {
        "produk_id": 3,
        "jumlah": 2
      }
    ]
  }
  ```
* **Keterangan:** `metode_pengiriman` bernilai `pickup` atau `delivery`. `metode_pembayaran` bernilai `qris` atau `transfer`. Stok produk petani akan langsung berkurang otomatis sesuai `jumlah`.
* **Response (201 Created):**
  ```json
  {
    "success": true,
    "message": "Transaksi berhasil dibuat",
    "data": {
      "umkm_id": 1,
      "petani_id": 1,
      "kode_transaksi": "TRX-20260809-XXXX",
      "total_harga": 84000,
      "metode_pembayaran": "qris",
      "metode_pengiriman": "pickup",
      "status_pesanan": "pending",
      "status_pembayaran": "unpaid",
      "id": 5
    }
  }
  ```

### **Upload Bukti Pembayaran (UMKM)**
* **Endpoint:** `POST /transaksi/{id}/bukti`
* **Headers:** 
  * `Accept: application/json`
  * `Authorization: Bearer <token>`
* **Body (Multipart/Form-Data):**
  * `bukti_pembayaran` (file, image) - Gambar bukti transfer/pembayaran QRIS
* **Response (200 OK):**
  ```json
  {
    "success": true,
    "message": "Bukti pembayaran berhasil diupload",
    "data": {
      "id": 5,
      "bukti_pembayaran": "bukti_pembayaran/xxxxxx.jpg",
      "status_pesanan": "pending"
    }
  }
  ```

### **Validasi Pembayaran & Selesaikan Transaksi (Khusus Petani)**
* **Endpoint:** `POST /transaksi/{id}/validasi`
* **Headers:** 
  * `Accept: application/json`
  * `Authorization: Bearer <token>`
* **Keterangan:** Petani menyetujui bukti bayar. Menandai status pesanan menjadi `completed` & status pembayaran menjadi `paid`. **Secara otomatis membuat record Pemasukan pada Buku Kas Petani dan Pengeluaran pada Buku Kas UMKM.**
* **Response (200 OK):**
  ```json
  {
    "success": true,
    "message": "Pembayaran berhasil divalidasi dan pesanan diselesaikan",
    "data": {
      "id": 5,
      "status_pesanan": "completed",
      "status_pembayaran": "paid"
    }
  }
  ```

### **Melihat Riwayat Transaksi**
* **Endpoint:** `GET /transaksi`
* **Headers:** 
  * `Accept: application/json`
  * `Authorization: Bearer <token>`
* **Response (200 OK):**
  ```json
  [
    {
      "id": 5,
      "kode_transaksi": "TRX-20260809-XXXX",
      "total_harga": 84000,
      "status_pesanan": "completed",
      "status_pembayaran": "paid",
      "items": [
        {
          "id": 10,
          "transaksi_id": 5,
          "produk_id": 3,
          "jumlah": 2,
          "harga_satuan": 42000,
          "produk": {
            "id": 3,
            "nama_barang": "Cabai Rawit Merah"
          }
        }
      ]
    }
  ]
  ```

---

## 4. Buku Kas Digital

Sistem pencatatan keuangan otomatis pasca transaksi sukses.

### **Melihat Rekap & Daftar Buku Kas**
* **Endpoint:** `GET /buku-kas`
* **Headers:** 
  * `Accept: application/json`
  * `Authorization: Bearer <token>`
* **Response (200 OK):**
  ```json
  {
    "success": true,
    "summary": {
      "total_pemasukan": 84000,
      "total_pengeluaran": 0,
      "saldo": 84000
    },
    "data": [
      {
        "id": 1,
        "user_id": 2,
        "transaksi_id": 5,
        "tipe": "pemasukan",
        "nominal": 84000,
        "keterangan": "Pemasukan otomatis dari transaksi TRX-20260809-XXXX",
        "tanggal": "2026-08-09",
        "created_at": "2026-08-09T13:40:00.000000Z"
      }
    ]
  }
  ```

### **Input Manual Pencatatan Buku Kas**
* **Endpoint:** `POST /buku-kas`
* **Headers:** 
  * `Accept: application/json`
  * `Authorization: Bearer <token>`
* **Body (JSON):**
  ```json
  {
    "tipe": "pengeluaran",
    "nominal": 15000,
    "keterangan": "Beli pupuk urea",
    "tanggal": "2026-08-09"
  }
  ```
* **Response (201 Created):**
  ```json
  {
    "success": true,
    "message": "Catatan keuangan berhasil ditambahkan",
    "data": {
      "user_id": 2,
      "tipe": "pengeluaran",
      "nominal": 15000,
      "keterangan": "Beli pupuk urea",
      "tanggal": "2026-08-09",
      "id": 2
    }
  }
  ```

---

## 5. Harga Pasar Harian

Mendukung transparansi patokan harga adil bagi Petani dan UMKM.

### **Input/Update Harga Pasar Harian (Khusus Admin)**
* **Endpoint:** `POST /market-prices`
* **Headers:** 
  * `Accept: application/json`
  * `Authorization: Bearer <token>`
* **Body (JSON):**
  ```json
  {
    "nama_komoditas": "Cabai Rawit",
    "harga_rata_rata": 47000,
    "satuan": "kg",
    "tanggal": "2026-08-09"
  }
  ```
* **Keterangan:** Endpoint ini bersifat *upsert* (menyimpan data baru jika belum ada, atau memperbarui harga rata-rata jika sudah ada record untuk komoditas & tanggal yang sama).
* **Response (201 Created):**
  ```json
  {
    "success": true,
    "message": "Harga pasar harian berhasil disimpan",
    "data": {
      "id": 1,
      "nama_komoditas": "Cabai Rawit",
      "harga_rata_rata": 47000,
      "satuan": "kg",
      "tanggal": "2026-08-09",
      "created_at": "2026-08-09T13:45:00.000000Z",
      "updated_at": "2026-08-09T13:45:00.000000Z"
    }
  }
  ```

### **Melihat Daftar Harga Pasar Harian (Semua Role)**
* **Endpoint:** `GET /market-prices`
* **Headers:** 
  * `Accept: application/json`
  * `Authorization: Bearer <token>`
* **Query Parameters:**
  * `tanggal` (optional, date) - Format `YYYY-MM-DD`. Default ke hari ini (`today()`).
  * `nama_komoditas` (optional, string) - Filter berdasarkan nama komoditas.
* **Response (200 OK):**
  ```json
  {
    "success": true,
    "message": "Daftar harga pasar harian berhasil diambil",
    "data": [
      {
        "id": 1,
        "nama_komoditas": "Cabai Rawit",
        "harga_rata_rata": 47000,
        "satuan": "kg",
        "tanggal": "2026-08-09",
        "created_at": "2026-08-09T13:45:00.000000Z",
        "updated_at": "2026-08-09T13:45:00.000000Z"
      }
    ]
  }
  ```

### **Hapus Data Harga Pasar Harian (Khusus Admin)**
* **Endpoint:** `DELETE /market-prices/{id}`
* **Headers:** 
  * `Accept: application/json`
  * `Authorization: Bearer <token>`
* **Response (200 OK):**
  ```json
  {
    "success": true,
    "message": "Harga pasar harian berhasil dihapus"
  }
  ```
