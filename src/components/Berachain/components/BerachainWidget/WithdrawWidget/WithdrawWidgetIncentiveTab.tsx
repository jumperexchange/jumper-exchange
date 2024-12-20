import {
  Box,
  FormControlLabel,
  Radio,
  RadioGroup,
  Typography,
} from '@mui/material';
import type {
  EnrichedMarketDataType,
  EnrichedPositionsRecipeDataType,
} from 'royco/queries';
import {
  getRecipeIncentiveTokenWithdrawalTransactionOptions,
  useEnrichedPositionsRecipe,
  useEnrichedPositionsVault,
} from 'royco/hooks';
import { useWaitForTransactionReceipt, useWriteContract } from 'wagmi';
import { useAccount } from '@lifi/wallet-management';
import { RoycoMarketType, RoycoMarketUserType } from 'royco/market';
import type { ChangeEvent } from 'react';
import { useEffect, useMemo, useState } from 'react';
import type { ExtendedChain } from '@lifi/sdk';
import { WithdrawInputTokenRow } from '@/components/Berachain/components/BerachainWidget/WithdrawWidget/WithdrawInputTokenRow';
import { CustomLoadingButton } from '@/components/Berachain/components/BerachainWidget/LoadingButton.style';

export const WithdrawWidgetIncentiveTab = ({
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
        id: 'can_claim',
        value: true,
      },
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
    ],
  });

  const positions =
    market.market_type === RoycoMarketType.recipe.value &&
    Array.isArray(positionsRecipe?.data)
      ? positionsRecipe.data
      : [];

  // TODO: to remove
  // eslint-disable-next-line no-console
  console.log('-positions', positions, positionsRecipe, positionsVault);

  const tokensData = useMemo<
    (EnrichedPositionsRecipeDataType['tokens_data'][0] & {
      position?: EnrichedPositionsRecipeDataType;
    })[]
  >(
    // @ts-expect-error
    () => {
      const tokens = [];
      for (const position of positions) {
        for (const token_data of position?.tokens_data ?? []) {
          tokens.push({ ...token_data, position });
        }
      }
      return tokens;
    },
    [positions],
  );

  useEffect(() => {
    refetch();
  }, [isTxConfirmed]);

  if (positionsRecipeSuccess && tokensData.length === 0) {
    return (
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
          No withdrawable positions found
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ marginY: 1 }}>
      <Typography variant="body2" color="textSecondary">
        Select a position
      </Typography>
      <RadioGroup
        aria-labelledby="incentive-token"
        name="incentive-token"
        sx={{}}
        value={value}
        onChange={handleChange}
      >
        {tokensData.map((token, tokenIndex) => {
          return (
            <FormControlLabel
              value={tokenIndex}
              sx={{
                display: 'flex', // Equivalent to `flex`
                justifyContent: 'space-between', // Equivalent to `justify-between`
                alignItems: 'flex-start',
                gap: 2, // Equivalent to `gap-2` (MUI uses theme-based spacing; `2` = 2 * 8px = 16px)
                borderRadius: '16px', // Equivalent to `rounded-2xl` (16px)
                border:
                  value !== tokenIndex
                    ? '1px solid #554F4E'
                    : '1px solid #FF8425', // Creates the border
                padding: 3, // Equivalent to `p-3` (MUI uses theme-based spacing; `3` = 3 * 8px = 24px)
                marginY: 1,
                marginX: 0,
              }}
              control={
                <Radio
                  disabled={
                    token.position?.can_withdraw &&
                    market.market_type === RoycoMarketType.recipe.value
                      ? // @ts-ignore
                        token.position?.is_claimed[tokenIndex] === true
                      : BigInt(token.raw_amount) === BigInt(0)
                  }
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
                        maximumFractionDigits: 6,
                      }).format(
                        token.position?.tokens_data?.reduce(
                          (acc, token) => acc + token.token_amount_usd,
                          0,
                        ) ?? 0,
                      )}
                    </Typography>
                    {!token.position?.can_claim && (
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
                        key={`withdraw-input-token-row:${tokenIndex}`}
                        token={token}
                      />
                    </Box>
                  </Box>
                </Box>
              }
              // delay={0.1 + positionIndex * 0.1}
              // className="w-full"
              key={`withdraw-position:${tokenIndex}`}
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
          !tokensData[value] ||
          (tokensData[value].position?.can_withdraw &&
          market.market_type === RoycoMarketType.recipe.value
            ? // @ts-ignore
              tokensData[value].position?.is_claimed === true
            : BigInt(tokensData[value].raw_amount) === BigInt(0))
        }
        onClick={() => {
          if (!!tokensData[value]) {
            const contractOptions =
              getRecipeIncentiveTokenWithdrawalTransactionOptions({
                account: account?.address?.toLowerCase() as string,
                chain_id: market.chain_id!,
                position: {
                  // @ts-ignore
                  weiroll_wallet:
                    // @ts-ignore
                    tokensData[value].position.weiroll_wallet,
                  token_data: tokensData[value],
                },
              });
            // @ts-expect-error
            writeContract(contractOptions);
          }
        }}
        fullWidth
      >
        <Typography variant="bodyMediumStrong">Claim incentive</Typography>
      </CustomLoadingButton>
      {txHash && (
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
      )}
      {isTxConfirmed && (
        <Box>
          <Typography variant="body2" color="textSecondary">
            Transaction successfull!
          </Typography>
        </Box>
      )}
    </Box>
  );
};
