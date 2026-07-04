<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        // Use UUID as primary key by default for all models
    \Illuminate\Database\Schema\Blueprint::macro('uuidPrimary', function () {
        return $this->uuid('id')->primary();
    });
    }
}
