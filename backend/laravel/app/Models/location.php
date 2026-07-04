<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Support\Str;

class Location extends Model
{
    use HasFactory;

    protected $table = 'locations';
    
    protected $primaryKey = 'location_id';
    
    public $incrementing = false;
    
    protected $keyType = 'string';
    
    protected $fillable = [
        'location_id',
        'wilaya',
    ];
    
    protected static function boot()
    {
        parent::boot();
        
        static::creating(function ($model) {
            if (empty($model->location_id)) {
                $model->location_id = (string) Str::uuid();
            }
        });
    }
    
    // Relationship with products
    public function products()
    {
        return $this->hasMany(Product::class, 'location_id', 'location_id');
    }
    
    // Optional: Add accessors/mutators
    public function getWilayaAttribute($value)
    {
        return ucwords($value);
    }
    
    public function setWilayaAttribute($value)
    {
        $this->attributes['wilaya'] = strtolower($value);
    }
}