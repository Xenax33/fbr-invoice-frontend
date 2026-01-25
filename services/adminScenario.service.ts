import axiosInstance from '@/lib/axios';
import {
  GlobalScenario,
  CreateGlobalScenarioRequest,
  UpdateGlobalScenarioRequest,
  AssignScenarioRequest,
  BulkAssignScenarioRequest,
  UnassignScenarioRequest,
  UserScenarioAssignment,
  ApiResponse,
  PaginatedResponse,
} from '@/types/api';

/**
 * Admin Scenario Service
 * Handles global scenario management and user assignments
 */
export const adminScenarioService = {
  /**
   * Create a new global scenario
   * POST /scenarios/global
   */
  createGlobalScenario: async (
    data: CreateGlobalScenarioRequest
  ): Promise<ApiResponse<{ scenario: GlobalScenario }>> => {
    const response = await axiosInstance.post('/v1/scenarios/global', data);
    return response.data;
  },

  /**
   * Get all global scenarios with pagination and search
   * GET /scenarios/global?page=1&limit=50&search=query
   */
  getGlobalScenarios: async (params?: {
    page?: number;
    limit?: number;
    search?: string;
  }): Promise<PaginatedResponse<GlobalScenario>> => {
    const response = await axiosInstance.get('/v1/scenarios/global', { params });
    return {
      data: response.data.data.scenarios || [],
      pagination: response.data.data.pagination,
    };
  },

  /**
   * Get a single global scenario by ID
   * GET /scenarios/global/:id
   */
  getGlobalScenarioById: async (
    id: string
  ): Promise<ApiResponse<{ scenario: GlobalScenario }>> => {
    const response = await axiosInstance.get(`/v1/scenarios/global/${id}`);
    return response.data;
  },

  /**
   * Update a global scenario
   * PATCH /scenarios/global/:id
   */
  updateGlobalScenario: async (
    id: string,
    data: UpdateGlobalScenarioRequest
  ): Promise<ApiResponse<{ scenario: GlobalScenario }>> => {
    const response = await axiosInstance.patch(
      `/v1/scenarios/global/${id}`,
      data
    );
    return response.data;
  },

  /**
   * Delete a global scenario
   * DELETE /scenarios/global/:id
   * Note: Cannot delete if assigned to users
   */
  deleteGlobalScenario: async (id: string): Promise<ApiResponse<null>> => {
    const response = await axiosInstance.delete(`/v1/scenarios/global/${id}`);
    return response.data;
  },

  /**
   * Assign a single scenario to a user
   * POST /scenarios/assign
   */
  assignScenarioToUser: async (
    data: AssignScenarioRequest
  ): Promise<ApiResponse<UserScenarioAssignment>> => {
    const response = await axiosInstance.post('/v1/scenarios/assign', data);
    return response.data;
  },

  /**
   * Bulk assign multiple scenarios to a user
   * Makes individual POST requests for each scenario ID
   */
  bulkAssignScenarios: async (
    data: BulkAssignScenarioRequest
  ): Promise<ApiResponse<UserScenarioAssignment>> => {
    // Make individual assignment requests for each scenario
    const results = await Promise.all(
      (data.scenarioIds || []).map((scenarioId) =>
        axiosInstance.post('/v1/scenarios/assign', {
          userId: data.userId,
          scenarioId,
        })
      )
    );
    // Return the last response (all should succeed if any fails, Promise.all will throw)
    return results[results.length - 1]?.data || { status: 'success' };
  },

  /**
   * Unassign a scenario from a user
   * POST /scenarios/unassign
   */
  unassignScenarioFromUser: async (
    data: UnassignScenarioRequest
  ): Promise<ApiResponse<null>> => {
    const response = await axiosInstance.post(
      '/v1/scenarios/unassign',
      data
    );
    return response.data;
  },

  /**
   * Get all scenarios assigned to a specific user (Admin view)
   * GET /scenarios/user/:userId
   */
  getUserAssignments: async (
    userId: string
  ): Promise<ApiResponse<{ scenarios: UserScenarioAssignment[] }>> => {
    const response = await axiosInstance.get(
      `/v1/scenarios/user/${userId}`
    );
    return response.data;
  },
};
