import type { SelectChangeEvent } from '@mui/material';
import {
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Typography,
  useTheme,
} from '@mui/material';
import type { EnrichedMarketDataType } from 'royco/queries';
import BerachainTransactionDetails from '@/components/Berachain/components/BerachainTransactionDetails/BerachainTransactionDetails';
import InfoBlock from '@/components/Berachain/components/BerachainWidget/InfoBlock';

import { useConfig } from 'wagmi';
import { useAccount } from '@lifi/wallet-management';
import { useMemo, useState } from 'react';
import { CustomLoadingButton } from '@/components/Berachain/components/BerachainWidget/LoadingButton.style';
import { switchChain } from '@wagmi/core';
import type { ExtendedChain } from '@lifi/sdk';
import { WithdrawWidgetInputTokenTab } from '@/components/Berachain/components/BerachainWidget/WithdrawWidget/WithdrawWidgetInputTokenTab';
import { WithdrawWidgetIncentiveTab } from '@/components/Berachain/components/BerachainWidget/WithdrawWidget/WithdrawWidgetIncentiveTab';

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

export const WithdrawWidget = ({
  market,
  chain,
  overrideStyle = {},
}: {
  market: EnrichedMarketDataType;
  chain?: ExtendedChain;
  overrideStyle?: {
    mainColor?: string;
  };
}) => {
  const wagmiConfig = useConfig();
  const { account } = useAccount();
  const theme = useTheme();
  const [withdrawType, setWithdrawType] = useState('input_token');

  const handleChange = (event: SelectChangeEvent) => {
    setWithdrawType(event.target.value as string);
  };

  const shouldSwitchChain = useMemo(() => {
    if (account?.isConnected && market.chain_id !== account?.chainId) {
      return true;
    }
    return false;
  }, [account?.chainId, account?.isConnected]);

  return (
    <Box sx={{ marginTop: theme.spacing(1.5) }}>
      <InfoBlock market={market} />
      <BerachainTransactionDetails type="withdraw" market={market} />
      <FormControl fullWidth>
        <InputLabel id="withdraw-type-label">Withdraw type</InputLabel>
        <Select
          labelId="withdraw-type-label"
          id="demo-simple-select"
          value={withdrawType}
          label="Withdraw type"
          onChange={handleChange}
          MenuProps={{
            sx: {
              '.MuiMenu-list': {
                backgroundColor: '#121214',
              },
            },
          }}
          sx={{
            '.MuiSelect-icon': {
              color: 'text.primary',
            },
          }}
        >
          {Object.keys(MarketWithdrawType).map((key, index) => (
            <MenuItem
              value={MarketWithdrawType[key as TypedMarketWithdrawType].id}
              key={index}
            >
              {MarketWithdrawType[key as TypedMarketWithdrawType].label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      {!account?.isConnected && (
        <Box
          sx={{
            height: '100%',
            width: '100%',
            display: 'grid', // 'place-content-center' is equivalent to a grid with centered content.
            placeContent: 'center', // Centers content horizontally and vertically.
            alignItems: 'start', // Aligns items at the start along the cross-axis.
          }}
        >
          {/*<div className="h-full w-full place-content-center items-start">*/}
          <Typography variant="body2" color="textSecondary">
            Wallet not connected
          </Typography>
        </Box>
      )}
      {shouldSwitchChain && (
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
                // TODO: to remove
                // eslint-disable-next-line no-console
                console.error(error);
              }
            }}
          >
            <Typography variant="bodyMediumStrong">Switch chain</Typography>
          </CustomLoadingButton>
        </Box>
      )}
      {!shouldSwitchChain &&
        withdrawType === MarketWithdrawType.input_token.id && (
          <WithdrawWidgetInputTokenTab market={market} chain={chain} />
        )}
      {!shouldSwitchChain &&
        withdrawType === MarketWithdrawType.incentives.id && (
          <WithdrawWidgetIncentiveTab market={market} chain={chain} />
        )}
    </Box>
  );
};
