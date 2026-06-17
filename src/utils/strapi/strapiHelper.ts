import config, { getEnvVars } from '@/config/env-config';

export function getStrapiApiAccessToken() {
  const token = getEnvVars().STRAPI_API_TOKEN;
  if (!token) {
    console.error('Strapi API token is not provided.');
    throw new Error('Strapi API token is not provided.');
  }
  return token;
}

export function getStrapiBaseUrl() {
  // Use default Strapi URL for other environments
  if (!config.NEXT_PUBLIC_STRAPI_URL) {
    console.error('Strapi URL is not provided.');
    throw new Error('Strapi URL is not provided.');
  }
  return `${config.NEXT_PUBLIC_STRAPI_URL}`;
}

/**
 * Resolve a Strapi media URL.
 *
 * Newer Strapi versions return absolute URLs (e.g. https://cdn.example.com/...)
 * while older / local Strapi instances return relative paths (e.g. /uploads/...).
 * This helper prefixes the configured Strapi base URL only when the value is a
 * relative path, keeping consumers backward compatible with both formats.
 */
export function resolveStrapiMediaUrl(
  url: string | null | undefined,
): string | undefined {
  if (!url) {
    return undefined;
  }
  if (url.startsWith('http')) {
    return url;
  }
  return `${getStrapiBaseUrl()}${url}`;
}
