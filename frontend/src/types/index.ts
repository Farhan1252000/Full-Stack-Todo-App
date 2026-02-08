// Task Entity
export interface Task {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  createdAt: Date;
  updatedAt: Date;
  dueDate?: Date;
}

// User Entity
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  createdAt: Date;
  lastLoginAt?: Date;
}

// Authentication State
export interface AuthState {
  user: User | null;
  token: string | null;
  isLoggedIn: boolean;
  isLoading: boolean;
}

// Task Filter State
export interface TaskFilterState {
  status: 'all' | 'completed' | 'pending';
  searchQuery: string;
  sortBy: 'createdAt' | 'updatedAt' | 'dueDate' | 'title';
  sortDirection: 'asc' | 'desc';
}

// UI Loading States
export interface GlobalLoadingState {
  isLoading: boolean;
}

export interface TaskOperationLoadingState {
  taskId: string;
  operation: 'create' | 'update' | 'delete' | 'toggle';
  isLoading: boolean;
}

export interface FormLoadingState {
  isLoading: boolean;
}

export interface InitialDataLoadingState {
  isLoading: boolean;
}

// Error State
export interface ErrorState {
  message: string;
  type: 'validation' | 'network' | 'server' | 'auth' | 'unknown';
  field?: string;
  timestamp: Date;
}

// API Response Types
export interface ApiResponse<T> {
  data?: T;
  error?: string;
  success: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Form Types
export interface LoginFormValues {
  email: string;
  password: string;
}

export interface SignupFormValues extends LoginFormValues {
  firstName: string;
  lastName: string;
}

export interface TaskFormValues {
  title: string;
  description?: string;
  dueDate?: Date;
}