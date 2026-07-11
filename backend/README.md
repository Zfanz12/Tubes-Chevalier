# Tubes Chevalier - Backend API (Laravel 13)

Ini adalah folder backend untuk project **Tubes Chevalier**.

---

## Pilihan Setup Local Development

Lu bebas mau pake cara instan pake **Docker (sangat direkomendasikan)** biar ga perlu install database di laptop, atau tetep pake **Cara Klasik (Tanpa Docker)**. 

Apapun pilihan setup lokal lu, **CI/CD Pipeline tetep bakal jalan otomatis** pas lu push code ke GitHub buat ngecek error dan running unit test backend.

---

### Pilihan A: Menggunakan Docker (Rekomendasi Instan)

Cara ini paling cepet karena database MySQL udah dibungkus di dalam Docker container.

#### Prasyarat
* Sudah install **Docker** & **Docker Compose** di laptop.

#### Langkah-langkah:
1. Pastiin file `.env` lu udah ada. Copy dari example:
   ```bash
   cp .env.example .env
   ```
2. Set konfigurasi database di file `.env` lu jadi kayak gini (sesuaiin port database Docker ke `3307`):
   ```env
   DB_CONNECTION=mysql
   DB_HOST=127.0.0.1
   DB_PORT=3307
   DB_DATABASE=tubes_chevalier_db
   DB_USERNAME=root
   DB_PASSWORD=root
   ```
3. Jalankan container database MySQL di background:
   ```bash
   docker compose up -d
   ```
4. Install dependencies PHP lewat composer lokal:
   ```bash
   composer install
   ```
5. Generate application key:
   ```bash
   php artisan key:generate
   ```
6. Jalankan database migrations:
   ```bash
   php artisan migrate
   ```
7. Jalankan server lokal Laravel:
   ```bash
   php artisan serve
   ```
   API Backend bisa diakses di `http://127.0.0.1:8000`.

---

### Pilihan B: Cara Klasik (Tanpa Docker)

Gunakan cara ini kalau lu belum install Docker di laptop dan lebih milih pake MySQL lokal yang udah ada.

#### Prasyarat
* **PHP >= 8.3** terinstall di sistem.
* **Composer** terinstall.
* **MySQL Server** terinstall dan berjalan lokal di port `3306`.

#### Langkah-langkah:
1. Copy template `.env`:
   ```bash
   cp .env.example .env
   ```
2. Buat database kosong baru di MySQL lokal lu dengan nama: `tubes_chevalier_db` (atau bebas sesuai preferensi).
3. Buka file `.env`, lalu sesuaikan kredensial koneksi database lokal lu:
   ```env
   DB_CONNECTION=mysql
   DB_HOST=127.0.0.1
   DB_PORT=3306          # Port default MySQL lokal lu
   DB_DATABASE=tubes_chevalier_db
   DB_USERNAME=root      # Username MySQL lokal lu
   DB_PASSWORD=your_password_here
   ```
4. Install PHP dependencies:
   ```bash
   composer install
   ```
5. Generate application key:
   ```bash
   php artisan key:generate
   ```
6. Jalankan database migrations:
   ```bash
   php artisan migrate
   ```
7. Jalankan local server:
   ```bash
   php artisan serve
   ```

---

## Menjalankan Unit Test Secara Lokal

Sebelum melakukan push ke GitHub, biasakan jalankan test lokal untuk memastikan tidak ada kode yang broken:
```bash
php artisan test
```

## CI/CD Pipeline (GitHub Actions)

Project backend ini sudah dilengkapi dengan CI/CD otomatis di file `.github/workflows/backend-ci.yml`. 
Setiap kali ada `push` atau `pull_request` di subfolder `backend/` ini, runner GitHub Actions bakal:
1. Setup PHP 8.4 & MySQL test database.
2. Install Composer dependencies.
3. Menjalankan migrations & unit test (`php artisan test`).

*Catatan: Pipeline ini hanya mentrigger perubahan di folder `backend/`, jadi anak-anak Frontend (FE) tidak akan terganggu sama sekali.*
