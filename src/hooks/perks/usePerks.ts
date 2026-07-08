import { useQuery } from '@tanstack/react-query';
import { getAllPerks } from '@/app/lib/getPerks';

/**
 * Client-side fetch of the perks list — the same query the profile page runs
 * on the server. Lets components outside the profile tree (e.g. the navbar)
 * derive perk counts.
 */
export const usePerks = () => {
  const { data, isLoading } = useQuery({
    queryKey: ['perks'],
    queryFn: () => getAllPerks(),
    // Matches the server-side revalidate window of getPerks.
    staleTime: 1000 * 60 * 5,
  });

  return { perks: data ?? [], isLoading };
};
