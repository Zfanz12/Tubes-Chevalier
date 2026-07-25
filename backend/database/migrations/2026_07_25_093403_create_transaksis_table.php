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
        Schema::create('transaksis', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade'); // Pembeli (UMKM)
            $table->foreignId('petani_id')->constrained('petanis')->onDelete('cascade'); // Penjual
            $table->string('kode_transaksi')->unique();
            $table->decimal('total_harga', 12, 2);
            $table->enum('metode_pembayaran', ['cod', 'transfer_bank', 'qris']);
            $table->string('bukti_pembayaran')->nullable();
            $table->enum('metode_pengiriman', ['pickup', 'delivery'])->default('pickup');
            $table->enum('status_pesanan', ['pending', 'preparing', 'shipping', 'completed'])->default('pending');
            $table->enum('status_pembayaran', ['unpaid', 'paid'])->default('unpaid');
            $table->integer('rating')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('transaksis');
    }
};
