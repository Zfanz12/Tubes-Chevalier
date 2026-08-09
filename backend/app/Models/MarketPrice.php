<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MarketPrice extends Model
{
    use HasFactory;

    protected $fillable = [
        'nama_komoditas',
        'harga_rata_rata',
        'satuan',
        'tanggal',
    ];

    protected $casts = [
        'harga_rata_rata' => 'float',
        // Kita tidak melakukan cast 'date' di sini agar perbandingan 'tanggal' (string Y-m-d) di updateOrCreate tetap presisi,
        // karena jika dicast ke 'date' / Carbon, SQLite memory di feature test membandingkan object Carbon/DateTime dengan string '2026-08-09' sehingga bernilai false dan memicu error Unique Constraint.
    ];
}
