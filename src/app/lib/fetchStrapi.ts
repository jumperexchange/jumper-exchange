import { logger } from '@/utils/logger';
import { recordFetchCacheMetric } from '@/utils/telemetry/recordFetchCacheMetric';

export async function fetchStrapi(
  url: string,
  options: RequestInit,
  endpoint: string,
): Promise<Response> {
  const res = await fetch(url, options);

  try {
    const cfCacheStatus = res.headers.get('cf-cache-status') ?? 'none';
    const ageRaw = res.headers.get('age');
    const ageParsed = ageRaw !== null ? Number(ageRaw) : NaN;
    const ageSeconds =
      Number.isFinite(ageParsed) && ageParsed >= 0 ? ageParsed : null;
    const cacheControl = res.headers.get('cache-control') ?? 'none';

    recordFetchCacheMetric({ endpoint, cfCacheStatus, ageSeconds });

    logger.debug(
      {
        endpoint,
        cfCacheStatus,
        age: ageSeconds,
        cacheControl,
        status: res.status,
        url,
      },
      'strapi fetch',
    );
  } catch (error) {
    console.error(error, 'Error instrumenting Strapi fetch.');
  }

  return res;
}
