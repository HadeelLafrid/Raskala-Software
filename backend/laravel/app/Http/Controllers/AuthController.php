<?php
namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    public function signup(Request $request)
    {
        try {
            $validated = $request->validate([
                'userName' => 'required|string|min:3|max:255',
                'email' => 'required|email|unique:users,email',
                'password' => [
                    'required',
                    'string',
                    'min:8',
                    'regex:/[a-z]/',
                    'regex:/[A-Z]/',
                    'regex:/[0-9]/',
                ],
                'confirmPassword' => 'required|same:password',
                'phoneNumber' => 'required|string|min:10',
                'location_id' => 'required|uuid|exists:locations,location_id',
            ], [
                'userName.required' => 'User name is required',
                'userName.min' => 'User name must be at least 3 characters',
                'email.required' => 'Email is required',
                'email.email' => 'Please enter a valid email address',
                'email.unique' => 'This email is already registered',
                'password.required' => 'Password is required',
                'password.min' => 'Password must be at least 8 characters',
                'password.regex' => 'Password must contain uppercase, lowercase, and number',
                'confirmPassword.required' => 'Please confirm your password',
                'confirmPassword.same' => 'Passwords do not match',
                'phoneNumber.required' => 'Phone number is required',
                'phoneNumber.min' => 'Phone number must be at least 10 digits',
                'location_id.required' => 'Location is required',
                'location_id.exists' => 'Selected location is invalid',
            ]);

            $user = User::create([
                'name' => $validated['userName'],
                'email' => $validated['email'],
                'password' => Hash::make($validated['password']),
                'phone' => $validated['phoneNumber'],
                'location_id' => $validated['location_id'],
                'is_active' => true,
                'role' => 'user',
            ]);

            return response()->json([
                'success' => true,
                'message' => 'User registered successfully! Please login.',
                'user' => [
                    'user_id' => $user->user_id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'role' => $user->role,
                    'location_id' => $user->location_id,
                ]
            ], 201);

        } catch (ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Registration failed',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function login(Request $request)
    {
        try {
            $validated = $request->validate([
                'email' => 'required|email',
                'password' => 'required|string|min:6',
            ], [
                'email.required' => 'Email is required',
                'email.email' => 'Please enter a valid email address',
                'password.required' => 'Password is required',
                'password.min' => 'Password must be at least 6 characters',
            ]);

            $user = User::where('email', $validated['email'])->first();

            if (!$user || !Hash::check($validated['password'], $user->password)) {
                return response()->json([
                    'success' => false,
                    'message' => 'Invalid email or password',
                    'errors' => [
                        'email' => ['Invalid email or password'],
                        'password' => ['Invalid email or password']
                    ]
                ], 401);
            }

            if (!$user->is_active) {
                return response()->json([
                    'success' => false,
                    'message' => 'Your account has been deactivated. Please contact support.',
                    'errors' => [
                        'email' => ['Account is deactivated']
                    ]
                ], 403);
            }

            $token = $user->createToken('auth_token')->plainTextToken;

            return response()->json([
                'success' => true,
                'message' => 'Login successful',
                'token' => $token,
                'user' => [
                    'user_id' => $user->user_id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'role' => $user->role,
                    'phone' => $user->phone,
                    'profile_photo' => $user->profile_photo,
                    'location_id' => $user->location_id,
                    'about' => $user->about,
                    'is_active' => $user->is_active,
                ]
            ], 200);

        } catch (ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Login failed',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function logout(Request $request)
    {
        try {
            $request->user()->currentAccessToken()->delete();
            return response()->json([
                'success' => true,
                'message' => 'Logged out successfully'
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Logout failed',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}