<?php

namespace Database\Seeders;

use App\Models\Petani;
use App\Models\Produk;
use Illuminate\Database\Seeder;

class PetaniSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $petani1 = Petani::create([
            'nama' => 'Kelompok Tani Sukarno',
            'radius' => '1.2 km',
            'rating' => 4.9,
            'logistik' => 'Tersedia (Kurir Internal)'
        ]);

        Produk::create([
            'petani_id' => $petani1->id,
            'nama_barang' => 'Tomat Segar',
            'stok' => 50,
            'harga' => 12000
        ]);

        $petani2 = Petani::create([
            'nama' => 'Tani Makmur Sragen',
            'radius' => '3.5 km',
            'rating' => 4.7,
            'logistik' => 'Tersedia (Kurir Internal)'
        ]);

        Produk::create([
            'petani_id' => $petani2->id,
            'nama_barang' => 'Cabai Rawit',
            'stok' => 25,
            'harga' => 35000
        ]);
    }
}
