import { usePortfolioTokens } from '@/utils/getTokens/usePortfolioTokens';
import { useFormatDisplayWalletTokens } from './useFormatDisplayWalletTokens';
import {
  filterTokensWithoutLpPositions,
  useLpPositions,
} from './useTokensWithoutLpPositions';
import { useMemo } from 'react';

export const usePortfolioDisplayTokens = () => {
  const {
    data: rawTokens,
    queriesByAddress: rawQueriesByAddress,
    isFetching,
    isSuccess,
    refetch,
    accounts,
  } = usePortfolioTokens();

  const lpTokens = useLpPositions();

  const data = useMemo(
    () => filterTokensWithoutLpPositions(rawTokens ?? [], lpTokens),
    [rawTokens, lpTokens],
  );

  const queriesByAddress = useMemo(() => {
    return new Map(
      Array.from(rawQueriesByAddress.entries()).map(([address, query]) => [
        address,
        {
          ...query,
          data: filterTokensWithoutLpPositions(query.data, lpTokens),
        },
      ]),
    );
  }, [rawQueriesByAddress, lpTokens]);

  const formattedData = useFormatDisplayWalletTokens(data);

  return {
    data,
    formattedData,
    queriesByAddress,
    isFetching,
    isSuccess,
    refetch,
    accounts,
  };
};
