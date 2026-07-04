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
        Schema::create('admin', function (Blueprint $table) {
             $table->uuid('admin_id')->primary();  // Changed from 'id' to 'admin_id'
        $table->string('admin_name');
        $table->string('admin_email')->unique();
        $table->string('admin_phone')->nullable();
        $table->string('admin_password');
        $table->string('admin_departement')->nullable();
        $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('admin');
    }
};
