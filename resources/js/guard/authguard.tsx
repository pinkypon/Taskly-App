// src/guard/AuthGuard.tsx
import { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function AuthGuard({ children }: { children: ReactNode }) {
    const { user, loading } = useAuth();
    const location = useLocation();

    if (loading) return null; // or spinner

    if (!user) {
        // Not authenticated → redirect to login
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    if (!user.email_verified_at) {
        // Logged in but not verified → redirect to verify page
        return <Navigate to="/verify-email" replace />;
    }

    // Authenticated + verified → allow access
    return <>{children}</>;
}
