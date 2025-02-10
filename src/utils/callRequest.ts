import { buildURL } from './buildUrl';

export interface CallRequestProps {
  method: 'GET' | 'POST';
  path: string;
  apiUrl?: string;
  queryParams?: Record<string, any>;
  body?: any;
  headers?: Record<string, string>;
}

export const callRequest = async <T>({
  method,
  apiUrl,
  path,
  queryParams,
  body,
  headers = {},
}: CallRequestProps): Promise<T> => {
  if (!apiUrl) {
    throw new Error('Request configuration is missing');
  }

  const url = buildURL(`${apiUrl}${path ?? ''}`, queryParams);

  const response = await fetch(url.toString(), {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`);
  }

  return response.json();
};
