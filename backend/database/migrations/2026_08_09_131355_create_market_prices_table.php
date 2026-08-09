<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('market_prices', function (Blueprint $table) {
            $table->id();
            $table->string('nama_komoditas'); // nama barang/produk, misal: Cabai Merah, Beras
            $table->decimal('harga_rata_rata', 12, 2); // harga rata-rata pasar harian
            $table->string('satuan')->default('kg'); // satuan: kg, ikat, liter, dll.
            $table->date('tanggal'); // tanggal record harga pasar harian
            $table->timestamps();

            // Unique key agar satu komoditas hanya punya satu record harga per tanggal
            $table->unique(['nama_komoditas', 'tanggal']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('market_prices');
    }
};
