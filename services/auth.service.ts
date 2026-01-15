import axiosInstance from '@/lib/axios';
import { LoginRequest, LoginResponse, RefreshTokenResponse, ProfileResponse } from '@/types/api';
import Cookies from 'js-cookie';

/**
 * Authentication Service
 * Handles all authentication-related API calls
 */
export const authService = {
  /**
   * Login user
   */
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    const response = await axiosInstance.post<LoginResponse>(
      '/v1/auth/login',
      credentials
    );
    
    // Store tokens in cookies (httpOnly would be better but requires server-side)
    const { accessToken, refreshToken, user } = response.data.data;
    
    // Set cookies with appropriate expiry
    Cookies.set('accessToken', accessToken, { 
      expires: 1, // 1 day
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict'
    });
    
    Cookies.set('refreshToken', refreshToken, { 
      expires: 7, // 7 days
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict'
    });
    
    // Store user data
    Cookies.set('user', JSON.stringify(user), { 
      expires: 7,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict'
    });
    
    return response.data;
  },

  /**
   * Logout user
   */
  async logout(): Promise<void> {
    try {
      const refreshToken = Cookies.get('refreshToken');
      if (refreshToken) {
        await axiosInstance.post('/v1/auth/logout', { refreshToken });
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Always clear local data
      Cookies.remove('accessToken');
      Cookies.remove('refreshToken');
      Cookies.remove('user');
    }
  },

  /**
   * Refresh access token
   */
  async refreshToken(): Promise<string> {
    const refreshToken = Cookies.get('refreshToken');
    
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }
    
    const response = await axiosInstance.post<RefreshTokenResponse>(
      '/v1/auth/refresh',
      { refreshToken }
    );
    
    const { accessToken } = response.data.data;
    
    Cookies.set('accessToken', accessToken, { 
      expires: 1,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict'
    });
    
    return accessToken;
  },

  /**
   * Get user profile
   */
  async getProfile(): Promise<ProfileResponse> {
    const response = await axiosInstance.get<ProfileResponse>('/v1/auth/profile');
    
    // Update stored user data
    const { user } = response.data.data;
    Cookies.set('user', JSON.stringify(user), { 
      expires: 7,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict'
    });
    
    return response.data;
  },

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    return !!Cookies.get('accessToken');
  },

  /**
   * Get current user from cookies
   */
  getCurrentUser() {
    const userStr = Cookies.get('user');
    if (userStr) {
      try {
        return JSON.parse(userStr);
      } catch {
        return null;
      }
    }
    return null;
  },

  /**
   * Get access token
   */
  getAccessToken(): string | undefined {
    return Cookies.get('accessToken');
  },
};
