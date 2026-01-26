/**
 * Token Manager - Secure token storage and retrieval
 * Uses cookies for middleware/SSR compatibility and sessionStorage as fallback
 */

import Cookies from 'js-cookie';

interface TokenPair {
  accessToken: string;
  refreshToken: string;
}

const ACCESS_TOKEN_KEY = 'fbr_access_token';
const REFRESH_TOKEN_KEY = 'fbr_refresh_token';
const MFA_CHALLENGE_KEY = 'fbr_mfa_challenge';

const COOKIE_OPTIONS = {
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict' as const,
};

const setCookie = (key: string, value: string, expiresDays: number) => {
  try {
    Cookies.set(key, value, { ...COOKIE_OPTIONS, expires: expiresDays });
  } catch (error) {
    console.error('Error setting cookie:', key, error);
  }
};

const removeCookie = (key: string) => {
  try {
    Cookies.remove(key);
  } catch (error) {
    console.error('Error removing cookie:', key, error);
  }
};

/**
 * Save tokens to session storage
 */
export const saveTokens = (accessToken: string, refreshToken: string): void => {
  try {
    // Persist in cookies for middleware + axios interceptor
    setCookie('accessToken', accessToken, 1); // 1 day
    setCookie('refreshToken', refreshToken, 7); // 7 days

    // Also persist in sessionStorage for client-side reads
    sessionStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
    sessionStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
  } catch (error) {
    console.error('Error saving tokens:', error);
    throw new Error('Failed to save authentication tokens');
  }
};

/**
 * Retrieve access token
 */
export const getAccessToken = (): string | null => {
  try {
    return Cookies.get('accessToken') || sessionStorage.getItem(ACCESS_TOKEN_KEY);
  } catch (error) {
    console.error('Error retrieving access token:', error);
    return null;
  }
};

/**
 * Retrieve refresh token
 */
export const getRefreshToken = (): string | null => {
  try {
    return Cookies.get('refreshToken') || sessionStorage.getItem(REFRESH_TOKEN_KEY);
  } catch (error) {
    console.error('Error retrieving refresh token:', error);
    return null;
  }
};

/**
 * Get both tokens as pair
 */
export const getTokenPair = (): TokenPair | null => {
  const accessToken = getAccessToken();
  const refreshToken = getRefreshToken();

  if (!accessToken || !refreshToken) {
    return null;
  }

  return { accessToken, refreshToken };
};

/**
 * Check if user is authenticated
 */
export const isAuthenticated = (): boolean => {
  return getAccessToken() !== null;
};

/**
 * Clear all tokens (logout)
 */
export const clearTokens = (): void => {
  try {
    removeCookie('accessToken');
    removeCookie('refreshToken');
    removeCookie('user');
    sessionStorage.removeItem(ACCESS_TOKEN_KEY);
    sessionStorage.removeItem(REFRESH_TOKEN_KEY);
    sessionStorage.removeItem(MFA_CHALLENGE_KEY);
  } catch (error) {
    console.error('Error clearing tokens:', error);
  }
};

/**
 * Save MFA challenge token (temporary, expires in 10 minutes)
 */
export const saveMfaChallengeToken = (token: string): void => {
  try {
    sessionStorage.setItem(MFA_CHALLENGE_KEY, token);
  } catch (error) {
    console.error('Error saving MFA challenge token:', error);
  }
};

/**
 * Get MFA challenge token
 */
export const getMfaChallengeToken = (): string | null => {
  try {
    return sessionStorage.getItem(MFA_CHALLENGE_KEY);
  } catch (error) {
    console.error('Error retrieving MFA challenge token:', error);
    return null;
  }
};

/**
 * Clear MFA challenge token
 */
export const clearMfaChallengeToken = (): void => {
  try {
    sessionStorage.removeItem(MFA_CHALLENGE_KEY);
  } catch (error) {
    console.error('Error clearing MFA challenge token:', error);
  }
};
