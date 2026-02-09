import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { AuthState, User } from '@/types';
import { useAuth } from '@/lib/auth-client';
import { signIn, signUp, signOut } from '@/lib/auth-client';

// Define action types
type AuthAction =
  | { type: 'LOGIN_START' }
  | { type: 'LOGIN_SUCCESS'; payload: { user: User } }
  | { type: 'LOGIN_FAILURE'; payload: string }
  | { type: 'LOGOUT' }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SIGNUP_SUCCESS'; payload: { user: User } };

// Initial state
const initialState: AuthState = {
  user: null,
  token: typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null,
  isLoggedIn: false,
  isLoading: true,
};

// Reducer function
const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'LOGIN_START':
      return {
        ...state,
        isLoading: true,
      };
    case 'LOGIN_SUCCESS':
      return {
        ...state,
        user: action.payload.user,
        isLoggedIn: true,
        isLoading: false,
      };
    case 'LOGIN_FAILURE':
      return {
        ...state,
        user: null,
        isLoggedIn: false,
        isLoading: false,
      };
    case 'SIGNUP_SUCCESS':
      return {
        ...state,
        user: action.payload.user,
        isLoggedIn: true,
        isLoading: false,
      };
    case 'LOGOUT':
      return {
        ...state,
        user: null,
        isLoggedIn: false,
        isLoading: false,
      };
    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.payload,
      };
    default:
      return state;
  }
};

// Create context
interface AuthContextType {
  state: AuthState;
  login: (email: string, password: string) => Promise<void>;
  signup: (userData: { email: string; password: string; firstName: string; lastName: string }) => Promise<void>;
  logout: () => void;
  checkAuthStatus: () => void;
  updateUserProfile: (userData: { firstName: string; lastName: string; email: string }) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provider component
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);
  const { data: session, isLoading: sessionLoading } = useAuth();

  // Check auth status on mount
  useEffect(() => {
    if (session?.user) {
      dispatch({
        type: 'LOGIN_SUCCESS',
        payload: {
          user: session.user as User
        }
      });
    } else {
      dispatch({ type: 'LOGOUT' });
    }
  }, [session]);

  const login = async (email: string, password: string) => {
    dispatch({ type: 'LOGIN_START' });

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirectTo: '/dashboard', // Redirect after login
      });

      if (result?.error) {
        throw new Error(result.error);
      }
    } catch (error: any) {
      dispatch({
        type: 'LOGIN_FAILURE',
        payload: error.message || 'Login failed'
      });
      throw error;
    }
  };

  const signup = async (userData: { email: string; password: string; firstName: string; lastName: string }) => {
    dispatch({ type: 'LOGIN_START' });

    try {
      const result = await signUp({
        email: userData.email,
        password: userData.password,
        firstName: userData.firstName,
        lastName: userData.lastName,
        redirectTo: '/dashboard', // Redirect after signup
      });

      if (result?.error) {
        throw new Error(result.error);
      }

      // Dispatch success action after successful signup
      // The user will be automatically logged in after signup
      // The session will be updated via the useEffect that monitors session changes
    } catch (error: any) {
      dispatch({
        type: 'LOGIN_FAILURE',
        payload: error.message || 'Signup failed'
      });
      throw error;
    }
  };

  const logout = async () => {
    await signOut({ redirectTo: '/login' });
    dispatch({ type: 'LOGOUT' });
  };

  const checkAuthStatus = () => {
    // This function is handled by the useEffect that checks session status
    // The useEffect automatically updates the state based on session status
  };

  const updateUserProfile = async (userData: { firstName: string; lastName: string; email: string }) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update profile');
      }

      const data = await response.json();

      // Update the local state with the new user data
      dispatch({
        type: 'LOGIN_SUCCESS',
        payload: { user: data.user }
      });

      return data;
    } catch (error: any) {
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ state, login, signup, logout, checkAuthStatus, updateUserProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth context
export const useAppAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAppAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;