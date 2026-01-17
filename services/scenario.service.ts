import axiosInstance from "@/lib/axios";
import {
  PaginationParams,
  PaginatedResponse,
  Scenario,
} from "@/types/api";

export interface GetScenariosParams extends PaginationParams {
  search?: string;
}

export interface CreateScenarioRequest {
  scenarioCode: string;
  scenarioDescription: string;
}

export interface UpdateScenarioRequest {
  scenarioCode?: string;
  scenarioDescription?: string;
}

class ScenarioService {
  /**
   * Get all scenarios with optional search and pagination
   */
  async getScenarios(
    params?: GetScenariosParams
  ): Promise<PaginatedResponse<Scenario>> {
    const response = await axiosInstance.get("/v1/scenarios", { params });
    return {
      data: response.data.data.scenarios || [],
      pagination: response.data.data.pagination,
    };
  }

  /**
   * Get a single scenario by ID
   */
  async getScenarioById(id: string): Promise<Scenario> {
    const response = await axiosInstance.get(`/v1/scenarios/${id}`);
    return response.data.data.scenario;
  }

  /**
   * Create a new scenario
   */
  async createScenario(data: CreateScenarioRequest): Promise<Scenario> {
    const response = await axiosInstance.post("/v1/scenarios", data);
    return response.data.data.scenario;
  }

  /**
   * Update an existing scenario
   */
  async updateScenario(
    id: string,
    data: UpdateScenarioRequest
  ): Promise<Scenario> {
    const response = await axiosInstance.patch(`/v1/scenarios/${id}`, data);
    return response.data.data.scenario;
  }

  /**
   * Delete a scenario
   * Note: Can only delete if not used in any invoices
   */
  async deleteScenario(id: string): Promise<void> {
    await axiosInstance.delete(`/v1/scenarios/${id}`);
  }
}

export const scenarioService = new ScenarioService();
export default scenarioService;
