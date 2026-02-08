import { apiService } from './api';
import { User, LoginFormValues, SignupFormValues } from '@/types';

interface LoginResponse {
  user: User;
  token: string;
}

interface SignupResponse {
  user: User;
  token: string;
}

class AuthService {
  /**
   * Login a user
   */
  async login(credentials: LoginFormValues): Promise<LoginResponse> {
    try {
      const response = await apiService.post<LoginResponse>('/auth/login', credentials);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Login failed');
    }
  }

  /**
   * Register a new user
   */
  async signup(userData: SignupFormValues): Promise<SignupResponse> {
    try {
      const response = await apiService.post<SignupResponse>('/auth/register', userData);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Registration failed');
    }
  }

  /**
   * Logout the current user
   */
  async logout(): Promise<void> {
    // In a real app, you might want to notify the backend about logout
    // Clear local storage
    localStorage.removeItem('authToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('userData');
  }

  /**
   * Check if the user is authenticated
   */
  isAuthenticated(): boolean {
    const token = localStorage.getItem('authToken');
    return !!token;
  }

  /**
   * Get the current user from local storage
   */
  getCurrentUser(): User | null {
    const userData = localStorage.getItem('userData');
    if (userData) {
      try {
        return JSON.parse(userData);
      } catch (error) {
        console.error('Failed to parse user data:', error);
        return null;
      }
    }
    return null;
  }

  /**
   * Get the current auth token
   */
  getToken(): string | null {
    return localStorage.getItem('authToken');
  }

  /**
   * Save user data to local storage
   */
  saveUserData(user: User, token: string): void {
    localStorage.setItem('userData', JSON.stringify(user));
    localStorage.setItem('authToken', token);
  }
}

export const authService = new AuthService();

export default AuthService;