interface ErrorResponse {
  missingParams?: string;
  error?: string;
}

export interface CallRequestOptions {
  method: 'GET' | 'POST';
  path: string;
  apiUrl?: string;
  queryParams?: Record<string, string | undefined>;
  body?: any;
  errors?: ErrorResponse;
  headers?: Record<string, string>;
}

export async function callRequest<T>({
  method,
  path,
  apiUrl,
  queryParams,
  body,
  errors,
  headers,
}: CallRequestOptions): Promise<T> {
  if (!apiUrl || !headers) {
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

  const options: RequestInit = {
    method,
    headers,
  };

  if (body) {
    options.body = JSON.stringify(body);
  }

  const response = await fetch(url.toString(), options);

  if (!response.ok) {
    throw new Error(
      `${errors?.error || 'HTTP error! Status'}: ${response.status}`,
    );
  }

  return response.json();
}
