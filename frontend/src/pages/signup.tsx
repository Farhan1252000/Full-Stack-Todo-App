import React from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { useAppAuth } from '@/context/AuthContext';
import AuthForm from '@/components/auth/AuthForm';

const SignupPage: React.FC = () => {
  const { signup } = useAppAuth();
  const router = useRouter();

  const handleSignup = async (email: string, password: string, firstName?: string, lastName?: string) => {
    try {
      await signup({
        email,
        password,
        firstName: firstName || '',
        lastName: lastName || ''
      });
      router.push('/dashboard'); // Redirect to dashboard after signup
    } catch (error) {
      console.error('Signup failed:', error);
      // Handle signup error appropriately
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Create a new account
          </h2>
        </div>
        <AuthForm
          onSubmit={(email, password) => handleSignup(email, password)}
          isLogin={false}
          buttonText="Sign up"
        />
        <div className="text-center mt-4">
          <p className="text-sm text-gray-600">
            Already have an account?{' '}
            <Link href="/login" className="font-medium text-indigo-600 hover:text-indigo-500">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;