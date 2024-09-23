import { Box, Skeleton, Stack, useTheme } from '@mui/material';
import { usePortfolioStore } from '@/stores/portfolio';
import { useAccounts } from '@/hooks/useAccounts';
import { useTranslation } from 'react-i18next';
import { useTokenBalances } from '@/hooks/useTokenBalances';
import TotalBalance from '@/components/Portfolio/TotalBalance';
import { WalletCardContainer } from '@/components/Menus';
import PortfolioToken from '@/components/Portfolio/PortfolioToken';
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
          Array.from({ length: 8 }, () => 42).map((token) => (
            <WalletCardContainer>
              <Stack direction="row" spacing={1} sx={{ width: '100%' }}>
                <Skeleton variant="circular" width={46} height={40} />
                <Box
                  sx={{
                    width: '100%',
                    display: 'flex',
                    justifyContent: 'space-between',
                  }}
                >
                  <Stack direction="column" alignItems="start" spacing={1}>
                    <Skeleton variant="rectangular" width={100} height={24} />
                    <Skeleton variant="text" width={70} height={24} />
                  </Stack>
                  <Stack direction="column" alignItems="end" spacing={1}>
                    <Skeleton variant="rectangular" width={100} height={24} />
                    <Skeleton variant="text" width={50} height={24} />
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
