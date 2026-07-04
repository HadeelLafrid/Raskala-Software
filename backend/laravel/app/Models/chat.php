<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class Chat extends Model
{
    protected $table = 'chats';
    protected $primaryKey = 'chat_id';
    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'chat_id',
        'seller_id',
        'buyer_id',
        'item_id',
        'last_message',
        'last_message_at',
    ];

    protected $casts = [
        'last_message_at' => 'datetime',
    ];

    // Auto-generate UUID
    protected static function boot()
    {
        parent::boot();

        static::creating(function ($model) {
            if (empty($model->chat_id)) {
                $model->chat_id = (string) Str::uuid();
            }
        });
    }

    // Relationship: Seller (User)
    public function seller()
    {
        return $this->belongsTo(User::class, 'seller_id', 'user_id');
    }

    // Relationship: Buyer (User)
    public function buyer()
    {
        return $this->belongsTo(User::class, 'buyer_id', 'user_id');
    }

    // Relationship: Product/Item
    public function item()
    {
        return $this->belongsTo(Product::class, 'item_id', 'product_id');
    }

    // Relationship: Messages in this chat
    public function messages()
    {
        return $this->hasMany(Message::class, 'chat_id', 'chat_id');
    }

    // Helper: Get the other user in the chat (not the logged-in user)
    public function getOtherUser($currentUserId)
    {
        if ($this->seller_id === $currentUserId) {
            return $this->buyer;
        }
        return $this->seller;
    }

    // Helper: Get unread message count for a specific user
    public function getUnreadCount($userId)
    {
        return $this->messages()
                    ->where('sender_id', '!=', $userId)
                    ->where('read', false)
                    ->count();
    }
}