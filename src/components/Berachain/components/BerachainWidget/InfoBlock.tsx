import type { EnrichedMarketDataType } from 'royco/queries';
import InfoIcon from '@mui/icons-material/Info';
import {
  formatWithCustomLabels,
  secondsToDuration,
} from '@/components/Berachain/lockupTimeMap';
import { useTranslation } from 'react-i18next';
import type { Breakpoint } from '@mui/material';
import { alpha, Box, Skeleton, Tooltip, Typography } from '@mui/material';
import { useTheme } from '@mui/material';
import { useEnrichedAccountBalancesRecipeInMarket } from 'royco/hooks';
import { useAccount } from '@lifi/wallet-management';
import TooltipIncentives from '@/components/Berachain/components/BerachainWidget/TooltipIncentives';
import {
  BerachainMarketCardTokenContainer,
  BerchainMarketCardInfos,
} from '../BerachainMarketCard/BerachainMarketCard.style';
import {
  BeraChainProgressCardComponent,
  BeraChainProgressCardContent,
  BeraChainProgressCardHeader,
} from '../BerachainMarketCard/StatCard/BerachainProgressCard.style';
import { useMemo, useState } from 'react';
import { parseRawAmountToTokenAmount } from 'royco/utils';
import { BerachainProgressCard } from '../BerachainMarketCard/StatCard/BerachainProgressCard';
import { BerachainWidgetSelection } from './DepositWidget/WidgetDeposit.style';
import DigitCard from '../BerachainMarketCard/StatCard/DigitCard';

function InfoBlock({ market }: { market: EnrichedMarketDataType }) {
  const { t } = useTranslation();
  const { account } = useAccount();
  const theme = useTheme();

  const [openTokensTooltip] = useState(false);

  const {
    isLoading: isLoadingRecipe,
    isRefetching: isRefetchingRecipe,
    data: dataRecipe,
  } = useEnrichedAccountBalancesRecipeInMarket({
    chain_id: market.chain_id!,
    market_id: market.market_id!,
    account_address: account?.address?.toLowerCase() ?? '',
    custom_token_data: undefined,
  });

  const deposited =
    dataRecipe?.input_token_data_ap?.token_amount &&
    dataRecipe?.input_token_data_ap?.token_amount > 0;

  const maxInputValue = useMemo(() => {
    return parseRawAmountToTokenAmount(
      market?.quantity_ip ?? '0', // @note: AP fills IP quantity
      market?.input_token_data.decimals ?? 0,
    );
  }, [market]);

  return (
    <BerachainWidgetSelection>
      <BerchainMarketCardInfos
        sx={{
          display: 'flex',
          flexDirection: 'row',
        }}
      >
        <BeraChainProgressCardComponent
          sx={{
            height: '100%',
            padding: theme.spacing(1.5, 2),
            display: 'flex',
            justifyContent: 'space-between',
            backgroundColor: deposited ? '#291812' : undefined,
            [theme.breakpoints.up('sm' as Breakpoint)]: {
              padding: theme.spacing(1.5, 2),
            },
          }}
        >
          <Box>
            <BeraChainProgressCardContent>
              <BeraChainProgressCardHeader display={'flex'}>
                <Typography
                  variant="bodySmall"
                  sx={(theme) => ({
                    typography: {
                      xs: theme.typography.bodyXSmall,
                      sm: theme.typography.bodySmall,
                    },
                  })}
                >
                  {deposited ? 'Deposited' : 'Deposit'}
                </Typography>
                <Tooltip
                  title={'Deposit amount'}
                  placement={'top'}
                  enterTouchDelay={0}
                  arrow
                >
                  <InfoIcon
                    sx={{
                      width: '16px',
                      height: '16px',
                      marginLeft: '4px',
                      color: 'inherit',
                    }}
                  />
                </Tooltip>
              </BeraChainProgressCardHeader>
              <Box
                sx={{
                  justifyContent: 'center',
                  alignItems: 'center',
                  gap: '16px',
                }}
              >
                <BerachainMarketCardTokenContainer
                  sx={{ display: 'flex', alignItems: 'center', gap: '4px' }}
                  key={`berachain-market-card-token-container-${market?.input_token_data?.name}`}
                >
                  {market?.input_token_data?.image ? (
                    <img
                      key={`berachain-market-card-token-${market?.input_token_data?.name}-${market?.input_token_data?.id}`}
                      src={market?.input_token_data?.image}
                      alt={`${market?.input_token_data?.name} logo`}
                      width={24}
                      height={24}
                      style={{ borderRadius: '10px' }}
                    />
                  ) : (
                    <Skeleton
                      key={`berachain-market-card-token-skeleton-${market?.input_token_data?.id}`}
                      variant="circular"
                      sx={{ width: 24, height: 24 }}
                    />
                  )}
                  <Typography
                    variant="titleXSmall"
                    marginTop={'4px'}
                    sx={(theme) => ({
                      typography: {
                        xs: theme.typography.titleXSmall,
                        sm: theme.typography.titleXSmall,
                      },
                    })}
                    key={`berachain-market-card-token-label-${market?.input_token_data?.name}-${market?.input_token_data?.id}`}
                    color={deposited ? theme.palette.primary.main : undefined}
                  >
                    {deposited
                      ? t('format.currency', {
                          value:
                            dataRecipe?.input_token_data_ap?.token_amount_usd,
                        })
                      : market?.input_token_data?.symbol}
                  </Typography>
                </BerachainMarketCardTokenContainer>
              </Box>
            </BeraChainProgressCardContent>
          </Box>
          {market.lockup_time === '0' ? undefined : (
            <Box>
              <BeraChainProgressCardContent>
                <BeraChainProgressCardHeader display={'flex'}>
                  <Typography
                    variant="bodySmall"
                    sx={(theme) => ({
                      typography: {
                        xs: theme.typography.bodyXSmall,
                        sm: theme.typography.bodySmall,
                      },
                    })}
                  >
                    Lockup
                  </Typography>
                  <Tooltip
                    title={'lockup'}
                    placement={'top'}
                    enterTouchDelay={0}
                    arrow
                  >
                    <InfoIcon
                      sx={{
                        width: '16px',
                        height: '16px',
                        marginLeft: '4px',
                        color: 'inherit',
                      }}
                    />
                  </Tooltip>
                </BeraChainProgressCardHeader>
                <Typography
                  variant="titleXSmall"
                  marginTop={'4px'}
                  sx={(theme) => ({
                    typography: {
                      xs: theme.typography.titleXSmall,
                      sm: theme.typography.titleXSmall,
                    },
                  })}
                >
                  {formatWithCustomLabels(
                    Object.entries(secondsToDuration(market.lockup_time))
                      .filter(([_, value]) => value > 0) // Filter out zero values
                      .slice(0, 2) // Take the first two non-zero units
                      .reduce(
                        (acc, [unit, value]) => ({ ...acc, [unit]: value }),
                        {},
                      ),
                  )}
                </Typography>
              </BeraChainProgressCardContent>
            </Box>
          )}
        </BeraChainProgressCardComponent>
      </BerchainMarketCardInfos>

      <BerchainMarketCardInfos
        sx={{
          display: 'flex',
          flexDirection: 'row',
        }}
      >
        <BeraChainProgressCardComponent
          sx={{
            height: '100%',
            padding: theme.spacing(1.5, 2),
            display: 'flex',
            justifyContent: 'space-between',
            [theme.breakpoints.up('sm' as Breakpoint)]: {
              padding: theme.spacing(1.5, 2),
            },
          }}
        >
          {/* <Box>
            <BeraChainProgressCardContent>
              <BeraChainProgressCardHeader display={'flex'}>
                <Typography
                  variant="bodySmall"
                  sx={(theme) => ({
                    typography: {
                      xs: theme.typography.bodyXSmall,
                      sm: theme.typography.bodySmall,
                    },
                  })}
                >
                  Available to Deposit
                </Typography>
                <Tooltip
                  title={'tvl'}
                  placement={'top'}
                  enterTouchDelay={0}
                  arrow
                >
                  <InfoIcon
                    sx={{
                      width: '16px',
                      height: '16px',
                      marginLeft: '4px',
                      color: 'inherit',
                    }}
                  />
                </Tooltip>
              </BeraChainProgressCardHeader>
              <Typography
                variant="titleXSmall"
                marginTop={'4px'}
                sx={(theme) => ({
                  typography: {
                    xs: theme.typography.titleXSmall,
                    sm: theme.typography.titleXSmall,
                  },
                })}
              >
                {Intl.NumberFormat('en-US', {
                  notation: 'standard',
                  useGrouping: true,
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 5,
                }).format(maxInputValue)}{' '}
              </Typography>
            </BeraChainProgressCardContent>
          </Box> */}
          <DigitCard
            title={'Available to Deposit'}
            tooltipText="Available to Deposit"
            digit={Intl.NumberFormat('en-US', {
              notation: 'standard',
              useGrouping: true,
              minimumFractionDigits: 0,
              maximumFractionDigits: 5,
            }).format(maxInputValue)}
          />
          <DigitCard
            title={'TVL'}
            tooltipText="The total value of crypto assets deposited in this pool"
            digit={
              market?.locked_quantity_usd
                ? t('format.currency', {
                    value: market?.locked_quantity_usd,
                    notation: 'compact',
                  })
                : 'N/A'
            }
          />
          {/* <Box>
            <BeraChainProgressCardContent>
              <BeraChainProgressCardHeader display={'flex'}>
                <Typography
                  variant="bodySmall"
                  sx={(theme) => ({
                    typography: {
                      xs: theme.typography.bodyXSmall,
                      sm: theme.typography.bodySmall,
                    },
                  })}
                >
                  TVL
                </Typography>
                <Tooltip
                  title={'tvl'}
                  placement={'top'}
                  enterTouchDelay={0}
                  arrow
                >
                  <InfoIcon
                    sx={{
                      width: '16px',
                      height: '16px',
                      marginLeft: '4px',
                      color: 'inherit',
                    }}
                  />
                </Tooltip>
              </BeraChainProgressCardHeader>
              <Typography
                variant="titleXSmall"
                marginTop={'4px'}
                sx={(theme) => ({
                  typography: {
                    xs: theme.typography.titleXSmall,
                    sm: theme.typography.titleXSmall,
                  },
                })}
              >
                {market?.locked_quantity_usd
                  ? t('format.currency', {
                      value: market?.locked_quantity_usd,
                      notation: 'compact',
                    })
                  : 'N/A'}
              </Typography>
            </BeraChainProgressCardContent>
          </Box> */}
        </BeraChainProgressCardComponent>
      </BerchainMarketCardInfos>

      <BerchainMarketCardInfos
        sx={{
          display: 'flex',
        }}
      >
        {market?.incentive_tokens_data?.length > 0 ? (
          <Tooltip
            title={
              market?.incentive_tokens_data?.length > 0 ? (
                <TooltipIncentives market={market} />
              ) : (
                <></>
              )
            }
            open={openTokensTooltip ? false : undefined}
            disableFocusListener={openTokensTooltip ? false : undefined}
            disableInteractive={!openTokensTooltip ? false : undefined}
            placement="top"
            enterTouchDelay={0}
            arrow
          >
            <div style={{ flexGrow: 1 }}>
              <BeraChainProgressCardComponent
                sx={{
                  height: '100%',
                  padding: theme.spacing(1.5, 2),
                  display: 'flex',
                  [theme.breakpoints.up('sm' as Breakpoint)]: {
                    padding: theme.spacing(1.5, 2),
                  },
                }}
              >
                <BeraChainProgressCardContent>
                  <BeraChainProgressCardHeader display={'flex'}>
                    <Typography
                      variant="bodySmall"
                      sx={(theme) => ({
                        typography: {
                          xs: theme.typography.bodyXSmall,
                          sm: theme.typography.bodySmall,
                        },
                      })}
                    >
                      {'Total Incentives'}
                    </Typography>
                    <Tooltip
                      title={''}
                      placement={'top'}
                      enterTouchDelay={0}
                      arrow
                    >
                      <InfoIcon
                        sx={{
                          width: '16px',
                          height: '16px',
                          marginLeft: '4px',
                          color: 'inherit',
                        }}
                      />
                    </Tooltip>
                  </BeraChainProgressCardHeader>
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '16px',
                    }}
                  >
                    {market?.incentive_tokens_data?.map(
                      (incentiveTokenData) => (
                        <Box
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            marginTop: '4px',
                          }}
                          key={incentiveTokenData?.id}
                        >
                          <Typography
                            variant="titleXSmall"
                            sx={(theme) => ({
                              typography: {
                                xs: theme.typography.titleXSmall,
                                sm: theme.typography.titleXSmall,
                              },
                            })}
                          >
                            {t('format.decimal', {
                              value: incentiveTokenData.per_input_token,
                            })}
                          </Typography>
                          <img
                            key={`berachain-market-card-token-${market?.input_token_data?.name}-${market?.input_token_data?.id}`}
                            src={incentiveTokenData?.image}
                            alt={`${incentiveTokenData?.name}-logo`}
                            width={24}
                            height={24}
                            style={{
                              borderRadius: '10px',
                              marginLeft: '4px',
                            }}
                          />
                        </Box>
                      ),
                    )}
                  </Box>
                </BeraChainProgressCardContent>
              </BeraChainProgressCardComponent>
            </div>
          </Tooltip>
        ) : (
          <Tooltip
            title={'Expected return on the tokens invested'}
            open={openTokensTooltip ? false : undefined}
            disableFocusListener={openTokensTooltip ? false : undefined}
            disableInteractive={!openTokensTooltip ? false : undefined}
            placement="top"
            enterTouchDelay={0}
            arrow
          >
            <div style={{ flexGrow: 1 }}>
              <BerachainProgressCard
                title={'Net APY'}
                value={
                  market?.annual_change_ratio
                    ? t('format.percent', {
                        value: market?.annual_change_ratio,
                      })
                    : 'N/A'
                }
                showTooltipIcon={true}
                sx={{
                  height: '100%',
                  padding: theme.spacing(1.5, 2),
                  display: 'flex',
                  [theme.breakpoints.up('sm' as Breakpoint)]: {
                    padding: theme.spacing(1.5, 2),
                  },
                }}
                valueSx={{
                  color: alpha(theme.palette.white.main, 0.84),
                  fontSize: theme.typography.titleXSmall.fontSize,
                  [theme.breakpoints.up('sm' as Breakpoint)]: {
                    fontSize: theme.typography.titleXSmall.fontSize,
                  },
                }}
              />
            </div>
          </Tooltip>
        )}
      </BerchainMarketCardInfos>
    </BerachainWidgetSelection>
  );
}

export default InfoBlock;
