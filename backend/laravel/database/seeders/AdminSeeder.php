<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class AdminSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Admin 1
        User::create([
            'user_id' => Str::uuid(),
            'name' => 'Super Admin',
            'email' => 'admin1@raskala.com',
            'role' => 'admin',
            'password' => Hash::make('admin123'),
            'phone' => '+213555000001',
            'is_active' => true,
        ]);

        // Admin 2
        User::create([
            'user_id' => Str::uuid(),
            'name' => 'Admin Manager',
            'email' => 'admin3@raskala.com',
            'role' => 'admin',
            'password' => Hash::make('admin123'),
            'phone' => '+213555000002',
            'is_active' => true,
        ]);

        // Admin 3
        User::create([
            'user_id' => Str::uuid(),
            'name' => 'Admin Support',
            'email' => 'admin2@raskala.com',
            'role' => 'admin',
            'password' => Hash::make('admin123'),
            'phone' => '+213555000003',
            'is_active' => true,
        ]);

        echo " 3 Admin accounts created successfully!\n";
        echo "-------------------------------------------\n";
        echo "Admin 1: admin1@raskala.com / admin123\n";
        echo "Admin 2: admin2@raskala.com / manager123\n";
        echo "Admin 3: admin3@raskala.com / support123\n";
    }
}