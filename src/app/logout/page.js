'use client';

import { useEffect } from 'react';
import { signOut } from 'next-auth/react';

export default function Logout() {
  useEffect(() => {
    signOut({ callbackUrl: '/login' });
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white font-sans">
      <p>Logging out...</p>
    </div>
  );
}
