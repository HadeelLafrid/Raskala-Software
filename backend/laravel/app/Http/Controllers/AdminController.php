<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Product;
use App\Models\Category; 
use Illuminate\Http\Request;

class AdminController extends Controller
{
    /**
     * Get all users with pagination and search
     */
    public function getUsers(Request $request)
    {
        try {
            // Get query parameters
            $perPage = $request->input('per_page', 10); // Default 10 users per page
            $search = $request->input('search', '');
            $status = $request->input('status', ''); // active, inactive, all

            // Build query
            $query = User::query();

            // Search by name, email, or phone
            if ($search) {
                $query->where(function($q) use ($search) {
                    $q->where('name', 'LIKE', "%{$search}%")
                      ->orWhere('email', 'LIKE', "%{$search}%")
                      ->orWhere('phone', 'LIKE', "%{$search}%");
                });
            }

            // Filter by status
            if ($status === 'active') {
                $query->where('is_active', true);
            } elseif ($status === 'inactive') {
                $query->where('is_active', false);
            }

            // Get users with pagination
            $users = $query->orderBy('created_at', 'desc')
                          ->paginate($perPage);

            // Return response
            return response()->json([
                'success' => true,
                'users' => $users->items(),
                'pagination' => [
                    'current_page' => $users->currentPage(),
                    'last_page' => $users->lastPage(),
                    'per_page' => $users->perPage(),
                    'total' => $users->total(),
                    'from' => $users->firstItem(),
                    'to' => $users->lastItem(),
                ]
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch users',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get user statistics for dashboard
     */
    public function getStats()
    {
        try {
            $totalUsers = User::count();
            $activeUsers = User::where('is_active', true)->count();
            $inactiveUsers = User::where('is_active', false)->count();
            $adminUsers = User::where('role', 'admin')->count();
            $regularUsers = User::where('role', 'user')->count();

            return response()->json([
                'success' => true,
                'stats' => [
                    'total_users' => $totalUsers,
                    'active_users' => $activeUsers,
                    'inactive_users' => $inactiveUsers,
                    'admin_users' => $adminUsers,
                    'regular_users' => $regularUsers,
                ]
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch stats',
                'error' => $e->getMessage()
            ], 500);
        }



    }

/**
     * NEW METHOD: Get all products/publications with pagination and filters
     */
    public function getProducts(Request $request)
    {
        try {
            // Get query parameters
            $perPage = $request->input('per_page', 10);
            $search = $request->input('search', '');
            $status = $request->input('status', ''); // pending, approved, rejected, etc.
            $category = $request->input('category', '');

            // Build query with relationships
            $query = Product::with(['user', 'category', 'location', 'images']);

            // Search by title, description, or price
            if ($search) {
                $query->where(function($q) use ($search) {
                    $q->where('title', 'LIKE', "%{$search}%")
                      ->orWhere('description', 'LIKE', "%{$search}%")
                      ->orWhere('price', 'LIKE', "%{$search}%");
                });
            }

            // Filter by status
            if ($status) {
                $query->where('status', $status);
            }

            // Filter by category
            if ($category) {
                $query->where('category_id', $category);
            }

            // Get products with pagination, ordered by newest first
            $products = $query->orderBy('created_at', 'desc')
                             ->paginate($perPage);

            // Format the response
            $formattedProducts = $products->map(function ($product) {
                return [
                    'product_id' => $product->product_id,
                    'title' => $product->title,
                    'description' => $product->description,
                    'price' => $product->price,
                    'condition' => $product->condition,
                    'status' => $product->status,
                    'likes' => $product->likes,
                    'created_at' => $product->created_at,
                    
                    // User info
                    'user' => [
                        'user_id' => $product->user->user_id ?? null,
                        'name' => $product->user->name ?? 'Unknown',
                        'email' => $product->user->email ?? null,
                    ],
                    
                    // Category info
                    'category' => [
                        'category_id' => $product->category->category_id ?? null,
                        'name' => $product->category->name ?? 'Uncategorized',
                    ],
                    
                    // Location info
                    'location' => [
                        'location_id' => $product->location->location_id ?? null,
                        // Add location name if you have it in your Location model
                    ],
                    
                    // First image (main image)
                    'image' => $product->images->first() 
                        ? $this->getSupabaseUrl($product->images->first()->image_path)
                        : null,
                    
                    // All images
                    'images' => $product->images->map(function ($img) {
                        return [
                            'image_id' => $img->image_id,
                            'image_path' => $img->image_path,
                            'url' => $this->getSupabaseUrl($img->image_path),
                        ];
                    }),
                ];
            });

            return response()->json([
                'success' => true,
                'products' => $formattedProducts,
                'pagination' => [
                    'current_page' => $products->currentPage(),
                    'last_page' => $products->lastPage(),
                    'per_page' => $products->perPage(),
                    'total' => $products->total(),
                    'from' => $products->firstItem(),
                    'to' => $products->lastItem(),
                ]
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch products',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * NEW METHOD: Get all categories for filtering
     */
    public function getCategories()
    {
        try {
            $categories = \App\Models\Category::all(['category_id', 'name']);

            return response()->json([
                'success' => true,
                'categories' => $categories
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch categories',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * NEW METHOD: Update product status (Approve/Reject)
     */
    public function updateProductStatus(Request $request, $productId)
    {
        try {
            $validated = $request->validate([
                'status' => 'required|string|in:pending,approved,rejected,flagged,need_more_info',
            ]);

            $product = Product::findOrFail($productId);
            $product->status = $validated['status'];
            $product->save();

            return response()->json([
                'success' => true,
                'message' => 'Product status updated successfully',
                'product' => $product
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to update product status',
                'error' => $e->getMessage()
            ], 500);
        }
    }
  

    /**
 * Get comprehensive dashboard statistics
 */
public function getDashboardStats()
{
    try {
        // User statistics
        $totalUsers = User::count();
        
        // Product statistics
        $totalProducts = Product::count();
        $approvedProducts = Product::where('status', 'approved')->count();
        $pendingProducts = Product::where('status', 'pending')->count();
        
        return response()->json([
            'success' => true,
            'data' => [
                'total_users' => $totalUsers,
                'total_products' => $totalProducts,
                'approved_products' => $approvedProducts,
                'pending_products' => $pendingProducts,
            ]
        ], 200);

    } catch (\Exception $e) {
        return response()->json([
            'success' => false,
            'message' => 'Failed to fetch dashboard stats',
            'error' => $e->getMessage()
        ], 500);
    }
}
    /**
     * NEW METHOD: Get product statistics
     */
    public function getProductStats()
    {
        try {
            $totalProducts = Product::count();
            $pendingReview = Product::where('status', 'pending')->count();
            $approved = Product::where('status', 'approved')->count();
            $rejected = Product::where('status', 'rejected')->count();
            $flagged = Product::where('status', 'flagged')->count();

            return response()->json([
                'success' => true,
                'stats' => [
                    'total_products' => $totalProducts,
                    'pending_review' => $pendingReview,
                    'approved' => $approved,
                    'rejected' => $rejected,
                    'flagged' => $flagged,
                ]
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch product stats',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}












//  getUsers(): Returns paginated list of users
//  Supports search by name, email, or phone
//  Supports filtering by status (active/inactive)
//  Returns pagination info (current page, total, etc.)
//  getStats(): Returns dashboard statistics