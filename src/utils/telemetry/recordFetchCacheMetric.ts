import { metrics } from '@opentelemetry/api';

const meter = metrics.getMeter('jumper-exchange');

const cacheStatusCounter = meter.createCounter(
  'strapi_fetch_cf_cache_status_total',
  {
    description: 'Count of Strapi fetches by Cloudflare cache status.',
  },
);

const cacheAgeHistogram = meter.createHistogram(
  'strapi_fetch_cf_cache_age_seconds',
  {
    description:
      'Age in seconds of CF-cached Strapi API responses at fetch time.',
    unit: 's',
  },
);

export const recordFetchCacheMetric = ({
  endpoint,
  cfCacheStatus,
  ageSeconds,
}: {
  endpoint: string;
  cfCacheStatus: string;
  ageSeconds: number | null;
}) => {
  try {
    cacheStatusCounter.add(1, { endpoint, cf_cache_status: cfCacheStatus });

    if (ageSeconds !== null) {
      cacheAgeHistogram.record(ageSeconds, {
        endpoint,
        cf_cache_status: cfCacheStatus,
      });
    }
  } catch (error) {
    console.error(error, 'Error recording fetch cache metric.');
  }
};
