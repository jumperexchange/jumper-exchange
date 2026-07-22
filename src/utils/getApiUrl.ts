import config from '@/config/env-config';
import { isBeta } from './isBeta';

export interface GetApiUrlParams {
  isPrivateVariant?: boolean;
  isLimitVariant?: boolean;
}

enum ApiUrlFlags {
  Beta = 'beta',
  Limit = 'limit-order',
  Private = 'private',
}

const getApiUrl = (params?: GetApiUrlParams): string => {
  const suffix = '/v1';
  const apiUrl = config.NEXT_PUBLIC_LIFI_BACKEND_URL;

  const flags = [
    betaOverride(params),
    privateOverride(params),
    limitOverride(params),
  ]
    .filter(Boolean)
    .map((flag) => `/${flag}`)
    .join('');

  return `${apiUrl}${flags}${suffix}`;
};

function betaOverride(_params?: GetApiUrlParams) {
  if (typeof window === 'undefined') {
    return undefined;
  }

  if (isBeta()) {
    return ApiUrlFlags.Beta;
  }
}

function privateOverride(params?: GetApiUrlParams) {
  if (params?.isPrivateVariant) {
    return ApiUrlFlags.Private;
  }
}

function limitOverride(params?: GetApiUrlParams) {
  if (params?.isLimitVariant) {
    return ApiUrlFlags.Limit;
  }
}

export default getApiUrl;
