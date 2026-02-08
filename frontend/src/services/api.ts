import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';

class ApiService {
  private api: AxiosInstance;
  private refreshTokenPromise: Promise<string> | null = null;

  constructor() {
    this.api = axios.create({
      baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api',
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Request interceptor to add auth token
    this.api.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('authToken');
        if (token && config.headers) {
          config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
      },
      (error: AxiosError) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor to handle token expiration and refresh
    this.api.interceptors.response.use(
      (response: AxiosResponse) => {
        return response;
      },
      async (error: AxiosError) => {
        const originalRequest = error.config;

        // If the error is due to unauthorized access and we have a refresh token
        if (error.response?.status === 401 && !originalRequest?.url?.includes?.('/auth/refresh')) {
          // Prevent multiple refresh requests
          if (!this.refreshTokenPromise) {
            this.refreshTokenPromise = this.handleTokenRefresh();
          }

          try {
            const newToken = await this.refreshTokenPromise;

            // Update the original request with the new token
            if (originalRequest && originalRequest.headers) {
              (originalRequest.headers as any)['Authorization'] = `Bearer ${newToken}`;
            }

            // Reset the refresh promise
            this.refreshTokenPromise = null;

            // Retry the original request
            return this.api(originalRequest as any);
          } catch (refreshError) {
            // Refresh failed, logout the user
            this.handleLogout();
            return Promise.reject(refreshError);
          }
        }

        return Promise.reject(error);
      }
    );
  }

  private async handleTokenRefresh(): Promise<string> {
    // In a real app, this would make an API call to refresh the token
    // For now, we'll return the current token if it exists, or reject
    const refreshToken = localStorage.getItem('refreshToken');

    if (!refreshToken) {
      this.handleLogout();
      throw new Error('No refresh token available');
    }

    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/auth/refresh`, {
        refreshToken,
      });

      const { token } = response.data;
      localStorage.setItem('authToken', token);
      return token;
    } catch (error) {
      this.handleLogout();
      throw error;
    }
  }

  private handleLogout(): void {
    localStorage.removeItem('authToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('userData');

    // In a real app, you might want to trigger a logout action in your auth context
    // window.location.href = '/login';
  }

  // Generic methods
  public get = <T>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> => {
    return this.api.get<T>(url, config);
  };

  public post = <T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> => {
    return this.api.post<T>(url, data, config);
  };

  public put = <T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> => {
    return this.api.put<T>(url, data, config);
  };

  public patch = <T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> => {
    return this.api.patch<T>(url, data, config);
  };

  public delete = <T>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> => {
    return this.api.delete<T>(url, config);
  };
}

export const apiService = new ApiService();

export default ApiService;