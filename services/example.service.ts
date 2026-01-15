/**
 * Example API service
 * Create similar services for different resources
 */

import { apiClient } from "@/lib/axios";
import { ApiResponse, PaginatedResponse, PaginationParams } from "@/types/api";

/**
 * Example: User type
 */
export interface User {
  id: string;
  name: string;
  email: string;
  createdAt: string;
}

/**
 * Example API service functions
 */
export const exampleService = {
  /**
   * Get all users with pagination
   */
  getUsers: async (params?: PaginationParams) => {
    const response = await apiClient.get<PaginatedResponse<User>>("/users", {
      params,
    });
    return response.data;
  },

  /**
   * Get user by ID
   */
  getUserById: async (id: string) => {
    const response = await apiClient.get<ApiResponse<User>>(`/users/${id}`);
    return response.data;
  },

  /**
   * Create new user
   */
  createUser: async (data: Omit<User, "id" | "createdAt">) => {
    const response = await apiClient.post<ApiResponse<User>>("/users", data);
    return response.data;
  },

  /**
   * Update user
   */
  updateUser: async (id: string, data: Partial<User>) => {
    const response = await apiClient.put<ApiResponse<User>>(
      `/users/${id}`,
      data
    );
    return response.data;
  },

  /**
   * Delete user
   */
  deleteUser: async (id: string) => {
    const response = await apiClient.delete<ApiResponse<void>>(`/users/${id}`);
    return response.data;
  },
};
