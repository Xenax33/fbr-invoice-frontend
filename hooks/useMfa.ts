/**
 * useMfa - Hook for MFA operations
 * Handles API calls to backend MFA endpoints
 * 
 * Flow:
 * 1. Login with /auth/login
 * 2. If admin without MFA: 403 with requireMfaEnrollment
 * 3. If admin with MFA: 200 with mfaRequired flag
 * 4. Verify MFA with /auth/login/mfa
 */

import { useState } from 'react';
import axios from '@/lib/axios';
import { saveTokens, saveMfaChallengeToken, getMfaChallengeToken } from '@/lib/tokenManager';

export interface MfaSecret {
  secret: string;
  otpauthUrl: string;
  qrDataUrl: string; // Base64-encoded PNG
}

export interface MfaEnrollmentResponse {
  mfaEnabled: boolean;
  backupCodes: string[];
  message: string;
}

export interface LoginResponse {
  mfaRequired?: boolean;
  challengeToken?: string;
  requireMfaEnrollment?: boolean;
  userId?: string;
  email?: string;
  accessToken?: string;
  refreshToken?: string;
  user?: {
    id: string;
    email: string;
    name?: string;
    role: string;
    mfaEnabled?: boolean;
  };
}

export interface MfaVerifyResponse {
  mfaRequired: boolean;
  user: {
    id: string;
    email: string;
    name?: string;
    role: string;
    mfaEnabled: boolean;
  };
  accessToken: string;
  refreshToken: string;
  backupCodesRemaining: number;
}

interface MfaError {
  message: string;
  code?: number | string;
}

export const useMfa = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<MfaError | null>(null);

  /**
   * Standard login with email and password
   * Returns:
   * - 200: Regular user or admin with MFA verification
   * - 403: Admin requiring MFA enrollment
   */
  const login = async (email: string, password: string): Promise<LoginResponse | null> => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post<{ status: string; data: LoginResponse }>(
        '/v1/auth/login',
        { email, password }
      );

      // Save challenge token if MFA is required
      if (response.data.data.mfaRequired && response.data.data.challengeToken) {
        saveMfaChallengeToken(response.data.data.challengeToken);
      }

      // If MFA is not required, save tokens immediately
      if (response.data.data.accessToken && response.data.data.refreshToken) {
        saveTokens(response.data.data.accessToken, response.data.data.refreshToken);
      }

      return response.data.data;
    } catch (err: any) {
      // 403 means MFA enrollment is required (expected flow)
      if (err.response?.status === 403 && err.response?.data?.data?.requireMfaEnrollment) {
        return err.response.data.data;
      }

      // Handle rate limits explicitly to avoid silent page reloads
      if (err.response?.status === 429) {
        const serverMessage = err.response?.data?.message;
        const retryAfter = err.response?.headers?.['retry-after'];
        const waitText = retryAfter ? ` Please retry after ${retryAfter} seconds.` : '';
        const errorMsg = serverMessage || ('Too many login attempts.' + waitText);
        setError({ message: errorMsg.trim(), code: 429 });
        throw err;
      }

      const errorMsg = err.response?.data?.message || 'Login failed. Please try again.';
      setError({ message: errorMsg, code: err.response?.status });
      throw err;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Issue TOTP secret for MFA enrollment (public endpoint)
   * Used during forced enrollment flow
   */
  const enrollGetSecret = async (userId: string): Promise<MfaSecret | null> => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post<{ status: string; data: MfaSecret }>(
        '/v1/admin/mfa/enroll/secret',
        { userId }
      );
      return response.data.data;
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || 'Failed to generate MFA secret';
      setError({ message: errorMsg, code: err.response?.status });
      return null;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Enable MFA during enrollment (public endpoint)
   * Used during forced enrollment flow
   */
  const enrollEnableMfa = async (userId: string, token: string): Promise<MfaEnrollmentResponse | null> => {
    setLoading(true);
    setError(null);
    try {
      console.log('Calling /v1/admin/mfa/enroll/enable with:', { userId, token });
      const response = await axios.post<{ status: string; data: MfaEnrollmentResponse }>(
        '/v1/admin/mfa/enroll/enable',
        { userId, token }
      );
      console.log('MFA enrollment response:', response.data);
      return response.data.data;
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || 'Failed to enable MFA. Invalid code or expired.';
      const errorCode = err.response?.status;
      console.error('MFA enrollment error response:', { status: errorCode, data: err.response?.data, message: errorMsg });
      setError({ message: errorMsg, code: errorCode });
      return null;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Issue TOTP secret for MFA (authenticated users with existing MFA)
   */
  const issueMfaSecret = async (accessToken: string): Promise<MfaSecret | null> => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post<{ status: string; data: MfaSecret }>(
        '/v1/admin/mfa/secret',
        {},
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      return response.data.data;
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || 'Failed to generate MFA secret';
      setError({ message: errorMsg, code: err.response?.status });
      return null;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Enable MFA (authenticated users)
   */
  const enableMfa = async (accessToken: string, token: string): Promise<any | null> => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post<{ status: string; data: any }>(
        '/v1/admin/mfa/enable',
        { token },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      return response.data.data;
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || 'Failed to enable MFA. Invalid code or expired.';
      setError({ message: errorMsg, code: err.response?.status });
      return null;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Verify MFA during login (TOTP or backup code)
   * Uses standard /auth/login/mfa endpoint
   */
  const verifyMfa = async (token?: string, backupCode?: string): Promise<MfaVerifyResponse | null> => {
    setLoading(true);
    setError(null);
    try {
      const challengeToken = getMfaChallengeToken();
      if (!challengeToken) {
        setError({ message: 'MFA session expired. Please login again.' });
        return null;
      }

      const body: any = { challengeToken };
      if (token) {
        body.token = token;
      } else if (backupCode) {
        body.backupCode = backupCode;
      } else {
        setError({ message: 'Please provide either a TOTP code or backup code' });
        return null;
      }

      const response = await axios.post<{ status: string; data: MfaVerifyResponse }>(
        '/v1/auth/login/mfa',
        body
      );

      return response.data.data;
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || 'Invalid or expired MFA code. Please try again.';
      setError({ message: errorMsg, code: err.response?.status });
      return null;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Disable MFA (authenticated users only)
   */
  const disableMfa = async (accessToken: string, password: string): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      await axios.post(
        '/v1/admin/mfa/disable',
        { password },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      return true;
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || 'Failed to disable MFA. Invalid password.';
      setError({ message: errorMsg, code: err.response?.status });
      return false;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Get user profile (includes MFA status)
   */
  const getUserProfile = async (accessToken: string): Promise<any | null> => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get('/v1/auth/profile', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      return response.data.data;
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || 'Failed to fetch profile';
      setError({ message: errorMsg, code: err.response?.status });
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    login,
    enrollGetSecret,
    enrollEnableMfa,
    issueMfaSecret,
    enableMfa,
    verifyMfa,
    disableMfa,
    getUserProfile,
  };
};
