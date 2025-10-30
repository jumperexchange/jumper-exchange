import { useRouter } from 'next/navigation';
import { useMainPaths } from 'src/hooks/useMainPaths';
import { useMenuStore } from 'src/stores/menu';
import { useWidgetCacheStore } from 'src/stores/widgetCache';
import { WalletBalanceCardProps } from './WalletBalanceCard.types';
import { FC, useMemo } from 'react';
import { useAccount } from '@lifi/wallet-management';
import Divider from '@mui/material/Divider';
import { WalletBalanceCardContainer } from './WalletBalanceCard.styles';
import Stack from '@mui/material/Stack';
import generateKey from 'src/app/lib/generateKey';
import { TokenListCardSkeleton } from '../TokenListCard/TokenListCardSkeleton';
import { TokenListCard } from '../TokenListCard/TokenListCard';
import { MinimalToken } from 'src/types/tokens';
import { WalletTotalBalance } from './components/WalletTotalBalance';
import { WalletWithActions } from './components/WalletWithActions';

export const WalletBalanceCard: FC<WalletBalanceCardProps> = ({
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

  const tokens = useMemo(() => {
    if (data?.length === 0) {
      return [];
    }

    return data.map((token) => ({
      address: token.address,
      symbol: token.symbol,
      chain: {
        chainId: token.chainId,
        chainKey: 'chainName' in token ? (token.chainName ?? '') : '',
      },
      balance: token.cumulatedBalance ?? 0,
      totalPriceUSD: token.cumulatedTotalUSD ?? 0,
      relatedTokens: token.chains.map((chain) => ({
        address: chain.address,
        symbol: chain.symbol,
        chain: {
          chainId: chain.chainId,
          chainKey: chain.chainName ?? '',
        },
        balance: chain.cumulatedBalance ?? 0,
        totalPriceUSD: chain.totalPriceUSD ?? 0,
      })),
    }));
  }, [data]);

  if (!account) {
    return null;
  }

  const handleSelectToken = (token: MinimalToken) => {
    setFrom(token.address, token.chain.chainId);
    setWalletMenuState(false);

    if (!isMainPaths) {
      router.push('/');
    }
  };
  return (
    <WalletBalanceCardContainer>
      <WalletWithActions account={account} />
      <WalletTotalBalance
        refetch={refetch}
        isFetching={isFetching}
        isComplete={isSuccess}
        account={account}
      />
      <Divider
        sx={(theme) => ({
          borderColor: (theme.vars || theme).palette.alpha100.main,
        })}
      />
      <Stack>
        {!isSuccess &&
          data.length == 0 &&
          Array.from({ length: 8 }).map(() => (
            <TokenListCardSkeleton key={generateKey('token')} />
          ))}
        {tokens.map((token) => (
          <TokenListCard
            token={token}
            key={`${token.chain.chainId}-${token.address}`}
            onSelect={handleSelectToken}
          />
        ))}
      </Stack>
    </WalletBalanceCardContainer>
  );
};
