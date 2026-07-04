<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('users', function (Blueprint $table) {
            $table->uuid('user_id')->primary();
            $table->string('name');
            $table->string('email')->unique();
            $table->enum('role', ['admin', 'user'])->default('user'); // ✅ Added
            $table->string('phone')->nullable();
            $table->string('password');
            $table->string('profile_photo')->nullable();
            $table->uuid('location_id')->nullable();
            $table->text('about')->nullable();
            $table->boolean('is_active')->default(true);
            $table->rememberToken();
            $table->timestamps();

            $table->foreign('location_id')
                  ->references('location_id')
                  ->on('locations')
                  ->onDelete('set null');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('users');
    }
};