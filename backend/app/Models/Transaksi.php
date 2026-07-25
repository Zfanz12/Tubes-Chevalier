<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Transaksi extends Model
{
    protected $table = 'transaksis';

    protected $fillable = [
        'user_id',
        'petani_id',
        'kode_transaksi',
        'total_harga',
        'metode_pembayaran',
        'bukti_pembayaran',
        'metode_pengiriman',
        'status_pesanan',
        'status_pembayaran',
        'rating',
    ];

    /**
     * Get the buyer (UMKM) that placed the order.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the farmer (seller) of the order.
     */
    public function petani(): BelongsTo
    {
        return $this->belongsTo(Petani::class);
    }

    /**
     * Get the items in this transaction.
     */
    public function items(): HasMany
    {
        return $this->hasMany(TransaksiItem::class);
    }
}
