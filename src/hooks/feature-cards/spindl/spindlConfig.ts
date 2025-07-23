import config from '@/config/env-config';
export const getSpindlConfig = () => {
  if (
    !config.NEXT_PUBLIC_SPINDL_API_KEY ||
    !config.NEXT_PUBLIC_SPINDL_API_URL
  ) {
    throw new Error(
      'Error fetching Spindl configuration! Please check your environment variables.',
    );
  }
  return {
    apiUrl: config.NEXT_PUBLIC_SPINDL_API_URL,
    headers: {
      'Content-Type': 'application/json',
      'X-API-ACCESS-KEY': config.NEXT_PUBLIC_SPINDL_API_KEY,
    },
  };
};
