import { CheckCircle, Lock, ArrowRight, Eye, EyeOff, Check, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import axios, { csrf } from '@/lib/axios';

interface FormData {
  email: string;
  token: string;
  password: string;
  password_confirmation: string;
}

interface ValidationErrors {
  general?: string;
  email?: string[];
  password?: string[];
  password_confirmation?: string[];
  token?: string[];
}

// Password Strength Indicator Component
interface PasswordStrengthProps {
  password: string;
  className?: string;
}

interface PasswordRequirement {
  label: string;
  test: (password: string) => boolean;
}

const passwordRequirements: PasswordRequirement[] = [
  {
    label: 'At least 8 characters',
    test: (password) => password.length >= 8
  },
  {
    label: 'Contains lowercase letters',
    test: (password) => /[a-z]/.test(password)
  },
  {
    label: 'Contains uppercase letters',
    test: (password) => /[A-Z]/.test(password)
  },
  {
    label: 'Contains numbers',
    test: (password) => /\d/.test(password)
  },
  {
    label: 'Contains special characters',
    test: (password) => /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)
  }
];

const PasswordStrengthIndicator: React.FC<PasswordStrengthProps> = ({
  password,
  className = ""
}) => {
  // Don't show indicator if password is empty
  if (!password) return null;

  const metRequirements = passwordRequirements.filter(req => req.test(password));
  const strengthPercentage = (metRequirements.length / passwordRequirements.length) * 100;

  const getStrengthColor = () => {
    if (strengthPercentage >= 100) return 'text-green-600';
    if (strengthPercentage >= 80) return 'text-yellow-600';
    if (strengthPercentage >= 60) return 'text-orange-600';
    return 'text-red-600';
  };

  const getStrengthLabel = () => {
    if (strengthPercentage >= 100) return 'Strong';
    if (strengthPercentage >= 80) return 'Good';
    if (strengthPercentage >= 60) return 'Fair';
    return 'Weak';
  };

  const getProgressColor = () => {
    if (strengthPercentage >= 100) return 'bg-green-500';
    if (strengthPercentage >= 80) return 'bg-yellow-500';
    if (strengthPercentage >= 60) return 'bg-orange-500';
    return 'bg-red-500';
  };

  return (
    <div className={`mt-3 space-y-3 ${className}`}>
      {/* Strength Bar and Label */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">Password Strength:</span>
          <span className={`font-medium ${getStrengthColor()}`}>
            {getStrengthLabel()}
          </span>
        </div>

        {/* Progress Bar */}
        <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
          <div
            className={`h-full transition-all duration-300 ${getProgressColor()}`}
            style={{ width: `${strengthPercentage}%` }}
          />
        </div>
      </div>

      {/* Requirements List */}
      <div className="space-y-2">
        <div className="grid grid-cols-1 gap-1">
          {passwordRequirements.map((requirement, index) => {
            const isMet = requirement.test(password);
            return (
              <div
                key={index}
                className="flex items-center gap-2 text-xs"
              >
                <div className={`flex-shrink-0 ${isMet ? 'text-green-600' : 'text-gray-400'}`}>
                  {isMet ? (
                    <Check className="h-3 w-3" />
                  ) : (
                    <X className="h-3 w-3" />
                  )}
                </div>
                <span className={isMet ? 'text-green-600' : 'text-gray-500'}>
                  {requirement.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

// Helper function to check if password meets all requirements
const isPasswordStrong = (password: string): boolean => {
  return passwordRequirements.every(req => req.test(password));
};

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [formData, setFormData] = useState<FormData>({
    email: searchParams.get('email') || '',
    token: searchParams.get('token') || '',
    password: '',
    password_confirmation: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [tokenValidated, setTokenValidated] = useState(false);

  // Set page title on component mount
  useEffect(() => {
    document.title = "Taskly - Reset Password";
  }, []);

  useEffect(() => {
    // Don't validate token if password reset was successful
    if (resetSuccess) return;

    // Redirect if no token or email
    if (!formData.token || !formData.email) {
      navigate('/forgot-password', { replace: true });
      return;
    }

    // Only validate token if not already validated and not successful
    if (!tokenValidated && !resetSuccess) {
      const validateToken = async () => {
        try {
          await csrf();
          await axios.post('/api/password/validate-token', {
            token: formData.token,
            email: formData.email
          });
          setTokenValidated(true);
        } catch (error: any) {
          const message = error?.response?.data?.message || 'Invalid or expired reset link.';
          navigate('/forgot-password', {
            replace: true,
            state: { error: message }
          });
          return;
        }
      };

      validateToken();
    }

    // Trigger animation
    setTimeout(() => setIsVisible(true), 100);

    // Mouse movement handler
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    // Prevent user from going back after successful reset
    const handlePopState = () => {
      if (resetSuccess) {
        navigate('/login', { replace: true });
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('popstate', handlePopState);
    };
  }, [formData.token, formData.email, navigate, resetSuccess, tokenValidated]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear specific error when user starts typing
    if (errors[name as keyof ValidationErrors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const resetPassword = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isResetting) return;

    setIsResetting(true);
    setResetSuccess(false);
    setErrors({});

    try {
      await csrf();
      await axios.post('/api/password/reset', formData);

      setResetSuccess(true);

      // Redirect to login after 3 seconds
      setTimeout(() => {
        navigate('/login', {
          replace: true,
          state: { message: 'Password reset successfully! Please log in with your new password.' }
        });
      }, 3000);
    } catch (error: any) {
      console.error('Password reset failed:', error);

      if (error?.response?.data?.errors) {
        setErrors(error.response.data.errors);
      } else {
        setErrors({
          general: error?.response?.data?.message || 'Password reset failed. Please try again.'
        });
      }
    } finally {
      setIsResetting(false);
    }
  };

  const isFormValid = () => {
    return isPasswordStrong(formData.password) &&
      formData.password === formData.password_confirmation;
  };

  if (resetSuccess) {
    return (
      <div className="min-h-screen overflow-hidden bg-gradient-to-br from-slate-200 via-indigo-80/60 to-blue-80/60 flex items-center justify-center">
        <div className="text-center">
          <div className="mb-6 flex justify-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
              <CheckCircle className="h-12 w-12 text-green-600" />
            </div>
          </div>
          <h2 className="mb-4 text-3xl font-bold text-gray-800">Password Reset Successfully!</h2>
          <p className="text-gray-600 mb-4">Your password has been reset. Redirecting you to login...</p>
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen overflow-hidden bg-gradient-to-br from-slate-200 via-indigo-80/60 to-blue-80/60">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <div
          className="absolute top-1/4 left-1/4 h-96 w-96 animate-pulse rounded-full bg-gradient-to-br from-indigo-400/10 via-indigo-500/8 to-blue-500/10 blur-3xl"
          style={{
            transform: `translate(${mousePosition.x * 0.02}px, ${mousePosition.y * 0.02}px)`,
          }}
        />
        <div
          className="absolute right-1/4 bottom-1/4 h-80 w-80 animate-pulse rounded-full bg-gradient-to-br from-blue-400/10 via-indigo-500/8 to-indigo-600/10 blur-3xl"
          style={{
            transform: `translate(${mousePosition.x * -0.01}px, ${mousePosition.y * -0.01}px)`,
          }}
        />
      </div>

      <div className="relative z-10 flex min-h-screen items-center justify-center px-4 py-12">
        <div
          className={`w-full max-w-md transform transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
            }`}
        >
          {/* Header */}
          <div className="mb-8 text-center">
            <div className="mb-6 flex items-center justify-center gap-3">
              <h1 className="text-4xl font-black text-indigo-900">Taskly</h1>
              <img
                src="/images/task-logo.png"
                alt="Logo"
                className="h-12 w-12"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
            </div>
          </div>

          {/* Form Container */}
          <form onSubmit={resetPassword} className="w-full">
            <div className="group relative rounded-2xl border border-white/20 bg-white/80 p-8 shadow-xl backdrop-blur-sm transition-all duration-500 hover:shadow-2xl">
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-indigo-500/10 to-blue-500/10 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

              <div className="relative z-10">
                {/* Lock Icon */}
                <div className="mb-6 flex justify-center">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-indigo-100">
                    <Lock className="h-8 w-8 text-indigo-600" />
                  </div>
                </div>

                {/* Title */}
                <h2 className="mb-4 text-2xl font-bold text-gray-800 text-center">Set New Password</h2>
                <p className="mb-8 text-gray-600 text-center">Enter your new password below</p>

                {/* General Error */}
                {errors.general && (
                  <div className="mb-6 rounded-xl border border-red-200 bg-red-50/80 p-4 backdrop-blur-sm">
                    <div className="text-sm font-medium text-red-800 text-center">
                      {errors.general}
                    </div>
                  </div>
                )}

                {/* Email Display */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    className="w-full rounded-xl border border-gray-300 bg-gray-100 px-4 py-3 text-gray-600"
                    disabled
                  />
                </div>

                {/* New Password */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    New Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      className={`w-full rounded-xl border px-4 py-3 pr-12 text-gray-900 placeholder-gray-500 transition-all duration-300 focus:outline-none focus:ring-2 ${errors.password
                        ? 'border-red-300 bg-red-50/50 focus:border-red-500 focus:ring-red-500/20'
                        : 'border-gray-300 bg-white/90 focus:border-indigo-500 focus:ring-indigo-500/20'
                        }`}
                      placeholder="Enter new password"
                      disabled={isResetting}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>

                  {/* Password Strength Indicator */}
                  <PasswordStrengthIndicator password={formData.password} />

                  {errors.password && (
                    <p className="mt-1 text-sm text-red-600">{errors.password[0]}</p>
                  )}
                </div>

                {/* Confirm Password */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Confirm New Password
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      name="password_confirmation"
                      value={formData.password_confirmation}
                      onChange={handleInputChange}
                      className={`w-full rounded-xl border px-4 py-3 pr-12 text-gray-900 placeholder-gray-500 transition-all duration-300 focus:outline-none focus:ring-2 ${formData.password_confirmation && formData.password !== formData.password_confirmation
                        ? 'border-red-300 bg-red-50/50 focus:border-red-500 focus:ring-red-500/20'
                        : 'border-gray-300 bg-white/90 focus:border-indigo-500 focus:ring-indigo-500/20'
                        }`}
                      placeholder="Confirm new password"
                      disabled={isResetting}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>

                  {/* Password Match Indicator */}
                  {formData.password_confirmation && (
                    <div className="flex items-center gap-2 text-sm mt-2">
                      {formData.password === formData.password_confirmation ? (
                        <>
                          <Check className="h-4 w-4 text-green-600" />
                          <span className="text-green-600">Passwords match</span>
                        </>
                      ) : (
                        <>
                          <X className="h-4 w-4 text-red-600" />
                          <span className="text-red-600">Passwords don't match</span>
                        </>
                      )}
                    </div>
                  )}
                </div>

                {/* Reset Button */}
                <button
                  type="submit"
                  disabled={isResetting || !isFormValid()}
                  className="group relative w-full transform overflow-hidden rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 px-6 py-4 text-lg font-semibold text-white transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:shadow-indigo-500/25 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-blue-500 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                  <span className="relative flex items-center justify-center">
                    {isResetting ? (
                      <>
                        <div className="mr-2 h-5 w-5 animate-spin rounded-full border-2 border-white/20 border-t-white" />
                        Resetting Password...
                      </>
                    ) : (
                      <>
                        <ArrowRight className="mr-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                        Reset Password
                      </>
                    )}
                  </span>
                </button>
              </div>
            </div>
          </form>

          {/* Back to Login */}
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