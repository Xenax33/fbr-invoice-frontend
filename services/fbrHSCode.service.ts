export interface FBRHSCode {
  hS_CODE: string;
  description: string;
}

/**
 * Fetch HS codes from FBR API via Next.js proxy
 * Uses user's production token if available, otherwise test token
 */
export const fbrHSCodeService = {
  /**
   * Get all HS codes from FBR
   * @param token - User's FBR token (production or test)
   */
  async getFBRHSCodes(token: string): Promise<FBRHSCode[]> {
    const response = await fetch('/api/fbr/hs-codes', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
      throw new Error(errorData.error || errorData.message || 'Failed to fetch HS codes');
    }
    
    return await response.json();
  },
};
