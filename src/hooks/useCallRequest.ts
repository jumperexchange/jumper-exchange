import { useQuery } from '@tanstack/react-query';
import type { CallRequestOptions } from 'src/utils/callRequest';

/**
 * Custom hook for making API requests using React Query.
 *
 * @template T The expected type of the API response data.
 * @param {Object} options - The options for the API request.
 * @param {('GET'|'POST')} options.method - The HTTP method for the request.
 * @param {string} options.path - The endpoint path for the API request.
 * @param {string} options.apiUrl - The base URL for the API.
 * @param {Record<string, string | undefined>} [options.queryParams] - Optional query parameters for the request.
 * @param {any} [options.body] - Optional body for POST requests.
 * @param {Record<string, string>} options.headers - Headers for the request.
 * @param {{missingParams?: string, error?: string}} [options.errors] - Custom error messages.
 * @param {boolean} [options.enabled=true] - Whether the query should automatically run. Use refetch() to trigger manually if set to false.
 * @param {number} [options.refetchInterval] - Interval in milliseconds to refetch the data.
 *
 * @returns {UseQueryResult<T, Error>} The result of the query, including data, error state, and refetch function.
 *
 * @throws {Error} Throws an error if the API configuration is missing or if the HTTP response is not OK.
 *
 * @example
 * const { data, isLoading, error } = useCallRequest<UserData>({
 *   method: 'GET',
 *   path: '/api/user',
 *   apiUrl: 'https://api.example.com',
 *   headers: { 'Authorization': 'Bearer token' },
 *   queryParams: { userId: '123' },
 * });
 */

interface UseCallRequestProps extends CallRequestOptions {
  enabled?: boolean;
  refetchInterval?: number;
}

export function useCallRequest<T>({
  method,
  path,
  apiUrl,
  queryParams,
  refetchInterval,
  body,
  headers,
  errors,
  enabled = true,
}: UseCallRequestProps) {
  return useQuery<T, Error>({
    queryKey: [path, queryParams],
    queryFn: async () => {
      if (!apiUrl || !headers || !queryParams) {
        throw new Error(
          errors?.missingParams || 'Request configuration is missing',
        );
      }

      const url = new URL(`${apiUrl}${path}`);
      if (queryParams) {
        Object.entries(queryParams).forEach(([key, value]) => {
          if (value) {
            url.searchParams.set(key, value);
          }
        });
      }

      const response = await fetch(url.toString(), {
        method,
        headers,
        body: body ? JSON.stringify(body) : undefined,
      });

      if (!response.ok) {
        throw new Error(
          `${errors?.error || 'HTTP error! Status'}: ${response.status}`,
        );
      }

      return response.json();
    },
    enabled,
    refetchInterval: refetchInterval || 1000 * 60 * 60,
  });
}
