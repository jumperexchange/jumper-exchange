import { useLoyaltyPass } from 'src/hooks/useLoyaltyPass';
import { usePaginatedData } from 'src/hooks/usePaginatedData';
import { PAGE_SIZE } from 'src/const/quests';
import { PDA } from 'src/types/loyaltyPass';

export const useAchievementsInfinite = (
  walletAddress?: string,
  initialData?: PDA[],
  pageSize: number = PAGE_SIZE,
) => {
  // @Note For now, simulate pagination with existing data
  // When backend supports pagination, this can be replaced with proper API calls
  const { pdas, isLoading } = useLoyaltyPass(walletAddress);

  return usePaginatedData({
    queryKey: ['achievements', walletAddress, pageSize],
    queryFn: async (page: number, pageSize: number) => {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 250));

      if (!pdas) return [];

      const startIndex = (page - 1) * pageSize;
      const endIndex = startIndex + pageSize;
      return pdas.slice(startIndex, endIndex);
    },
    initialData: initialData || pdas?.slice(0, pageSize),
    pageSize,
    enabled: !!walletAddress && !isLoading,
  });
};
