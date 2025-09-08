// src/guard/GuestGuard.tsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface GuestGuardProps {
    children: React.ReactNode;
}

export default function GuestGuard({ children }: GuestGuardProps) {
    const { user, loading } = useAuth();
    const navigate = useNavigate();
    const [checked, setChecked] = useState(false);

    useEffect(() => {
        if (!loading) {
            if (user) {
                navigate("/home", { replace: true });
            }
            setChecked(true); // mark that check is done
        }
    }, [user, loading, navigate]);

    if (loading || !checked) return null; // or a spinner

    return <>{children}</>;
}
