<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\TaskController;
use Illuminate\Support\Facades\DB;
use Illuminate\Foundation\Auth\EmailVerificationRequest;


/*
|--------------------------------------------------------------------------
| Public API Routes
|--------------------------------------------------------------------------
| These routes are accessible without authentication.
| Example: fetching user session, handling password reset, etc.
*/

// Return the authenticated user if logged in, otherwise null
Route::middleware(['ajax.only'])->get('/user', function (Request $request) {
    return $request->user() ?? null;
});

// Guest-only routes for password reset flow
Route::middleware('guest')->group(function () {
    Route::post('/password/email', [AuthController::class, 'sendResetLinkEmail']);   // Send reset link
    Route::post('/password/validate-token', [AuthController::class, 'validateResetToken']); // Validate token
    Route::post('/password/reset', [AuthController::class, 'reset']);                // Reset password
});

/*
|--------------------------------------------------------------------------
| Email Verification Routes
|--------------------------------------------------------------------------
| These routes require the user to be authenticated.
| They handle verifying email status and resending verification links.
*/
Route::middleware(['auth:sanctum'])->group(function () {
    Route::get('/email/verify', function (Request $request) {
        return [
            'email_verified' => $request->user()->hasVerifiedEmail(),
        ];
    });

    // Add throttle middleware for verification notification endpoint
    Route::post('/email/verification-notification', function (Request $request) {
        if ($request->user()->hasVerifiedEmail()) {
            return response()->json(['message' => 'Already verified']);
        }

        try {
            $request->user()->sendEmailVerificationNotification();
            return response()->json(['message' => 'Verification link sent']);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to send verification email',
                'error' => $e->getMessage(),
                'file' => $e->getFile(),
                'line' => $e->getLine(),
            ], 500);
        }
    })->middleware('throttle:3,1'); // 3 requests per 1 minute
});


/*
|--------------------------------------------------------------------------
| Protected API Routes
|--------------------------------------------------------------------------
| These routes require authentication, AJAX requests, and verified email.
| Example: Logout, Task CRUD operations, and analytics.
*/
Route::middleware(['auth:sanctum', 'verified', 'ajax.only'])->group(function () {
    // ✅ Get the authenticated user
    // ✅ Logout
    Route::post('/logout', [AuthController::class, 'logout']);

    // ✅ Task CRUD
    Route::get('/tasks', [TaskController::class, 'index']);
    Route::post('/tasks', [TaskController::class, 'store']);

    // ✅ NEW: Optimized single call
    Route::get('/tasks/dashboard-data', [TaskController::class, 'dashboardData']);

    // ✅ LEGACY: Individual endpoints (for backward compatibility)
    Route::get('/tasks/bar-chart', [TaskController::class, 'barChart']);
    Route::get('/tasks/status-counts', [TaskController::class, 'getTaskStatusCounts']);
    Route::get('/tasks/priority-counts', [TaskController::class, 'priorityCounts']);
    Route::get('/tasks/productivity', [TaskController::class, 'productivityStats']);

    // Individual task operations
    Route::get('/tasks/{task}', [TaskController::class, 'show']);
    Route::put('/tasks/{task}', [TaskController::class, 'update']);
    Route::delete('/tasks/{task}', [TaskController::class, 'destroy']);
});
