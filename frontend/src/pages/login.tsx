import React from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { useAppAuth } from '@/context/AuthContext';
import AuthForm from '@/components/auth/AuthForm';

const LoginPage: React.FC = () => {
  const { login } = useAppAuth();
  const router = useRouter();

  const handleLogin = async (email: string, password: string) => {
    try {
      await login(email, password);
      router.push('/dashboard'); // Redirect to dashboard after login
    } catch (error) {
      console.error('Login failed:', error);
      // Handle login error appropriately
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Sign in to your account
          </h2>
        </div>
        <AuthForm
          onSubmit={handleLogin}
          isLogin={true}
          buttonText="Sign in"
        />
        <div className="text-center mt-4">
          <p className="text-sm text-gray-600">
            Don't have an account?{' '}
            <Link href="/signup" className="font-medium text-indigo-600 hover:text-indigo-500">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;