import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { userService, GetUsersParams, CreateUserRequest, UpdateUserRequest } from "@/services/user.service";
import toast from 'react-hot-toast';

// Helper function to handle API errors with validation messages
const handleApiError = (error: unknown, defaultMessage: string) => {
  const response = error && typeof error === 'object' && 'response' in error && error.response && typeof error.response === 'object' && 'data' in error.response ? error.response.data : null;
  
  // Check for validation errors array
  if (response && typeof response === 'object' && 'errors' in response && Array.isArray(response.errors)) {
    // Show each validation error
    response.errors.forEach((err: { field: string; message: string }) => {
      toast.error(`${err.field}: ${err.message}`);
    });
  } else {
    // Show general error message
    const message = response && typeof response === 'object' && 'message' in response && typeof response.message === 'string' ? response.message : defaultMessage;
    toast.error(message);
  }
};

/**
 * Query keys for React Query cache management
 */
export const userKeys = {
  all: ["users"] as const,
  lists: () => [...userKeys.all, "list"] as const,
  list: (params?: GetUsersParams) => [...userKeys.lists(), params] as const,
  details: () => [...userKeys.all, "detail"] as const,
  detail: (id: string) => [...userKeys.details(), id] as const,
};

/**
 * Hook to fetch users list (Admin only)
 */
export function useUsers(params?: GetUsersParams) {
  return useQuery({
    queryKey: userKeys.list(params),
    queryFn: () => userService.getAllUsers(params),
    staleTime: 30 * 1000, // 30 seconds
  });
}

/**
 * Hook to fetch single user (Admin only)
 */
export function useUser(id: string) {
  return useQuery({
    queryKey: userKeys.detail(id),
    queryFn: () => userService.getUserById(id),
    enabled: !!id,
  });
}

/**
 * Hook to create user (Admin only)
 */
export function useCreateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateUserRequest) => userService.createUser(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
      toast.success('User created successfully');
    },
    onError: (error: unknown) => {
      handleApiError(error, 'Failed to create user');
    },
  });
}

/**
 * Hook to update user (Admin only)
 */
export function useUpdateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateUserRequest }) =>
      userService.updateUser(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: userKeys.detail(variables.id) });
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
      toast.success('User updated successfully');
    },
    onError: (error: unknown) => {
      handleApiError(error, 'Failed to update user');
    },
  });
}

/**
 * Hook to delete user (Admin only)
 */
export function useDeleteUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => userService.deleteUser(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
      toast.success('User deleted successfully');
    },
    onError: (error: unknown) => {
      handleApiError(error, 'Failed to delete user');
    },
  });
}

/**
 * Hook to toggle user status (Admin only)
 */
export function useToggleUserStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => userService.toggleUserStatus(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: userKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
      toast.success('User status updated successfully');
    },
    onError: (error: unknown) => {
      handleApiError(error, 'Failed to update user status');
    },
  });
}

/**
 * Hook to update user password (Admin only)
 */
export function useUpdateUserPassword() {
  return useMutation({
    mutationFn: ({ id, password }: { id: string; password: string }) =>
      userService.updateUserPassword(id, { password }),
    onSuccess: () => {
      toast.success('Password updated successfully');
    },
    onError: (error: unknown) => {
      handleApiError(error, 'Failed to update password');
    },
  });
}
