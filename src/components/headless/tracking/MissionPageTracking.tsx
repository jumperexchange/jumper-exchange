'use client';

import { useAccountAddress } from '@/hooks/earn/useAccountAddress';
import { useMissionTracking } from '@/hooks/userTracking/useMissionTracking';
import { useEffect } from 'react';

export const MissionPageTracking = ({ slug }: { slug?: string }) => {
  const { trackMissionPageOverviewEvent } = useMissionTracking();
  const accountAddress = useAccountAddress();

  useEffect(() => {
    trackMissionPageOverviewEvent(slug);
  }, [accountAddress, slug, trackMissionPageOverviewEvent]);

  return null;
};
