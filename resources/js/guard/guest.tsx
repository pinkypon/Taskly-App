// File: resources/js/components/GuestOnly.tsx
import React, { ReactNode } from 'react';
import { useAuth } from '../context/AuthContext';

interface Props {
  children: ReactNode;
}

export default function GuestOnly({ children }: Props) {
  const { user, loading } = useAuth();

  if (loading) return null;

  return !user ? <>{children}</> : null;
}
