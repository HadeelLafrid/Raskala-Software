<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class LocationSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $wilayas = [
            'Adrar',
            'Chlef',
            'Laghouat',
            'Oum El Bouaghi',
            'Batna',
            'Béjaïa',
            'Biskra',
            'Béchar',
            'Blida',
            'Bouira',
            'Tamanrasset',
            'Tébessa',
            'Tlemcen',
            'Tiaret',
            'Tizi Ouzou',
            'Alger',
            'Djelfa',
            'Jijel',
            'Sétif',
            'Saïda',
            'Skikda',
            'Sidi Bel Abbès',
            'Annaba',
            'Guelma',
            'Constantine',
            'Médéa',
            'Mostaganem',
            'M\'Sila',
            'Mascara',
            'Ouargla',
            'Oran',
            'El Bayadh',
            'Illizi',
            'Bordj Bou Arréridj',
            'Boumerdès',
            'El Tarf',
            'Tindouf',
            'Tissemsilt',
            'El Oued',
            'Khenchela',
            'Souk Ahras',
            'Tipaza',
            'Mila',
            'Aïn Defla',
            'Naâma',
            'Aïn Témouchent',
            'Ghardaïa',
            'Relizane',
            'Timimoun',
            'Bordj Badji Mokhtar',
            'Ouled Djellal',
            'Béni Abbès',
            'In Salah',
            'In Guezzam',
            'Touggourt',
            'Djanet',
            'El M\'Ghair',
            'El Menia',
        ];

        // Clear existing locations
        DB::table('locations')->truncate();

        // Insert all wilayas
        foreach ($wilayas as $wilaya) {
            DB::table('locations')->insert([
                'location_id' => Str::uuid()->toString(),
                'wilaya' => $wilaya,
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }

        $this->command->info('Successfully seeded ' . count($wilayas) . ' Algerian wilayas!');
    }
}
