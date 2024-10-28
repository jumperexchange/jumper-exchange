import { WalletCardContainer } from '@/components/Menus';
import PortfolioToken from '@/components/Portfolio/PortfolioToken';
import TotalBalance from '@/components/Portfolio/TotalBalance';
import { usePortfolioTokens } from '@/utils/getTokens/usePortfolioTokens';
import { Badge, Box, Skeleton, Stack, useTheme } from '@mui/material';
import PortfolioTokenSkeleton from './PortfolioTokensSkeleton';

export function Portfolio() {
  const { isSuccess, refetch, isFetching, data } = usePortfolioTokens();

  return (
    <>
      <TotalBalance
        refetch={refetch}
        isFetching={isFetching}
        isComplete={isSuccess}
      />
      <Stack spacing={1}>
        {!isSuccess && data.length == 0 && <PortfolioTokenSkeleton />}
        {(data || []).map((token) => (
          <PortfolioToken
            token={token}
            key={`${token.chainId}-${token.address}`}
          />
        ))}
      </Stack>
    </>
  );
}
