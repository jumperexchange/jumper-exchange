import { WalletCardContainer } from '@/components/Menus';
import PortfolioToken from '@/components/Portfolio/PortfolioToken';
import TotalBalance from '@/components/Portfolio/TotalBalance';
import { useAccounts } from '@/hooks/useAccounts';
import { useTokenBalances } from '@/hooks/useTokenBalances';
import { usePortfolioStore } from '@/stores/portfolio';
import { Badge, Box, Skeleton, Stack } from '@mui/material';
import { useEffect } from 'react';

function Portfolio() {
  const { accounts } = useAccounts();
  const [forceRefresh, setForceRefresh] = usePortfolioStore((state) => [
    state.forceRefresh,
    state.setForceRefresh,
  ]);
  const { refetch, data, totalValue, isLoading, isRefetching } =
    useTokenBalances(accounts);

  useEffect(() => {
    if (!forceRefresh) {
      return;
    }

    setForceRefresh(false);
    refetch();
  }, [forceRefresh]);

  return (
    <>
      <TotalBalance refetch={refetch} totalValue={totalValue} />
      <Stack spacing={1}>
        {(isLoading || isRefetching) &&
          Array.from({ length: 8 }, () => 42).map((token, index) => (
            <WalletCardContainer key={`wallet-portfolio-${index}`}>
              <Stack direction="row" spacing={1} sx={{ width: '100%' }}>
                <Box>
                  <Badge
                    overlap="circular"
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                    badgeContent={
                      <Skeleton
                        variant="circular"
                        width={24}
                        height={24}
                        sx={{
                          border: `4px solid #FFFFFF`,
                        }}
                      />
                    }
                  >
                    <Skeleton variant="circular" width={46} height={46} />
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
        {(data || []).map((token, index) => (
          <PortfolioToken token={token} key={index} />
        ))}
      </Stack>
    </>
  );
}

export default Portfolio;
