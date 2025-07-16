import config from '@/config/env-config';

export function getStrapiBaseUrl() {
  if (config.NEXT_PUBLIC_STRAPI_DEVELOP === 'true') {
    // Use local Strapi URL for development environment
    if (!config.NEXT_PUBLIC_LOCAL_STRAPI_URL) {
      console.error('Local Strapi URL is not provided.');
      throw new Error('Local Strapi URL is not provided.');
    }
    return `${config.NEXT_PUBLIC_LOCAL_STRAPI_URL}`;
  } else {
    // Use default Strapi URL for other environments
    if (!config.NEXT_PUBLIC_STRAPI_URL) {
      console.error('Strapi URL is not provided.');
      throw new Error('Strapi URL is not provided.');
    }
    return `${config.NEXT_PUBLIC_STRAPI_URL}`;
  }
}

export function getStrapiApiAccessToken() {
  if (config.NEXT_PUBLIC_STRAPI_DEVELOP === 'true') {
    // Check local development token
    if (!config.NEXT_PUBLIC_LOCAL_STRAPI_API_TOKEN) {
      console.error('Local Strapi API token is not provided.');
      throw new Error('Local Strapi API token is not provided.');
    }
    return config.NEXT_PUBLIC_LOCAL_STRAPI_API_TOKEN;
  } else {
    // Check production token
    if (!config.NEXT_PUBLIC_STRAPI_API_TOKEN) {
      console.error('Strapi API token is not provided.');
      throw new Error('Strapi API token is not provided.');
    }
    return config.NEXT_PUBLIC_STRAPI_API_TOKEN;
  }
}
