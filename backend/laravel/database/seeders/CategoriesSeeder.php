<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class CategoriesSeeder extends Seeder
{
    public function run(): void
    {
        $categories = [
            'Clothes',
            'Computer Science',
            'Sports',
            'Furniture',
            'Household appliances',
            'Spare part',
        ];

        foreach ($categories as $name) {
            DB::table('categories')->insert([
                'category_id' => Str::uuid(),
                'name' => $name,
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }
    }
}
