import React from 'react';
import { useRouter } from 'next/router';
import { useAppAuth } from '@/context/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { state } = useAppAuth();
  const router = useRouter();

  // Show loading state while checking auth status
  if (state.isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!state.isLoggedIn) {
    // Store the attempted route for redirect after login
    const returnUrl = typeof window !== 'undefined' ? window.location.pathname : '/';
    void router.push(`/login?return=${encodeURIComponent(returnUrl)}`);
    return null; // Return null while redirecting
  }

  // Render children if authenticated
  return <>{children}</>;
};

export default ProtectedRoute;