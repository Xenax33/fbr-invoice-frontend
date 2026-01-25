import { useMutation, useQuery, useQueryClient, UseQueryOptions } from '@tanstack/react-query';
import { hsCodeService, GetHSCodesParams } from '@/services/hsCode.service';
import type { HSCode, CreateHSCodeRequest, BulkCreateHSCodeRequest, BulkCreateHSCodeResponse, UpdateHSCodeRequest, PaginatedResponse } from '@/types/api';
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
export const hsCodeKeys = {
  all: ['hsCodes'] as const,
  lists: () => [...hsCodeKeys.all, 'list'] as const,
  list: (params: GetHSCodesParams) => [...hsCodeKeys.lists(), params] as const,
  details: () => [...hsCodeKeys.all, 'detail'] as const,
  detail: (id: string) => [...hsCodeKeys.details(), id] as const,
};

/**
 * Hook to fetch paginated list of HS codes
 */
export function useHSCodes(params?: GetHSCodesParams, options?: Omit<UseQueryOptions<PaginatedResponse<HSCode>>, 'queryKey' | 'queryFn'>) {
  return useQuery<PaginatedResponse<HSCode>>({
    queryKey: hsCodeKeys.list(params || {}),
    queryFn: () => hsCodeService.getHSCodes(params),
    staleTime: 30 * 60 * 1000, // 30 minutes - HS codes rarely change
    ...options,
  });
}

/**
 * Hook to fetch a single HS code by ID
 */
export function useHSCode(id: string) {
  return useQuery({
    queryKey: hsCodeKeys.detail(id),
    queryFn: () => hsCodeService.getHSCodeById(id),
    enabled: !!id,
  });
}

/**
 * Hook to create a new HS code (supports both single and bulk)
 */
export function useCreateHSCode() {
  const queryClient = useQueryClient();

  return useMutation<HSCode | BulkCreateHSCodeResponse, Error, CreateHSCodeRequest | BulkCreateHSCodeRequest>({
    mutationFn: (data) => hsCodeService.createHSCode(data),
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: hsCodeKeys.lists() });
      
      // Check if bulk response
      if ('summary' in result) {
        const { created, failed } = result.summary;
        if (failed > 0) {
          toast.success(`${created} HS codes created successfully. ${failed} failed.`);
        } else {
          toast.success(`${created} HS codes created successfully`);
        }
      } else {
        toast.success('HS Code created successfully');
      }
    },
    onError: (error: unknown) => {
      handleApiError(error, 'Failed to create HS code');
    },
  });
}

/**
 * Hook to update an HS code
 */
export function useUpdateHSCode() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateHSCodeRequest }) =>
      hsCodeService.updateHSCode(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: hsCodeKeys.lists() });
      queryClient.invalidateQueries({ queryKey: hsCodeKeys.detail(variables.id) });
      toast.success('HS Code updated successfully');
    },
    onError: (error: unknown) => {
      handleApiError(error, 'Failed to update HS code');
    },
  });
}

/**
 * Hook to delete an HS code
 */
export function useDeleteHSCode() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => hsCodeService.deleteHSCode(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: hsCodeKeys.lists() });
      toast.success('HS Code deleted successfully');
    },
    onError: (error: unknown) => {
      toast.error(error && typeof error === 'object' && 'response' in error && error.response && typeof error.response === 'object' && 'data' in error.response && error.response.data && typeof error.response.data === 'object' && 'message' in error.response.data ? String(error.response.data.message) : 'Failed to delete HS code');
    },
  });
}
