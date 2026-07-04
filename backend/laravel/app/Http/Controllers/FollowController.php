<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;

class FollowController extends Controller
{
    public function follow(Request $request, $userId)
{
    $authUser = $request->user();

    if ($authUser->user_id === $userId) {
        return response()->json([
            'message' => 'You cannot follow yourself'
        ], 400);
    }

    $targetUser = User::where('user_id', $userId)->firstOrFail();

    $authUser->following()->syncWithoutDetaching([$userId]);

    // Reload counts
    $targetUser->loadCount('followers');
    $authUser->loadCount('following');

    return response()->json([
        'message' => 'Followed successfully',
        'followersCount' => $targetUser->followers_count,
        'followingCount' => $authUser->following_count,
    ]);
}


    public function unfollow(Request $request, $userId)
{
    $authUser = $request->user();

    $targetUser = User::where('user_id', $userId)->firstOrFail();

    $authUser->following()->detach($userId);

    // Reload counts
    $targetUser->loadCount('followers');
    $authUser->loadCount('following');

    return response()->json([
        'message' => 'Unfollowed successfully',
        'followersCount' => $targetUser->followers_count,
        'followingCount' => $authUser->following_count,
    ]);
}

}
