<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\User; 
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Http;

class ProfileController extends Controller
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
     * GET PROFILE - show all products regardless of status
     */
    public function profile(Request $request, $userId = null)
    {
        $startTime = microtime(true);
        
        try {
            Log::info('===== PROFILE REQUEST START =====');
            
            $authUser = $request->user();
            
            // Determine which user to fetch
            if (!$userId) {
                $user = $authUser;
                $isOwnProfile = true;
            } else {
                $user = User::where('user_id', $userId)->firstOrFail();
                $isOwnProfile = $authUser && ($authUser->user_id === $user->user_id);
            }

            // Enable query logging
            DB::enableQueryLog();
            
            // Load ALL products, not just 'active' status
            $user->load([
                'products' => function ($query) {
                    // Remove status filter - show ALL products
                    $query->latest()->limit(50);
                },
                'products.category',
                'products.location',
                'products.images',
                'products.user',
            ]);
            
            $queries = DB::getQueryLog();
            
            Log::info('Products loaded', [
                'products_count' => $user->products->count(),
                'queries_count' => count($queries),
            ]);

            // Load follower/following counts
            $user->loadCount(['followers', 'following']);

            // Check following status
            $isFollowing = false;
            if ($authUser && !$isOwnProfile) {
                $isFollowing = $authUser->following()
                    ->where('following_id', $user->user_id)
                    ->exists();
            }

            // Format products - handle missing columns gracefully
            $formattedProducts = $user->products->map(function($product) {
                return [
                    'product_id' => $product->product_id,
                    'id' => $product->product_id,
                    'title' => $product->title,
                    'description' => $product->description,
                    'category' => $product->category ? $product->category->name : null,
                    'category_id' => $product->category_id,
                    'location' => $product->location ? $product->location->wilaya : null,
                    'location_id' => $product->location_id,
                    'price' => (float) ($product->price ?? 0),
                    'condition' => (int) ($product->condition ?? 5),
                    'status' => $product->status ?? 'pending',
                    'likes' => (int) ($product->likes ?? 0),
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
            });

            $totalTime = round((microtime(true) - $startTime) * 1000, 2);
            
            Log::info('===== PROFILE REQUEST END =====', [
                'total_time_ms' => $totalTime,
                'products_returned' => $formattedProducts->count(),
                'profile_photo' => $user->profile_photo,
            ]);

            return response()->json([
                'user' => [
                    'id' => $user->user_id,
                    'user_id' => $user->user_id,
                    'name' => $user->name,
                    'profileImage' => $user->profile_photo 
                        ? $this->supabasePublicUrl($user->profile_photo)
                        : null,
                        'sidebarImage' => $user->shop_image ? $this->supabasePublicUrl($user->shop_image) : null,
                        'shopImage' => $user->shop_image ? $this->supabasePublicUrl($user->shop_image) : null,
                    'about' => $user->about,
                    'phone' => $user->phone,
                    'email' => $user->email,
                    'location_id' => $user->location_id,
                    'followers' => $user->followers_count ?? 0,
                    'following' => $user->following_count ?? 0,
                    'products_count' => $user->products->count(),
                    'posts' => $formattedProducts,
                    'isFollowing' => $isFollowing,
                    'isOwnProfile' => $isOwnProfile,
                ],
                'debug' => [
                    'total_time_ms' => $totalTime,
                    'products_loaded' => $user->products->count(),
                    'queries_executed' => count($queries),
                    'profile_photo_raw' => $user->profile_photo,
                    'profile_photo_url' => $this->getSupabaseUrl($user->profile_photo),
                    'shop_image_raw' => $user->shop_image,
                    'shop_image_url' => $this->getSupabaseUrl($user->shop_image),
                    'warning' => $totalTime > 500 ? 'SLOW - Check database indexes' : null
                ],
            ]);

        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            Log::error('User not found', ['user_id' => $userId]);
            return response()->json([
                'success' => false,
                'message' => 'User not found',
            ], 404);
        } catch (\Exception $e) {
            $totalTime = round((microtime(true) - $startTime) * 1000, 2);
            Log::error('Profile fetch failed', [
                'time_ms' => $totalTime,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch profile',
                'error' => config('app.debug') ? $e->getMessage() : 'Server error'
            ], 500);
        }
    }

    /**
     * Update authenticated user's profile - Only update changed fields
     */
    public function update(Request $request)
    {
        try {
            $user = $request->user();
            
            Log::info('Profile update started', [
                'user_id' => $user->user_id,
                'has_file' => $request->hasFile('profile_photo'),
                'file_details' => $request->hasFile('profile_photo') ? [
                    'original_name' => $request->file('profile_photo')->getClientOriginalName(),
                    'size' => $request->file('profile_photo')->getSize(),
                    'mime' => $request->file('profile_photo')->getMimeType(),
                ] : null,
                'fields_present' => array_keys($request->except(['_token', '_method'])),
            ]);

            // Validation rules with enhanced email and phone validation
            $validator = Validator::make($request->all(), [
                'name' => 'nullable|string|max:255',
                'about' => 'nullable|string|max:2000',
                'email' => [
                    'nullable',
                    'email',
                    'regex:/^[^\s@]+@[^\s@]+\.[^\s@]+$/',
                    'unique:users,email,' . $user->user_id . ',user_id'
                ],
                'phone' => [
                    'nullable',
                    'string',
                    'max:20',
                    // Algerian phone format: 0XXXXXXXXX or +213XXXXXXXXX
                    'regex:/^(0[5-7]\d{8}|(\+213|00213)[5-7]\d{8})$/'
                ],
                'location_id' => 'nullable|uuid|exists:locations,location_id',
                'current_password' => 'nullable|required_with:new_password|string',
                'new_password' => 'nullable|string|min:8|confirmed',
                'new_password_confirmation' => 'nullable|required_with:new_password|string|min:8',
                'profile_photo' => 'nullable|image|mimes:jpeg,jpg,png,gif|max:5120',
                'shop_image' => 'nullable|image|mimes:jpeg,jpg,png,gif|max:5120',
            ], [
                'email.regex' => 'Please enter a valid email address.',
                'phone.regex' => 'Please enter a valid Algerian phone number (e.g., 0555123456 or +213555123456).',
                'new_password.min' => 'Password must be at least 8 characters.',
                'new_password.confirmed' => 'Password confirmation does not match.',
            ]);

            if ($validator->fails()) {
                Log::error('Validation failed', ['errors' => $validator->errors()]);
                return response()->json([
                    'success' => false,
                    'message' => 'Validation failed',
                    'errors' => $validator->errors()
                ], 422);
            }

            $updatesMade = false;
            $updatedFields = [];

            // Verify current password if user wants to change password
            if ($request->filled('current_password')) {
                if (!Hash::check($request->current_password, $user->password)) {
                    return response()->json([
                        'success' => false,
                        'message' => 'Current password is incorrect',
                        'errors' => [
                            'current_password' => ['The current password is incorrect.']
                        ]
                    ], 422);
                }

                // Update password
                if ($request->filled('new_password')) {
                    $user->password = Hash::make($request->new_password);
                    $updatesMade = true;
                    $updatedFields[] = 'password';
                }
            }

            // Handle profile photo upload
            if ($request->hasFile('profile_photo')) {
                Log::info('Processing profile photo upload');
                
                // Delete old photo if exists (best-effort)
                if ($user->profile_photo) {
                    try {
                        Log::info('Deleting old photo', ['path' => $user->profile_photo]);
                        Http::withHeaders($this->supabaseAuthHeaders())
                            ->delete($this->supabaseObjectUrl($user->profile_photo));
                    } catch (\Throwable $t) {
                        Log::warning('Could not delete old profile photo', [
                            'path' => $user->profile_photo,
                            'error' => $t->getMessage(),
                        ]);
                    }
                }

                $file = $request->file('profile_photo');
                $filename = $user->user_id . '_' . time() . '.' . $file->getClientOriginalExtension();
                $path = 'profiles/' . $filename;
                
                Log::info('Uploading profile photo via REST API', ['path' => $path]);
                
                // Upload via Supabase REST API (send raw binary body)
                $response = Http::withHeaders($this->supabaseUploadHeaders($file->getMimeType()))
                    ->send('PUT', $this->supabaseObjectUrl($path), [
                        'body' => $file->getContent(),
                    ]);
                
                if (!$response->successful()) {
                    Log::error('Profile photo upload failed', [
                        'status' => $response->status(),
                        'body' => $response->body(),
                    ]);
                    throw new \Exception('Failed to upload profile photo: ' . $response->body());
                }
                
                Log::info('Photo uploaded successfully', ['path' => $path]);
                
                // Save the path
                $user->profile_photo = $path;
                $updatesMade = true;
                $updatedFields[] = 'profile_photo';
            }

            // Handle shop (sidebar) image upload
            if ($request->hasFile('shop_image')) {
                Log::info('Processing shop image upload');

                if ($user->shop_image) {
                    try {
                        Log::info('Deleting old shop image', ['path' => $user->shop_image]);
                        Http::withHeaders($this->supabaseAuthHeaders())
                            ->delete($this->supabaseObjectUrl($user->shop_image));
                    } catch (\Throwable $t) {
                        Log::warning('Could not delete old shop image', [
                            'path' => $user->shop_image,
                            'error' => $t->getMessage(),
                        ]);
                    }
                }

                $file = $request->file('shop_image');
                $filename = $user->user_id . '_shop_' . time() . '.' . $file->getClientOriginalExtension();
                $path = 'shops/' . $filename;
                
                Log::info('Uploading shop image via REST API', ['path' => $path]);
                
                // Upload via Supabase REST API (send raw binary body)
                $response = Http::withHeaders($this->supabaseUploadHeaders($file->getMimeType()))
                    ->send('PUT', $this->supabaseObjectUrl($path), [
                        'body' => $file->getContent(),
                    ]);
                
                if (!$response->successful()) {
                    Log::error('Shop image upload failed', [
                        'status' => $response->status(),
                        'body' => $response->body(),
                    ]);
                    throw new \Exception('Failed to upload shop image: ' . $response->body());
                }
                
                Log::info('Shop image uploaded successfully', ['path' => $path]);

                $user->shop_image = $path;
                $updatesMade = true;
                $updatedFields[] = 'shop_image';
            }

            // Update user fields only if provided AND different from current value
            if ($request->filled('name') && $request->name !== $user->name) {
                $user->name = $request->name;
                $updatesMade = true;
                $updatedFields[] = 'name';
            }
            
            if ($request->filled('email') && $request->email !== $user->email) {
                $user->email = $request->email;
                $updatesMade = true;
                $updatedFields[] = 'email';
            }
            
            if ($request->has('phone') && $request->phone !== $user->phone) {
                $user->phone = $request->phone;
                $updatesMade = true;
                $updatedFields[] = 'phone';
            }
            
            if ($request->has('location_id') && $request->location_id !== $user->location_id) {
                $user->location_id = $request->location_id;
                $updatesMade = true;
                $updatedFields[] = 'location_id';
            }

            // Update about/bio if provided
            if ($request->has('about') && $request->about !== $user->about) {
                $user->about = $request->about;
                $updatesMade = true;
                $updatedFields[] = 'about';
            }

            // Only save if there were actual changes
            if (!$updatesMade) {
                Log::info('No changes detected, skipping save', [
                    'user_id' => $user->user_id,
                ]);
                
                return response()->json([
                    'success' => true,
                    'message' => 'No changes to save',
                    'data' => [
                            'user_id' => $user->user_id,
                            'name' => $user->name,
                            'email' => $user->email,
                            'phone' => $user->phone,
                            'location_id' => $user->location_id,
                            'about' => $user->about,
                            'profile_photo' => $user->profile_photo,
                            'profile_photo_url' => $this->getSupabaseUrl($user->profile_photo),
                        ]
                ], 200);
            }

            $user->save();
            
            Log::info('Profile updated successfully', [
                'user_id' => $user->user_id,
                'updated_fields' => $updatedFields,
                'profile_photo' => $user->profile_photo,
                'profile_photo_url' => $user->profile_photo ? $this->getSupabaseUrl($user->profile_photo) : null,
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Profile updated successfully',
                'data' => [
                    'user_id' => $user->user_id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'phone' => $user->phone,
                    'location_id' => $user->location_id,
                    'profile_photo' => $user->profile_photo,
                    'profile_photo_url' => $this->getSupabaseUrl($user->profile_photo),
                    'shop_image' => $user->shop_image,
                    'shop_image_url' => $this->getSupabaseUrl($user->shop_image),
                    'updated_fields' => $updatedFields,
                ]
            ], 200);

        } catch (\Exception $e) {
            Log::error('Profile update failed', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            
            return response()->json([
                'success' => false,
                'message' => 'Failed to update profile',
                'error' => config('app.debug') ? $e->getMessage() : 'Server error'
            ], 500);
        }
    }

    /**
     * Upload profile photo separately
     */
    public function uploadPhoto(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'profile_photo' => 'required|image|mimes:jpeg,jpg,png,gif|max:5120',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Validation failed',
                    'errors' => $validator->errors()
                ], 422);
            }

            $user = $request->user();

            // Delete old photo if exists (best-effort)
            if ($user->profile_photo) {
                try {
                    Http::withHeaders($this->supabaseAuthHeaders())
                        ->delete($this->supabaseObjectUrl($user->profile_photo));
                } catch (\Exception $e) {
                    Log::debug('Failed to delete old profile photo (non-critical)', ['error' => $e->getMessage()]);
                }
            }

            $file = $request->file('profile_photo');
            $filename = $user->user_id . '_' . time() . '.' . $file->getClientOriginalExtension();
            $path = 'profiles/' . $filename;
            
            // Upload via Supabase REST API
            $response = Http::withHeaders($this->supabaseUploadHeaders($file->getMimeType()))
                ->put($this->supabaseObjectUrl($path), $file->getContent());
            
            if (!$response->successful()) {
                throw new \Exception('Failed to upload profile photo');
            }
            
            $user->profile_photo = $path;
            $user->save();

            return response()->json([
                'success' => true,
                'message' => 'Profile photo uploaded successfully',
                'data' => [
                    'profile_photo' => $user->profile_photo,
                    'profile_photo_url' => $this->getSupabaseUrl($user->profile_photo),
                ]
            ], 200);

        } catch (\Exception $e) {
            Log::error('Photo upload failed', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            
            return response()->json([
                'success' => false,
                'message' => 'Failed to upload photo',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}