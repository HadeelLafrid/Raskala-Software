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
        Schema::create('products', function (Blueprint $table) {
         $table->uuid('product_id')->primary();
        $table->uuid('user_id');
        $table->uuid('category_id');
         $table->uuid('location_id');
        $table->string('title');
        $table->text('description');
        $table->decimal('price', 10, 2)->nullable();
        $table->enum('status', ['pending', 'approved', 'rejected', 'company_offer'])->default('pending');
        $table->timestamps();
        $table->foreign('user_id')->references('user_id')->on('users')->onDelete('cascade');
        $table->foreign('category_id')->references('category_id')->on('categories')->onDelete('cascade');
        $table->foreign('location_id')->references('location_id')->on('locations')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('products');
    }
};
