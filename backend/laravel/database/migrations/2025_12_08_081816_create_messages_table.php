<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('messages', function (Blueprint $table) {

            // Primary key UUID
            $table->uuid('message_id')->primary()->default(DB::raw('gen_random_uuid()'));

            // Foreign keys
            $table->uuid('chat_id');
            $table->uuid('sender_id');

            // Message data
            $table->text('body');
            $table->string('type')->default('text');
            $table->boolean('read')->default(false);

            $table->timestamps();

            // Foreign key constraints
            $table->foreign('chat_id')->references('chat_id')->on('chats')->onDelete('cascade');
            $table->foreign('sender_id')->references('user_id')->on('users')->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('messages');
    }
};
