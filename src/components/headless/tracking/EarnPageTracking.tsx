'use client';

import { useEarnTracking } from '@/hooks/userTracking/useEarnTracking';
import { useAccountAddress } from '@/hooks/earn/useAccountAddress';
import { useEffect } from 'react';

export const EarnPageTracking = ({ slug }: { slug?: string }) => {
  const { trackEarnPageOverviewEvent } = useEarnTracking();
  const accountAddress = useAccountAddress();

  useEffect(() => {
    trackEarnPageOverviewEvent(slug);
  }, [accountAddress, slug, trackEarnPageOverviewEvent]);

  return null;
};
