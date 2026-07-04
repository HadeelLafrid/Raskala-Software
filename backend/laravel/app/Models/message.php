<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class Message extends Model
{
    protected $table = 'messages';
    protected $primaryKey = 'message_id';
    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'message_id',
        'chat_id',
        'sender_id',
        'body',
        'type',
        'read',
    ];

    protected $casts = [
        'read' => 'boolean',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    // Auto-generate UUID
    protected static function boot()
    {
        parent::boot();

        static::creating(function ($model) {
            if (empty($model->message_id)) {
                $model->message_id = (string) Str::uuid();
            }
        });
    }

    // Relationship: Chat this message belongs to
    public function chat()
    {
        return $this->belongsTo(Chat::class, 'chat_id', 'chat_id');
    }

    // Relationship: Sender (User)
    public function sender()
    {
        return $this->belongsTo(User::class, 'sender_id', 'user_id');
    }

    // Helper: Check if message is from specific user
    public function isFromUser($userId)
    {
        return $this->sender_id === $userId;
    }
}