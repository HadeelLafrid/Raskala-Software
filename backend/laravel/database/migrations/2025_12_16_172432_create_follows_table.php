<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('follows', function (Blueprint $table) {
            $table->uuid('follow_id')->primary()->default(DB::raw('gen_random_uuid()'));
            
            $table->uuid('follower_id'); // the user who follows
            $table->uuid('following_id'); // the user being followed
            
            $table->timestamps();

            // Foreign key constraints
            $table->foreign('follower_id')->references('user_id')->on('users')->onDelete('cascade');
            $table->foreign('following_id')->references('user_id')->on('users')->onDelete('cascade');

            // Prevent duplicate follows
            $table->unique(['follower_id', 'following_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('follows');
    }
};
