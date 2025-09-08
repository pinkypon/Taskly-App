<?php
namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\ValidationException;
use App\Models\User;
use Illuminate\Support\Facades\Password;
use Illuminate\Validation\Rules\Password as PasswordFacade;
use Illuminate\Auth\Events\PasswordReset;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Carbon\Carbon;

class AuthController extends Controller
{
    // Handle new user registration
    public function register(Request $request)
    {
        // Validate input fields
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255', 'unique:users'],
            'password' => [
                'required',
                'confirmed',
                PasswordFacade::min(8)   // at least 8 characters
                    ->letters()    // must have letters
                    ->mixedCase()  // must have uppercase & lowercase
                    ->numbers()    // must have numbers
                    ->symbols()    // must have special characters
            ],
        ]);

        // Create user record
        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => bcrypt($validated['password']),
        ]);

        // Send email verification
        $user->sendEmailVerificationNotification();

        // Auto-login after registration
        Auth::login($user);
        $request->session()->regenerate();

        return response()->json(['message' => 'Registered and logged in. Please check your email to verify.']);
    }

    // Handle user login
    public function login(Request $request)
    {
        // Validate login fields
        $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        // Attempt login with given credentials
        if (!Auth::attempt($request->only('email', 'password'))) {
            throw ValidationException::withMessages([
                'email' => ['The provided credentials are incorrect.'],
            ]);
        }

        // Prevent session fixation
        $request->session()->regenerate();

        return response()->json(['message' => 'Logged in successfully']);
    }

    // Get currently authenticated user
    public function user(Request $request)
    {
        return response()->json($request->user());
    }

    // Handle user logout
    public function logout(Request $request)
    {
        Auth::guard('web')->logout();

        // Invalidate session and regenerate CSRF token
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return response()->json(['message' => 'Logged out']);
    }

    // Send password reset link to user email
    public function sendResetLinkEmail(Request $request)
    {
        $request->validate([
            'email' => ['required', 'email'],
        ]);

        $status = Password::sendResetLink(
            $request->only('email')
        );

        if ($status == Password::RESET_LINK_SENT) {
            return response()->json([
                'message' => 'Password reset link sent to your email.',
                'status' => $status
            ], 200);
        }

        throw ValidationException::withMessages([
            'email' => [trans($status)],
        ]);
    }

    // Validate reset token without resetting the password
    public function validateResetToken(Request $request)
    {
        $request->validate([
            'token' => 'required',
            'email' => 'required|email',
        ]);

        // Look for reset token in database
        $tokenRecord = DB::table('password_reset_tokens')
            ->where('email', $request->email)
            ->first();

        if (!$tokenRecord) {
            return response()->json([
                'valid' => false,
                'message' => 'Invalid reset token.'
            ], 422);
        }

        // Check if token matches
        if (!Hash::check($request->token, $tokenRecord->token)) {
            return response()->json([
                'valid' => false,
                'message' => 'Invalid reset token.'
            ], 422);
        }

        // Check token expiration (default 60 minutes)
        $tokenAge = Carbon::parse($tokenRecord->created_at);
        $expiryMinutes = config('auth.passwords.users.expire', 60);

        if ($tokenAge->addMinutes($expiryMinutes)->isPast()) {
            // Remove expired token
            DB::table('password_reset_tokens')->where('email', $request->email)->delete();

            return response()->json([
                'valid' => false,
                'message' => 'Reset token has expired. Please request a new one.'
            ], 422);
        }

        return response()->json([
            'valid' => true,
            'message' => 'Token is valid.'
        ]);
    }

    // Reset user password using a valid token
    public function reset(Request $request)
    {
        // Validate fields
        $request->validate([
            'token' => 'required',
            'email' => 'required|email',
            'password' => [
                'required',
                'confirmed',
                PasswordFacade::min(8)   // at least 8 characters
                    ->letters()    // must have letters
                    ->mixedCase()  // must have uppercase & lowercase
                    ->numbers()    // must have numbers
                    ->symbols()    // must have special characters
            ],
        ]);

        // Check token validity first
        $tokenValidation = $this->validateResetToken($request);
        if ($tokenValidation->getStatusCode() !== 200) {
            $data = json_decode($tokenValidation->getContent(), true);
            throw ValidationException::withMessages([
                'email' => [$data['message']],
            ]);
        }

        // Reset password
        $status = Password::reset(
            $request->only('email', 'password', 'password_confirmation', 'token'),
            function ($user) use ($request) {
                $user->forceFill([
                    'password' => Hash::make($request->password),
                    'remember_token' => Str::random(60),
                ])->save();

                // Fire password reset event
                event(new PasswordReset($user));
            }
        );

        if ($status == Password::PASSWORD_RESET) {
            // Remove used reset tokens
            DB::table('password_reset_tokens')->where('email', $request->email)->delete();

            return response()->json([
                'message' => 'Password has been reset successfully.',
                'status' => $status
            ], 200);
        }

        throw ValidationException::withMessages([
            'email' => [trans($status)],
        ]);
    }

    // Optional: Clean up expired reset tokens (can be run via scheduler)
    public function cleanupExpiredTokens()
    {
        $expiryMinutes = config('auth.passwords.users.expire', 60);
        $cutoff = Carbon::now()->subMinutes($expiryMinutes);

        $deleted = DB::table('password_reset_tokens')
            ->where('created_at', '<', $cutoff)
            ->delete();

        return response()->json([
            'message' => "Cleaned up {$deleted} expired tokens."
        ]);
    }
}
