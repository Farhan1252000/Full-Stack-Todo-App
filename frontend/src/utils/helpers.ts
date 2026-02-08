/**
 * Format date to a readable string
 * @param date The date to format
 * @returns Formatted date string
 */
export const formatDate = (date: Date): string => {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);
};

/**
 * Format date for display without time
 * @param date The date to format
 * @returns Formatted date string without time
 */
export const formatDateWithoutTime = (date: Date): string => {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  }).format(date);
};

/**
 * Validate email format
 * @param email The email to validate
 * @returns True if email is valid, false otherwise
 */
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validate password strength
 * @param password The password to validate
 * @returns Object with validation results
 */
export const validatePassword = (password: string): { isValid: boolean; reasons: string[] } => {
  const minLength = 8;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumbers = /\d/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

  const reasons: string[] = [];
  if (password.length < minLength) {
    reasons.push(`At least ${minLength} characters`);
  }
  if (!hasUpperCase) {
    reasons.push('At least one uppercase letter');
  }
  if (!hasLowerCase) {
    reasons.push('At least one lowercase letter');
  }
  if (!hasNumbers) {
    reasons.push('At least one number');
  }
  if (!hasSpecialChar) {
    reasons.push('At least one special character');
  }

  return {
    isValid: password.length >= minLength && hasUpperCase && hasLowerCase && hasNumbers && hasSpecialChar,
    reasons
  };
};

/**
 * Debounce a function
 * @param func The function to debounce
 * @param delay The delay in milliseconds
 * @returns Debounced function
 */
export const debounce = <T extends (...args: any[]) => any>(func: T, delay: number): ((...args: Parameters<T>) => void) => {
  let timeoutId: NodeJS.Timeout;
  return (...args: Parameters<T>): void => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
};

/**
 * Capitalize the first letter of a string
 * @param str The string to capitalize
 * @returns String with first letter capitalized
 */
export const capitalizeFirstLetter = (str: string): string => {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
};

/**
 * Truncate text to specified length
 * @param text The text to truncate
 * @param maxLength The maximum length
 * @param suffix The suffix to add when truncated (default: '...')
 * @returns Truncated text
 */
export const truncateText = (text: string, maxLength: number, suffix: string = '...'): string => {
  if (text.length <= maxLength) {
    return text;
  }
  return text.substring(0, maxLength) + suffix;
};

/**
 * Generate a random ID
 * @param length The length of the ID (default: 8)
 * @returns Random ID string
 */
export const generateRandomId = (length: number = 8): string => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

/**
 * Check if a date is in the past
 * @param date The date to check
 * @returns True if date is in the past, false otherwise
 */
export const isPastDate = (date: Date): boolean => {
  const now = new Date();
  return date < now;
};

/**
 * Format error message for display
 * @param error The error object or message
 * @returns Formatted error message
 */
export const formatErrorMessage = (error: any): string => {
  if (typeof error === 'string') {
    return error;
  }
  if (error?.response?.data?.error) {
    return error.response.data.error;
  }
  if (error?.message) {
    return error.message;
  }
  return 'An unexpected error occurred';
};

/**
 * Sleep for a specified number of milliseconds
 * @param ms The number of milliseconds to sleep
 * @returns Promise that resolves after the specified time
 */
export const sleep = (ms: number): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, ms));
};