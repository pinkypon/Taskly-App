<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use Illuminate\Support\Facades\Auth;
use Illuminate\Foundation\Auth\EmailVerificationRequest;


// Test route for rendering a Blade email view
Route::get('/bokbok', function () {
    return view('emails.das');
});

// API endpoint to check authentication status and return user data
Route::get('/test-auth', function () {
    return response()->json(['auth' => Auth::check(), 'user' => Auth::user()]);
});

// Stub route for CSRF cookie initialization (used by Sanctum)
Route::get('/sanctum/csrf-cookie', function () {
    return response()->json(['message' => 'CSRF cookie set']);
});

// Handle email verification callback
Route::get('/email/verify/{id}/{hash}', function (EmailVerificationRequest $request) {
    $request->fulfill(); // Mark user as verified
    return redirect(env('APP_URL') . '/home'); // Redirect to SPA home
})->middleware(['auth', 'signed'])->name('verification.verify');



// Main group for web routes
Route::middleware(['web'])->group(function () {

    // Authentication endpoints (login and register)
    Route::post('/login', [AuthController::class, 'login'])->name('login');
    Route::post('/register', [AuthController::class, 'register']);

    // SPA fallback: all unmatched routes are served by React app
    Route::middleware('nocache')->group(function () {
        Route::get('/{any}', function () {
            return view('app'); // React SPA entrypoint (resources/views/app.blade.php)
        })->where('any', '.*'); // Match all routes
    });
});
