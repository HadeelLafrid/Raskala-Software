<?php

namespace App\Http\Controllers;

use App\Models\Location;
use Illuminate\Http\Request;

class LocationController extends Controller
{
    /**
     * Get all locations/wilayas
     */
    public function index()
    {
        $locations = Location::orderBy('wilaya', 'asc')->get();

        return response()->json([
            'success' => true,
            'data' => $locations
        ]);
    }

    /**
     * Get a single location by ID
     */
    public function show($id)
    {
        $location = Location::find($id);

        if (!$location) {
            return response()->json([
                'success' => false,
                'message' => 'Location not found'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $location
        ]);
    }

    /**
     * Create a new location (Admin only)
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'wilaya' => 'required|string|max:100|unique:locations,wilaya',
        ]);

        $location = Location::create([
            'location_id' => (string) \Illuminate\Support\Str::uuid(),
            'wilaya' => $validated['wilaya'],
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Location created successfully',
            'data' => $location
        ], 201);
    }

    /**
     * Update a location (Admin only)
     */
    public function update(Request $request, $id)
    {
        $location = Location::find($id);

        if (!$location) {
            return response()->json([
                'success' => false,
                'message' => 'Location not found'
            ], 404);
        }

        $validated = $request->validate([
            'wilaya' => 'required|string|max:100|unique:locations,wilaya,' . $id . ',location_id',
        ]);

        $location->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Location updated successfully',
            'data' => $location
        ]);
    }

    /**
     * Delete a location (Admin only)
     */
    public function destroy($id)
    {
        $location = Location::find($id);

        if (!$location) {
            return response()->json([
                'success' => false,
                'message' => 'Location not found'
            ], 404);
        }

        // Check if location has products
        if ($location->products()->count() > 0) {
            return response()->json([
                'success' => false,
                'message' => 'Cannot delete location with existing products'
            ], 400);
        }

        $location->delete();

        return response()->json([
            'success' => true,
            'message' => 'Location deleted successfully'
        ]);
    }
}