import config from '@/config/env-config';
const getApiUrl = (): string => {
  let apiUrl = config.NEXT_PUBLIC_LIFI_API_URL;
  if (typeof window === 'undefined') {
    return apiUrl;
  }

  const isBetaEnabled = window?.localStorage.getItem('use-beta');

  if (isBetaEnabled) {
    apiUrl = `${apiUrl}/beta`;
  }

  return apiUrl;
};

export default getApiUrl;
