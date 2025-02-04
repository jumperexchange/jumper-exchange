import { CustomLoadingButton } from '@/components/Berachain/components/BerachainWidget/LoadingButton.style';
import { WithdrawInputTokenRow } from '@/components/Berachain/components/BerachainWidget/WithdrawWidget/WithdrawInputTokenRow';
import type { ExtendedChain } from '@lifi/sdk';
import { useAccount } from '@lifi/wallet-management';
import {
  Box,
  FormControlLabel,
  Radio,
  RadioGroup,
  Typography,
  useTheme,
} from '@mui/material';
import type { ChangeEvent } from 'react';
import { useEffect, useMemo, useState } from 'react';
import {
  getRecipeIncentiveTokenWithdrawalTransactionOptions,
  useEnrichedPositionsRecipe,
  useEnrichedPositionsVault,
} from 'royco/hooks';
import { RoycoMarketType, RoycoMarketUserType } from 'royco/market';
import type {
  EnrichedMarketDataType,
  EnrichedPositionsRecipeDataType,
} from 'royco/queries';
import { useWaitForTransactionReceipt, useWriteContract } from 'wagmi';
import { TxConfirmation } from '../TxConfirmation';

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

  const tokensData = useMemo<
    (EnrichedPositionsRecipeDataType['tokens_data'][0] & {
      position?: EnrichedPositionsRecipeDataType;
    })[]
  >(() => {
    const tokens = [];
    for (const position of positions) {
      for (const token_data of position?.tokens_data ?? []) {
        tokens.push({ ...token_data, position });
      }
    }
    return tokens;
  }, [positions]);

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
          marginTop: theme.spacing(2),
        }}
      >
        {/*<div className="h-full w-full place-content-center items-start">*/}
        <Typography variant="bodyLargeStrong" color="textSecondary">
          No claimable positions found
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ marginY: 1 }}>
      <Typography variant="body2" color="textSecondary">
        Claim a position
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
                  sx={{ visibility: 'hidden' }}
                  disabled={!token.position?.is_claimed as unknown as boolean}
                />
              }
              labelPlacement="start"
              label={
                <Box
                  component="span"
                  sx={{
                    flexGrow: 1, // Equivalent to `grow`
                    minWidth: '400px', // Equivalent to `min-w-full`
                    display: 'flex', // Equivalent to `flex`
                    width: '100%', // Equivalent to `w-full`
                    flexDirection: 'row', // Equivalent to `flex-row`
                    alignItems: 'center', // Equivalent to `items-center`
                  }}
                >
                  <Box
                    sx={{
                      display: 'flex',
                      width: '100%',
                      flexGrow: 1, // Equivalent to `grow`
                      minWidth: '400px',
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}
                  >
                    <Box
                      component="span"
                      sx={{
                        display: 'flex', // Equivalent to `flex`
                        width: '100%', // Equivalent to `w-full`
                        flexGrow: 1, // Equivalent to `grow`
                        flexDirection: 'column', // Equivalent to `flex-col`
                      }}
                    >
                      <WithdrawInputTokenRow
                        key={`withdraw-input-token-row:${tokenIndex}`}
                        token={token}
                        tokenValueUSD={Intl.NumberFormat('en-US', {
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
                      />
                    </Box>
                    {!token.position?.can_claim && (
                      <Box
                        sx={{
                          borderRadius: '32px',
                          padding: theme.spacing(1),
                          borderColor: '#302F2E',
                          borderWidth: '1px',
                          borderStyle: 'solid',
                        }}
                      >
                        <Typography
                          sx={(theme) => ({
                            whiteSpace: 'nowrap',
                            wordBreak: 'normal',
                            color: theme.palette.text.primary,
                          })}
                          variant="bodySmallStrong"
                        >
                          Locked
                        </Typography>
                      </Box>
                    )}
                  </Box>
                  {/* </Box> */}
                </Box>
              }
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
          (!tokensData[value].position?.is_claimed as unknown as boolean)
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
      {isTxConfirmed && txHash ? (
        <TxConfirmation
          s={'Claim successful'}
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
    </Box>
  );
};
