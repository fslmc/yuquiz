'use client';

import { useSession } from '@/app/hooks/useSession';
import { signOut } from 'next-auth/react';

export default function Profile() {
  const { session, loading } = useSession();

  const handleSignOut = async () => {
    try {
      // The signOut function handles both client-side and server-side session clearing.
      // It makes a POST request to NextAuth's /api/auth/signout endpoint
      // and then redirects the user.
      await signOut({ redirectTo: '/login' });
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white font-sans">
        <p>Loading...</p>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-black text-white font-sans px-4">
        <h2 className="text-3xl font-extrabold text-red-600 mb-6 text-center drop-shadow-lg">
          Not Logged In
        </h2>
        <p className="mb-4">
          You are not logged in. Please{' '}
          <a href="/login" className="text-red-600 hover:underline">
            sign in
          </a>{' '}
          to view your profile.
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-black text-white font-sans px-4">
      <h2 className="text-3xl font-extrabold text-red-600 mb-6 text-center drop-shadow-lg">
        Profile
      </h2>
      <div className="bg-gray-900 p-8 rounded-lg shadow-lg w-full max-w-md">
        <p className="mb-4">
          <strong>Name:</strong> {session.name || 'N/A'}
        </p>
        <p className="mb-4">
          <strong>Email:</strong> {session.email || 'N/A'}
        </p>
        {/* Buttons are now grouped in a flex container for a clean layout */}
        <div className="mt-6 flex flex-col space-y-4">
          <Link
            href="/profile/my_quiz"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white text-center font-semibold py-3 rounded-lg shadow-lg transition-colors"
          >
            My Quizzes
          </Link>
          <button
            onClick={handleSignOut}
            className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3 rounded-lg shadow-lg transition-colors"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}
