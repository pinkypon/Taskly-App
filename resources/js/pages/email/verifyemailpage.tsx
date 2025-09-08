// VerifyEmail component - Handles email verification process for Taskly app
import { ArrowRight, CheckCircle, Mail, RefreshCw, Clock } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import axios, { csrf } from '../../lib/axios';

export default function VerifyEmail() {
    // Get user data and fetch function from authentication context
    const { user, fetchUser } = useAuth();
    const navigate = useNavigate();

    // Component state management
    const [isVisible, setIsVisible] = useState(false); // Controls fade-in animation
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 }); // Tracks mouse for interactive background
    const [isResending, setIsResending] = useState(false); // Loading state for resend button
    const [resendSuccess, setResendSuccess] = useState(false); // Shows success message after resend
    const [cooldownTime, setCooldownTime] = useState(0); // Cooldown time in seconds
    const [errorMessage, setErrorMessage] = useState(''); // Error message display

    // Initialize component and set up event listeners
    useEffect(() => {
        // Fetch latest user data to check verification status
        fetchUser();

        // Trigger entrance animation after brief delay
        setTimeout(() => setIsVisible(true), 100);

        // Set up mouse tracking for interactive background effects
        const handleMouseMove = (e: MouseEvent) => {
            setMousePosition({ x: e.clientX, y: e.clientY });
        };

        window.addEventListener('mousemove', handleMouseMove);

        // Cleanup event listener on component unmount
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    // Handle navigation for already verified users
    useEffect(() => {
        // Redirect to home page if user's email is already verified
        if (user?.email_verified_at) {
            navigate('/home');
        }
    }, [user, navigate]);

    // Countdown timer effect for cooldown
    useEffect(() => {
        let timer: number;

        if (cooldownTime > 0) {
            timer = setInterval(() => {
                setCooldownTime((prev) => {
                    if (prev <= 1) {
                        setErrorMessage(''); // Clear error message when cooldown ends
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        }

        return () => {
            if (timer) clearInterval(timer);
        };
    }, [cooldownTime]);

    // Format cooldown time for display
    const formatCooldownTime = (seconds: number): string => {
        if (seconds >= 60) {
            const minutes = Math.floor(seconds / 60);
            const remainingSeconds = seconds % 60;
            return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
        }
        return `${seconds}s`;
    };

    // Handle resending verification email
    const resendEmail = async () => {
        // Prevent multiple requests or requests for already verified users or during cooldown
        if (user?.email_verified_at || isResending || cooldownTime > 0) return;

        // Set loading state and clear any previous messages
        setIsResending(true);
        setResendSuccess(false);
        setErrorMessage('');

        try {
            // Get CSRF token for Laravel Sanctum authentication
            await csrf();

            // Send request to Laravel backend to resend verification email
            await axios.post('/api/email/verification-notification');

            // Show success message
            setResendSuccess(true);

            // Refresh user data to check if verification status changed
            await fetchUser();

            // Hide success message after 5 seconds
            setTimeout(() => setResendSuccess(false), 5000);
        } catch (error: any) {
            // Handle rate limiting (429 status code)
            if (error.response?.status === 429) {
                // Extract rate limit info from headers or response
                const retryAfter = error.response.headers['retry-after'] ||
                    error.response.headers['x-ratelimit-reset-after'] ||
                    error.response.data?.retry_after ||
                    60; // Default to 60 seconds if no info available

                setCooldownTime(parseInt(retryAfter));
                setErrorMessage('Too many attempts. Please wait before trying again.');
            } else if (error.response?.status === 422) {
                // Handle validation errors
                setErrorMessage('Unable to send verification email. Please try again later.');
            } else {
                // Handle other errors
                setErrorMessage('Failed to send verification email. Please try again.');
            }

            console.error('Failed to resend verification email:', error);
        } finally {
            // Reset loading state regardless of success or failure
            setIsResending(false);
        }
    };

    // Determine if button should be disabled
    const isButtonDisabled = user?.email_verified_at || isResending || cooldownTime > 0;

    return (
        <div className="via-indigo-80/60 to-blue-80/60 min-h-screen overflow-hidden bg-gradient-to-br from-slate-200">
            {/* Animated background elements with mouse interaction */}
            <div className="absolute inset-0">
                {/* Primary floating gradient orb that follows mouse movement */}
                <div
                    className="absolute top-1/4 left-1/4 h-96 w-96 animate-pulse rounded-full bg-gradient-to-br from-indigo-400/10 via-indigo-500/8 to-blue-500/10 blur-3xl"
                    style={{
                        transform: `translate(${mousePosition.x * 0.02}px, ${mousePosition.y * 0.02}px)`,
                    }}
                ></div>

                {/* Secondary floating gradient orb with opposite mouse movement */}
                <div
                    className="absolute right-1/4 bottom-1/4 h-80 w-80 animate-pulse rounded-full bg-gradient-to-br from-blue-400/10 via-indigo-500/8 to-indigo-600/10 blur-3xl"
                    style={{
                        transform: `translate(${mousePosition.x * -0.01}px, ${mousePosition.y * -0.01}px)`,
                    }}
                ></div>

                {/* Small decorative floating dots with staggered animations */}
                <div className="absolute top-20 right-20 h-4 w-4 animate-bounce rounded-full bg-indigo-300/20" style={{ animationDelay: '1s' }}></div>
                <div
                    className="absolute bottom-32 left-20 h-6 w-6 animate-bounce rounded-full bg-indigo-400/20"
                    style={{ animationDelay: '3s' }}
                ></div>
            </div>

            {/* Main content container */}
            <div className="relative z-10 flex min-h-screen items-center justify-center px-4 py-12">
                <div
                    className={`w-full max-w-md transform transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
                        }`}
                >
                    {/* Application header with logo */}
                    <div className="mb-8 text-center">
                        <div className="mb-6 flex items-center justify-center gap-3">
                            <h1 className="text-4xl font-black text-indigo-900 md:text-4xl">Taskly</h1>
                            <img
                                src="/images/task-logo.png"
                                alt="Logo"
                                className="h-12 w-12 md:h-12 md:w-12"
                                onError={(e) => {
                                    // Hide image if it fails to load
                                    e.currentTarget.style.display = 'none';
                                }}
                            />
                        </div>
                    </div>

                    {/* Main verification form container */}
                    <div className="w-full">
                        <div className="group relative rounded-2xl border border-white/20 bg-white/80 p-8 shadow-xl backdrop-blur-sm transition-all duration-500 hover:shadow-2xl">
                            {/* Hover effect gradient border */}
                            <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-indigo-500/10 to-blue-500/10 opacity-0 transition-opacity duration-500 group-hover:opacity-100"></div>

                            <div className="relative z-10 text-center">
                                {/* Email verification icon */}
                                <div className="mb-6 flex justify-center">
                                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-indigo-100">
                                        <Mail className="h-8 w-8 text-indigo-600" />
                                    </div>
                                </div>

                                {/* Page title */}
                                <h2 className="mb-4 text-2xl font-bold text-gray-800">Verify Your Email</h2>

                                {/* User instructions and email confirmation */}
                                <div className="mb-8 space-y-2">
                                    <p className="text-gray-600">
                                        Hi <span className="font-semibold text-indigo-600">{user?.name}</span>,
                                    </p>
                                    <p className="text-gray-600">
                                        We've sent a verification link to{' '}
                                        <span className="font-semibold text-gray-800">{user?.email}</span>
                                    </p>
                                    <p className="text-sm text-gray-500">
                                        Please check your inbox and click the link to continue.
                                    </p>
                                </div>

                                {/* Success message display after successful resend */}
                                {resendSuccess && (
                                    <div className="mb-6 rounded-xl border border-green-200 bg-green-50/80 p-4 backdrop-blur-sm">
                                        <div className="flex items-center justify-center gap-3">
                                            <CheckCircle className="h-5 w-5 text-green-600" />
                                            <div className="text-sm font-medium text-green-800">
                                                Verification email sent successfully!
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Error message display for rate limiting and other errors */}
                                {errorMessage && (
                                    <div className="mb-6 rounded-xl border border-red-200 bg-red-50/80 p-4 backdrop-blur-sm">
                                        <div className="flex items-center justify-center gap-3">
                                            <Clock className="h-5 w-5 text-red-600" />
                                            <div className="text-sm font-medium text-red-800">
                                                {errorMessage}
                                                {cooldownTime > 0 && (
                                                    <div className="mt-1 text-red-600">
                                                        Try again in {formatCooldownTime(cooldownTime)}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Resend verification email button */}
                                <button
                                    onClick={resendEmail}
                                    disabled={isButtonDisabled}
                                    className="group relative w-full transform overflow-hidden rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 px-6 py-4 text-lg font-semibold text-white transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:shadow-indigo-500/25 disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    {/* Button hover effect gradient overlay */}
                                    <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-blue-500 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>

                                    {/* Dynamic button content based on state */}
                                    <span className="relative flex items-center justify-center">
                                        {isResending ? (
                                            // Loading state with spinner
                                            <>
                                                <div className="mr-2 h-5 w-5 animate-spin rounded-full border-2 border-white/20 border-t-white"></div>
                                                Sending...
                                            </>
                                        ) : user?.email_verified_at ? (
                                            // Already verified state
                                            <>
                                                <CheckCircle className="mr-2 h-5 w-5" />
                                                Email Already Verified
                                            </>
                                        ) : cooldownTime > 0 ? (
                                            // Cooldown state
                                            <>
                                                <Clock className="mr-2 h-5 w-5" />
                                                Wait {formatCooldownTime(cooldownTime)}
                                            </>
                                        ) : (
                                            // Default resend state
                                            <>
                                                <RefreshCw className="mr-2 h-5 w-5 transition-transform group-hover:rotate-180" />
                                                Resend Verification Email
                                            </>
                                        )}
                                    </span>
                                </button>

                                {/* Helper text for users
                                <div className="mt-6 space-y-3 text-sm text-gray-500">
                                    <p>Don't see the email? Check your spam folder.</p>
                                    {cooldownTime === 0 && !errorMessage && (
                                        <p>You can resend the verification email up to 3 times per minute.</p>
                                    )}
                                </div> */}
                            </div>
                        </div>
                    </div>

                    {/* Navigation link back to login page */}
                    <div className="mt-6 text-center">
                        <Link
                            to="/login"
                            className="inline-flex items-center gap-2 text-gray-600 transition-colors hover:text-indigo-600"
                        >
                            ← Back to login
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}