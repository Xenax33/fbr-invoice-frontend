/**
 * Common API response types
 */
export interface ApiResponse<T = any> {
  data: T;
  message?: string;
  success: boolean;
}

export interface ApiError {
  message: string;
  statusCode: number;
  errors?: Record<string, string[]>;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

/**
 * Query parameters for pagination
 */
export interface PaginationParams {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

/**
 * User and Authentication types
 */
export interface User {
  id: string;
  name: string;
  email: string;
  businessName: string;
  province: string;
  address: string;
  ntncnic: string;
  role: 'ADMIN' | 'USER';
  postInvoiceTokenTest: string | null;
  validateInvoiceTokenTest: string | null;
  postInvoiceToken: string | null;
  validateInvoiceToken: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  status: string;
  data: {
    user: User;
    accessToken: string;
    refreshToken: string;
  };
}

export interface RefreshTokenResponse {
  status: string;
  data: {
    accessToken: string;
  };
}

export interface ProfileResponse {
  status: string;
  data: {
    user: User;
  };
}
