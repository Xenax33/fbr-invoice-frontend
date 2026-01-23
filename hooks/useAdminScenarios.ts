import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { adminScenarioService } from '@/services/adminScenario.service';
import {
  CreateGlobalScenarioRequest,
  UpdateGlobalScenarioRequest,
  AssignScenarioRequest,
  BulkAssignScenarioRequest,
  UnassignScenarioRequest,
} from '@/types/api';
import { useLoading } from '@/contexts/LoadingContext';

/**
 * Query keys for admin scenario management
 */
export const ADMIN_SCENARIO_KEYS = {
  globalScenarios: ['admin', 'scenarios', 'global'] as const,
  globalScenariosPage: (page?: number, limit?: number, search?: string) =>
    ['admin', 'scenarios', 'global', { page, limit, search }] as const,
  userAssignments: (userId: string) =>
    ['admin', 'scenarios', 'assignments', userId] as const,
};

/**
 * Hook for fetching all global scenarios with pagination and search
 */
export const useGlobalScenarios = (params?: {
  page?: number;
  limit?: number;
  search?: string;
}) => {
  return useQuery({
    queryKey: ADMIN_SCENARIO_KEYS.globalScenariosPage(
      params?.page,
      params?.limit,
      params?.search
    ),
    queryFn: async () => {
      const response = await adminScenarioService.getGlobalScenarios(params);
      return response;
    },
    staleTime: 30 * 60 * 1000,
  });
};

/**
 * Hook for creating a global scenario
 */
export const useCreateGlobalScenario = () => {
  const queryClient = useQueryClient();
  const { showLoading, hideLoading } = useLoading();

  return useMutation({
    mutationFn: (data: CreateGlobalScenarioRequest) => {
      showLoading('Creating global scenario...');
      return adminScenarioService.createGlobalScenario(data);
    },
    onSuccess: (response) => {
      hideLoading();
      // Invalidate all global scenario queries (any page/search params)
      queryClient.invalidateQueries({ queryKey: ['admin', 'scenarios', 'global'], exact: false });

      // Optimistically update cached lists
      queryClient.setQueriesData({ queryKey: ['admin', 'scenarios', 'global'], exact: false }, (oldData: any) => {
        if (!oldData?.data) return oldData;
        const newScenario = response?.data?.scenario;
        if (!newScenario) return oldData;
        return {
          ...oldData,
          data: [newScenario, ...oldData.data],
        };
      });
      toast.success('Global scenario created successfully');
    },
    onError: (error: any) => {
      hideLoading();
      toast.error(
        error.response?.data?.message || 'Failed to create global scenario'
      );
    },
  });
};

/**
 * Hook for updating a global scenario
 */
export const useUpdateGlobalScenario = () => {
  const queryClient = useQueryClient();
  const { showLoading, hideLoading } = useLoading();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: UpdateGlobalScenarioRequest;
    }) => {
      showLoading('Updating global scenario...');
      return adminScenarioService.updateGlobalScenario(id, data);
    },
    onSuccess: (response) => {
      hideLoading();
      // Invalidate all global scenario queries (any page/search params)
      queryClient.invalidateQueries({ queryKey: ['admin', 'scenarios', 'global'], exact: false });

      // Optimistically update cached lists
      queryClient.setQueriesData({ queryKey: ['admin', 'scenarios', 'global'], exact: false }, (oldData: any) => {
        if (!oldData?.data) return oldData;
        const updated = response?.data?.scenario;
        if (!updated) return oldData;
        return {
          ...oldData,
          data: oldData.data.map((item: any) => (item.id === updated.id ? updated : item)),
        };
      });
      toast.success('Global scenario updated successfully');
    },
    onError: (error: any) => {
      hideLoading();
      toast.error(
        error.response?.data?.message || 'Failed to update global scenario'
      );
    },
  });
};

/**
 * Hook for deleting a global scenario
 */
export const useDeleteGlobalScenario = () => {
  const queryClient = useQueryClient();
  const { showLoading, hideLoading } = useLoading();

  return useMutation({
    mutationFn: (id: string) => {
      showLoading('Deleting global scenario...');
      return adminScenarioService.deleteGlobalScenario(id);
    },
    onSuccess: (_, id) => {
      hideLoading();
      queryClient.invalidateQueries({ queryKey: ['admin', 'scenarios', 'global'], exact: false });

      // Optimistically update cached lists
      queryClient.setQueriesData({ queryKey: ['admin', 'scenarios', 'global'], exact: false }, (oldData: any) => {
        if (!oldData?.data) return oldData;
        return {
          ...oldData,
          data: oldData.data.filter((item: any) => item.id !== id),
        };
      });
      toast.success('Global scenario deleted successfully');
    },
    onError: (error: any) => {
      hideLoading();
      const message =
        error.response?.data?.message || 'Failed to delete global scenario';
      toast.error(message);
    },
  });
};

/**
 * Hook for assigning a scenario to a user
 */
export const useAssignScenario = () => {
  const queryClient = useQueryClient();
  const { showLoading, hideLoading } = useLoading();

  return useMutation({
    mutationFn: (data: AssignScenarioRequest) => {
      showLoading('Assigning scenario to user...');
      return adminScenarioService.assignScenarioToUser(data);
    },
    onSuccess: (_, variables) => {
      hideLoading();
      queryClient.invalidateQueries({
        queryKey: ADMIN_SCENARIO_KEYS.userAssignments(variables.userId),
      });
      toast.success('Scenario assigned successfully');
    },
    onError: (error: any) => {
      hideLoading();
      toast.error(
        error.response?.data?.message || 'Failed to assign scenario'
      );
    },
  });
};

/**
 * Hook for bulk assigning scenarios to a user
 */
export const useBulkAssignScenarios = () => {
  const queryClient = useQueryClient();
  const { showLoading, hideLoading } = useLoading();

  return useMutation({
    mutationFn: (data: BulkAssignScenarioRequest) => {
      showLoading('Bulk assigning scenarios...');
      return adminScenarioService.bulkAssignScenarios(data);
    },
    onSuccess: (_, variables) => {
      hideLoading();
      queryClient.invalidateQueries({
        queryKey: ADMIN_SCENARIO_KEYS.userAssignments(variables.userId),
      });
      toast.success('Scenarios assigned successfully');
    },
    onError: (error: any) => {
      hideLoading();
      toast.error(
        error.response?.data?.message || 'Failed to bulk assign scenarios'
      );
    },
  });
};

/**
 * Hook for unassigning a scenario from a user
 */
export const useUnassignScenario = () => {
  const queryClient = useQueryClient();
  const { showLoading, hideLoading } = useLoading();

  return useMutation({
    mutationFn: (data: UnassignScenarioRequest) => {
      showLoading('Unassigning scenario...');
      return adminScenarioService.unassignScenarioFromUser(data);
    },
    onSuccess: (_, variables) => {
      hideLoading();
      queryClient.invalidateQueries({
        queryKey: ADMIN_SCENARIO_KEYS.userAssignments(variables.userId),
      });
      toast.success('Scenario unassigned successfully');
    },
    onError: (error: any) => {
      hideLoading();
      const message =
        error.response?.data?.message || 'Failed to unassign scenario';
      toast.error(message);
    },
  });
};

/**
 * Hook for fetching user scenario assignments (Admin view)
 */
export const useUserScenarioAssignments = (userId: string) => {
  return useQuery({
    queryKey: ADMIN_SCENARIO_KEYS.userAssignments(userId),
    queryFn: async () => {
      const response = await adminScenarioService.getUserAssignments(userId);
      return response.data?.scenarios || [];
    },
    enabled: !!userId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
