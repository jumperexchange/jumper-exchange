import { WalletCardContainer } from '@/components/Menus';
import PortfolioToken from '@/components/Portfolio/PortfolioToken';
import TotalBalance from '@/components/Portfolio/TotalBalance';
import { useTokens } from '@/utils/getTokens';
import { Stack, Box, useTheme } from '@mui/material';
import PortfolioTokenSkeleton from './PortfolioTokensSkeleton';

function Portfolio() {
  const { isSuccess, refetch, isFetching, data } = useTokens();
  const theme = useTheme();

  return (
    <Box sx={{ paddingX: '1.25rem' }}>
      <TotalBalance
        refetch={refetch}
        isFetching={isFetching}
        isComplete={isSuccess}
      />
      <Stack spacing={1} marginY={theme.spacing(2)}>
        {!isSuccess && data.length == 0 && <PortfolioTokenSkeleton />}
        {(data || []).map((token) => (
          <PortfolioToken
            token={token}
            key={`${token.chainId}-${token.address}`}
          />
        ))}
      </Stack>
    </Box>
  );
}

export default Portfolio;
