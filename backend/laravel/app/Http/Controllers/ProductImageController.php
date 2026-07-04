<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\ProductImage;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

class ProductImageController extends Controller
{
    private function supabaseBaseUrl(): string
    {
        $url = rtrim((string) config('services.supabase.url'), '/');

        if ($url === '') {
            throw new \RuntimeException('SUPABASE_URL is not configured');
        }

        return $url;
    }

    private function supabaseBucket(): string
    {
        $bucket = config('services.supabase.bucket');

        if (!$bucket) {
            throw new \RuntimeException('SUPABASE_BUCKET is not configured');
        }

        return $bucket;
    }

    private function supabaseServiceKey(): string
    {
        $key = config('services.supabase.service_key');

        if (!$key) {
            throw new \RuntimeException('SUPABASE_SECRET_KEY is not configured');
        }

        return $key;
    }

    private function supabaseObjectUrl(string $path): string
    {
        return $this->supabaseBaseUrl() . '/storage/v1/object/' . $this->supabaseBucket() . '/' . ltrim($path, '/');
    }

    private function supabasePublicUrl(string $path): string
    {
        return $this->supabaseBaseUrl() . '/storage/v1/object/public/' . $this->supabaseBucket() . '/' . ltrim($path, '/');
    }

    private function supabaseAuthHeaders(): array
    {
        return [
            'Authorization' => 'Bearer ' . $this->supabaseServiceKey(),
        ];
    }

    private function supabaseUploadHeaders(?string $mime = null): array
    {
        $headers = $this->supabaseAuthHeaders();
        $headers['x-upsert'] = 'true';

        if ($mime) {
            $headers['Content-Type'] = $mime;
        }

        return $headers;
    }

    /**
     * Store images for a product
     * Matches your frontend validation and requirements
     */
    public function store(Request $request, $productId)
    {
        // Get authenticated user
        $user = $request->user();

        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthenticated. Please log in to upload images.',
                'errors' => [
                    'auth' => ['You must be logged in to upload images']
                ]
            ], 401);
        }

        try {
            // Find product by product_id (UUID)
            $product = Product::with('images')
                ->where('product_id', $productId)
                ->first();

            if (!$product) {
                return response()->json([
                    'success' => false,
                    'message' => 'Product not found',
                    'errors' => [
                        'product' => ['The requested product does not exist']
                    ]
                ], 404);
            }

            // Check ownership
            if ($product->user_id !== $user->user_id) {
                return response()->json([
                    'success' => false,
                    'message' => 'Unauthorized. You can only add images to your own products.',
                    'errors' => [
                        'auth' => ['You do not have permission to modify this product']
                    ]
                ], 403);
            }

            // Validate input
            $validated = $request->validate([
                'images' => 'required|array|min:1|max:10',
                'images.*' => 'required|image|mimes:jpeg,png,jpg,gif,webp|max:5120', // 5MB
            ], [
                'images.required' => 'At least one image is required',
                'images.min' => 'At least one image is required',
                'images.max' => 'Maximum 10 images allowed',
                'images.*.required' => 'Each file must be provided',
                'images.*.image' => 'Each file must be an image',
                'images.*.mimes' => 'Images must be jpeg, png, jpg, gif, or webp',
                'images.*.max' => 'Each image must not exceed 5MB',
            ]);

            // Check total images limit (existing + new)
            $existingImagesCount = $product->images->count();
            $newImagesCount = count($validated['images']);
            $totalImages = $existingImagesCount + $newImagesCount;

            if ($totalImages > 10) {
                return response()->json([
                    'success' => false,
                    'message' => "Maximum 10 images allowed per product. You have {$existingImagesCount} existing images.",
                    'errors' => [
                        'images' => ["You can only upload " . (10 - $existingImagesCount) . " more image(s)"]
                    ]
                ], 422);
            }

            $uploadedImages = [];

            foreach ($request->file('images') as $index => $image) {
                try {
                    // Generate unique filename
                    $filename = $product->product_id . '_' . time() . '_' . $index . '.' . $image->getClientOriginalExtension();
                    $path = 'products/' . $filename;
                    
                    Log::info('Uploading product image via REST API', [
                        'product_id' => $product->product_id,
                        'path' => $path,
                    ]);
                    
                    // Upload via Supabase REST API (send raw binary body)
                    $response = Http::withHeaders($this->supabaseUploadHeaders($image->getMimeType()))
                        ->send('PUT', $this->supabaseObjectUrl($path), [
                            'body' => $image->getContent(),
                        ]);
                    
                    if (!$response->successful()) {
                        $rawBody = $response->body();
                        $safeBody = is_string($rawBody)
                            ? mb_convert_encoding($rawBody, 'UTF-8', 'UTF-8')
                            : json_encode($rawBody);

                        Log::error('Image upload failed', [
                            'status' => $response->status(),
                            'body' => $safeBody,
                        ]);

                        throw new \Exception('Image upload failed with status ' . $response->status());
                    }

                    // Create image record with UUID
                    $productImage = ProductImage::create([
                        'image_id' => Str::uuid()->toString(),
                        'product_id' => $product->product_id,
                        'image_path' => $path,
                    ]);

                    $uploadedImages[] = [
                        'id' => $productImage->image_id,
                        'url' => $this->supabasePublicUrl($path),
                        'path' => $path,
                        'created_at' => $productImage->created_at?->toDateTimeString(),
                    ];

                    Log::info('Image uploaded successfully', [
                        'image_id' => $productImage->image_id,
                        'product_id' => $product->product_id,
                        'user_id' => $user->user_id
                    ]);

                } catch (\Exception $imageError) {
                    Log::error('Product image upload failed', [
                        'error' => $imageError->getMessage(),
                        'index' => $index,
                        'product_id' => $product->product_id
                    ]);
                    continue;
                }
            }

            if (empty($uploadedImages)) {
                return response()->json([
                    'success' => false,
                    'message' => 'Failed to upload any images',
                    'errors' => [
                        'images' => ['All image uploads failed. Please try again.']
                    ]
                ], 500);
            }

            return response()->json([
                'success' => true,
                'message' => count($uploadedImages) . ' image(s) uploaded successfully!',
                'data' => $uploadedImages
            ], 201);

        } catch (ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            Log::error('Product image upload failed', [
                'error' => $e->getMessage(),
                'product_id' => $productId,
                'user_id' => $user->user_id ?? null
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Failed to upload images',
                'error' => config('app.debug') ? $e->getMessage() : 'Server error'
            ], 500);
        }
    }

    /**
     * Get all images for a product
     */
    public function index(Request $request, $productId)
    {
        try {
            $product = Product::where('product_id', $productId)->first();

            if (!$product) {
                return response()->json([
                    'success' => false,
                    'message' => 'Product not found',
                    'errors' => [
                        'product' => ['The requested product does not exist']
                    ]
                ], 404);
            }

            $images = ProductImage::where('product_id', $productId)
                ->orderBy('created_at')
                ->get()
                ->map(function ($image) {
                    return [
                        'id' => $image->image_id,
                        'url' => $this->supabasePublicUrl($image->image_path),
                        'path' => $image->image_path,
                        'created_at' => $image->created_at?->toDateTimeString(),
                    ];
                });

            return response()->json([
                'success' => true,
                'data' => $images
            ], 200);

        } catch (\Exception $e) {
            Log::error('Failed to fetch product images', [
                'error' => $e->getMessage(),
                'product_id' => $productId
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch images',
                'error' => config('app.debug') ? $e->getMessage() : 'Server error'
            ], 500);
        }
    }

    /**
     * Delete a product image
     */
    public function destroy(Request $request, $productId, $imageId)
    {
        $user = $request->user();

        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthenticated. Please log in.',
                'errors' => [
                    'auth' => ['You must be logged in to delete images']
                ]
            ], 401);
        }

        try {
            // Find product
            $product = Product::where('product_id', $productId)->first();

            if (!$product) {
                return response()->json([
                    'success' => false,
                    'message' => 'Product not found',
                    'errors' => [
                        'product' => ['The requested product does not exist']
                    ]
                ], 404);
            }

            // Check ownership
            if ($product->user_id !== $user->user_id) {
                return response()->json([
                    'success' => false,
                    'message' => 'Unauthorized. You can only delete images from your own products.',
                    'errors' => [
                        'auth' => ['You do not have permission to modify this product']
                    ]
                ], 403);
            }

            // Find image
            $image = ProductImage::where('product_id', $productId)
                ->where('image_id', $imageId)
                ->first();

            if (!$image) {
                return response()->json([
                    'success' => false,
                    'message' => 'Image not found',
                    'errors' => [
                        'image' => ['The requested image does not exist']
                    ]
                ], 404);
            }

            // Check if it's the last image (prevent deletion if only one image left)
            $imageCount = ProductImage::where('product_id', $productId)->count();
            if ($imageCount <= 1) {
                return response()->json([
                    'success' => false,
                    'message' => 'Cannot delete the last image. Products must have at least one image.',
                    'errors' => [
                        'image' => ['At least one image is required for each product']
                    ]
                ], 422);
            }

            // Delete file from storage (best-effort)
            try {
                Http::withHeaders($this->supabaseAuthHeaders())
                    ->delete($this->supabaseObjectUrl($image->image_path));
                
                Log::info('Image deleted from storage', ['path' => $image->image_path]);
            } catch (\Exception $e) {
                Log::warning('Failed to delete image from storage', [
                    'path' => $image->image_path,
                    'error' => $e->getMessage(),
                ]);
            }

            // Delete from database
            $image->delete();

            Log::info('Image deleted successfully', [
                'image_id' => $imageId,
                'product_id' => $productId,
                'user_id' => $user->user_id
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Image deleted successfully!'
            ], 200);

        } catch (\Exception $e) {
            Log::error('Image deletion failed', [
                'error' => $e->getMessage(),
                'image_id' => $imageId,
                'product_id' => $productId,
                'user_id' => $user->user_id ?? null
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Failed to delete image',
                'error' => config('app.debug') ? $e->getMessage() : 'Server error'
            ], 500);
        }
    }
}