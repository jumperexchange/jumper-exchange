'use client';

import { useQuery } from '@tanstack/react-query';
import { getMissionApy, getMissionTaskApy } from '@/app/lib/getMissionApy';
import type { MissionApyDto } from '@/types/jumper-backend';

export const missionApyQueryKeys = {
  all: ['mission-apy'] as const,
  byMission: (slug: string) => [...missionApyQueryKeys.all, slug] as const,
  byTask: (slug: string, identifier: string) =>
    [...missionApyQueryKeys.all, 'task', slug, identifier] as const,
};

export const useMissionApy = (slug?: string) => {
  return useQuery<MissionApyDto | null>({
    queryKey: missionApyQueryKeys.byMission(slug ?? ''),
    queryFn: async () => {
      const result = await getMissionApy(slug!);
      return result.data.data;
    },
    enabled: !!slug,
  });
};

export const useMissionTaskApy = (slug?: string, identifier?: string) => {
  return useQuery<MissionApyDto | null>({
    queryKey: missionApyQueryKeys.byTask(slug ?? '', identifier ?? ''),
    queryFn: async () => {
      const result = await getMissionTaskApy(slug!, identifier!);
      return result.data.data;
    },
    enabled: !!slug && !!identifier,
  });
};
