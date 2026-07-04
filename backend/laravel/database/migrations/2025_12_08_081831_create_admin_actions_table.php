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
        Schema::create('admin_actions', function (Blueprint $table) {
           $table->uuid('action_id')->primary();  // Changed from 'id' to 'action_id'
        $table->uuid('admin_id');
        $table->uuid('product_id');
        $table->enum('action_type', ['approved', 'rejected', 'featured', 'hidden']);
        $table->text('reason')->nullable();
        $table->timestamps();

        // Foreign keys
        $table->foreign('admin_id')->references('admin_id')->on('admin')->onDelete('cascade');
        $table->foreign('product_id')->references('product_id')->on('products')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('admin_actions');
    }
};
