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
        Schema::table('users', function (Blueprint $table) {
            $table->string('no_hp')->unique()->nullable()->after('email');
            $table->enum('role', ['petani', 'umkm', 'admin'])->default('umkm')->after('no_hp');
            $table->decimal('latitude', 10, 8)->nullable()->after('role');
            $table->decimal('longitude', 11, 8)->nullable()->after('latitude');
            $table->text('alamat')->nullable()->after('longitude');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn(['no_hp', 'role', 'latitude', 'longitude', 'alamat']);
        });
    }
};
