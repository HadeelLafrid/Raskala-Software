<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class ProductImage extends Model
{
    use HasFactory;

    // Table name
    protected $table = 'product_images';

    // Primary key setup
    protected $primaryKey = 'image_id';
    public $incrementing = false; // UUID is not auto-increment
    protected $keyType = 'string';

    // Fillable columns
    protected $fillable = [
        'image_id',
        'product_id',
        'image_path',
    ];

    // Automatically generate UUID on creation
    protected static function boot()
    {
        parent::boot();

        static::creating(function ($model) {
            if (empty($model->image_id)) {
                $model->image_id = (string) Str::uuid();
            }
        });
    }

    // Relation: each image belongs to a product
    public function product()
    {
        return $this->belongsTo(Product::class, 'product_id', 'product_id');
    }
}

