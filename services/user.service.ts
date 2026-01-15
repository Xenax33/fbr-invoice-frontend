import axiosInstance from '@/lib/axios';
import type { User } from '@/types/api';

export interface CreateUserRequest {
  name: string;
  email: string;
  businessName: string;
  province: string;
  address: string;
  ntncnic: string;
  password: string;
  postInvoiceTokenTest?: string;
  validateInvoiceTokenTest?: string;
  postInvoiceToken?: string;
  validateInvoiceToken?: string;
}

export interface UpdateUserRequest {
  name?: string;
  email?: string;
  businessName?: string;
  province?: string;
  address?: string;
  ntncnic?: string;
  postInvoiceTokenTest?: string;
  validateInvoiceTokenTest?: string;
  postInvoiceToken?: string;
  validateInvoiceToken?: string;
}

export interface GetUsersParams {
  page?: number;
  limit?: number;
  search?: string;
  role?: 'ADMIN' | 'USER';
  isActive?: boolean;
}

export interface UsersListResponse {
  status: string;
  data: {
    users: User[];
    pagination: {
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    };
  };
}

export interface UserResponse {
  status: string;
  data: {
    user: User;
  };
}

export interface UpdatePasswordRequest {
  password: string;
}

class UserService {
  /**
   * Get all users with pagination and filters (Admin only)
   */
  async getAllUsers(params?: GetUsersParams): Promise<UsersListResponse> {
    const queryParams = new URLSearchParams();
    
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.search) queryParams.append('search', params.search);
    if (params?.role) queryParams.append('role', params.role);
    if (params?.isActive !== undefined) queryParams.append('isActive', params.isActive.toString());
    
    const queryString = queryParams.toString();
    const url = `/users${queryString ? `?${queryString}` : ''}`;
    
    const response = await axiosInstance.get<UsersListResponse>(url);
    return response.data;
  }

  /**
   * Get a specific user by ID (Admin only)
   */
  async getUserById(id: string): Promise<UserResponse> {
    const response = await axiosInstance.get<UserResponse>(`/users/${id}`);
    return response.data;
  }

  /**
   * Create a new user (Admin only)
   */
  async createUser(userData: CreateUserRequest): Promise<UserResponse> {
    const response = await axiosInstance.post<UserResponse>('/users', userData);
    return response.data;
  }

  /**
   * Update user information (Admin only)
   */
  async updateUser(id: string, userData: UpdateUserRequest): Promise<UserResponse> {
    const response = await axiosInstance.patch<UserResponse>(`/users/${id}`, userData);
    return response.data;
  }

  /**
   * Delete a user (Admin only)
   */
  async deleteUser(id: string): Promise<void> {
    await axiosInstance.delete(`/users/${id}`);
  }

  /**
   * Toggle user's active/inactive status (Admin only)
   */
  async toggleUserStatus(id: string): Promise<UserResponse> {
    const response = await axiosInstance.patch<UserResponse>(`/users/${id}/toggle-status`);
    return response.data;
  }

  /**
   * Update user password (Admin only)
   */
  async updateUserPassword(id: string, passwordData: UpdatePasswordRequest): Promise<{ status: string; message: string }> {
    const response = await axiosInstance.patch<{ status: string; message: string }>(
      `/users/${id}/password`,
      passwordData
    );
    return response.data;
  }
}

export const userService = new UserService();
