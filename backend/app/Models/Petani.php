<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Petani extends Model
{
    protected $fillable = [
        'user_id',
        'nama',
        'radius',
        'rating',
        'logistik',
        'rekening',
        'qris_image',
    ];

    /**
     * Get the user profile linked to the farmer.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the products for the farmer.
     */
    public function produks(): HasMany
    {
        return $this->hasMany(Produk::class);
    }
}
