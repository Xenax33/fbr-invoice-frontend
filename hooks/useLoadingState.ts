import { useLoading } from '@/contexts/LoadingContext';
import { useEffect } from 'react';

/**
 * Hook to show loading state for React Query mutations
 * Usage: useLoadingMutation(mutation, 'Creating invoice...')
 */
export function useLoadingMutation(mutation: { isPending: boolean }, message?: string) {
  const { showLoading, hideLoading } = useLoading();

  useEffect(() => {
    if (mutation.isPending) {
      showLoading(message);
    } else {
      hideLoading();
    }
  }, [mutation.isPending, message, showLoading, hideLoading]);
}

/**
 * Hook to show loading state for React Query queries
 * Usage: useLoadingQuery(query, 'Loading data...')
 */
export function useLoadingQuery(query: { isLoading: boolean; isFetching: boolean }, message?: string) {
  const { showLoading, hideLoading } = useLoading();

  useEffect(() => {
    if (query.isLoading || query.isFetching) {
      showLoading(message);
    } else {
      hideLoading();
    }
  }, [query.isLoading, query.isFetching, message, showLoading, hideLoading]);
}

/**
 * Hook for manual loading control
 * Usage:
 * const loading = useManualLoading();
 * loading.show('Processing...');
 * // do async work
 * loading.hide();
 */
export function useManualLoading() {
  const { showLoading, hideLoading } = useLoading();

  return {
    show: (message?: string) => showLoading(message),
    hide: () => hideLoading(),
  };
}
