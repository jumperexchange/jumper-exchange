import type { EnrichedMarketDataType } from 'royco/queries';
import {
  BerachainWidgetSelection,
  BerachainWidgetSelectionRewards,
} from '@/components/Berachain/components/BerachainWidgetWip/BerachainWidgetWip.style';
import { BerachainProgressCard } from '@/components/Berachain/components/BerachainProgressCard/BerachainProgressCard';
import { formatDuration } from 'date-fns';
import { secondsToDuration } from '@/components/Berachain/lockupTimeMap';
import { useTranslation } from 'react-i18next';
import type { Breakpoint } from '@mui/material';
import { useTheme } from '@mui/material';
import { useEnrichedAccountBalancesRecipeInMarket } from 'royco/hooks';
import { useAccount } from '@lifi/wallet-management';

function InfoBlock({ market }: { market: EnrichedMarketDataType }) {
  const { t } = useTranslation();
  const { account } = useAccount();
  const theme = useTheme();

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

  // @ts-expect-error
  const deposited = dataRecipe?.input_token_data_ap?.token_amount > 0;

  return (
    <BerachainWidgetSelection>
      <BerachainWidgetSelectionRewards>
        <BerachainProgressCard
          title="APY"
          value={
            market.annual_change_ratio
              ? // @ts-expect-error
                t('format.percent', {
                  value: market.annual_change_ratio.toString(),
                })
              : 'N/A'
          }
          tooltip={'APY lorem ipsum tooltip msg'}
        />
        {market.lockup_time === '0' ? (
          <BerachainProgressCard
            title="TVL"
            value={
              market.locked_quantity_usd
                ? t('format.currency', {
                    value: market.locked_quantity_usd,
                    notation: 'compact',
                  })
                : 'N/A'
            }
            tooltip={'Rewards lorem ipsum tooltip msg'}
          />
        ) : (
          <BerachainProgressCard
            title="Lockup time"
            value={formatDuration(
              Object.entries(secondsToDuration(market.lockup_time))
                .filter(([_, value]) => value > 0) // Filter out zero values
                .slice(0, 2) // Take the first two non-zero units
                .reduce(
                  (acc, [unit, value]) => ({ ...acc, [unit]: value }),
                  {},
                ),
            )}
            tooltip={'Rewards lorem ipsum tooltip msg'}
          />
        )}

        {deposited && (
          <BerachainProgressCard
            title={'Deposited'}
            value={t('format.currency', {
              value: dataRecipe?.input_token_data_ap?.token_amount_usd,
            })}
            sx={{
              height: '100%',
              padding: theme.spacing(1.5, 2),
              display: 'flex',
              [theme.breakpoints.up('sm' as Breakpoint)]: {
                padding: theme.spacing(1.5, 2),
              },
              backgroundImage:
                'linear-gradient(rgba(253, 183, 45, 0.20), rgba(253, 183, 45, 0.20))',
            }}
          />
        )}
      </BerachainWidgetSelectionRewards>
    </BerachainWidgetSelection>
  );
}

export default InfoBlock;
