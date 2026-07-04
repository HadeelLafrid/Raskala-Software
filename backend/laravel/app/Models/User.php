<?php
namespace App\Models;


use Illuminate\Foundation\Auth\User as Authenticatable;
use Laravel\Sanctum\HasApiTokens;
use Illuminate\Notifications\Notifiable;      // <-- add this
use Illuminate\Database\Eloquent\Factories\HasFactory;  // <-- optional but recommended
use Illuminate\Support\Str;
class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;
    // Tell Laravel to use 'user_id' instead of 'id'
    protected $primaryKey = 'user_id';
    
    // Tell Laravel this is not auto-incrementing (it's UUID)
    public $incrementing = false;
    
    // Tell Laravel the primary key is a string (UUID)
    protected $keyType = 'string';

    protected $fillable = [
        'user_id',
        'name',
        'email',
        'phone',
        'role', 
        'password',
        'profile_photo',
        'shop_image',
        'location_id',
        'about',
        'is_active',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'role' => 'string',
    ];

    // Automatically generate UUID when creating a new user
    protected static function boot()
    {
        parent::boot();

        static::creating(function ($user) {
            if (empty($user->user_id)) {
                $user->user_id = (string) Str::uuid();
            }
        });
    }

public function followers()
{
    return $this->belongsToMany(
        User::class,
        'follows',
        'following_id', // foreign key on follows table
        'follower_id',  // related key on follows table
        'user_id',
        'user_id'
    );
}

public function following()
{
    return $this->belongsToMany(
        User::class,
        'follows',
        'follower_id',
        'following_id',
        'user_id',
        'user_id'
    );
}

public function products()
{
    return $this->hasMany(Product::class, 'user_id', 'user_id');
}

public function favorites()
{
    return $this->hasMany(Favorite::class, 'user_id', 'user_id');
}

public function favoriteProducts()
{
    return $this->belongsToMany(Product::class, 'favorites', 'user_id', 'product_id', 'user_id', 'product_id');
}

}