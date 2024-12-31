import type { EnrichedMarketDataType } from 'royco/queries';
import {
  formatWithCustomLabels,
  secondsToDuration,
} from '@/components/Berachain/lockupTimeMap';
import { useTranslation } from 'react-i18next';
import type { Breakpoint } from '@mui/material';
import { useTheme } from '@mui/material';
import { useEnrichedAccountBalancesRecipeInMarket } from 'royco/hooks';
import { useAccount } from '@lifi/wallet-management';
import { BerchainMarketCardInfos } from '../BerachainMarketCard/BerachainMarketCard.style';
import { BeraChainProgressCardComponent } from '../BerachainMarketCard/StatCard/BerachainProgressCard.style';
import { useMemo, useState } from 'react';
import { parseRawAmountToTokenAmount } from 'royco/utils';
import { BerachainWidgetSelection } from './DepositWidget/WidgetDeposit.style';
import DigitCard from '../BerachainMarketCard/StatCard/DigitCard';
import {
  APY_TOOLTIP,
  AVAILABLE_TOOLTIP,
  DEPOSIT_TOOLTIP,
  DEPOSITED_TOOLTIP,
  LOCKUP_TOOLTIP,
  TVL_TOOLTIP,
} from '../../const/title';
import TokenIncentivesCard from '../BerachainMarketCard/StatCard/TokenIncentivesCard';
import DigitTooltipCard from '../BerachainMarketCard/StatCard/DigitTooltipCard';
import DigitTokenSymbolCard from '../BerachainMarketCard/StatCard/DigitTokenSymbolCard';

interface InfoBlockProps {
  market: EnrichedMarketDataType;
  type: 'deposit' | 'withdraw';
}

function InfoBlock({ market, type }: InfoBlockProps) {
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
          <DigitTokenSymbolCard
            title={deposited ? 'Deposited' : 'Deposit'}
            tooltipText={deposited ? DEPOSITED_TOOLTIP : DEPOSIT_TOOLTIP}
            tokenImage={market?.input_token_data?.image}
            digit={
              deposited
                ? t('format.currency', {
                    value: dataRecipe?.input_token_data_ap?.token_amount_usd,
                  })
                : market?.input_token_data?.symbol
            }
          />

          {market.lockup_time === '0' ? undefined : (
            <DigitCard
              title={'Lockup'}
              tooltipText={LOCKUP_TOOLTIP}
              digit={formatWithCustomLabels(
                Object.entries(secondsToDuration(market.lockup_time))
                  .filter(([_, value]) => value > 0) // Filter out zero values
                  .slice(0, 2) // Take the first two non-zero units
                  .reduce(
                    (acc, [unit, value]) => ({ ...acc, [unit]: value }),
                    {},
                  ),
              )}
            />
          )}
        </BeraChainProgressCardComponent>
      </BerchainMarketCardInfos>

      {type === 'deposit' && (
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
            <DigitCard
              title={'Available to Deposit'}
              tooltipText={AVAILABLE_TOOLTIP}
              digit={Intl.NumberFormat('en-US', {
                notation: 'standard',
                useGrouping: true,
                minimumFractionDigits: 0,
                maximumFractionDigits: 5,
              }).format(maxInputValue)}
            />
            <DigitCard
              title={'TVL'}
              tooltipText={TVL_TOOLTIP}
              digit={
                market?.locked_quantity_usd
                  ? t('format.currency', {
                      value: market?.locked_quantity_usd,
                      notation: 'compact',
                    })
                  : 'N/A'
              }
            />
          </BeraChainProgressCardComponent>
        </BerchainMarketCardInfos>
      )}

      {type === 'deposit' && (
        <BerchainMarketCardInfos
          sx={{
            display: 'flex',
          }}
        >
          {market?.incentive_tokens_data?.length > 0 ? (
            <TokenIncentivesCard
              tokens={market?.incentive_tokens_data}
              marketData={market}
            />
          ) : (
            <DigitTooltipCard
              title={'APY'}
              digit={
                market?.annual_change_ratio
                  ? t('format.percent', {
                      value: market?.annual_change_ratio,
                    })
                  : 'N/A'
              }
              tooltipText={APY_TOOLTIP}
            />
          )}
        </BerchainMarketCardInfos>
      )}
    </BerachainWidgetSelection>
  );
}

export default InfoBlock;

{
  /* {type === 'deposit' && (
        <BerchainMarketCardInfos
          sx={{
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <Box
            sx={{
              height: '100%',
              width: '100%',
              padding: theme.spacing(1),
              display: 'flex',
              justifyContent: 'space-between',
              backgroundColor: deposited ? '#291812' : undefined,
              [theme.breakpoints.up('sm' as Breakpoint)]: {
                padding: theme.spacing(1.5, 2),
              },
            }}
          >
            <DigitTokenSymbolCard
              title={deposited ? 'Deposited' : 'Deposit'}
              tooltipText={deposited ? DEPOSITED_TOOLTIP : DEPOSIT_TOOLTIP}
              tokenImage={market?.input_token_data?.image}
              digit={
                deposited
                  ? t('format.currency', {
                      value: dataRecipe?.input_token_data_ap?.token_amount_usd,
                    })
                  : market?.input_token_data?.symbol
              }
            />

            <DigitCard
              title={'TVL'}
              tooltipText={TVL_TOOLTIP}
              digit={
                market?.locked_quantity_usd
                  ? t('format.currency', {
                      value: market?.locked_quantity_usd,
                      notation: 'compact',
                    })
                  : 'N/A'
              }
            />
          </Box>

          <Divider />

          <Box
            sx={{
              height: '100%',
              width: '100%',
              padding: theme.spacing(1),
              display: 'flex',
              justifyContent: 'space-between',
              [theme.breakpoints.up('sm' as Breakpoint)]: {
                padding: theme.spacing(1),
              },
            }}
          >
            {market?.incentive_tokens_data?.length > 0 ? (
              <TokenIncentivesCard
                tokens={market?.incentive_tokens_data}
                marketData={market}
              />
            ) : (
              <DigitTooltipCard
                title={'APY'}
                digit={
                  market?.annual_change_ratio
                    ? t('format.percent', {
                        value: market?.annual_change_ratio,
                      })
                    : 'N/A'
                }
                tooltipText={APY_TOOLTIP}
              />
            )}

            {market.lockup_time === '0' ? undefined : (
              <DigitCard
                title={'Lockup'}
                tooltipText={LOCKUP_TOOLTIP}
                digit={formatWithCustomLabels(
                  Object.entries(secondsToDuration(market.lockup_time))
                    .filter(([_, value]) => value > 0) // Filter out zero values
                    .slice(0, 2) // Take the first two non-zero units
                    .reduce(
                      (acc, [unit, value]) => ({ ...acc, [unit]: value }),
                      {},
                    ),
                )}
              />
            )}
          </Box>
        </BerchainMarketCardInfos>
      )} */
}
