<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('favorites', function (Blueprint $table) {      
        $table->uuid('favorite_id')->primary();  // Added primary key
        $table->uuid('user_id');
        $table->uuid('product_id');
        $table->timestamps();

        // Prevent duplicate favorites
        $table->unique(['user_id', 'product_id']);

        // Foreign keys
        $table->foreign('user_id')->references('user_id')->on('users')->onDelete('cascade');
        $table->foreign('product_id')->references('product_id')->on('products')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('favorites');
    }
};