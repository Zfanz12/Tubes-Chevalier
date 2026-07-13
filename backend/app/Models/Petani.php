<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Petani extends Model
{
    protected $fillable = [
        'nama',
        'radius',
        'rating',
        'logistik',
    ];

    /**
     * Get the products for the farmer.
     */
    public function produks(): HasMany
    {
        return $this->hasMany(Produk::class);
    }
}
