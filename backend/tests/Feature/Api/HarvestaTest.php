<?php

namespace Tests\Feature\Api;

use App\Models\BukuKas;
use App\Models\Petani;
use App\Models\Produk;
use App\Models\Transaksi;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class HarvestaTest extends TestCase
{
    use RefreshDatabase;

    protected User $petaniUser;
    protected User $umkmUser;
    protected Petani $petani;
    protected Produk $produk;

    protected function setUp(): void
    {
        parent::setUp();

        // 1. Setup Petani User
        $this->petaniUser = User::create([
            'name' => 'Petani Budi',
            'email' => 'budi@tani.com',
            'no_hp' => '08123456789',
            'password' => bcrypt('password123'),
            'role' => 'petani',
            'latitude' => -6.9744, // Telkom University area approx
            'longitude' => 107.6303,
            'alamat' => 'Sawah Baru, Bojongsoang'
        ]);

        $this->petani = Petani::create([
            'user_id' => $this->petaniUser->id,
            'nama' => 'Tani Jaya Budi',
            'radius' => '1.5 km',
            'rating' => 5.0,
            'logistik' => 'Kurir Mandiri',
            'rekening' => 'BCA 123456789',
        ]);

        $this->produk = Produk::create([
            'petani_id' => $this->petani->id,
            'nama_barang' => 'Bayam Hijau',
            'stok' => 10.0,
            'harga' => 8000,
        ]);

        // 2. Setup UMKM User
        $this->umkmUser = User::create([
            'name' => 'Warung Nasi Enak',
            'email' => 'warung@enak.com',
            'no_hp' => '08987654321',
            'password' => bcrypt('password123'),
            'role' => 'umkm',
            'latitude' => -6.9750, // very close to petani
            'longitude' => 107.6310,
            'alamat' => 'Kantin Tel-U'
        ]);
    }

    /**
     * Test geolocation list petani within radius.
     */
    public function test_umkm_can_get_farmers_by_gps_radius(): void
    {
        // UMKM requests farmers list with its GPS coordinates
        $response = $this->actingAs($this->umkmUser)
            ->getJson('/api/petani?latitude=-6.9750&longitude=107.6310');

        $response->assertStatus(200);
        $data = $response->json();
        
        $this->assertNotEmpty($data);
        $this->assertEquals('Tani Jaya Budi', $data[0]['nama']);
        $this->assertNotNull($data[0]['distance_val']);
        // The distance between -6.9744, 107.6303 and -6.9750, 107.6310 is very small (< 1km)
        $this->assertLessThan(1.0, $data[0]['distance_val']);
    }

    /**
     * Test Petani profile updates (including QRIS image).
     */
    public function test_petani_can_update_profile_and_qris(): void
    {
        Storage::fake('public');
        
        // Use a generic fake file instead of UploadedFile::fake()->image() to avoid GD dependency
        $file = UploadedFile::fake()->create('qris_barcode.png', 100, 'image/png');

        $response = $this->actingAs($this->petaniUser)
            ->postJson('/api/petani/profile', [
                'rekening' => 'Mandiri 987654321',
                'qris_image' => $file,
                'logistik' => 'Bisa diantar',
                'latitude' => -6.9800,
                'longitude' => 107.6400,
            ]);

        $response->assertStatus(200)
            ->assertJsonPath('data.rekening', 'Mandiri 987654321')
            ->assertJsonPath('data.logistik', 'Bisa diantar');

        // Check if QRIS image path exists in response
        $qrisPath = $response->json('data.qris_image');
        $this->assertNotNull($qrisPath);
        
        // Check database
        $this->assertDatabaseHas('petanis', [
            'id' => $this->petani->id,
            'rekening' => 'Mandiri 987654321',
            'qris_image' => $qrisPath
        ]);

        // Check user location updated
        $this->assertDatabaseHas('users', [
            'id' => $this->petaniUser->id,
            'latitude' => -6.9800,
            'longitude' => 107.6400,
        ]);
    }

    /**
     * Test Petani product CRUD.
     */
    public function test_petani_can_crud_product(): void
    {
        // 1. Create Product
        $createResponse = $this->actingAs($this->petaniUser)
            ->postJson('/api/produk', [
                'nama_barang' => 'Kangkung Hidroponik',
                'stok' => 15.5,
                'harga' => 10000,
            ]);

        $createResponse->assertStatus(201)
            ->assertJsonPath('data.nama_barang', 'Kangkung Hidroponik');

        $newProductId = $createResponse->json('data.id');

        // 2. Update Product
        $updateResponse = $this->actingAs($this->petaniUser)
            ->putJson("/api/produk/{$newProductId}", [
                'stok' => 20,
                'harga' => 9500,
            ]);

        $updateResponse->assertStatus(200);
        $this->assertEquals(20, $updateResponse->json('data.stok'));
        $this->assertEquals(9500, $updateResponse->json('data.harga'));

        // 3. Destroy Product
        $destroyResponse = $this->actingAs($this->petaniUser)
            ->deleteJson("/api/produk/{$newProductId}");

        $destroyResponse->assertStatus(200);

        $this->assertDatabaseMissing('produks', [
            'id' => $newProductId
        ]);
    }

    /**
     * Test full checkout flow (UMKM checkout, upload proof, farmer validates, trigger Buku Kas).
     */
    public function test_full_checkout_and_buku_kas_flow(): void
    {
        Storage::fake('public');

        // 1. UMKM Places Order (Aturan 3-Klik)
        $checkoutResponse = $this->actingAs($this->umkmUser)
            ->postJson('/api/transaksi', [
                'petani_id' => $this->petani->id,
                'metode_pembayaran' => 'qris',
                'metode_pengiriman' => 'pickup',
                'items' => [
                    [
                        'produk_id' => $this->produk->id,
                        'jumlah' => 2, // 2kg of Bayam
                    ]
                ]
            ]);

        $checkoutResponse->assertStatus(201)
            ->assertJsonPath('data.status_pesanan', 'pending');
        
        $this->assertEquals(16000, $checkoutResponse->json('data.total_harga'));

        $transaksiId = $checkoutResponse->json('data.id');

        // Verify product stock is decremented (10.0 - 2.0 = 8.0)
        $this->assertDatabaseHas('produks', [
            'id' => $this->produk->id,
            'stok' => 8.0
        ]);

        // 2. UMKM uploads payment proof (semi-otomatis)
        $file = UploadedFile::fake()->create('bukti_transfer.jpg', 100, 'image/jpeg');
        $uploadResponse = $this->actingAs($this->umkmUser)
            ->postJson("/api/transaksi/{$transaksiId}/bukti", [
                'bukti_pembayaran' => $file,
            ]);

        $uploadResponse->assertStatus(200);
        $buktiPath = $uploadResponse->json('data.bukti_pembayaran');
        $this->assertNotNull($buktiPath);

        // 3. Petani validates payment and completes order
        $validateResponse = $this->actingAs($this->petaniUser)
            ->postJson("/api/transaksi/{$transaksiId}/validasi");

        $validateResponse->assertStatus(200)
            ->assertJsonPath('data.status_pesanan', 'completed')
            ->assertJsonPath('data.status_pembayaran', 'paid');

        // 4. Verify Buku Kas entries created automatically
        // UMKM Pengeluaran
        $this->assertDatabaseHas('buku_kas', [
            'user_id' => $this->umkmUser->id,
            'transaksi_id' => $transaksiId,
            'tipe' => 'pengeluaran',
            'nominal' => 16000,
        ]);

        // Petani Pemasukan
        $this->assertDatabaseHas('buku_kas', [
            'user_id' => $this->petaniUser->id,
            'transaksi_id' => $transaksiId,
            'tipe' => 'pemasukan',
            'nominal' => 16000,
        ]);

        // 5. Test Buku Kas Get Summary API
        $kasResponse = $this->actingAs($this->petaniUser)
            ->getJson('/api/buku-kas');

        $kasResponse->assertStatus(200);
        $this->assertEquals(16000, $kasResponse->json('summary.total_pemasukan'));
        $this->assertEquals(16000, $kasResponse->json('summary.saldo'));
    }
}
