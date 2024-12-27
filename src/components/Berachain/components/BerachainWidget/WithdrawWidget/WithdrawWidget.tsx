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
import ConnectButton from '@/components/Navbar/ConnectButton';

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
      {/* <FormControl fullWidth sx={{ marginTop: theme.spacing(2) }}>
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
      </FormControl> */}
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
                // TODO: to remove
                // eslint-disable-next-line no-console
                console.error(error);
              }
            }}
          >
            <Typography variant="bodyMediumStrong">Switch chain</Typography>
          </CustomLoadingButton>
        </Box>
      ) : withdrawType === MarketWithdrawType.input_token.id ? (
        <WithdrawWidgetInputTokenTab market={market} chain={chain} />
      ) : (
        withdrawType === MarketWithdrawType.incentives.id && (
          <WithdrawWidgetIncentiveTab market={market} chain={chain} />
        )
      )}
    </Box>
  );
};
