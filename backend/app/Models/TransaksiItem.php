<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class TransaksiItem extends Model
{
    protected $table = 'transaksi_items';

    protected $fillable = [
        'transaksi_id',
        'produk_id',
        'jumlah',
        'harga_satuan',
    ];

    /**
     * Get the transaction that owns this item.
     */
    public function transaksi(): BelongsTo
    {
        return $this->belongsTo(Transaksi::class);
    }

    /**
     * Get the product details of this item.
     */
    public function produk(): BelongsTo
    {
        return $this->belongsTo(Produk::class);
    }
}
