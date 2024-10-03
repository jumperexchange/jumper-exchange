import { Box, Skeleton, Stack, Badge } from '@mui/material';
import { usePortfolioStore } from '@/stores/portfolio';
import { useAccounts } from '@/hooks/useAccounts';
import TotalBalance from '@/components/Portfolio/TotalBalance';
import { WalletCardContainer } from '@/components/Menus';
import PortfolioToken from '@/components/Portfolio/PortfolioToken';
import { useEffect, useState } from 'react';
import type { ExtendedTokenAmount } from '@/utils/getTokens';
import getTokens, { ResultTokenBalance } from '@/utils/getTokens';

function Portfolio() {
  const { accounts } = useAccounts();
  const [data, setData] = useState<ExtendedTokenAmount[]>([]);
  const [cumulativePriceUSD, setCumulativePriceUSD] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [forceRefresh, setForceRefresh] = usePortfolioStore((state) => [
    state.forceRefresh,
    state.setForceRefresh,
  ]);
  const handleProgress = (
    round: number,
    cumulativePriceUSD: number,
    fetchedBalances: ExtendedTokenAmount[],
  ) => {
    console.log(`\n** Round ${round} **`);
    console.log(`Cumulative Price USD: $${cumulativePriceUSD.toFixed(2)}`);
    console.log(`Fetched Balances this Round:`, fetchedBalances);

    setCumulativePriceUSD(cumulativePriceUSD);
    setData(fetchedBalances);
  };

  const handleComplete = () => {
    setIsComplete(true);
  };

  useEffect(() => {
    if (!accounts?.[0]?.address) {
      return;
    }

    getTokens(accounts?.[0]?.address, handleProgress, handleComplete);
  }, [accounts?.[0].address]);

  return (
    <>
      <TotalBalance isComplete={isComplete} totalValue={cumulativePriceUSD} />
      <Stack spacing={1}>
        {data.length == 0 &&
          Array.from({ length: 5 }, () => 42).map((token) => (
            <WalletCardContainer>
              <Stack direction="row" spacing={1} sx={{ width: '100%' }}>
                <Box>
                  <Badge
                    overlap="circular"
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                    badgeContent={
                      <Skeleton
                        variant="circular"
                        width={16}
                        height={16}
                        sx={{
                          border: `1px solid #FFFFFF`,
                        }}
                      />
                    }
                  >
                    <Skeleton variant="circular" width={40} height={40} />
                  </Badge>
                </Box>
                <Box
                  sx={{
                    width: '100%',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  <Stack direction="column" alignItems="start" spacing={1}>
                    <Skeleton
                      variant="rectangular"
                      width={64}
                      height={16}
                      sx={{ borderRadius: '32px' }}
                    />
                    <Skeleton
                      variant="text"
                      width={96}
                      height={16}
                      sx={{ borderRadius: '32px' }}
                    />
                  </Stack>
                  <Stack direction="column" alignItems="end" spacing={1}>
                    <Skeleton
                      variant="rectangular"
                      width={64}
                      height={16}
                      sx={{ borderRadius: '32px' }}
                    />
                    <Skeleton
                      variant="text"
                      width={48}
                      height={16}
                      sx={{ borderRadius: '32px' }}
                    />
                  </Stack>
                </Box>
              </Stack>
            </WalletCardContainer>
          ))}
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

export default Portfolio;
