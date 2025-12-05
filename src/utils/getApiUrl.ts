import config from '@/config/env-config';

const getApiUrl = (): string => {
  const suffix = '/v1';
  let apiUrl = config.NEXT_PUBLIC_LIFI_API_URL;
  if (typeof window === 'undefined') {
    return `${apiUrl}${suffix}`;
  }

  const isBetaEnabled = window?.localStorage.getItem('use-beta');

  if (isBetaEnabled) {
    apiUrl = `${apiUrl}/beta`;
  }

  return `${apiUrl}${suffix}`;
};

export default getApiUrl;
