import type { Balance, ExtendedToken } from '@/types/tokens';
import type { FC } from 'react';
import { useMemo } from 'react';
import { usePortfolioBalances } from '@/providers/PortfolioProvider/PortfolioContext';
import { Summary } from '@/components/composite/JumperWidget/components/Summary';
import type { ComposeResponseData } from '@/app/lib/lifi-composer-client';
import Box from '@mui/material/Box';
import { AvatarItem } from '@/components/core/AvatarStack/AvatarItem';
import Typography from '@mui/material/Typography';
import { AvatarSize } from '@/components/core/AvatarStack/AvatarStack.types';
import { ComposerNetworkCost } from '../../JumperWidget/components/NetworkCost/ComposerNetworkCost';

const fieldSx = { background: 'transparent', boxShadow: 'none', padding: 0 };

interface RouteOverviewProps {
  composerQuote?: ComposeResponseData;
  nativeTokenBalance?: Balance<ExtendedToken>;
  slippage: number;
}

export const RouteOverview: FC<RouteOverviewProps> = ({
  composerQuote,
  nativeTokenBalance,
  slippage,
}) => {
  const { balances: portfolioBalances } = usePortfolioBalances();

  const flatBalances = useMemo(
    () => Object.values(portfolioBalances ?? {}).flat(),
    [portfolioBalances],
  );

  const fromBalances = useMemo(() => {
    if (!composerQuote) {
      return [];
    }
    const approvalAddresses = new Set(
      composerQuote.approvals.map((a) => a.token.toLowerCase()),
    );
    return flatBalances.filter((b) =>
      approvalAddresses.has(b.token.address.toLowerCase()),
    );
  }, [flatBalances, composerQuote]);

  if (!composerQuote || fromBalances.length === 0 || !nativeTokenBalance) {
    return null;
  }

  return (
    <>
      <Summary
        label="Convert"
        from={fromBalances}
        amountUSD={composerQuote.priceImpact.inputValueUsd}
        to={nativeTokenBalance}
        fieldSx={fieldSx}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            gap: 2,
          }}
        >
          <AvatarItem
            avatar={{
              src: 'https://raw.githubusercontent.com/lifinance/types/main/src/assets/icons/protocols/wrapper.svg',
              alt: 'Composer',
              id: 'step',
            }}
            size={AvatarSize.XL}
          />
          <Typography variant="bodySmallStrong">Composer via Li.Fi</Typography>
        </Box>
      </Summary>
      <ComposerNetworkCost
        composerQuote={composerQuote}
        outputToken={nativeTokenBalance.token}
        slippage={slippage}
      />
    </>
  );
};
