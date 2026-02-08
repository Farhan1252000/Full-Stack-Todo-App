import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Link from 'next/link';
import { validatePassword } from '@/utils/helpers';
import { useAppAuth } from '@/context/AuthContext';

// Define the schema for signup form
const signupSchema = z.object({
  firstName: z.string().min(1, 'First name is required').max(100, 'First name must be less than 100 characters'),
  lastName: z.string().min(1, 'Last name is required').max(100, 'Last name must be less than 100 characters'),
  email: z.string().min(1, 'Email is required').email('Invalid email address'),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/\d/, 'Password must contain at least one number')
    .regex(/[!@#$%^&*(),.?":{}|<>]/, 'Password must contain at least one special character'),
  confirmPassword: z.string().min(1, 'Please confirm your password'),
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type SignupFormData = z.infer<typeof signupSchema>;

interface SignupFormProps {
  onSuccess?: () => void;
}

const SignupForm: React.FC<SignupFormProps> = ({ onSuccess }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { signup } = useAppAuth();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
  });

  const onSubmit = async (data: SignupFormData) => {
    try {
      setError(null);
      await signup({
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        password: data.password,
      });
      onSuccess?.();
    } catch (err: any) {
      setError(err.message || 'An error occurred during authentication');
    }
  };

  // Watch password to show strength indicator
  const password = watch('password') as string;

  return (
    <div className="w-full max-w-md space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Create a new account</h2>
        <p className="mt-2 text-sm text-gray-600">Already have an account? Sign in to your account</p>
      </div>

      {error && (
        <div className="rounded-md bg-red-50 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">{error}</h3>
            </div>
          </div>
        </div>
      )}

      <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-2 gap-4">
          <Input
            label="First name"
            id="firstName"
            type="text"
            autoComplete="given-name"
            error={errors.firstName?.message?.toString()}
            required
            {...register('firstName')}
          />
          <Input
            label="Last name"
            id="lastName"
            type="text"
            autoComplete="family-name"
            error={errors.lastName?.message?.toString()}
            required
            {...register('lastName')}
          />
        </div>

        <Input
          label="Email address"
          id="email"
          type="email"
          autoComplete="username"
          error={errors.email?.message?.toString()}
          required
          {...register('email')}
        />

        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <Input
              label="Password"
              id="password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="new-password"
              error={errors.password?.message?.toString()}
              required
              containerClassName="mb-0"
              {...register('password')}
            />
            <button
              type="button"
              className="absolute right-3 mt-6 text-sm text-gray-500 hover:text-gray-700"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <EyeSlashIcon className="h-5 w-5 text-gray-500" />
              ) : (
                <EyeIcon className="h-5 w-5 text-gray-500" />
              )}
            </button>
          </div>

          {password && (
            <div className="mt-2 text-xs text-gray-500">
              <p>Password must:</p>
              <ul className="ml-4 list-disc space-y-1">
                {password.length >= 8 ? (
                  <li className="text-green-600">Be at least 8 characters</li>
                ) : (
                  <li>Be at least 8 characters</li>
                )}
                {/[A-Z]/.test(password) ? (
                  <li className="text-green-600">Contain an uppercase letter</li>
                ) : (
                  <li>Contain an uppercase letter</li>
                )}
                {/[a-z]/.test(password) ? (
                  <li className="text-green-600">Contain a lowercase letter</li>
                ) : (
                  <li>Contain a lowercase letter</li>
                )}
                {/\d/.test(password) ? (
                  <li className="text-green-600">Contain a number</li>
                ) : (
                  <li>Contain a number</li>
                )}
                {/[!@#$%^&*(),.?":{}|<>]/.test(password) ? (
                  <li className="text-green-600">Contain a special character</li>
                ) : (
                  <li>Contain a special character</li>
                )}
              </ul>
            </div>
          )}
        </div>

        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <Input
              label="Confirm password"
              id="confirmPassword"
              type={showConfirmPassword ? 'text' : 'password'}
              autoComplete="new-password"
              error={errors.confirmPassword?.message?.toString()}
              required
              containerClassName="mb-0"
              {...register('confirmPassword')}
            />
            <button
              type="button"
              className="absolute right-3 mt-6 text-sm text-gray-500 hover:text-gray-700"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? (
                <EyeSlashIcon className="h-5 w-5 text-gray-500" />
              ) : (
                <EyeIcon className="h-5 w-5 text-gray-500" />
              )}
            </button>
          </div>
        </div>

        <div>
          <Button
            type="submit"
            loading={isSubmitting}
            fullWidth
            variant="secondary"
          >
            {isSubmitting ? 'Processing...' : 'Create account'}
          </Button>
        </div>
      </form>

      <div className="text-center text-sm text-gray-500">
        <p>
          Already have an account?{' '}
          <Link href="/login" className="font-semibold text-primary-600 hover:text-primary-500">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignupForm;