import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import useAuth from './useAuth';

export default function Protected({ children }) {
    const [mounted, setMounted] = useState(false);
    useEffect(() => {
        setMounted(true);
    }, []);

    const router = useRouter();
    const isAuthenticated = useAuth();

    useEffect(() => {
        if (!isAuthenticated) {
            router.push('/login'); // Redirect on server-side
        }
    }, [isAuthenticated]);

    return isAuthenticated ? mounted && children : null;
}
