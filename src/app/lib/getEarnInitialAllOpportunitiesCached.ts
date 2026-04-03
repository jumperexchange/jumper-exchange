import { unstable_cache } from 'next/cache';

import { getOpportunitiesFiltered } from '@/app/lib/getOpportunitiesFiltered';

const ONE_HOUR_SECONDS = 60 * 60;

/**
 * Cached SSR payload for the Earn list empty filter.
 * Without this, client-only URL updates (e.g. nuqs `tab`) can trigger a new RSC run;
 * re-awaiting a cold `getOpportunitiesFiltered({})` suspends the segment and shows `loading.tsx`.
 */
export async function getEarnInitialAllOpportunitiesCached() {
  const run = unstable_cache(
    async () => {
      return getOpportunitiesFiltered({})
        .then((response) => response.data)
        .catch(() => ({
          data: [],
          meta: {
            total: 0,
            updatedAt: new Date().toISOString(),
          },
        }));
    },
    ['earn-initial-all-opportunities', 'empty-filter'],
    { revalidate: ONE_HOUR_SECONDS },
  );

  return run();
}
