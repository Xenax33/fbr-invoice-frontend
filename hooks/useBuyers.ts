import { useMutation, useQuery, useQueryClient, UseQueryOptions } from '@tanstack/react-query';
import { buyerService, GetBuyersParams } from '@/services/buyer.service';
import type { Buyer, CreateBuyerRequest, UpdateBuyerRequest, PaginatedResponse } from '@/types/api';
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

// Query keys
export const buyerKeys = {
  all: ['buyers'] as const,
  lists: () => [...buyerKeys.all, 'list'] as const,
  list: (params: GetBuyersParams) => [...buyerKeys.lists(), params] as const,
  details: () => [...buyerKeys.all, 'detail'] as const,
  detail: (id: string) => [...buyerKeys.details(), id] as const,
};

/**
 * Hook to fetch paginated list of buyers
 */
export function useBuyers(params?: GetBuyersParams, options?: Omit<UseQueryOptions<PaginatedResponse<Buyer>>, 'queryKey' | 'queryFn'>) {
  return useQuery<PaginatedResponse<Buyer>>({
    queryKey: buyerKeys.list(params || {}),
    queryFn: () => buyerService.getBuyers(params),
    staleTime: 30 * 60 * 1000, // 30 minutes - buyers rarely change
    ...options,
  });
}

/**
 * Hook to fetch a single buyer by ID
 */
export function useBuyer(id: string) {
  return useQuery({
    queryKey: buyerKeys.detail(id),
    queryFn: () => buyerService.getBuyerById(id),
    enabled: !!id,
  });
}

/**
 * Hook to create a new buyer
 */
export function useCreateBuyer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateBuyerRequest) => buyerService.createBuyer(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: buyerKeys.lists() });
      toast.success('Buyer created successfully');
    },
    onError: (error: unknown) => {
      handleApiError(error, 'Failed to create buyer');
    },
  });
}

/**
 * Hook to update a buyer
 */
export function useUpdateBuyer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateBuyerRequest }) =>
      buyerService.updateBuyer(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: buyerKeys.lists() });
      queryClient.invalidateQueries({ queryKey: buyerKeys.detail(variables.id) });
      toast.success('Buyer updated successfully');
    },
    onError: (error: unknown) => {
      handleApiError(error, 'Failed to update buyer');
    },
  });
}

/**
 * Hook to delete a buyer
 */
export function useDeleteBuyer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => buyerService.deleteBuyer(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: buyerKeys.lists() });
      toast.success('Buyer deleted successfully');
    },
    onError: (error: unknown) => {
      handleApiError(error, 'Failed to delete buyer');
    },
  });
}
