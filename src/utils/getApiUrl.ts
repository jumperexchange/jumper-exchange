import config from '@/config/env-config';

export interface GetApiUrlParams {
  isPrivateVariant?: boolean;
}

enum ApiUrlFlags {
  Beta = 'beta',
  Private = 'private',
}

const getApiUrl = (params?: GetApiUrlParams): string => {
  const suffix = '/v1';
  const apiUrl = config.NEXT_PUBLIC_LIFI_BACKEND_URL;

  const flags = [betaOverride(params), privateOverride(params)]
    .filter(Boolean)
    .map((flag) => `/${flag}`)
    .join('');

  return `${apiUrl}${flags}${suffix}`;
};

function betaOverride(_params?: GetApiUrlParams) {
  if (typeof window === 'undefined') {
    return undefined;
  }

  const isBetaEnabled = window?.localStorage.getItem('use-beta');
  if (isBetaEnabled) {
    return ApiUrlFlags.Beta;
  }
}

function privateOverride(params?: GetApiUrlParams) {
  if (params?.isPrivateVariant) {
    return ApiUrlFlags.Private;
  }
}

export default getApiUrl;
