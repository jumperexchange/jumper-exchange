import { useAccount } from '@lifi/wallet-management';

import Stack from '@mui/material/Stack';
import TotalBalance from './TotalBalance';
import { ExtendedTokenAmount } from 'src/utils/getTokens';
import { FC } from 'react';
import { CacheToken } from 'src/types/portfolio';
import { WalletCard } from '../Menus/WalletMenu/WalletCard';
import { PortfolioByAccountWrapper } from './Portfolio.styles';
import Divider from '@mui/material/Divider';
import { PortfolioToken } from '../composite/PortfolioToken/PortfolioToken';
import { useMenuStore } from 'src/stores/menu';
import { useWidgetCacheStore } from 'src/stores/widgetCache';
import { useRouter } from 'next/navigation';
import { useMainPaths } from 'src/hooks/useMainPaths';
import { PortfolioTokenSkeleton } from '../composite/PortfolioToken/PortfolioTokenSkeleton';
import generateKey from 'src/app/lib/generateKey';

interface PortfolioByAccountProps {
  walletAddress: string;
  refetch: () => void;
  isFetching: boolean;
  isSuccess: boolean;
  data: (ExtendedTokenAmount | CacheToken)[];
}

export const PortfolioByAccount: FC<PortfolioByAccountProps> = ({
  walletAddress,
  refetch,
  isFetching,
  isSuccess,
  data,
}) => {
  const { accounts } = useAccount();
  const account = accounts?.find(
    (account) => account.address === walletAddress,
  );
  const { isMainPaths } = useMainPaths();
  const router = useRouter();
  const setFrom = useWidgetCacheStore((state) => state.setFrom);
  const { setWalletMenuState } = useMenuStore((state) => state);

  if (!account) {
    return null;
  }

  const handleSelectToken = (token: { address: string; chainId: number }) => {
    setFrom(token.address, token.chainId);
    setWalletMenuState(false);

    if (!isMainPaths) {
      router.push('/');
    }
  };

  return (
    <PortfolioByAccountWrapper>
      <WalletCard account={account} />
      <TotalBalance
        refetch={refetch}
        isFetching={isFetching}
        isComplete={isSuccess}
        walletAddress={walletAddress}
      />
      <Divider
        sx={(theme) => ({
          borderColor: (theme.vars || theme).palette.alpha100.main,
        })}
      />
      <Stack>
        {!isSuccess &&
          data.length == 0 &&
          new Array(8)
            .fill(undefined)
            .map((token) => (
              <PortfolioTokenSkeleton key={generateKey('token')} />
            ))}
        {(data || []).map((token) => (
          <PortfolioToken
            token={token}
            key={`${token.chainId}-${token.address}`}
            onSelect={handleSelectToken}
          />
        ))}
      </Stack>
    </PortfolioByAccountWrapper>
  );
};
