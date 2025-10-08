import config from '@/config/env-config';

export function getStrapiBaseUrl() {
  // Use default Strapi URL for other environments
  if (!config.NEXT_PUBLIC_STRAPI_URL) {
    console.error('Strapi URL is not provided.');
    throw new Error('Strapi URL is not provided.');
  }
  return `${config.NEXT_PUBLIC_STRAPI_URL}`;
}

export function getStrapiApiAccessToken() {
  // Check production token
  if (!config.NEXT_PUBLIC_STRAPI_API_TOKEN) {
    console.error('Strapi API token is not provided.');
    throw new Error('Strapi API token is not provided.');
  }
  return config.NEXT_PUBLIC_STRAPI_API_TOKEN;
}
