import { Box, Button, Typography, useTheme } from '@mui/material';
import type { EnrichedMarketDataType } from 'royco/queries';
import BerachainTransactionDetails from '@/components/Berachain/components/BerachainTransactionDetails/BerachainTransactionDetails';
import InfoBlock from '@/components/Berachain/components/BerachainWidget/InfoBlock';
import {
  getRecipeIncentiveTokenWithdrawalTransactionOptions,
  getRecipeInputTokenWithdrawalTransactionOptions,
  getVaultIncentiveTokenWithdrawalTransactionOptions,
  useEnrichedPositionsRecipe,
  useEnrichedPositionsVault,
} from 'royco/hooks';
import { useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { useAccount } from '@lifi/wallet-management';
import { RoycoMarketType, RoycoMarketUserType } from 'royco/market';
import { WithdrawInputTokenRow } from './WithdrawInputTokenRow';
import { WithdrawIncentiveTokenRow } from './WithdrawIncentiveTokenRow';
import { useState } from 'react';
import { WalletButtons } from '@/components/Navbar/WalletButtons';

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
}: {
  market: EnrichedMarketDataType;
}) => {
  const { account } = useAccount();
  const theme = useTheme();
  const [transactions, setTransactions] = useState([]);
  const withdrawType = 'input_token';

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
    query: {
      enabled: !txHash,
    },
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
    isError,
    error,
  } = useEnrichedPositionsRecipe({
    chain_id: market.chain_id!,
    market_id: market.market_id!,
    account_address: (account?.address?.toLowerCase() as string) ?? '',
    page_index: 0,
    filters: [
      {
        id: 'can_withdraw',
        // withdrawType === MarketWithdrawType.input_token.id
        //   ? "can_withdraw"
        // : "can_claim",
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
    market.market_type === RoycoMarketType.recipe.value
      ? Array.isArray(positionsRecipe?.data) && positionsRecipe.data
      : /*       : []
            : Array.isArray(positionsVault?.data)
              ? positionsVault.data.filter((position) => {
                if (!!position) {
                  if (withdrawType === MarketWithdrawType.input_token.id) {
                  // if (withdrawType === MarketWithdrawType.input_token.id) {
                    // Check if the raw input token amount is greater than 0
                    if (BigNumber.from(position.input_token_data.shares).gt(0)) {
                      return true;
                    } else {
                      return false;
                    }
                  } else {
                    // Check if value of at least one token is greater than 0
                    if (
                      position.tokens_data.some((token) =>
                        BigNumber.from(token.raw_amount).gt(0)
                      )
                    ) {
                      return true;
                    } else {
                      return false;
                    }
                  }
                }
                return false;
              })*/
        [];

  // TODO: to remove
  // eslint-disable-next-line no-console
  console.log('-positions', positions, positionsRecipe, positionsVault);

  // TODO: to remove
  // eslint-disable-next-line no-console
  console.log('-transactions', transactions);

  return (
    <Box sx={{ marginTop: theme.spacing(1.5) }}>
      <InfoBlock market={market} />
      <BerachainTransactionDetails market={market} />

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
      {!isLoadingPositionsRecipe && !!positions && positions.length === 0 && (
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
      )}
      {!!positions &&
        !isLoadingPositionsRecipe &&
        Array.isArray(positions) &&
        positions.length > 0 &&
        positions.map((position, positionIndex) => {
          return (
            <Box
              // delay={0.1 + positionIndex * 0.1}
              // className="w-full"
              key={`withdraw-position:${positionIndex}`}
            >
              <Box
                sx={{
                  display: 'flex', // Equivalent to `flex`
                  width: '100%', // Equivalent to `w-full`
                  flexDirection: 'row', // Equivalent to `flex-row`
                  alignItems: 'center', // Equivalent to `items-center`
                  justifyContent: 'space-between', // Equivalent to `justify-between`
                  gap: 2, // Equivalent to `gap-2` (MUI uses theme-based spacing; `2` = 2 * 8px = 16px)
                  borderRadius: '16px', // Equivalent to `rounded-2xl` (16px)
                  border: '1px solid #fff', // Creates the border
                  padding: 3, // Equivalent to `p-3` (MUI uses theme-based spacing; `3` = 3 * 8px = 24px)
                  margin: 1,
                }}
                // className="flex w-full flex-row items-center justify-between gap-2 rounded-2xl border border-divider p-3"
              >
                <Box
                  sx={{
                    display: 'flex', // Equivalent to `flex`
                    width: '100%', // Equivalent to `w-full`
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
                      maximumFractionDigits: 8,
                    }).format(
                      withdrawType === MarketWithdrawType.input_token.id
                        ? (position?.input_token_data?.token_amount_usd ?? 0)
                        : (position?.tokens_data?.reduce(
                            (acc, token) => acc + token.token_amount_usd,
                            0,
                          ) ?? 0),
                    )}
                  </Typography>
                  <Box
                    sx={{
                      display: 'flex', // Equivalent to `flex`
                      width: '100%', // Equivalent to `w-full`
                      flexGrow: 1, // Equivalent to `grow`
                      flexDirection: 'column', // Equivalent to `flex-col`
                      gap: 3, // Equivalent to `space-y-3` (MUI uses theme-based spacing; `3` = 3 * 8px = 24px)
                    }}
                    // className="flex w-full grow flex-col space-y-3"
                  >
                    {withdrawType === MarketWithdrawType.input_token.id ? (
                      <WithdrawInputTokenRow
                        key={`withdraw-input-token-row:${positionIndex}`}
                        token={position?.input_token_data}
                      />
                    ) : (
                      position?.tokens_data?.map((token, tokenIndex) => {
                        return (
                          <WithdrawIncentiveTokenRow
                            disabled={
                              market.market_type ===
                              RoycoMarketType.recipe.value
                                ? // @ts-ignore
                                  position?.is_claimed[tokenIndex] === true
                                : BigInt(token.raw_amount) === BigInt(0)
                            }
                            onClick={() => {
                              if (
                                market.market_type ===
                                RoycoMarketType.recipe.value
                              ) {
                                const contractOptions =
                                  getRecipeIncentiveTokenWithdrawalTransactionOptions(
                                    {
                                      account:
                                        account?.address?.toLowerCase() as string,
                                      chain_id: market.chain_id!,
                                      position: {
                                        // @ts-expect-error
                                        weiroll_wallet:
                                          /**
                                           * @TODO Strictly type this
                                           */
                                          // @ts-ignore
                                          position.weiroll_wallet,
                                        token_data: token,
                                      },
                                    },
                                  );
                                // @ts-expect-error
                                writeContract(contractOptions);
                              } else {
                                const contractOptions =
                                  getVaultIncentiveTokenWithdrawalTransactionOptions(
                                    {
                                      account:
                                        account?.address?.toLowerCase() as string,
                                      market_id: market.market_id!,
                                      chain_id: market.chain_id!,
                                      position: {
                                        token_data: token,
                                      },
                                    },
                                  );
                                // @ts-expect-error
                                writeContract(contractOptions);
                              }
                            }}
                            key={`withdraw-incentive-token-row:${positionIndex}-${tokenIndex}`}
                            token={token}
                          />
                        );
                      })
                    )}
                  </Box>
                </Box>

                {withdrawType === MarketWithdrawType.input_token.id && (
                  <Box
                    sx={{
                      width: '6rem', // Equivalent to `w-24` (24 * 0.25rem = 6rem)
                      flexShrink: 0, // Equivalent to `shrink-0`
                    }}
                    // className="w-24 shrink-0"
                  >
                    <Button
                      disabled={
                        BigInt(position?.input_token_data?.raw_amount ?? 0) ===
                        BigInt(0)
                      }
                      onClick={() => {
                        if (!!position) {
                          if (
                            market.market_type === RoycoMarketType.recipe.value
                          ) {
                            const contractOptions =
                              getRecipeInputTokenWithdrawalTransactionOptions({
                                chain_id: market.chain_id!,
                                position: {
                                  // @ts-expect-error
                                  weiroll_wallet:
                                    /**
                                     * @TODO Strictly type this
                                     */
                                    // @ts-ignore
                                    position.weiroll_wallet,
                                  token_data: position.input_token_data,
                                },
                              });
                            // @ts-expect-error
                            writeContract(contractOptions);
                          } else {
                            // TODO: to remove
                            // eslint-disable-next-line no-console
                            console.log(
                              'OPEN A MODAL? and run setSelectedVaultPosition (Not implemented)',
                            );
                            // setSelectedVaultPosition(position);
                            // setIsVaultWithdrawModalOpen(true);
                          }
                        }
                      }}
                      size="small"
                      className="text-sm"
                    >
                      Withdraw
                    </Button>
                  </Box>
                )}
              </Box>
            </Box>
          );
        })}
    </Box>
  );
};
