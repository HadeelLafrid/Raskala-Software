<?php

namespace App\Http\Controllers;

use App\Models\Chat;
use App\Models\Message;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ChatController extends Controller
{
    /**
     * Get all conversations for the logged-in user
     * Returns list of chats with last message, unread count, and other user info
     */
    public function getConversations(Request $request)
    {
        try {
            $userId = $request->user()->user_id;

            // Get all chats where user is either seller or buyer
            $chats = Chat::where('seller_id', $userId)
                        ->orWhere('buyer_id', $userId)
                        ->with(['seller', 'buyer', 'item'])
                        ->orderBy('last_message_at', 'desc')
                        ->get();

            // Format conversations for frontend
            $conversations = $chats->map(function ($chat) use ($userId) {
                $otherUser = $chat->getOtherUser($userId);
                $unreadCount = $chat->getUnreadCount($userId);

                return [
                    'chat_id' => $chat->chat_id,
                    'other_user' => [
                        'user_id' => $otherUser->user_id,
                        'name' => $otherUser->name,
                        'email' => $otherUser->email,
                        'profile_photo' => $otherUser->profile_photo,
                    ],
                    'item' => $chat->item ? [
                        'product_id' => $chat->item->product_id,
                        'title' => $chat->item->title,
                        'price' => $chat->item->price,
                    ] : null,
                    'last_message' => $chat->last_message,
                    'last_message_at' => $chat->last_message_at,
                    'unread_count' => $unreadCount,
                    'created_at' => $chat->created_at,
                ];
            });

            return response()->json([
                'success' => true,
                'conversations' => $conversations,
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch conversations',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Get messages for a specific chat
     * Supports pagination for loading older messages
     */
    public function getMessages(Request $request, $chatId)
    {
        try {
            $userId = $request->user()->user_id;
            $perPage = $request->input('per_page', 50);

            // Find the chat and verify user is part of it
            $chat = Chat::where('chat_id', $chatId)
                       ->where(function($query) use ($userId) {
                           $query->where('seller_id', $userId)
                                 ->orWhere('buyer_id', $userId);
                       })
                       ->first();

            if (!$chat) {
                return response()->json([
                    'success' => false,
                    'message' => 'Chat not found or you do not have access',
                ], 404);
            }

            // Get messages with pagination (newest first, then reverse)
            $messages = Message::where('chat_id', $chatId)
                              ->with('sender')
                              ->orderBy('created_at', 'desc')
                              ->paginate($perPage);

            // Format messages
            $formattedMessages = $messages->map(function ($message) use ($userId) {
                return [
                    'message_id' => $message->message_id,
                    'chat_id' => $message->chat_id,
                    'sender' => [
                        'user_id' => $message->sender->user_id,
                        'name' => $message->sender->name,
                        'profile_photo' => $message->sender->profile_photo,
                    ],
                    'body' => $message->body,
                    'type' => $message->type,
                    'read' => $message->read,
                    'is_mine' => $message->sender_id === $userId,
                    'created_at' => $message->created_at,
                    'updated_at' => $message->updated_at,
                ];
            });

            return response()->json([
                'success' => true,
                'messages' => $formattedMessages->reverse()->values(), // Reverse to show oldest first
                'pagination' => [
                    'current_page' => $messages->currentPage(),
                    'last_page' => $messages->lastPage(),
                    'per_page' => $messages->perPage(),
                    'total' => $messages->total(),
                ],
                'chat' => [
                    'chat_id' => $chat->chat_id,
                    'other_user' => $chat->getOtherUser($userId),
                ],
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch messages',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Send a new message
     * Creates chat if it doesn't exist
     */
    public function sendMessage(Request $request)
    {
        try {
            $validated = $request->validate([
                'receiver_id' => 'required|uuid|exists:users,user_id',
                'body' => 'required|string',
                'type' => 'nullable|string|in:text,image,file',
                'item_id' => 'nullable|uuid|exists:products,product_id',
            ]);

            $senderId = $request->user()->user_id;
            $receiverId = $validated['receiver_id'];
            $itemId = $validated['item_id'] ?? null;

            // Check if chat already exists between these two users
            $chat = Chat::where(function($query) use ($senderId, $receiverId) {
                        $query->where('seller_id', $senderId)
                              ->where('buyer_id', $receiverId);
                    })
                    ->orWhere(function($query) use ($senderId, $receiverId) {
                        $query->where('seller_id', $receiverId)
                              ->where('buyer_id', $senderId);
                    })
                    ->when($itemId, function($query) use ($itemId) {
                        return $query->where('item_id', $itemId);
                    })
                    ->first();

            // Create chat if it doesn't exist
            if (!$chat) {
                $chat = Chat::create([
                    'seller_id' => $senderId,
                    'buyer_id' => $receiverId,
                    'item_id' => $itemId,
                    'last_message' => $validated['body'],
                    'last_message_at' => now(),
                ]);
            }

            // Create the message
            $message = Message::create([
                'chat_id' => $chat->chat_id,
                'sender_id' => $senderId,
                'body' => $validated['body'],
                'type' => $validated['type'] ?? 'text',
                'read' => false,
            ]);

            // Update chat's last message
            $chat->update([
                'last_message' => $validated['body'],
                'last_message_at' => now(),
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Message sent successfully',
                'data' => [
                    'message_id' => $message->message_id,
                    'chat_id' => $chat->chat_id,
                    'body' => $message->body,
                    'created_at' => $message->created_at,
                ],
            ], 201);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to send message',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Mark messages as read
     * Marks all unread messages in a chat as read for the current user
     */
    public function markAsRead(Request $request, $chatId)
    {
        try {
            $userId = $request->user()->user_id;

            // Verify user is part of this chat
            $chat = Chat::where('chat_id', $chatId)
                       ->where(function($query) use ($userId) {
                           $query->where('seller_id', $userId)
                                 ->orWhere('buyer_id', $userId);
                       })
                       ->first();

            if (!$chat) {
                return response()->json([
                    'success' => false,
                    'message' => 'Chat not found',
                ], 404);
            }

            // Mark all messages from other user as read
            $updatedCount = Message::where('chat_id', $chatId)
                                   ->where('sender_id', '!=', $userId)
                                   ->where('read', false)
                                   ->update(['read' => true]);

            return response()->json([
                'success' => true,
                'message' => 'Messages marked as read',
                'marked_count' => $updatedCount,
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to mark messages as read',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Delete a specific message
     */
    public function deleteMessage(Request $request, $messageId)
    {
        try {
            $userId = $request->user()->user_id;

            // Find message and verify it belongs to the user
            $message = Message::where('message_id', $messageId)
                             ->where('sender_id', $userId)
                             ->first();

            if (!$message) {
                return response()->json([
                    'success' => false,
                    'message' => 'Message not found or you cannot delete it',
                ], 404);
            }

            $message->delete();

            return response()->json([
                'success' => true,
                'message' => 'Message deleted successfully',
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to delete message',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Delete entire conversation
     */
    public function deleteConversation(Request $request, $chatId)
    {
        try {
            $userId = $request->user()->user_id;

            // Find chat and verify user is part of it
            $chat = Chat::where('chat_id', $chatId)
                       ->where(function($query) use ($userId) {
                           $query->where('seller_id', $userId)
                                 ->orWhere('buyer_id', $userId);
                       })
                       ->first();

            if (!$chat) {
                return response()->json([
                    'success' => false,
                    'message' => 'Chat not found',
                ], 404);
            }

            // Delete all messages and the chat (cascade will handle messages)
            $chat->delete();

            return response()->json([
                'success' => true,
                'message' => 'Conversation deleted successfully',
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to delete conversation',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Get total unread message count for user
     */
    public function getUnreadCount(Request $request)
    {
        try {
            $userId = $request->user()->user_id;

            // Get all chats for user
            $chatIds = Chat::where('seller_id', $userId)
                          ->orWhere('buyer_id', $userId)
                          ->pluck('chat_id');

            // Count unread messages
            $unreadCount = Message::whereIn('chat_id', $chatIds)
                                 ->where('sender_id', '!=', $userId)
                                 ->where('read', false)
                                 ->count();

            return response()->json([
                'success' => true,
                'unread_count' => $unreadCount,
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to get unread count',
                'error' => $e->getMessage(),
            ], 500);
        }
    }






    public function startChat(Request $request)
{
    $validated = $request->validate([
        'product_id' => 'required|uuid|exists:products,product_id',
    ]);

    $me = $request->user()->user_id;

    $product = \App\Models\Product::select('product_id','user_id')
        ->where('product_id', $validated['product_id'])
        ->firstOrFail();

    $sellerId = $product->user_id;

    if ($sellerId === $me) {
        return response()->json([
            'success' => false,
            'message' => 'You cannot chat with yourself on your own product',
        ], 422);
    }

    // find existing chat for same product and same 2 users (either direction)
    $chat = \App\Models\Chat::where('item_id', $product->product_id)
        ->where(function ($q) use ($me, $sellerId) {
            $q->where(function ($q2) use ($me, $sellerId) {
                $q2->where('seller_id', $sellerId)->where('buyer_id', $me);
            })->orWhere(function ($q2) use ($me, $sellerId) {
                $q2->where('seller_id', $me)->where('buyer_id', $sellerId);
            });
        })
        ->first();

    if (!$chat) {
        // Pick a consistent meaning: seller = product owner, buyer = current user
        $chat = \App\Models\Chat::create([
            'seller_id' => $sellerId,
            'buyer_id' => $me,
            'item_id' => $product->product_id,
            'last_message' => null,
            'last_message_at' => now(),
        ]);
    }

    return response()->json([
        'success' => true,
        'chat_id' => $chat->chat_id,
    ], 200);
}

}



