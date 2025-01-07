import { BerachainDepositInputBackground } from '@/components/Berachain/components/BerachainWidget/DepositWidget/WidgetDeposit.style';
import type { EnrichedMarketDataType } from 'royco/queries';
import { LinearProgress, Stack } from '@mui/material';
import DigitCard from '@/components/Berachain/components/BerachainMarketCard/StatCard/DigitCard';
import {
  AVAILABLE_TOOLTIP,
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

interface DepositInfoProps {
  market: EnrichedMarketDataType;
}

function DepositInfo({ market }: DepositInfoProps) {
  const { t } = useTranslation();
  const maxInputValue = useMemo(() => {
    return parseRawAmountToTokenAmount(
      market?.quantity_ip ?? '0', // @note: AP fills IP quantity
      market?.input_token_data.decimals ?? 0,
    );
  }, [market]);

  const tvlGoal = useMemo(() => {
    return calculateTVLGoal(market);
  }, [market]);

  return (
    <BerachainDepositInputBackground>
      <Stack direction="column">
        <Stack direction="row" justifyContent="space-between">
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
          <DigitCard
            sx={{
              alignItems: 'flex-end',
            }}
            title={'Available to deposit'}
            tooltipText={AVAILABLE_TOOLTIP}
            digit={t('format.currency', {
              value: maxInputValue,
              notation: 'compact',
              maximumFractionDigits: 5,
            })}
          />
        </Stack>
      </Stack>
      <LinearProgress
        variant="determinate"
        value={tvlGoal}
        sx={(theme) => ({
          color: '#FF8425',
          background: theme.palette.alphaLight200.main,
        })}
      />
      <Stack direction="column">
        <Stack direction="row" justifyContent="space-between">
          {market?.incentive_tokens_data?.length > 0 && (
            <DigitCard
              title={'Total rewards'}
              tooltipText={INCENTIVES_TOOLTIP}
              digit={
                <TokenIncentivesData tokens={market?.incentive_tokens_data} />
              }
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
        </Stack>
      </Stack>
    </BerachainDepositInputBackground>
  );
}

export default DepositInfo;
