<?php
use App\Http\Controllers\AuthController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AdminController;
use App\Http\Controllers\LocationController;
use App\Http\Controllers\FollowController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\FavoriteController;
use App\Http\Controllers\ChatController;

// Public routes (no authentication required)
Route::post('/signup', [AuthController::class, 'signup']);
Route::post('/login', [AuthController::class, 'login']); // We'll create this next
Route::get('/locations', [LocationController::class, 'index']);
Route::get('/products', [ProductController::class, 'index']);
Route::get('/products/{productId}', [ProductController::class, 'show']);
Route::get('/categories', [ProductController::class, 'getCategories']);

// Protected routes (authentication required)
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    // Get own profile
    Route::get('/profile', [ProfileController::class, 'profile']);
    // Get another user's profile
    Route::get('/profile/{userId}', [ProfileController::class, 'profile']);
    // editing profile
    Route::post('/profile/update', [ProfileController::class, 'update']); 
    Route::post('/profile/upload-photo', [ProfileController::class, 'uploadPhoto']);
    
    // Follow/Unfollow routes
    Route::post('/users/{userId}/follow', [FollowController::class, 'follow']);
    Route::post('/users/{userId}/unfollow', [FollowController::class, 'unfollow']);

    // Product management routes (require authentication)
    Route::post('/products', [ProductController::class, 'store']);
    Route::put('/products/{productId}', [ProductController::class, 'update']);
    Route::delete('/products/{productId}', [ProductController::class, 'destroy']);
    Route::get('/my-products', [ProductController::class, 'myProducts']);
    Route::post('/products/{productId}/like', [ProductController::class, 'like']);
    
    // Favorites routes
    Route::get('/favorites', [FavoriteController::class, 'index']);
    Route::get('/favorites/ids', [FavoriteController::class, 'getFavoriteIds']);
    Route::post('/favorites/{productId}', [FavoriteController::class, 'store']);
    Route::delete('/favorites/{productId}', [FavoriteController::class, 'destroy']);
    Route::get('/favorites/{productId}/check', [FavoriteController::class, 'check']);

});
//  // chat routes
//      Route::prefix('chats')->group(function () {
//         // Get all conversations
//         Route::get('/', [ChatController::class, 'getConversations']);
        
//         // Get messages for a specific chat
//         Route::get('/{chatId}/messages', [ChatController::class, 'getMessages']);
        
//         // Send a message
//         Route::post('/messages', [ChatController::class, 'sendMessage']);
        
//         // Mark messages as read
//         Route::patch('/{chatId}/read', [ChatController::class, 'markAsRead']);
        
//         // Delete a message
//         Route::delete('/messages/{messageId}', [ChatController::class, 'deleteMessage']);
        
//         // Delete conversation
//         Route::delete('/{chatId}', [ChatController::class, 'deleteConversation']);
        
//         // Get unread count
//         Route::get('/unread/count', [ChatController::class, 'getUnreadCount']);
//     });

// chats routes 
Route::middleware('auth:sanctum')->prefix('chats')->group(function () {
    Route::get('/', [ChatController::class, 'getConversations']);
    Route::get('/{chatId}/messages', [ChatController::class, 'getMessages']);
    Route::post('/messages', [ChatController::class, 'sendMessage']);
    Route::patch('/{chatId}/read', [ChatController::class, 'markAsRead']);
    Route::delete('/messages/{messageId}', [ChatController::class, 'deleteMessage']);
    Route::delete('/{chatId}', [ChatController::class, 'deleteConversation']);
    Route::get('/unread/count', [ChatController::class, 'getUnreadCount']);
      Route::post('/start', [ChatController::class, 'startChat']); 
});


// Admin-only routes
Route::middleware(['auth:sanctum', 'admin'])->group(function () {
    Route::get('/admin/users', [AdminController::class, 'getUsers']);
    Route::get('/admin/stats', [AdminController::class, 'getStats']);
     Route::get('/admin/dashboard-stats', [AdminController::class, 'getDashboardStats']); 

    // publication routes 
    Route::get('/admin/products', [AdminController::class, 'getProducts']);
    Route::get('/admin/products/stats', [AdminController::class, 'getProductStats']);
    Route::get('/admin/categories', [AdminController::class, 'getCategories']);
    Route::patch('/admin/products/{productId}/status', [AdminController::class, 'updateProductStatus']);
});