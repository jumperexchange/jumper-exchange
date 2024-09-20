import { Skeleton, Stack, useTheme } from '@mui/material';
import { usePortfolioStore } from '@/stores/portfolio';
import { useAccounts } from '@/hooks/useAccounts';
import { useTranslation } from 'react-i18next';
import { useTokenBalances } from '@/hooks/useTokenBalances';
import TotalBalance from '@/components/Portfolio/TotalBalance';
import { WalletCardContainer } from '@/components/Menus';
import PortfolioToken from '@/components/Portfolio/PortfolioToken';

function Portfolio() {
  const { accounts } = useAccounts();

  const { refetch, data, totalValue } = useTokenBalances(accounts);

  return (
    <>
      <TotalBalance refetch={refetch} totalValue={totalValue} />
      <Stack spacing={1}>
        {false &&
          new Array(8).fill(undefined).map((token) => (
            <WalletCardContainer>
              <Stack direction="row" spacing={1}>
                <Skeleton variant="circular" width={40} height={40} />
                <Stack direction="column" alignItems="center" spacing={1}>
                  <Skeleton variant="rectangular" width={100} height={24} />
                  <Skeleton variant="text" width={100} height={24} />
                </Stack>
                <Stack direction="column" alignItems="center" spacing={1}>
                  <Skeleton variant="rectangular" width={100} height={24} />
                  <Skeleton variant="text" width={100} height={24} />
                </Stack>
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
