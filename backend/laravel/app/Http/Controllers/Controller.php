<?php

namespace App\Http\Controllers;

abstract class Controller
{
    /**
     * Get Supabase public URL for a file path
     */
    protected function getSupabaseUrl($path)
    {
        if (!$path) {
            return null;
        }
        
        $url = rtrim((string) config('services.supabase.url'), '/');
        $bucket = config('services.supabase.bucket');
        
        if (!$url || !$bucket) {
            return null;
        }
        
        return $url . '/storage/v1/object/public/' . $bucket . '/' . ltrim($path, '/');
    }
}
