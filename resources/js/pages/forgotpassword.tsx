// ForgotPassword component - Handles password reset email requests with rate limiting
import { CheckCircle, Mail, ArrowRight } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios, { csrf } from '@/lib/axios';

export default function ForgotPassword() {
  // Component animation and UI state
  const [isVisible, setIsVisible] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  // Form state management
  const [email, setEmail] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [sendSuccess, setSendSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Rate limiting countdown state
  const [cooldownSeconds, setCooldownSeconds] = useState(0);

  // Initialize component animations and event listeners
  useEffect(() => {
    // Set page title and trigger entrance animation
    document.title = "Taskly - Forgot Password";
    setTimeout(() => setIsVisible(true), 100);

    // Set up mouse tracking for interactive background effects
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Handle cooldown timer countdown
  useEffect(() => {
    if (cooldownSeconds > 0) {
      const timer = setTimeout(() => setCooldownSeconds(cooldownSeconds - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [cooldownSeconds]);

  // Send password reset email to Laravel backend
  const sendResetEmail = async () => {
    // Prevent sending if already in progress, email is empty, or in cooldown
    if (isSending || !email.trim() || cooldownSeconds > 0) return;

    // Reset states and start loading
    setIsSending(true);
    setSendSuccess(false);
    setErrorMessage('');

    try {
      // Get CSRF token for Laravel Sanctum authentication
      await csrf();

      // Send password reset request to Laravel
      await axios.post('/api/password/email', {
        email: email.trim()
      });

      // Show success message and auto-hide after 5 seconds
      setSendSuccess(true);
      setTimeout(() => setSendSuccess(false), 5000);

      // Start cooldown period (60 seconds to match Laravel config)
      setCooldownSeconds(60);

    } catch (error: any) {
      console.error('Failed to send reset email:', error);
      console.log('Response data:', error.response?.data); // Debug information

      // Handle different types of errors
      const errorData = error.response?.data;

      if (error.response?.status === 422) {
        // Rate limiting or validation error
        if (errorData?.message?.includes('throttle') || errorData?.message?.includes('too many')) {
          setErrorMessage('Please wait before requesting another reset email. You can only request one per minute.');
          setCooldownSeconds(60); // Start cooldown on rate limit
        } else {
          setErrorMessage(errorData?.message || 'Please check your email address and try again.');
        }
      } else {
        // Other errors (network, server, etc.)
        setErrorMessage('Failed to send reset email. Please check your internet connection and try again.');
      }
    } finally {
      setIsSending(false);
    }
  };

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

          {/* Password reset form container */}
          <div className="w-full">
            <div className="group relative rounded-2xl border border-white/20 bg-white/80 p-8 shadow-xl backdrop-blur-sm transition-all duration-500 hover:shadow-2xl">
              {/* Hover effect gradient border */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-indigo-500/10 to-blue-500/10 opacity-0 transition-opacity duration-500 group-hover:opacity-100"></div>

              <div className="relative z-10 text-center">
                {/* Password reset icon */}
                <div className="mb-6 flex justify-center">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-indigo-100">
                    <Mail className="h-8 w-8 text-indigo-600" />
                  </div>
                </div>

                {/* Page title */}
                <h2 className="mb-4 text-2xl font-bold text-gray-800">Reset Your Password</h2>

                {/* User instructions */}
                <div className="mb-8 space-y-2">
                  <p className="text-gray-600">
                    Enter your email address below.
                  </p>
                  <p className="text-sm text-gray-500">
                    We'll send you a link to reset your password.
                  </p>
                </div>

                {/* Email input field */}
                <div className="mb-6">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full rounded-xl border border-gray-300 bg-white/90 px-4 py-3 text-gray-900 placeholder-gray-500 backdrop-blur-sm transition-all duration-300 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                    placeholder="Enter your email address"
                    disabled={isSending}
                    required
                    onKeyPress={(e) => e.key === 'Enter' && sendResetEmail()}
                  />
                </div>

                {/* Success message display after successful email send */}
                {sendSuccess && (
                  <div className="mb-6 rounded-xl border border-green-200 bg-green-50/80 p-4 backdrop-blur-sm">
                    <div className="flex items-center justify-center gap-3">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      <div className="text-sm font-medium text-green-800">
                        Reset link sent successfully! Check your email.
                      </div>
                    </div>
                  </div>
                )}

                {/* Error message display for failed requests */}
                {errorMessage && (
                  <div className="mb-6 rounded-xl border border-red-200 bg-red-50/80 p-4 backdrop-blur-sm">
                    <div className="flex items-center justify-center gap-3">
                      <div className="text-sm font-medium text-red-800">
                        {errorMessage}
                      </div>
                    </div>
                  </div>
                )}

                {/* Send reset email button */}
                <button
                  onClick={sendResetEmail}
                  disabled={isSending || !email.trim() || cooldownSeconds > 0}
                  className="group relative w-full transform overflow-hidden rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 px-6 py-4 text-lg font-semibold text-white transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:shadow-indigo-500/25 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {/* Button hover effect gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-blue-500 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>

                  {/* Dynamic button content based on state */}
                  <span className="relative flex items-center justify-center">
                    {isSending ? (
                      // Loading state with spinner
                      <>
                        <div className="mr-2 h-5 w-5 animate-spin rounded-full border-2 border-white/20 border-t-white"></div>
                        Sending...
                      </>
                    ) : cooldownSeconds > 0 ? (
                      // Cooldown state with countdown timer
                      <>
                        Wait {cooldownSeconds}s
                      </>
                    ) : (
                      // Default send state
                      <>
                        <ArrowRight className="mr-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                        Send Reset Link
                      </>
                    )}
                  </span>
                </button>

                {/* Helper text for users */}
                <div className="mt-6 space-y-3 text-sm text-gray-500">
                  <p>Don't see the email? Check your spam folder.</p>
                  {cooldownSeconds > 0 && (
                    <p className="text-indigo-600">
                      Rate limit active. You can request another email in {cooldownSeconds} seconds.
                    </p>
                  )}
                </div>
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