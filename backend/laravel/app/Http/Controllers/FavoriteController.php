<?php

namespace App\Http\Controllers;

use App\Models\Favorite;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class FavoriteController extends Controller
{
    /**
     * Get all favorites for the authenticated user
     */
    public function index(Request $request)
    {
        $user = $request->user();
        
        $favorites = Favorite::where('user_id', $user->user_id)
            ->with(['product.user', 'product.category', 'product.location', 'product.images'])
            ->orderBy('created_at', 'desc')
            ->get();

        $favoriteProducts = $favorites->map(function ($favorite) {
            return $this->formatProduct($favorite->product);
        });

        return response()->json([
            'success' => true,
            'favorites' => $favoriteProducts
        ]);
    }

    /**
     * Add a product to favorites
     */
    public function store(Request $request, $productId)
    {
        $user = $request->user();

        // Check if product exists
        $product = Product::find($productId);
        if (!$product) {
            return response()->json([
                'success' => false,
                'message' => 'Product not found'
            ], 404);
        }

        // Check if already favorited
        $existingFavorite = Favorite::where('user_id', $user->user_id)
            ->where('product_id', $productId)
            ->first();

        if ($existingFavorite) {
            return response()->json([
                'success' => false,
                'message' => 'Product already in favorites'
            ], 400);
        }

        // Create favorite
        $favorite = Favorite::create([
            'favorite_id' => (string) Str::uuid(),
            'user_id' => $user->user_id,
            'product_id' => $productId,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Product added to favorites',
            'favorite' => $favorite
        ], 201);
    }

    /**
     * Remove a product from favorites
     */
    public function destroy(Request $request, $productId)
    {
        $user = $request->user();

        $favorite = Favorite::where('user_id', $user->user_id)
            ->where('product_id', $productId)
            ->first();

        if (!$favorite) {
            return response()->json([
                'success' => false,
                'message' => 'Favorite not found'
            ], 404);
        }

        $favorite->delete();

        return response()->json([
            'success' => true,
            'message' => 'Product removed from favorites'
        ]);
    }

    /**
     * Check if a product is favorited by the user
     */
    public function check(Request $request, $productId)
    {
        $user = $request->user();

        $isFavorited = Favorite::where('user_id', $user->user_id)
            ->where('product_id', $productId)
            ->exists();

        return response()->json([
            'success' => true,
            'is_favorited' => $isFavorited
        ]);
    }

    /**
     * Get all product IDs that are favorited by the user
     */
    public function getFavoriteIds(Request $request)
    {
        $user = $request->user();

        $favoriteIds = Favorite::where('user_id', $user->user_id)
            ->pluck('product_id')
            ->toArray();

        return response()->json([
            'success' => true,
            'favorite_ids' => $favoriteIds
        ]);
    }

    /**
     * Format product for API response
     */
    private function formatProduct($product)
    {
        if (!$product) {
            return null;
        }

        return [
            'id' => $product->product_id,
            'title' => $product->title,
            'description' => $product->description,
            'price' => $product->price,
            'status' => $product->status,
            'category' => $product->category ? $product->category->name : null,
            'category_id' => $product->category_id,
            'location' => $product->location ? $product->location->wilaya : null,
            'location_id' => $product->location_id,
            'image' => $product->images->isNotEmpty()
                ? $this->getSupabaseUrl($product->images->first()->image_path)
                : null,
            'images' => $product->images->map(function ($image) {
                return [
                    'id' => $image->image_id,
                    'url' => $this->getSupabaseUrl($image->image_path)
                ];
            })->values(),
            'user' => [
                'id' => $product->user->user_id,
                'name' => $product->user->name,
                'email' => $product->user->email,
            ],
            'created_at' => $product->created_at->format('Y-m-d H:i:s'),
        ];
    }
}