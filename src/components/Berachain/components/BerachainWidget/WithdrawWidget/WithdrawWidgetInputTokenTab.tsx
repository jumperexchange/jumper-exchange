import {
  Box,
  FormControlLabel,
  Radio,
  RadioGroup,
  Typography,
  useTheme,
} from '@mui/material';
import type { EnrichedMarketDataType } from 'royco/queries';
import {
  getRecipeInputTokenWithdrawalTransactionOptions,
  useEnrichedPositionsRecipe,
  useEnrichedPositionsVault,
} from 'royco/hooks';
import { useWaitForTransactionReceipt, useWriteContract } from 'wagmi';
import { useAccount } from '@lifi/wallet-management';
import { RoycoMarketType, RoycoMarketUserType } from 'royco/market';
import { WithdrawInputTokenRow } from '@/components/Berachain/components/BerachainWidget/WithdrawWidget/WithdrawInputTokenRow';
import type { ChangeEvent } from 'react';
import { useEffect, useState } from 'react';
import { CustomLoadingButton } from '@/components/Berachain/components/BerachainWidget/LoadingButton.style';
import type { ExtendedChain } from '@lifi/sdk';
import { TxConfirmation } from '../TxConfirmation';

export const WithdrawWidgetInputTokenTab = ({
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
  const { account } = useAccount();
  const [value, setValue] = useState(0);
  const theme = useTheme();

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setValue(parseInt((event.target as HTMLInputElement).value, 10));
  };

  const {
    status: txStatus,
    data: txHash,
    isIdle: isTxIdle,
    isPending: isTxPending,
    isError: isTxError,
    error: txError,
    writeContract,
    reset: resetTx,
  } = useWriteContract();

  // TODO: to remove
  // eslint-disable-next-line no-console
  console.log('writecontract', {
    status: txStatus,
    data: txHash,
    isIdle: isTxIdle,
    isPending: isTxPending,
    isError: isTxError,
    error: txError,
    writeContract,
    reset: resetTx,
  });

  const {
    isLoading: isTxConfirming,
    isSuccess: isTxConfirmed,
    isError: isTxConfirmError,
    status: confirmationStatus,
  } = useWaitForTransactionReceipt({
    chainId: market.chain_id ?? undefined,
    hash: txHash,
    confirmations: 2,
    pollingInterval: 1_000,
  });

  // TODO: to remove
  // eslint-disable-next-line no-console
  console.log('waitTransactionReceipt', {
    txHash,
    isLoading: isTxConfirming,
    isSuccess: isTxConfirmed,
    isError: isTxConfirmError,
    status: confirmationStatus,
  });

  const {
    isLoading: isLoadingPositionsRecipe,
    data: positionsRecipe,
    isSuccess: positionsRecipeSuccess,
    isError,
    error,
    refetch,
  } = useEnrichedPositionsRecipe({
    chain_id: market.chain_id!,
    market_id: market.market_id!,
    account_address: (account?.address?.toLowerCase() as string) ?? '',
    page_index: 0,
    filters: [
      {
        id: 'offer_side',
        value: 0,
      },
    ],
  });

  const {
    isLoading: isLoadingPositionsVault,
    data: positionsVault,
    isError: isErrorPositionsVault,
    error: errorPositionsVault,
  } = useEnrichedPositionsVault({
    chain_id: market.chain_id!,
    market_id: market.market_id!,
    account_address: (account?.address?.toLowerCase() as string) ?? '',
    page_index: 0,
    filters: [
      {
        id: 'offer_side',
        value: RoycoMarketUserType.ap.value,
      },
      {
        id: 'is_withdrawn',
        value: false,
      },
    ],
  });

  const positions =
    market.market_type === RoycoMarketType.recipe.value &&
    Array.isArray(positionsRecipe?.data)
      ? positionsRecipe.data.filter((d) => !d?.is_withdrawn)
      : [];

  // TODO: to remove
  // eslint-disable-next-line no-console
  console.log('-positions', positions, positionsRecipe, positionsVault);

  useEffect(() => {
    refetch();
  }, [isTxConfirmed]);

  if (positionsRecipeSuccess && positions.length === 0) {
    return (
      <Box
        sx={{
          height: '100%',
          width: '100%',
          display: 'grid', // 'place-content-center' is equivalent to a grid with centered content.
          placeContent: 'center', // Centers content horizontally and vertically.
          alignItems: 'start', // Aligns items at the start along the cross-axis.
          marginTop: theme.spacing(2),
        }}
      >
        {/*<div className="h-full w-full place-content-center items-start">*/}
        <Typography variant="bodyLargeStrong" color="textSecondary">
          No withdrawable positions found
        </Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        marginY: 1,
      }}
    >
      <Typography variant="bodyLargeStrong" color="textSecondary">
        Select a position
      </Typography>
      <RadioGroup
        aria-labelledby="input-token"
        name="input-token"
        sx={{}}
        value={value}
        onChange={handleChange}
      >
        {positions.map((position, positionIndex) => {
          return (
            <FormControlLabel
              value={positionIndex}
              sx={{
                display: 'flex', // Equivalent to `flex`
                justifyContent: 'space-between', // Equivalent to `justify-between`
                alignItems: 'flex-start',
                gap: 2, // Equivalent to `gap-2` (MUI uses theme-based spacing; `2` = 2 * 8px = 16px)
                borderRadius: '16px', // Equivalent to `rounded-2xl` (16px)
                border:
                  value !== positionIndex
                    ? '1px solid #554F4E'
                    : '1px solid #FF8425', // Creates the border
                padding: 3, // Equivalent to `p-3` (MUI uses theme-based spacing; `3` = 3 * 8px = 24px)
                marginY: 1,
                marginX: 0,
              }}
              control={
                <Radio
                  sx={{ visibility: 'hidden' }}
                  disabled={position?.can_withdraw !== true}
                />
              }
              labelPlacement="start"
              label={
                <Box
                  component="span"
                  sx={{
                    display: 'flex', // Equivalent to `flex`
                    width: '100%', // Equivalent to `w-full`
                    flexDirection: 'row', // Equivalent to `flex-row`
                    alignItems: 'center', // Equivalent to `items-center`
                  }}
                  // className="flex w-full flex-row items-center justify-between gap-2 rounded-2xl border border-divider p-3"
                >
                  <Box
                    component="span"
                    sx={{
                      display: 'flex', // Equivalent to `flex`
                      flexGrow: 1, // Equivalent to `grow`
                      flexDirection: 'column', // Equivalent to `flex-col`
                      alignItems: 'start', // Equivalent to `items-start`
                      gap: 1, // Equivalent to `space-y-1` (MUI uses theme-based spacing; `1` = 1 * 8px = 8px)
                      overflowX: 'scroll', // Equivalent to `overflow-x-scroll`
                    }}
                    // className="hide-scrollbar flex w-full grow flex-col items-start space-y-1 overflow-x-scroll"
                  >
                    <Typography
                      sx={{
                        whiteSpace: 'nowrap', // Equivalent to `whitespace-nowrap`
                        wordBreak: 'normal', // Equivalent to `break-normal`
                        color: 'text.primary', // Equivalent to `text-black`
                      }}
                      // className="whitespace-nowrap break-normal text-black"
                    >
                      Value:{' '}
                      {Intl.NumberFormat('en-US', {
                        style: 'currency',
                        currency: 'USD',
                        notation: 'standard',
                        useGrouping: true,
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      }).format(
                        position?.input_token_data?.token_amount_usd ?? 0,
                      )}
                    </Typography>
                    {!position?.can_withdraw && (
                      <Typography
                        sx={{
                          whiteSpace: 'nowrap', // Equivalent to `whitespace-nowrap`
                          wordBreak: 'normal', // Equivalent to `break-normal`
                          color: 'text.primary', // Equivalent to `text-black`
                        }}
                        // className="whitespace-nowrap break-normal text-black"
                      >
                        LOCKED
                      </Typography>
                    )}
                    <Box
                      component="span"
                      sx={{
                        display: 'flex', // Equivalent to `flex`
                        width: '100%', // Equivalent to `w-full`
                        flexGrow: 1, // Equivalent to `grow`
                        flexDirection: 'column', // Equivalent to `flex-col`
                        gap: 3, // Equivalent to `space-y-3` (MUI uses theme-based spacing; `3` = 3 * 8px = 24px)
                      }}
                      // className="flex w-full grow flex-col space-y-3"
                    >
                      <WithdrawInputTokenRow
                        key={`withdraw-input-token-row:${positionIndex}`}
                        token={position?.input_token_data}
                      />
                    </Box>
                  </Box>
                </Box>
              }
              // delay={0.1 + positionIndex * 0.1}
              // className="w-full"
              key={`withdraw-position:${positionIndex}`}
            />
          );
        })}
      </RadioGroup>
      <CustomLoadingButton
        sx={{
          marginY: 1,
        }}
        variant="contained"
        loading={isTxConfirming || isTxPending}
        overrideStyle={{
          mainColor: '#FF8425',
        }}
        disabled={
          !positions[value]?.can_withdraw ||
          BigInt(positions[value]?.input_token_data?.raw_amount ?? 0) ===
            BigInt(0)
        }
        onClick={() => {
          if (!!positions[value]) {
            const contractOptions =
              getRecipeInputTokenWithdrawalTransactionOptions({
                chain_id: market.chain_id!,
                position: {
                  // @ts-expect-error
                  weiroll_wallet: positions[value].weiroll_wallet,
                  token_data: positions[value].input_token_data,
                },
              });
            // @ts-expect-error
            writeContract(contractOptions);
          }
        }}
        fullWidth
      >
        <Typography variant="bodyMediumStrong">Withdraw</Typography>
      </CustomLoadingButton>
      {isTxConfirmed && txHash ? (
        <TxConfirmation
          s={'Withdrawal successful'}
          link={`${chain?.metamask.blockExplorerUrls?.[0] ?? 'https://etherscan.io'}/tx/${txHash}`}
          success={true}
        />
      ) : (
        txHash && (
          <TxConfirmation
            s={'Transaction link'}
            link={`${chain?.metamask.blockExplorerUrls?.[0] ?? 'https://etherscan.io'}/tx/${txHash}`}
          />
        )
      )}
      {/* {txHash && (
        <Box
          sx={{
            flexShrink: 0, // Equivalent to `shrink-0`
          }}
          // className="w-24 shrink-0"
        >
          <Typography
            component="a"
            href={`${chain?.metamask.blockExplorerUrls?.[0] ?? 'https://etherscan.io'}/tx/${txHash}`}
            target="_blank"
          >
            Transaction link
          </Typography>
        </Box>
      )} */}
      {/* {isTxConfirmed && (
        <Box>
          <Typography variant="body2" color="textSecondary">
            Transaction successfull!
          </Typography>
        </Box>
      )} */}
    </Box>
  );
};
