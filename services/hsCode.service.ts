import axiosInstance from '@/lib/axios';
import type { HSCode, CreateHSCodeRequest, UpdateHSCodeRequest, PaginatedResponse } from '@/types/api';

export interface GetHSCodesParams {
  page?: number;
  limit?: number;
  search?: string;
}

export const hsCodeService = {
  /**
   * Get all HS codes for the authenticated user
   */
  async getHSCodes(params?: GetHSCodesParams): Promise<PaginatedResponse<HSCode>> {
    const response = await axiosInstance.get('/v1/hs-codes', { params });
    return {
      data: response.data.data.hsCodes || [],
      pagination: response.data.data.pagination,
    };
  },

  /**
   * Get a single HS code by ID
   */
  async getHSCodeById(id: string): Promise<HSCode> {
    const response = await axiosInstance.get(`/v1/hs-codes/${id}`);
    return response.data.data.hsCode;
  },

  /**
   * Create a new HS code
   */
  async createHSCode(data: CreateHSCodeRequest): Promise<HSCode> {
    const response = await axiosInstance.post('/v1/hs-codes', data);
    return response.data.data.hsCode;
  },

  /**
   * Update an HS code
   */
  async updateHSCode(id: string, data: UpdateHSCodeRequest): Promise<HSCode> {
    const response = await axiosInstance.patch(`/v1/hs-codes/${id}`, data);
    return response.data.data.hsCode;
  },

  /**
   * Delete an HS code
   */
  async deleteHSCode(id: string): Promise<void> {
    await axiosInstance.delete(`/v1/hs-codes/${id}`);
  },
};
