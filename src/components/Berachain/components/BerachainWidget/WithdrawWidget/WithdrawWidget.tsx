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
import {
  getRecipeIncentiveTokenWithdrawalTransactionOptions,
  getRecipeInputTokenWithdrawalTransactionOptions,
  getVaultIncentiveTokenWithdrawalTransactionOptions,
  useEnrichedPositionsRecipe,
  useEnrichedPositionsVault,
} from 'royco/hooks';
import {
  useConfig,
  useWaitForTransactionReceipt,
  useWriteContract,
} from 'wagmi';
import { useAccount } from '@lifi/wallet-management';
import { RoycoMarketType, RoycoMarketUserType } from 'royco/market';
import { WithdrawInputTokenRow } from '@/components/Berachain/components/BerachainWidget/WithdrawWidget/WithdrawInputTokenRow';
import { WithdrawIncentiveTokenRow } from '@/components/Berachain/components/BerachainWidget/WithdrawWidget/WithdrawIncentiveTokenRow';
import { useMemo, useState } from 'react';
import { CustomLoadingButton } from '@/components/Berachain/components/BerachainWidget/LoadingButton.style';
import { switchChain } from '@wagmi/core';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import type { ExtendedChain } from '@lifi/sdk';

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
  const [transactions, setTransactions] = useState([]);
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
  } = useEnrichedPositionsRecipe({
    chain_id: market.chain_id!,
    market_id: market.market_id!,
    account_address: (account?.address?.toLowerCase() as string) ?? '',
    page_index: 0,
    filters: [
      {
        id: 'is_withdrawn',
        value: false,
      },
      /*      {
              id: 'can_withdraw',
              // withdrawType === MarketWithdrawType.input_token.id
              //   ? "can_withdraw"
              // : "can_claim",
              value: true,
            },*/
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
      ? positionsRecipe.data
      : [];

  // TODO: to remove
  // eslint-disable-next-line no-console
  console.log('-positions', positions, positionsRecipe, positionsVault);

  // TODO: to remove
  // eslint-disable-next-line no-console
  console.log('-transactions', transactions);

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
        positionsRecipeSuccess &&
        positions.length === 0 && (
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
        positions
          .filter((d) => !d?.is_withdrawn)
          .map((position, positionIndex) => {
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
                    marginY: 1,
                  }}
                  // className="flex w-full flex-row items-center justify-between gap-2 rounded-2xl border border-divider p-3"
                >
                  <Box
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
                                position.can_withdraw &&
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
                  {shouldSwitchChain && (
                    <CustomLoadingButton
                      overrideStyle={{ mainColor: '#FF8425' }}
                      type="button"
                      size="small"
                      // loading={isLoading || isTxPending || isTxConfirming}
                      variant="contained"
                      onClick={async () => {
                        try {
                          await switchChain(wagmiConfig, {
                            chainId: market?.chain_id ?? 1,
                          });
                        } catch (error) {
                          // TODO: to remove
                          // eslint-disable-next-line no-console
                          console.error(error);
                        }
                      }}
                    >
                      <Typography variant="bodyMediumStrong">
                        Switch chain
                      </Typography>
                    </CustomLoadingButton>
                  )}

                  {!shouldSwitchChain &&
                    withdrawType === MarketWithdrawType.input_token.id && (
                      <Box
                        sx={{
                          flexShrink: 0, // Equivalent to `shrink-0`
                        }}
                        // className="w-24 shrink-0"
                      >
                        {position?.can_withdraw === false ? (
                          <Typography
                            variant="body2"
                            color="textSecondary"
                            sx={{ textAlign: 'center' }}
                          >
                            Locked
                          </Typography>
                        ) : (
                          <CustomLoadingButton
                            variant="contained"
                            loading={isTxConfirming || isTxPending}
                            overrideStyle={{
                              mainColor: '#FF8425',
                            }}
                            disabled={
                              !position?.can_withdraw ||
                              BigInt(
                                position?.input_token_data?.raw_amount ?? 0,
                              ) === BigInt(0)
                            }
                            onClick={() => {
                              if (!!position) {
                                if (
                                  market.market_type ===
                                  RoycoMarketType.recipe.value
                                ) {
                                  const contractOptions =
                                    getRecipeInputTokenWithdrawalTransactionOptions(
                                      {
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
                                      },
                                    );
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
                            <Typography variant="bodyMediumStrong">
                              Withdraw
                            </Typography>
                          </CustomLoadingButton>
                        )}
                        {txHash && (
                          <Typography
                            component="a"
                            href={`${chain?.metamask.blockExplorerUrls?.[0] ?? 'https://etherscan.io'}/tx/${txHash}`}
                            target="_blank"
                          >
                            Transaction link
                          </Typography>
                        )}
                      </Box>
                    )}
                </Box>
                {withdrawType === MarketWithdrawType.incentives.id && (
                  <Box
                    sx={{
                      display: 'flex',
                      flexDirection: 'row',
                      color: 'text.primary',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: '100%',
                    }}
                  >
                    <Typography variant="body2" color="textSecondary">
                      Click to claim
                    </Typography>
                    <ArrowUpwardIcon />
                  </Box>
                )}
              </Box>
            );
          })}
    </Box>
  );
};
