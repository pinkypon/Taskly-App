// File: resources/js/components/AuthOnly.tsx
import React, { ReactNode } from 'react';
import { useAuth } from '../context/AuthContext';

interface Props {
  children: ReactNode;
}

export default function AuthOnly({ children }: Props) {
  const { user, loading } = useAuth();

  if (loading) return null; // or show spinner

  return user ? <>{children}</> : null;
}
