<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Produk extends Model
{
    protected $fillable = [
        'petani_id',
        'nama_barang',
        'stok',
        'harga',
    ];

    /**
     * Get the farmer that owns the product.
     */
    public function petani(): BelongsTo
    {
        return $this->belongsTo(Petani::class);
    }
}
