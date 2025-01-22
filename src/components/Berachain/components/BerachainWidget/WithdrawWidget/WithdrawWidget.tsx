import type { SelectChangeEvent } from '@mui/material';
import { Box, Typography, useTheme } from '@mui/material';
import type { EnrichedMarketDataType } from 'royco/queries';
import InfoBlock from '@/components/Berachain/components/BerachainWidget/InfoBlock';

import { useConfig } from 'wagmi';
import { useAccount } from '@lifi/wallet-management';
import { useMemo, useState } from 'react';
import { CustomLoadingButton } from '@/components/Berachain/components/BerachainWidget/LoadingButton.style';
import { switchChain } from '@wagmi/core';
import type { ExtendedChain } from '@lifi/sdk';
import { WithdrawWidgetInputTokenTab } from '@/components/Berachain/components/BerachainWidget/WithdrawWidget/WithdrawWidgetInputTokenTab';
import { WithdrawWidgetIncentiveTab } from '@/components/Berachain/components/BerachainWidget/WithdrawWidget/WithdrawWidgetIncentiveTab';
import ConnectButton from '@/components/Navbar/ConnectButton';
import { ClaimingInformation } from '../ClaimingInformation';
import { useEnrichedAccountBalancesRecipeInMarket } from 'royco/hooks';

export type TypedMarketWithdrawType = 'input_token' | 'incentives';
export const MarketWithdrawType: Record<
  TypedMarketWithdrawType,
  {
    id: TypedMarketWithdrawType;
    label: string;
  }
> = {
  input_token: {
    id: 'input_token',
    label: 'Input Token',
  },
  incentives: {
    id: 'incentives',
    label: 'Incentives',
  },
};
interface Image {
  url?: string;
  name?: string;
}

interface WithdrawWidgetProps {
  market: EnrichedMarketDataType;
  chain?: ExtendedChain;
  overrideStyle?: {
    mainColor?: string;
  };
  appLink?: string;
  appName?: string;
  fullAppName?: string;
  image?: Image & { badge?: Image };
}

export const WithdrawWidget = ({
  market,
  chain,
  overrideStyle = {},
  appLink,
  appName,
  fullAppName,
  image,
}: WithdrawWidgetProps) => {
  const wagmiConfig = useConfig();
  const { account } = useAccount();
  const theme = useTheme();
  const [withdrawType, setWithdrawType] = useState('input_token');

  const { data: recipe, refetch } = useEnrichedAccountBalancesRecipeInMarket({
    chain_id: market.chain_id!,
    market_id: market.market_id!,
    account_address: account?.address?.toLowerCase() ?? '',
    custom_token_data: undefined,
  });

  const shouldSwitchChain = useMemo(() => {
    if (account?.isConnected && market.chain_id !== account?.chainId) {
      return true;
    }
    return false;
  }, [account?.chainId, account?.isConnected]);

  return (
    <Box sx={{ marginTop: theme.spacing(1.5) }}>
      <InfoBlock
        market={market}
        sx={{ marginBottom: theme.spacing(3), padding: theme.spacing(1) }}
        recipe={recipe}
      />
      {!account?.isConnected ? (
        <Box
          sx={{
            marginY: 1,
            '& > button': {
              width: '100%!important',
            },
          }}
        >
          <ConnectButton />
        </Box>
      ) : shouldSwitchChain ? (
        <Box sx={{ marginTop: theme.spacing(1.5) }}>
          <CustomLoadingButton
            fullWidth
            overrideStyle={overrideStyle}
            type="button"
            // loading={isLoading || isTxPending || isTxConfirming}
            variant="contained"
            onClick={async () => {
              try {
                await switchChain(wagmiConfig, {
                  chainId: market?.chain_id!,
                });
              } catch (error) {
                // eslint-disable-next-line no-console
                console.error(error);
              }
            }}
          >
            <Typography variant="bodyMediumStrong">Switch chain</Typography>
          </CustomLoadingButton>
        </Box>
      ) : withdrawType === MarketWithdrawType.input_token.id ? (
        <WithdrawWidgetInputTokenTab
          market={market}
          appName={fullAppName}
          chain={chain}
          image={image}
          refetch={refetch}
        />
      ) : (
        withdrawType === MarketWithdrawType.incentives.id && (
          <WithdrawWidgetIncentiveTab market={market} chain={chain} />
        )
      )}
      <ClaimingInformation
        link={appLink ?? 'https://jumper.exchange'}
        appName={appName}
      />
    </Box>
  );
};
