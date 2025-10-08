import config from '@/config/env-config';
import { isProduction } from 'src/utils/isProduction';

const apiBaseUrl = config.NEXT_PUBLIC_BACKEND_URL;

export const getFeatureFlag = async (
  feature: string,
  // Placeholder distinctId required by the API call.
  // A global feature flag is not tied to any specific user.
  distinctId: string = 'distinct-id',
) => {
  const searchParams = new URLSearchParams();
  searchParams.set('key', feature);
  searchParams.set('distinctId', distinctId);

  const response = await fetch(
    `${apiBaseUrl}/posthog/feature-flag?${searchParams.toString()}`,
  );

  const resFormatted = await response.json();

  return !!resFormatted.data;
};

export const isEarnFeatureEnabled = () => {
  return !isProduction;
};
