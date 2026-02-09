import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import clsx from 'clsx';

// Define schema based on whether it's login or signup
interface AuthFormProps {
  onSubmit: (email: string, password: string, firstName?: string, lastName?: string) => void;
  isLogin: boolean;
  buttonText: string;
}

const AuthForm: React.FC<AuthFormProps> = ({ onSubmit, isLogin, buttonText }) => {
  // Define schema based on form type
  const schema = isLogin
    ? z.object({
        email: z.string().email('Invalid email address'),
        password: z.string().min(6, 'Password must be at least 6 characters'),
      })
    : z.object({
        email: z.string().email('Invalid email address'),
        password: z.string().min(6, 'Password must be at least 6 characters'),
        firstName: z.string().min(1, 'First name is required'),
        lastName: z.string().min(1, 'Last name is required'),
      });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<{
    email: string;
    password: string;
    firstName?: string;
    lastName?: string;
  }>({
    resolver: zodResolver(schema),
  });

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const onFormSubmit = async (data: any) => {
    setLoading(true);
    setErrorMessage(null);
    try {
      if (isLogin) {
        const result = await onSubmit(data.email, data.password);
        if (result && result.error) {
          setErrorMessage(result.error);
        }
      } else {
        const result = await onSubmit(data.email, data.password, data.firstName, data.lastName);
        if (result && result.error) {
          setErrorMessage(result.error);
        }
      }
    } catch (error: any) {
      console.error(isLogin ? 'Login' : 'Signup', 'failed:', error);
      setErrorMessage(error.message || (isLogin ? 'Login failed' : 'Signup failed'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="mt-8 space-y-6" onSubmit={handleSubmit(onFormSubmit)}>
      {errorMessage && (
        <div className="rounded-md bg-red-50 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">{errorMessage}</h3>
            </div>
          </div>
        </div>
      )}
      <div className="rounded-md shadow-sm -space-y-px">
        {!isLogin && (
          <div className="mb-4 grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="firstName" className="sr-only">
                First Name
              </label>
              <input
                id="firstName"
                {...register('firstName')}
                type="text"
                className={clsx(
                  'appearance-none rounded-none relative block w-full px-3 py-2 border',
                  errors.firstName ? 'border-red-300' : 'border-gray-300',
                  'placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm',
                  'rounded-b-md'
                )}
                placeholder="First name"
              />
              {errors.firstName && (
                <p className="mt-1 text-sm text-red-600">{errors.firstName.message as string}</p>
              )}
            </div>
            <div>
              <label htmlFor="lastName" className="sr-only">
                Last Name
              </label>
              <input
                id="lastName"
                {...register('lastName')}
                type="text"
                className={clsx(
                  'appearance-none rounded-none relative block w-full px-3 py-2 border',
                  errors.lastName ? 'border-red-300' : 'border-gray-300',
                  'placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm',
                  'rounded-b-md'
                )}
                placeholder="Last name"
              />
              {errors.lastName && (
                <p className="mt-1 text-sm text-red-600">{errors.lastName.message as string}</p>
              )}
            </div>
          </div>
        )}
        <div>
          <label htmlFor="email-address" className="sr-only">
            Email address
          </label>
          <input
            id="email-address"
            {...register('email')}
            type="email"
            autoComplete="email"
            className={clsx(
              'appearance-none rounded-none relative block w-full px-3 py-2 border',
              errors.email ? 'border-red-300' : 'border-gray-300',
              'placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm',
              isLogin ? 'rounded-b-md' : ''
            )}
            placeholder="Email address"
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-600">{errors.email.message as string}</p>
          )}
        </div>
        <div>
          <label htmlFor="password" className="sr-only">
            Password
          </label>
          <input
            id="password"
            {...register('password')}
            type="password"
            autoComplete="current-password"
            className={clsx(
              'appearance-none rounded-none relative block w-full px-3 py-2 border',
              errors.password ? 'border-red-300' : 'border-gray-300',
              'placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm'
            )}
            placeholder="Password"
          />
          {errors.password && (
            <p className="mt-1 text-sm text-red-600">{errors.password.message as string}</p>
          )}
        </div>
      </div>

      <div>
        <button
          type="submit"
          disabled={loading}
          className={clsx(
            'group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white',
            loading ? 'bg-indigo-400' : 'bg-indigo-600 hover:bg-indigo-700',
            'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
          )}
        >
          {loading ? 'Processing...' : buttonText}
        </button>
      </div>
    </form>
  );
};

export default AuthForm;