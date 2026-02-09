import React, { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { useAppAuth } from '@/context/AuthContext';
import AuthForm from '@/components/auth/AuthForm';

const SignupPage: React.FC = () => {
  const { signup } = useAppAuth();
  const router = useRouter();
  const [isSignedUp, setIsSignedUp] = useState(false);

  const handleSignup = async (email: string, password: string, firstName?: string, lastName?: string) => {
    try {
      await signup({
        email,
        password,
        firstName: firstName || '',
        lastName: lastName || ''
      });
      
      // Show success message instead of redirecting immediately
      setIsSignedUp(true);
    } catch (error) {
      console.error('Signup failed:', error);
      // Handle signup error appropriately
    }
  };

  if (isSignedUp) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <div className="mx-auto h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
              <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
              Account Created Successfully!
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Your account has been created successfully. You can now sign in to your account.
            </p>
          </div>
          <div className="mt-6">
            <Link href="/login" className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
              Go to Sign In
            </Link>
          </div>
          <div className="text-center mt-4">
            <p className="text-sm text-gray-600">
              Back to{' '}
              <Link href="/" className="font-medium text-indigo-600 hover:text-indigo-500">
                Home
              </Link>
            </p>
          </div>
        </div>
      </div>
    );
  }

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