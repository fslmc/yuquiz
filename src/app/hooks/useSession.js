'use client';

import { useEffect, useState } from 'react';

export function useSession() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSession = async () => {
      try {
        const res = await fetch('/api/auth/session');
        const data = await res.json();
        
        if (data.authenticated) {
          setSession(data.user);
        } else {
          setSession(null);
        }
      } catch (error) {
        console.error('Session fetch error:', error);
        setSession(null);
      } finally {
        setLoading(false);
      }
    };

    fetchSession();
  }, []);

  return { session, loading };
}