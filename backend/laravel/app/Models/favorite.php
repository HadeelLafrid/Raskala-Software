<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class Favorite extends Model
{
    protected $table = 'favorites';
    protected $primaryKey = 'favorite_id';
    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'favorite_id',
        'user_id',
        'product_id',
    ];

    protected static function boot()
    {
        parent::boot();
        
        static::creating(function ($favorite) {
            if (empty($favorite->favorite_id)) {
                $favorite->favorite_id = (string) Str::uuid();
            }
        });
    }

    // Relationships
    public function user()
    {
        return $this->belongsTo(User::class, 'user_id', 'user_id');
    }

    public function product()
    {
        return $this->belongsTo(Product::class, 'product_id', 'product_id');
    }
}