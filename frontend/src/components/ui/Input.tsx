import React, { InputHTMLAttributes } from 'react';
import clsx from 'clsx';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  required?: boolean;
  containerClassName?: string;
}

const Input: React.FC<InputProps> = ({
  label,
  error,
  helperText,
  required,
  containerClassName,
  className,
  ...props
}) => {
  const hasError = !!error;

  return (
    <div className={clsx('space-y-1', containerClassName)}>
      {label && (
        <label htmlFor={props.id} className="block text-sm font-medium text-gray-700">
          {label} {required && <span className="text-danger-500">*</span>}
        </label>
      )}
      <input
        className={clsx(
          'block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm',
          {
            'border-danger-500 focus:border-danger-500 focus:ring-danger-500': hasError,
          },
          className
        )}
        aria-invalid={hasError}
        aria-describedby={hasError ? `${props.id}-error` : undefined}
        {...props}
      />
      {hasError && (
        <p id={`${props.id}-error`} className="mt-1 text-sm text-danger-600">
          {error}
        </p>
      )}
      {!hasError && helperText && (
        <p className="mt-1 text-sm text-gray-500">{helperText}</p>
      )}
    </div>
  );
};

export default Input;