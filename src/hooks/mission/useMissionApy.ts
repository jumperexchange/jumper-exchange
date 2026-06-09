'use client';

import { getMissionApy, getMissionTaskApy } from '@/app/lib/getMissionApy';
import type { MissionApyResponse } from '@/types/jumper-backend';
import { useQuery } from '@tanstack/react-query';

export const missionApyQueryKeys = {
  all: ['mission-apy'] as const,
  byMission: (slug: string) => [...missionApyQueryKeys.all, slug] as const,
  byTask: (slug: string, identifier: string) =>
    [...missionApyQueryKeys.all, 'task', slug, identifier] as const,
};

export const useMissionApy = (slug?: string) => {
  return useQuery<MissionApyResponse | null>({
    queryKey: missionApyQueryKeys.byMission(slug ?? ''),
    queryFn: async () => {
      const result = await getMissionApy(slug!);
      // @ts-expect-error: see LF-15589 - we are transforming data in the backend)
      return result.data.data;
    },
    enabled: !!slug,
  });
};

export const useMissionTaskApy = (slug?: string, identifier?: string) => {
  return useQuery<MissionApyResponse | null>({
    queryKey: missionApyQueryKeys.byTask(slug ?? '', identifier ?? ''),
    queryFn: async () => {
      const result = await getMissionTaskApy(slug!, identifier!);
      // @ts-expect-error: see LF-15589 - we are transforming data in the backend)
      return result.data.data;
    },
    enabled: !!slug && !!identifier,
  });
};
