import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useAppAuth } from '@/context/AuthContext';
import UserProfile from '@/components/layout/UserProfile';

const NavigationHeader: React.FC = () => {
  const router = useRouter();
  const { state, logout } = useAppAuth();

  const isActive = (path: string) => {
    return router.pathname === path;
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link href="/dashboard" className="text-xl font-bold text-primary-600">
                TodoApp
              </Link>
            </div>
            <nav className="ml-6 flex space-x-8" aria-label="Global navigation">
              <Link
                href="/dashboard"
                className={`${
                  isActive('/dashboard')
                    ? 'border-b-2 border-primary-500 text-gray-900'
                    : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
              >
                Dashboard
              </Link>
              <Link
                href="/tasks"
                className={`${
                  isActive('/tasks')
                    ? 'border-b-2 border-primary-500 text-gray-900'
                    : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
              >
                My Tasks
              </Link>
            </nav>
          </div>
          <div className="flex items-center">
            {state.user ? (
              <div className="flex items-center space-x-4">
                <Link
                  href="/profile"
                  className="text-sm font-medium text-gray-500 hover:text-gray-900"
                >
                  Profile
                </Link>
                <button
                  onClick={handleLogout}
                  className="ml-4 text-sm font-medium text-gray-500 hover:text-gray-900"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  href="/login"
                  className="text-sm font-medium text-gray-500 hover:text-gray-900"
                >
                  Sign in
                </Link>
                <Link
                  href="/signup"
                  className="ml-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700"
                >
                  Sign up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default NavigationHeader;