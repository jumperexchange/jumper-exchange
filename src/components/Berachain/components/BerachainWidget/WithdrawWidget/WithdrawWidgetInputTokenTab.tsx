import {
  Avatar as MuiAvatar,
  Box,
  IconButton,
  Stack,
  Typography,
  useTheme,
} from '@mui/material';
import { formatDistanceToNow, isBefore } from 'date-fns';
import type { EnrichedMarketDataType } from 'royco/queries';
import {
  getRecipeInputTokenWithdrawalTransactionOptions,
  useEnrichedPositionsRecipe,
  useEnrichedPositionsVault,
} from 'royco/hooks';
import { useWaitForTransactionReceipt, useWriteContract } from 'wagmi';
import { useAccount } from '@lifi/wallet-management';
import { RoycoMarketType, RoycoMarketUserType } from 'royco/market';
import type { ChangeEvent } from 'react';
import { useEffect, useState } from 'react';
import { CustomLoadingButton } from '@/components/Berachain/components/BerachainWidget/LoadingButton.style';
import type { ExtendedChain } from '@lifi/sdk';
import { TxConfirmation } from '../TxConfirmation';
import { BerachainDepositInputBackground } from '@/components/Berachain/components/BerachainWidget/DepositWidget/WidgetDeposit.style';
import DigitCard from '@/components/Berachain/components/BerachainMarketCard/StatCard/DigitCard';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import {
  APY_TOOLTIP,
  INCENTIVES_TOOLTIP,
  LOCKUP_TOOLTIP,
} from '@/components/Berachain/const/title';
import { TokenIncentivesData } from '@/components/Berachain/components/BerachainMarketCard/StatCard/TokenIncentivesData';
import {
  formatWithCustomLabels,
  secondsToDuration,
} from '@/components/Berachain/lockupTimeMap';
import { useTranslation } from 'react-i18next';
import {
  WalletAvatar,
  WalletCardBadge,
} from '@/components/Menus/WalletMenu/WalletCard.style';
import TokenImage from '@/components/Portfolio/TokenImage';

// TODO: refactorize, should have a common component TokenImage (without badge) and possibility to add an adornment to it
interface Image {
  url?: string;
  name?: string;
}

interface WithdrawWidgetInputTokenTabProps {
  market: EnrichedMarketDataType;
  chain?: ExtendedChain;
  overrideStyle?: {
    mainColor?: string;
  };
  image?: Image & { badge?: Image };
  refetch: () => void;
}

export const WithdrawWidgetInputTokenTab = ({
  market,
  chain,
  overrideStyle = {},
  image,
  refetch = () => undefined,
}: WithdrawWidgetInputTokenTabProps) => {
  const { t } = useTranslation();
  const { account } = useAccount();
  const [value, setValue] = useState(0);
  const theme = useTheme();
  const [currentPositionIndex, setCurrentPositionIndex] = useState<number>();

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
    refetch: positionsRecipeRefetch,
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

  useEffect(() => {
    refetch();
    positionsRecipeRefetch();
  }, [isTxConfirmed]);

  if (positionsRecipeSuccess && positions.length === 0) {
    return (
      <Box
        sx={{
          display: 'flex', // 'place-content-center' is equivalent to a grid with centered content.
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          // marginTop: theme.spacing(6),
          // marginBottom: theme.spacing(6),
          marginY: theme.spacing(8),
          gap: 1,
        }}
      >
        {/*<div className="h-full w-full place-content-center items-start">*/}
        <IconButton
          disabled
          sx={{
            '&.Mui-disabled': {
              background: '#1F1D1D',
              borderRadius: '50%',
              width: '6rem',
              height: '6rem',
              marginBottom: 4,
            },
          }}
        >
          <ReceiptLongIcon
            sx={(theme) => ({
              color: theme.palette.primary.main,
              width: '3rem',
              height: '3rem',
            })}
          />
        </IconButton>
        <Typography
          variant="bodyLargeStrong"
          color="textPrimary"
          sx={{
            fontSize: '1.5rem',
          }}
        >
          Nothing to Withdraw yet
        </Typography>
        <Typography variant="body2" color="textSecondary">
          Deposits and rewards can be withdrawn here.
        </Typography>
      </Box>
    );
  }

  return (
    <Stack direction="column" gap={3}>
      {positions.map((position, positionIndex) => {
        return (
          <Stack gap={1}>
            <Typography
              variant="body2"
              sx={(theme) => ({
                color: theme.palette.alphaLight700.main,
              })}
            >
              {formatDistanceToNow(
                new Date((position?.block_timestamp ?? 0) * 1000),
                { addSuffix: true },
              )}
            </Typography>
            <BerachainDepositInputBackground
              key={positionIndex}
              sx={{
                display: 'flex', // Equivalent to `flex`
                flexDirection: 'column',
                justifyContent: 'space-between', // Equivalent to `justify-between`
                alignItems: 'flex-start',
                gap: 2, // Equivalent to `gap-2` (MUI uses theme-based spacing; `2` = 2 * 8px = 16px)
                borderRadius: '16px', // Equivalent to `rounded-2xl` (16px)
                border: '1px solid #554F4E', // Creates the border
                padding: 2, // Equivalent to `p-3` (MUI uses theme-based spacing; `3` = 3 * 8px = 24px)
                cursor: !position?.can_withdraw ? 'not-allowed' : 'default',
              }}
            >
              <Stack
                direction="row"
                justifyContent="space-between"
                width="100%"
                gap={2}
              >
                <Stack direction="column" gap="inherit">
                  <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                    Deposited
                  </Typography>
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 'inherit',
                      marginTop: '4px',
                    }}
                  >
                    {image && (
                      <Box
                        sx={{
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'flex-start',
                          width: 'auto',
                        }}
                      >
                        <>
                          <WalletCardBadge
                            overlap="circular"
                            className="badge"
                            sx={{ maringRight: '8px' }}
                            anchorOrigin={{
                              vertical: 'bottom',
                              horizontal: 'right',
                            }}
                            badgeContent={
                              image.badge && (
                                <MuiAvatar
                                  alt={image.badge.name}
                                  sx={(theme: any) => ({
                                    width: '18px',
                                    height: '18px',
                                    border: `2px solid ${theme.palette.surface2.main}`,
                                  })}
                                >
                                  {image.badge.name && (
                                    <TokenImage
                                      token={{
                                        name: image.badge.name,
                                        logoURI: image.badge.url,
                                      }}
                                    />
                                  )}
                                </MuiAvatar>
                              )
                            }
                          >
                            <WalletAvatar>
                              {image.name && (
                                <TokenImage
                                  token={{
                                    name: image.name,
                                    logoURI: image.url,
                                  }}
                                />
                              )}
                            </WalletAvatar>
                          </WalletCardBadge>
                        </>
                      </Box>
                    )}
                    <Typography
                      variant="titleXSmall"
                      sx={(theme) => ({
                        fontSize: '1.5rem',
                        /*                      typography: {
                        xs: theme.typography.titleXSmall,
                        sm: theme.typography.titleXSmall,
                      },*/
                      })}
                    >
                      {Intl.NumberFormat('en-US', {
                        notation: 'compact',
                        useGrouping: true,
                        minimumFractionDigits: 0,
                        maximumFractionDigits: 5,
                      }).format(
                        position?.input_token_data?.token_amount_usd ?? 0,
                      )}{' '}
                    </Typography>
                  </Box>
                </Stack>
                {isBefore(
                  new Date(parseInt(position?.unlock_timestamp ?? '0') * 1000),
                  new Date(),
                ) ? undefined : (
                  <Typography
                    sx={{
                      whiteSpace: 'nowrap',
                      wordBreak: 'normal',
                    }}
                    variant="bodySmallStrong"
                    color={theme.palette.text.primary}
                  >
                    Locked
                  </Typography>
                )}
              </Stack>
              <Stack direction="column">
                <Stack direction="row" justifyContent="space-between">
                  {market?.incentive_tokens_data?.length > 0 ? (
                    <DigitCard
                      title={'Earned rewards'}
                      tooltipText={INCENTIVES_TOOLTIP}
                      digit={
                        <TokenIncentivesData
                          tokens={market?.incentive_tokens_data}
                        />
                      }
                      sx={(theme) => ({
                        '.title': {
                          fontSize: '0.750rem',
                          color: theme.palette.alphaLight700.main,
                        },
                      })}
                    />
                  ) : (
                    <DigitCard
                      title={'APY rewards'}
                      tooltipText={APY_TOOLTIP}
                      digit={
                        market?.annual_change_ratio
                          ? t('format.percent', {
                              value: market?.annual_change_ratio,
                            })
                          : 'N/A'
                      }
                    />
                  )}
                </Stack>
              </Stack>
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
                <CustomLoadingButton
                  sx={{
                    marginY: 1,
                  }}
                  variant="contained"
                  loading={
                    currentPositionIndex === positionIndex &&
                    (isTxConfirming || isTxPending)
                  }
                  overrideStyle={{
                    mainColor: '#FF8425',
                  }}
                  disabled={
                    !position?.can_withdraw ||
                    BigInt(position?.input_token_data?.raw_amount ?? 0) ===
                      BigInt(0)
                  }
                  onClick={() => {
                    if (!!position) {
                      setCurrentPositionIndex(positionIndex);
                      const contractOptions =
                        getRecipeInputTokenWithdrawalTransactionOptions({
                          chain_id: market.chain_id!,
                          position: {
                            // @ts-expect-error
                            weiroll_wallet: position.weiroll_wallet,
                            token_data: position.input_token_data,
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
              </Box>
            </BerachainDepositInputBackground>
          </Stack>
        );
      })}
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
    </Stack>
  );
};
