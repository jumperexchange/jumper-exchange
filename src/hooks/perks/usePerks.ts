import { useQuery } from '@tanstack/react-query';
import { getPerks } from 'src/app/lib/getPerks';
import { PAGE_SIZE } from 'src/const/perks';

/**
 * Client-side fetch of the perks list — the same query the profile page runs
 * on the server. Lets components outside the profile tree (e.g. the navbar)
 * derive perk counts.
 */
export const usePerks = () => {
  const { data, isLoading } = useQuery({
    queryKey: ['perks'],
    queryFn: async () => {
      const { data } = await getPerks({
        page: 1,
        pageSize: PAGE_SIZE,
        withCount: true,
      });
      return data.data;
    },
    // Matches the server-side revalidate window of getPerks.
    staleTime: 1000 * 60 * 5,
  });

  return { perks: data ?? [], isLoading };
};
