import { Box, Skeleton, Stack, Badge, useTheme } from '@mui/material';
import { usePortfolioStore } from '@/stores/portfolio';
import type { Account } from '@/hooks/useAccounts';
import { useAccounts } from '@/hooks/useAccounts';
import TotalBalance from '@/components/Portfolio/TotalBalance';
import { WalletCardContainer } from '@/components/Menus';
import PortfolioToken from '@/components/Portfolio/PortfolioToken';
import { useEffect, useState } from 'react';
import { merge } from 'lodash';
import type { ExtendedTokenAmount } from '@/utils/getTokens';
import getTokens, { ResultTokenBalance } from '@/utils/getTokens';

function Portfolio() {
  const { accounts } = useAccounts();
  const [cachedAccounts, setCachedAccounts] = useState<
    Pick<Account, 'address' | 'chainType'>[]
  >([]);
  const [data, setData] = useState<ExtendedTokenAmount[]>([]);
  const [cumulativePriceUSD, setCumulativePriceUSD] = useState<{
    [key: string]: number;
  }>({});
  const [isComplete, setIsComplete] = useState(false);
  const [forceRefresh, setForceRefresh] = usePortfolioStore((state) => [
    state.forceRefresh,
    state.setForceRefresh,
  ]);
  const theme = useTheme();
  const handleProgress = (
    account: string,
    round: number,
    totalPriceUSD: number,
    fetchedBalances: ExtendedTokenAmount[],
  ) => {
    console.log(`\n** Round ${round} **`);
    console.log(`Cumulative Price USD: $${totalPriceUSD.toFixed(2)}`);
    console.log(`Fetched Balances this Round:`, fetchedBalances);

    setCumulativePriceUSD((prev) => ({ ...prev, [account]: totalPriceUSD }));
    setData((prev) => {
      const updatedData = prev.map((item) => {
        const newItem = fetchedBalances.find(
          (balance) => balance.symbol === item.symbol,
        );
        return newItem ? newItem : item;
      });

      fetchedBalances.forEach((balance) => {
        if (!updatedData.some((item) => item.symbol === balance.symbol)) {
          updatedData.push(balance);
        }
      });

      return updatedData.sort(
        (a, b) => (b.cumulatedTotalUSD || 0) - (a.cumulatedTotalUSD || 0),
      );
    });
  };

  const handleComplete = () => {
    setIsComplete(true);
  };

  useEffect(() => {
    setCachedAccounts((prev) => {
      const accs = accounts.filter(
        (account) => account.isConnected && account.address,
      );
      if (prev.length === 0) {
        return accs.map((account) => ({
          address: account.address,
          chainType: account.chainType,
        }));
      }

      for (const account of accs) {
        if (
          !prev.find((prevAccount) => prevAccount.address === account.address)
        ) {
          return [
            ...prev,
            { address: account.address, chainType: account.chainType },
          ];
        }
      }

      return prev;
    });
  }, [accounts]);

  useEffect(() => {
    const intervals: (NodeJS.Timeout | undefined)[] = [];
    const fetchData = async () => {
      if (cachedAccounts.length === 0) {
        return;
      }

      for (const account of cachedAccounts) {
        const intervalId = await getTokens(
          account,
          handleProgress,
          handleComplete,
        );
        intervals.push(intervalId);
      }
    };

    fetchData();

    // Cleanup function
    return () => {
      for (const intervalId of intervals) {
        intervalId && clearInterval(intervalId);
      }
    };
  }, [cachedAccounts]);

  return (
    <>
      <TotalBalance
        isComplete={isComplete}
        totalValue={Object.values(cumulativePriceUSD).reduce(
          (sum, value) => sum + value,
          0,
        )}
      />
      <Stack spacing={1}>
        {data.length == 0 &&
          Array.from({ length: 10 }, () => 42).map((_, index) => (
            <WalletCardContainer key={index}>
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
                          border: `2px solid #FFFFFF`,
                          backgroundColor:
                            theme.palette.mode === 'light'
                              ? '#e4e4e4'
                              : '#3f3d56',
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
                      variant="rectangular"
                      width={96}
                      height={12}
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
