<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\Category;
use App\Models\Location;
use App\Models\ProductImage;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Http;

class ProductController extends Controller
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
     * Display a listing of products
     */
    public function index(Request $request)
    {
        try {
            $query = Product::with(['user', 'category', 'location', 'images']);

            // Filter by status if provided
            if ($request->has('status') && $request->status !== 'all') {
                $query->where('status', $request->status);
            }

            // Filter by user if provided (for user's own products)
            if ($request->has('user_id')) {
                $query->where('user_id', $request->user_id);
            }

            // Filter by category if provided (now using category_id)
            if ($request->has('category_id')) {
                $query->where('category_id', $request->category_id);
            }
            
            // Filter by category name (alternative)
            if ($request->has('category')) {
                $category = Category::where('name', 'like', '%' . $request->category . '%')->first();
                if ($category) {
                    $query->where('category_id', $category->category_id);
                }
            }

            // Filter by location if provided
            if ($request->has('location_id')) {
                $query->where('location_id', $request->location_id);
            }
            
            // Filter by location name (alternative)
            if ($request->has('location')) {
                $location = Location::where('wilaya', 'like', '%' . $request->location . '%')->first();
                if ($location) {
                    $query->where('location_id', $location->location_id);
                }
            }

            // Search by keyword in title or description
            if ($request->has('search') && $request->search) {
                $searchTerm = $request->search;
                $query->where(function($q) use ($searchTerm) {
                    $q->where('title', 'like', '%' . $searchTerm . '%')
                      ->orWhere('description', 'like', '%' . $searchTerm . '%');
                });
            }

            // Sort by date (newest first by default, or oldest first)
            $sortOrder = $request->get('sort', 'desc'); // desc = newest first, asc = oldest first
            if ($sortOrder === 'asc') {
                $query->oldest();
            } else {
                $query->latest();
            }

            $products = $query->paginate(12);

            return response()->json([
                'success' => true,
                'data' => array_map([$this, 'formatProduct'], $products->items()),
                'pagination' => [
                    'current_page' => $products->currentPage(),
                    'total' => $products->total(),
                    'per_page' => $products->perPage(),
                    'last_page' => $products->lastPage(),
                ]
            ], 200);

        } catch (\Exception $e) {
            Log::error('Failed to fetch products: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch products',
                'error' => config('app.debug') ? $e->getMessage() : 'Server error'
            ], 500);
        }
    }

    /**
     * Store a new product with images
     */
    public function store(Request $request)
    {
        $user = $request->user();
        
        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthenticated. Please log in to create products.',
                'errors' => [
                    'auth' => ['You must be logged in to create a product']
                ]
            ], 401);
        }

        // Start database transaction
        DB::beginTransaction();

        try {
            // Validate the input data
            $validated = $request->validate([
                'title' => 'required|string|min:3|max:100',
                'description' => 'required|string|min:10|max:1000',
                'category_id' => 'required|uuid|exists:categories,category_id', // Category ID from database
                'price' => 'required|numeric|min:0|max:999999999',
                'location_id' => 'required|uuid|exists:locations,location_id', // Location ID from database
                'status' => 'sometimes|in:draft,published,active,sold,expired,pending,approved,rejected,company_offer',
                'images' => 'required|array|min:1|max:10',
                'images.*' => 'image|mimes:jpeg,png,jpg,gif,webp|max:5120',
            ], [
                'title.required' => 'Title is required',
                'title.min' => 'Title must be at least 3 characters',
                'title.max' => 'Title must not exceed 100 characters',
                'description.required' => 'Description is required',
                'description.min' => 'Description must be at least 10 characters',
                'description.max' => 'Description must not exceed 1000 characters',
                'category_id.required' => 'Please select a category',
                'category_id.uuid' => 'Invalid category selected',
                'category_id.exists' => 'Selected category does not exist',
                'price.required' => 'Price is required',
                'price.min' => 'Price must be a positive number',
                'price.max' => 'Price is too high',
                'location_id.required' => 'Location is required',
                'location_id.uuid' => 'Invalid location selected',
                'location_id.exists' => 'Selected location does not exist',
                'images.required' => 'At least one image is required',
                'images.min' => 'At least one image is required',
                'images.max' => 'Maximum 10 images allowed',
                'images.*.image' => 'File must be an image',
                'images.*.mimes' => 'Image must be jpeg, png, jpg, gif, or webp',
                'images.*.max' => 'Each image must not exceed 5MB',
            ]);

            Log::info('Product creation - validated data:', $validated);

            // Use category_id directly from request (already validated to exist)
            $categoryId = $validated['category_id'];

            // Use location_id directly from request (already validated to exist)
            $locationId = $validated['location_id'];

            // Determine status - use pending as default (matches DB enum: pending, approved, rejected, company_offer)
            $status = $validated['status'] ?? 'pending';
            // Map common status values to allowed DB values
            if (in_array($status, ['published', 'active'])) {
                $status = 'pending';
            }
            if ($status === 'draft') {
                $status = 'pending';
            }

            // Create product with UUID foreign keys
            $productData = [
                'product_id' => Str::uuid()->toString(),
                'user_id' => $user->user_id,
                'category_id' => $categoryId,
                'location_id' => $locationId,
                'title' => $validated['title'],
                'description' => $validated['description'],
                'price' => $validated['price'],
                'status' => $status,
            ];

            Log::info('Product creation - product data:', $productData);

            $product = Product::create($productData);

            // Handle image uploads
            if ($request->hasFile('images')) {
                $uploadedAny = false;
                $imageOrder = 0;
                foreach ($request->file('images') as $image) {
                    try {
                        // Generate unique filename
                        $filename = $product->product_id . '_' . $imageOrder . '_' . time() . '.' . $image->getClientOriginalExtension();
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
                        ProductImage::create([
                            'image_id' => Str::uuid()->toString(),
                            'product_id' => $product->product_id,
                            'image_path' => $path,
                        ]);
                        
                        Log::info('Product image uploaded successfully', [
                            'product_id' => $product->product_id,
                            'path' => $path
                        ]);
                        
                        $uploadedAny = true;
                        $imageOrder++;
                    } catch (\Exception $imageError) {
                        Log::error('Image upload error: ' . $imageError->getMessage());
                        // Continue with other images even if one fails
                    }
                }

                if (!$uploadedAny) {
                    throw new \Exception('Failed to upload any product images');
                }
            }

            // Commit transaction
            DB::commit();

            // Load relationships
            $product->load(['user', 'category', 'location', 'images']);
            
            Log::info('Product created successfully', [
                'product_id' => $product->product_id,
                'user_id' => $user->user_id,
                'title' => $product->title
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Product created successfully!',
                'data' => $this->formatProduct($product)
            ], 201);

        } catch (ValidationException $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Product creation failed: ' . $e->getMessage(), [
                'user_id' => $user->user_id ?? null,
                'trace' => $e->getTraceAsString()
            ]);
            
            return response()->json([
                'success' => false,
                'message' => 'Failed to create product',
                'error' => config('app.debug') ? $e->getMessage() : 'Server error'
            ], 500);
        }
    }

    /**
     * Display the specified product
     */
    public function show(Request $request, $productId)
    {
        try {
            $product = Product::with(['user', 'category', 'location', 'images'])
                ->where('product_id', $productId)
                ->firstOrFail();
            
            return response()->json([
                'success' => true,
                'data' => $this->formatProduct($product)
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Product not found',
                'errors' => [
                    'product' => ['The requested product does not exist']
                ]
            ], 404);
        }
    }

    /**
     * Update the specified product
     */
    public function update(Request $request, $productId)
    {
        $user = $request->user();
        
        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthenticated. Please log in.',
                'errors' => [
                    'auth' => ['You must be logged in to update products']
                ]
            ], 401);
        }

        DB::beginTransaction();

        try {
            $product = Product::where('product_id', $productId)->firstOrFail();

            // Check ownership
            if ($product->user_id !== $user->user_id) {
                return response()->json([
                    'success' => false,
                    'message' => 'Unauthorized. You can only edit your own products.',
                    'errors' => [
                        'auth' => ['You do not have permission to edit this product']
                    ]
                ], 403);
            }

            // Validate input
            $validated = $request->validate([
                'title' => 'required|string|min:3|max:100',
                'description' => 'required|string|min:10|max:1000',
                'category_id' => 'required|uuid|exists:categories,category_id',
                'price' => 'required|numeric|min:0|max:999999999',
                'location_id' => 'required|uuid|exists:locations,location_id',
                'status' => 'sometimes|in:draft,published,active,sold,expired,pending,approved,rejected,company_offer',
                'images' => 'sometimes|array|max:10',
                'images.*' => 'image|mimes:jpeg,png,jpg,gif,webp|max:5120',
                'remove_images' => 'sometimes|array',
                'remove_images.*' => 'string', // image_id is string (UUID)
            ]);

            // Use category_id directly from request (already validated to exist)
            $categoryId = $validated['category_id'];

            // Use location_id directly from request (already validated to exist)
            $locationId = $validated['location_id'];

            // Determine status
            $status = $validated['status'] ?? $product->status;
            if ($status === 'published') {
                $status = 'active';
            }

            // Update product with UUID foreign keys
            $product->update([
                'title' => $validated['title'],
                'description' => $validated['description'],
                'category_id' => $categoryId,
                'location_id' => $locationId,
                'price' => $validated['price'],
                'status' => $status,
            ]);

            // Remove specified images
            if ($request->has('remove_images')) {
                foreach ($request->remove_images as $imageId) {
                    $image = ProductImage::where('image_id', $imageId)
                        ->where('product_id', $product->product_id)
                        ->first();
                    
                    if ($image) {
                        try {
                            Http::withHeaders($this->supabaseAuthHeaders())
                                ->delete($this->supabaseObjectUrl($image->image_path));
                        } catch (\Exception $e) {
                            Log::warning('Failed to delete image from storage', ['path' => $image->image_path]);
                        }
                        $image->delete();
                    }
                }
            }

            // Add new images
            if ($request->hasFile('images')) {
                $existingCount = $product->images()->count();
                $imageOrder = $existingCount;
                $uploadedAny = false;
                
                foreach ($request->file('images') as $image) {
                    if ($imageOrder >= 10) break; // Max 10 images
                    
                    $filename = $product->product_id . '_' . $imageOrder . '_' . time() . '.' . $image->getClientOriginalExtension();
                    $path = 'products/' . $filename;
                    
                    // Upload via Supabase REST API (binary body, no JSON encoding)
                    $response = Http::withHeaders($this->supabaseUploadHeaders($image->getMimeType()))
                        ->send('PUT', $this->supabaseObjectUrl($path), [
                            'body' => $image->getContent(),
                        ]);
                    
                    if (!$response->successful()) {
                        $rawBody = $response->body();
                        $safeBody = is_string($rawBody)
                            ? mb_convert_encoding($rawBody, 'UTF-8', 'UTF-8')
                            : json_encode($rawBody);

                        Log::error('Image upload failed (update)', [
                            'status' => $response->status(),
                            'body' => $safeBody,
                        ]);

                        throw new \Exception('Image upload failed with status ' . $response->status());
                    }

                    ProductImage::create([
                        'image_id' => Str::uuid()->toString(),
                        'product_id' => $product->product_id,
                        'image_path' => $path,
                    ]);
                    
                    $imageOrder++;
                    $uploadedAny = true;
                }

                if (!$uploadedAny) {
                    throw new \Exception('Failed to upload any new product images');
                }
            }

            DB::commit();

            $product->load(['user', 'category', 'location', 'images']);
            
            Log::info('Product updated successfully', [
                'product_id' => $product->product_id,
                'user_id' => $user->user_id
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Product updated successfully!',
                'data' => $this->formatProduct($product)
            ], 200);

        } catch (ValidationException $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Product update failed: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Failed to update product',
                'error' => config('app.debug') ? $e->getMessage() : 'Server error'
            ], 500);
        }
    }

    /**
     * Remove the specified product
     */
    public function destroy(Request $request, $productId)
    {
        $user = $request->user();
        
        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthenticated. Please log in.',
                'errors' => [
                    'auth' => ['You must be logged in to delete products']
                ]
            ], 401);
        }

        DB::beginTransaction();

        try {
            $product = Product::where('product_id', $productId)->firstOrFail();

            // Check ownership
            if ($product->user_id !== $user->user_id) {
                DB::rollBack();
                return response()->json([
                    'success' => false,
                    'message' => 'Unauthorized. You can only delete your own products.',
                    'errors' => [
                        'auth' => ['You do not have permission to delete this product']
                    ]
                ], 403);
            }

            // Delete images from storage and database
            foreach ($product->images as $image) {
                try {
                    Http::withHeaders($this->supabaseAuthHeaders())
                        ->delete($this->supabaseObjectUrl($image->image_path));
                } catch (\Exception $e) {
                    Log::warning('Failed to delete image', ['path' => $image->image_path]);
                }
                $image->delete();
            }
            
            // Delete product
            $product->delete();
            
            DB::commit();
            
            Log::info('Product deleted successfully', [
                'product_id' => $productId,
                'user_id' => $user->user_id
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Product deleted successfully!'
            ], 200);

        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Product deletion failed: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Failed to delete product',
                'error' => config('app.debug') ? $e->getMessage() : 'Server error'
            ], 500);
        }
    }

    /**
     * Like a product
     */
    public function like(Request $request, $productId)
    {
        try {
            $product = Product::where('product_id', $productId)->firstOrFail();
            $product->increment('likes');
            $product->load(['user', 'category', 'location', 'images']);
            
            return response()->json([
                'success' => true,
                'message' => 'Product liked successfully!',
                'data' => $this->formatProduct($product)
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Product not found',
                'errors' => [
                    'product' => ['The requested product does not exist']
                ]
            ], 404);
        }
    }

    /**
     * Get products for the authenticated user
     */
    public function myProducts(Request $request)
    {
        $user = $request->user();
        
        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthenticated. Please log in.',
                'errors' => [
                    'auth' => ['You must be logged in to view your products']
                ]
            ], 401);
        }

        try {
            $query = Product::with(['user', 'category', 'location', 'images'])
                ->where('user_id', $user->user_id);

            // Filter by status if provided
            if ($request->has('status') && $request->status !== 'all') {
                $query->where('status', $request->status);
            }

            $products = $query->latest()->paginate(12);

            return response()->json([
                'success' => true,
                'data' => array_map([$this, 'formatProduct'], $products->items()),
                'pagination' => [
                    'current_page' => $products->currentPage(),
                    'total' => $products->total(),
                    'per_page' => $products->perPage(),
                    'last_page' => $products->lastPage(),
                ]
            ], 200);

        } catch (\Exception $e) {
            Log::error('Failed to fetch user products: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch your products',
                'error' => config('app.debug') ? $e->getMessage() : 'Server error'
            ], 500);
        }
    }

    /**
     * Get available categories
     */
    public function getCategories()
    {
        try {
            $categories = Category::orderBy('name')->get();
            
            return response()->json([
                'success' => true,
                'data' => $categories->map(function($category) {
                    return [
                        'id' => $category->category_id,
                        'name' => $category->name,
                        'created_at' => $category->created_at,
                        'updated_at' => $category->updated_at,
                    ];
                })
            ], 200);
        } catch (\Exception $e) {
            Log::error('Failed to fetch categories: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch categories',
                'error' => config('app.debug') ? $e->getMessage() : 'Server error'
            ], 500);
        }
    }

    /**
     * Get available locations (wilayas)
     */
    public function getLocations()
    {
        try {
            $locations = Location::orderBy('wilaya')->get();
            
            return response()->json([
                'success' => true,
                'data' => $locations->map(function($location) {
                    return [
                        'id' => $location->location_id,
                        'wilaya' => $location->wilaya,
                        'created_at' => $location->created_at,
                        'updated_at' => $location->updated_at,
                    ];
                })
            ], 200);
        } catch (\Exception $e) {
            Log::error('Failed to fetch locations: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch locations',
                'error' => config('app.debug') ? $e->getMessage() : 'Server error'
            ], 500);
        }
    }

    /**
     * Format product for API response
     */
    private function formatProduct($product)
    {
        return [
            'id' => $product->product_id,
            'title' => $product->title,
            'description' => $product->description,
            'category' => $product->category ? $product->category->name : null,
            'category_id' => $product->category_id,
            'location' => $product->location ? $product->location->wilaya : null,
            'location_id' => $product->location_id,
            'price' => (float) $product->price,
            'status' => $product->status,
            'created_at' => $product->created_at?->toDateTimeString(),
            'updated_at' => $product->updated_at?->toDateTimeString(),
            'user' => $product->user ? [
                'id' => $product->user->user_id,
                'name' => $product->user->name,
                'email' => $product->user->email,
            ] : null,
            'images' => $product->images->map(fn($image) => [
                'id' => $image->image_id,
                'url' => $this->supabasePublicUrl($image->image_path),
            ])->values()->toArray(),
        ];
    }
}