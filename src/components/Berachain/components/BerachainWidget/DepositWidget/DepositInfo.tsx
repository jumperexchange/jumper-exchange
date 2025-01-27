import { BerachainDepositInputBackground } from '@/components/Berachain/components/BerachainWidget/DepositWidget/WidgetDeposit.style';
import type { EnrichedMarketDataType } from 'royco/queries';
import { LinearProgress, Stack, Tooltip } from '@mui/material';
import DigitCard from '@/components/Berachain/components/BerachainMarketCard/StatCard/DigitCard';
import {
  APY_TOOLTIP,
  AVAILABLE_TOOLTIP,
  DEPOSITED_TOOLTIP,
  INCENTIVES_TOOLTIP,
  LOCKUP_TOOLTIP,
  TVL_TOOLTIP,
} from '@/components/Berachain/const/title';
import { useMemo } from 'react';
import { parseRawAmountToTokenAmount } from 'royco/utils';
import { useTranslation } from 'react-i18next';
import { calculateTVLGoal } from '@/components/Berachain/utils';
import {
  formatWithCustomLabels,
  secondsToDuration,
} from '@/components/Berachain/lockupTimeMap';
import { TokenIncentivesData } from '@/components/Berachain/components/BerachainMarketCard/StatCard/TokenIncentivesData';
import DigitTooltipCard from '@/components/Berachain/components/BerachainMarketCard/StatCard/DigitTooltipCard';
import TooltipProgressbar from '@/components/Berachain/components/TooltipProgressbar';
import TooltipIncentives from '@/components/Berachain/components/BerachainWidget/TooltipIncentives';
import DigitTokenSymbolCard from '../../BerachainMarketCard/StatCard/DigitTokenSymbolCard';
import { useEnrichedAccountBalancesRecipeInMarket } from 'royco/hooks';
import { useAccount } from '@lifi/wallet-management';
import { useActiveMarket } from '@/components/Berachain/hooks/useActiveMarket';

interface DepositInfoProps {
  market: EnrichedMarketDataType;
  balance?: number;
}

function DepositInfo({ market, balance }: DepositInfoProps) {
  const { t } = useTranslation();
  const { account } = useAccount();

  const maxInputValue = useMemo(() => {
    return parseRawAmountToTokenAmount(
      market?.quantity_ip ?? '0', // @note: AP fills IP quantity
      market?.input_token_data.decimals ?? 0,
    );
  }, [market]);

  const tvlGoal = useMemo(() => {
    return calculateTVLGoal(market);
  }, [market]);

  const fillable = parseRawAmountToTokenAmount(
    market.quantity_ip?.toString() ?? '0',
    market?.input_token_data?.decimals ?? 0,
  );

  const { data: recipe, refetch } = useEnrichedAccountBalancesRecipeInMarket({
    chain_id: market.chain_id!,
    market_id: market.market_id!,
    account_address: account?.address?.toLowerCase() ?? '',
    custom_token_data: undefined,
  });

  return (
    <BerachainDepositInputBackground
      sx={{
        gap: 2,
      }}
    >
      <Stack direction="column">
        <Stack direction="row" justifyContent="space-between">
          <DigitCard
            title={'TVL'}
            tooltipText={TVL_TOOLTIP}
            sx={(theme) => ({
              '.tooltip-icon': {
                color: theme.palette.alphaLight500.main,
              },
              '.content': {
                fontSize: '1.5rem',
              },
            })}
            digit={
              market?.locked_quantity_usd
                ? t('format.currency', {
                    value: market?.locked_quantity_usd,
                    notation: 'compact',
                  })
                : 'N/A'
            }
          />
          {!!recipe?.input_token_data_ap?.token_amount &&
          recipe.input_token_data_ap.token_amount > 0 ? (
            <DigitTokenSymbolCard
              title={'Deposited'}
              sx={(theme) => ({
                '.tooltip-icon': {
                  color: theme.palette.alphaLight500.main,
                },
                '.content-wrapper': {
                  alignItems: 'flex-end',
                  justifyContent: 'flex-end',
                },
                '.content': {
                  fontSize: '1.5rem',
                },
              })}
              tooltipText={DEPOSITED_TOOLTIP}
              tokenImage={market?.input_token_data?.image}
              digit={t('format.decimal', {
                value: recipe?.input_token_data_ap?.token_amount,
                maximumFractionDigits:
                  recipe?.input_token_data_ap?.token_amount > 1 ? 1 : 5,
              })}
              hasDeposited={true}
            />
          ) : (
            <DigitCard
              sx={(theme) => ({
                '.tooltip-icon': {
                  color: theme.palette.alphaLight500.main,
                },
                alignItems: 'flex-end',
                '.content': {
                  fontSize: '1.5rem',
                },
              })}
              title={'Deposit Cap'}
              tooltipText={AVAILABLE_TOOLTIP}
              digit={t('format.currency', {
                value: maxInputValue,
                notation: 'compact',
                maximumFractionDigits: maxInputValue > 1 ? 1 : 5,
              })}
            />
          )}
        </Stack>
      </Stack>
      <TooltipProgressbar market={market}>
        <LinearProgress
          variant="determinate"
          value={tvlGoal}
          sx={(theme) => ({
            color: '#FF8425',
            background: theme.palette.alphaLight200.main,
            borderRadius: '16px',
          })}
        />
      </TooltipProgressbar>
      <Stack direction="column">
        <Stack direction="row" justifyContent="space-between">
          {market?.incentive_tokens_data?.length > 0 ? (
            <DigitCard
              title={'Total rewards'}
              sx={(theme) => ({
                '.tooltip-icon': {
                  color: theme.palette.alphaLight500.main,
                },
                '.title': {
                  color: theme.palette.text.secondary,
                  fontSize: '0.75rem',
                },
                '.content': {
                  fontSize: '1.5rem',
                },
              })}
              tooltipText={<TooltipIncentives market={market} />}
              digit={<TokenIncentivesData market={market} />}
            />
          ) : (
            <DigitCard
              title={'APY rewards'}
              tooltipText={APY_TOOLTIP}
              sx={(theme) => ({
                '.tooltip-icon': {
                  color: theme.palette.alphaLight500.main,
                },
                '.title': {
                  color: theme.palette.text.secondary,
                  fontSize: '0.75rem',
                },
                '.content': {
                  fontSize: '1.5rem',
                },
              })}
              digit={
                market?.annual_change_ratio
                  ? t('format.percent', {
                      value: market?.annual_change_ratio,
                    })
                  : 'N/A'
              }
            />
          )}
          {market.lockup_time === '0' ? undefined : (
            <DigitCard
              sx={(theme) => ({
                alignItems: 'flex-end',
                '.tooltip-icon': {
                  color: theme.palette.alphaLight500.main,
                },
                '.title': {
                  color: theme.palette.text.secondary,
                  fontSize: '0.75rem',
                },
                '.content': {
                  fontSize: '1.5rem',
                },
              })}
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
        </Stack>
      </Stack>
    </BerachainDepositInputBackground>
  );
}

export default DepositInfo;
