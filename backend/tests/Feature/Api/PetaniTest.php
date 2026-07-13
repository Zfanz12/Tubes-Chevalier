<?php

namespace Tests\Feature\Api;

use App\Models\Petani;
use App\Models\Produk;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class PetaniTest extends TestCase
{
    use RefreshDatabase;

    /**
     * Test retrieving the list of farmers.
     */
    public function test_can_get_list_of_farmers(): void
    {
        $petani = Petani::create([
            'nama' => 'Kelompok Tani Uji',
            'radius' => '1.5 km',
            'rating' => 4.8,
            'logistik' => 'Tersedia'
        ]);

        Produk::create([
            'petani_id' => $petani->id,
            'nama_barang' => 'Cabai Hijau',
            'stok' => 10,
            'harga' => 15000
        ]);

        $response = $this->getJson('/api/petani');

        $response->assertStatus(200)
            ->assertJsonCount(1)
            ->assertJsonFragment([
                'nama' => 'Kelompok Tani Uji',
                'komoditas' => 'Cabai Hijau',
                'stok' => 10,
                'harga' => 15000,
                'radius' => '1.5 km',
                'rating' => 4.8,
                'logistik' => 'Tersedia'
            ]);
    }
}
