'use client';

import { useSession } from '@/app/hooks/useSession';
import { signOut } from 'next-auth/react';
import Link from 'next/link';

export default function Profile() {
  const { session, loading } = useSession();

  const handleSignOut = async () => {
    try {
      await signOut({ redirectTo: '/login' });
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-foreground">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-highlight mb-4"></div>
          <p className="text-lg">Loading your profile...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background text-foreground px-4 py-8">
        <div className="bg-primary border border-accent rounded-xl p-8 max-w-md w-full text-center">
          <h2 className="text-3xl font-extrabold text-highlight mb-6 drop-shadow-lg">
            Not Logged In
          </h2>
          <p className="mb-6 text-neutral-light">
            You need to be signed in to view your profile
          </p>
          <Link 
            href="/login" 
            className="bg-accent hover:bg-accent-alt text-white font-semibold py-3 px-6 rounded-lg inline-block transition-colors"
          >
            Sign In Now
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background text-foreground px-4 py-8">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="mx-auto bg-primary rounded-full w-24 h-24 flex items-center justify-center mb-4 border-2 border-accent">
            <span className="text-4xl font-bold text-highlight">
              {session.name?.charAt(0) || 'U'}
            </span>
          </div>
          <h2 className="text-3xl font-extrabold text-highlight drop-shadow-lg">
            Your Profile
          </h2>
          <p className="text-neutral-light-alt mt-2">
            Manage your account and activities
          </p>
        </div>
        
        <div className="bg-primary rounded-xl border border-accent shadow-lg p-6 mb-8">
          <div className="mb-6 pb-4 border-b border-accent">
            <h3 className="text-lg font-bold text-highlight mb-2">Account Info</h3>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-neutral-light-alt">Name</p>
                <p className="font-medium text-neutral-light">{session.name || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-neutral-light-alt">Email</p>
                <p className="font-medium text-neutral-light">{session.email || 'N/A'}</p>
              </div>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-bold text-highlight mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <Link
                href="/profile/my_quiz"
                className="block w-full bg-wine hover:bg-wine-alt text-neutral-light text-center font-semibold py-3 rounded-lg transition-colors"
              >
                My Quizzes
              </Link>
              <Link
                href="/result"
                className="block w-full bg-wine hover:bg-wine-alt text-neutral-light text-center font-semibold py-3 rounded-lg transition-colors"
              >
                My Records
              </Link>
            </div>
          </div>
        </div>
        
        <div className="text-center">
          <button
            onClick={handleSignOut}
            className="w-full max-w-xs mx-auto bg-accent hover:bg-accent-alt text-white font-semibold py-3 rounded-lg shadow-lg transition-colors"
          >
            Sign Out
          </button>
          <p className="text-neutral-light-alt text-sm mt-4">
            Signed in as {session.email}
          </p>
        </div>
      </div>
    </div>
  );
}