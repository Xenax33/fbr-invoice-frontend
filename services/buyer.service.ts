import axiosInstance from '@/lib/axios';
import type { Buyer, CreateBuyerRequest, UpdateBuyerRequest, PaginatedResponse } from '@/types/api';

export interface GetBuyersParams {
  page?: number;
  limit?: number;
  search?: string;
  registrationType?: 'Registered' | 'Unregistered';
}

export const buyerService = {
  /**
   * Get all buyers for the authenticated user
   */
  async getBuyers(params?: GetBuyersParams): Promise<PaginatedResponse<Buyer>> {
    const response = await axiosInstance.get('/v1/buyers', { params });
    return {
      data: response.data.data.buyers || [],
      pagination: response.data.data.pagination,
    };
  },

  /**
   * Get a single buyer by ID
   */
  async getBuyerById(id: string): Promise<Buyer> {
    const response = await axiosInstance.get(`/v1/buyers/${id}`);
    return response.data.data.buyer;
  },

  /**
   * Create a new buyer
   */
  async createBuyer(data: CreateBuyerRequest): Promise<Buyer> {
    const response = await axiosInstance.post('/v1/buyers', data);
    return response.data.data.buyer;
  },

  /**
   * Update a buyer
   */
  async updateBuyer(id: string, data: UpdateBuyerRequest): Promise<Buyer> {
    const response = await axiosInstance.patch(`/v1/buyers/${id}`, data);
    return response.data.data.buyer;
  },

  /**
   * Delete a buyer
   */
  async deleteBuyer(id: string): Promise<void> {
    await axiosInstance.delete(`/v1/buyers/${id}`);
  },
};
