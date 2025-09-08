// src/guard/VerifyEmailGuard.tsx
import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function VerifyEmailGuard({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();

  if (loading) return null;

  if (!user) return <Navigate to="/login" replace />;

  if (user.email_verified_at) {
    // Already verified → redirect to home
    return <Navigate to="/home" replace />;
  }

  return <>{children}</>;
}
