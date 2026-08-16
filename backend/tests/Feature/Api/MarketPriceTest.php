<?php

namespace Tests\Feature\Api;

use App\Models\MarketPrice;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class MarketPriceTest extends TestCase
{
    use RefreshDatabase;

    protected User $adminUser;
    protected User $petaniUser;
    protected User $umkmUser;

    protected function setUp(): void
    {
        parent::setUp();

        // Admin User
        $this->adminUser = User::create([
            'name' => 'Admin Harvesta',
            'email' => 'admin@harvesta.com',
            'no_hp' => '08111111111',
            'password' => bcrypt('password123'),
            'role' => 'admin',
        ]);

        // Petani User
        $this->petaniUser = User::create([
            'name' => 'Petani Tok',
            'email' => 'petanitok@tani.com',
            'no_hp' => '08222222222',
            'password' => bcrypt('password123'),
            'role' => 'petani',
        ]);

        // UMKM User
        $this->umkmUser = User::create([
            'name' => 'UMKM Tok',
            'email' => 'umkmtok@umkm.com',
            'no_hp' => '08333333333',
            'password' => bcrypt('password123'),
            'role' => 'umkm',
        ]);
    }

    /**
     * Test admin can insert and update market prices.
     */
    public function test_admin_can_manage_market_prices(): void
    {
        // 1. Admin store market price
        $response = $this->actingAs($this->adminUser)
            ->postJson('/api/market-prices', [
                'nama_komoditas' => 'Cabai Rawit',
                'harga_rata_rata' => 45000,
                'satuan' => 'kg',
                'tanggal' => '2026-08-09',
            ]);

        $response->assertStatus(201)
            ->assertJsonPath('data.nama_komoditas', 'Cabai Rawit')
            ->assertJsonPath('data.harga_rata_rata', 45000)
            ->assertJsonPath('data.satuan', 'kg')
            ->assertJsonPath('data.tanggal', '2026-08-09');

        // 2. Admin update same market price (upsert)
        $updateResponse = $this->actingAs($this->adminUser)
            ->postJson('/api/market-prices', [
                'nama_komoditas' => 'Cabai Rawit',
                'harga_rata_rata' => 47000,
                'satuan' => 'kg',
                'tanggal' => '2026-08-09',
            ]);

        $updateResponse->assertStatus(201)
            ->assertJsonPath('data.harga_rata_rata', 47000);

        // Check DB
        $this->assertDatabaseCount('market_prices', 1);
        $this->assertDatabaseHas('market_prices', [
            'nama_komoditas' => 'Cabai Rawit',
            'harga_rata_rata' => 47000,
        ]);
    }

    /**
     * Test non-admin cannot insert or delete market prices.
     */
    public function test_non_admin_cannot_manage_market_prices(): void
    {
        // Petani tries to store
        $response1 = $this->actingAs($this->petaniUser)
            ->postJson('/api/market-prices', [
                'nama_komoditas' => 'Cabai Rawit',
                'harga_rata_rata' => 45000,
                'satuan' => 'kg',
                'tanggal' => '2026-08-09',
            ]);

        $response1->assertStatus(403);

        // UMKM tries to store
        $response2 = $this->actingAs($this->umkmUser)
            ->postJson('/api/market-prices', [
                'nama_komoditas' => 'Cabai Rawit',
                'harga_rata_rata' => 45000,
                'satuan' => 'kg',
                'tanggal' => '2026-08-09',
            ]);

        $response2->assertStatus(403);
    }

    /**
     * Test all authenticated users can view market prices.
     */
    public function test_all_users_can_view_market_prices(): void
    {
        // Seed a market price
        MarketPrice::create([
            'nama_komoditas' => 'Bawang Merah',
            'harga_rata_rata' => 35000,
            'satuan' => 'kg',
            'tanggal' => '2026-08-09',
        ]);

        // 1. Petani gets today's market prices
        $responsePetani = $this->actingAs($this->petaniUser)
            ->getJson('/api/market-prices?tanggal=2026-08-09');

        $responsePetani->assertStatus(200)
            ->assertJsonCount(1, 'data')
            ->assertJsonPath('data.0.nama_komoditas', 'Bawang Merah');

        // 2. UMKM gets today's market prices
        $responseUmkm = $this->actingAs($this->umkmUser)
            ->getJson('/api/market-prices?tanggal=2026-08-09');

        $responseUmkm->assertStatus(200)
            ->assertJsonCount(1, 'data')
            ->assertJsonPath('data.0.nama_komoditas', 'Bawang Merah');
    }

    /**
     * Test admin can delete market price.
     */
    public function test_admin_can_delete_market_price(): void
    {
        $mp = MarketPrice::create([
            'nama_komoditas' => 'Wortel',
            'harga_rata_rata' => 12000,
            'satuan' => 'kg',
            'tanggal' => '2026-08-09',
        ]);

        // Non-admin try to delete
        $responsePetani = $this->actingAs($this->petaniUser)
            ->deleteJson("/api/market-prices/{$mp->id}");
        $responsePetani->assertStatus(403);

        // Admin delete
        $responseAdmin = $this->actingAs($this->adminUser)
            ->deleteJson("/api/market-prices/{$mp->id}");
        $responseAdmin->assertStatus(200);

        $this->assertDatabaseMissing('market_prices', [
            'id' => $mp->id
        ]);
    }
}
