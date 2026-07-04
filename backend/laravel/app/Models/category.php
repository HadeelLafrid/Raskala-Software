<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Support\Str;

class Category extends Model
{
    use HasFactory;

    protected $table = 'categories';
    
    protected $primaryKey = 'category_id';
    
    public $incrementing = false;
    
    protected $keyType = 'string';
    
    protected $fillable = [
        'category_id',
        'name',
    ];
    
    // Optional: Add these if you want auto-generation of UUID
    protected static function boot()
    {
        parent::boot();
        
        static::creating(function ($model) {
            if (empty($model->category_id)) {
                $model->category_id = (string) Str::uuid();
            }
        });
    }
    
    // Relationship with products
    public function products()
    {
        return $this->hasMany(Product::class, 'category_id', 'category_id');
    }
    
    // Optional: Add accessors/mutators if needed
    public function getNameAttribute($value)
    {
        return ucfirst($value);
    }
    
    public function setNameAttribute($value)
    {
        $this->attributes['name'] = strtolower($value);
    }
}