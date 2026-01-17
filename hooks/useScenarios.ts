import { useMutation, useQuery, useQueryClient, UseQueryOptions } from '@tanstack/react-query';
import { toast } from "react-hot-toast";
import {
  scenarioService,
  GetScenariosParams,
  CreateScenarioRequest,
  UpdateScenarioRequest,
} from "@/services/scenario.service";
import { Scenario, PaginatedResponse } from "@/types/api";

// Helper function to handle API errors
const handleApiError = (error: any) => {
  if (error.response?.data?.errors && Array.isArray(error.response.data.errors)) {
    // Handle validation errors array
    error.response.data.errors.forEach((err: any) => {
      toast.error(`${err.field}: ${err.message}`);
    });
  } else {
    toast.error(error.response?.data?.message || "An error occurred");
  }
};

/**
 * Query keys for scenario-related queries
 * Follows hierarchical structure for efficient cache invalidation
 */
export const scenarioKeys = {
  all: ["scenarios"] as const,
  lists: () => [...scenarioKeys.all, "list"] as const,
  list: (params?: GetScenariosParams) => [...scenarioKeys.lists(), params] as const,
  details: () => [...scenarioKeys.all, "detail"] as const,
  detail: (id: string) => [...scenarioKeys.details(), id] as const,
};

/**
 * Hook to fetch paginated list of scenarios
 */
export function useScenarios(params?: GetScenariosParams, options?: Omit<UseQueryOptions<PaginatedResponse<Scenario>>, 'queryKey' | 'queryFn'>) {
  return useQuery<PaginatedResponse<Scenario>>({
    queryKey: scenarioKeys.list(params),
    queryFn: () => scenarioService.getScenarios(params),
    staleTime: 30 * 60 * 1000, // 30 minutes - scenarios rarely change
    ...options,
  });
}

/**
 * Hook to fetch a single scenario by ID
 */
export function useScenario(id: string) {
  return useQuery({
    queryKey: scenarioKeys.detail(id),
    queryFn: () => scenarioService.getScenarioById(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

/**
 * Hook to create a new scenario
 */
export function useCreateScenario() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateScenarioRequest) =>
      scenarioService.createScenario(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: scenarioKeys.lists() });
      toast.success("Scenario created successfully");
    },
    onError: handleApiError,
  });
}

/**
 * Hook to update an existing scenario
 */
export function useUpdateScenario() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateScenarioRequest }) =>
      scenarioService.updateScenario(id, data),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: scenarioKeys.lists() });
      queryClient.invalidateQueries({ queryKey: scenarioKeys.detail(variables.id) });
      toast.success("Scenario updated successfully");
    },
    onError: handleApiError,
  });
}

/**
 * Hook to delete a scenario
 */
export function useDeleteScenario() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => scenarioService.deleteScenario(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: scenarioKeys.lists() });
      toast.success("Scenario deleted successfully");
    },
    onError: handleApiError,
  });
}
