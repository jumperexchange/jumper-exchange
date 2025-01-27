import type {
  EnrichedAccountBalanceRecipeInMarketDataType,
  EnrichedMarketDataType,
} from 'royco/queries';
import {
  formatWithCustomLabels,
  secondsToDuration,
} from '@/components/Berachain/lockupTimeMap';
import { useTranslation } from 'react-i18next';
import type { Breakpoint, SxProps, Theme } from '@mui/material';
import { useTheme } from '@mui/material';
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
import { titleSlicer } from '@/components/Berachain/utils';

interface InfoBlockProps {
  market: EnrichedMarketDataType;
  recipe?: EnrichedAccountBalanceRecipeInMarketDataType | null;
  sx?: SxProps<Theme>;
}

function InfoBlock({ market, recipe, sx = {} }: InfoBlockProps) {
  const { t } = useTranslation();
  const { account } = useAccount();
  const theme = useTheme();

  const [openTokensTooltip] = useState(false);

  const deposited =
    recipe?.input_token_data_ap?.token_amount &&
    recipe?.input_token_data_ap?.token_amount > 0;

  const maxInputValue = useMemo(() => {
    return parseRawAmountToTokenAmount(
      market?.quantity_ip ?? '0', // @note: AP fills IP quantity
      market?.input_token_data.decimals ?? 0,
    );
  }, [market]);

  return (
    <BerachainWidgetSelection sx={sx}>
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
            background: 'transparent',
            [theme.breakpoints.up('sm' as Breakpoint)]: {
              padding: theme.spacing(1.5, 2),
            },
          }}
        >
          <DigitTokenSymbolCard
            title={deposited ? 'Deposited' : 'Deposit'}
            tooltipText={deposited ? DEPOSITED_TOOLTIP : DEPOSIT_TOOLTIP}
            tokenImage={market?.input_token_data?.image}
            sx={(theme) => ({
              '.tooltip-icon': {
                color: theme.palette.alphaLight500.main,
              },
              '.content': {
                fontSize: '1.5rem',
              },
            })}
            digit={
              deposited
                ? t('format.decimal', {
                    value: recipe?.input_token_data_ap?.token_amount,
                    maximumFractionDigits: 5,
                  })
                : titleSlicer(market?.input_token_data?.symbol)
            }
            hasDeposited={deposited ? true : false}
          />

          {market.lockup_time === '0' ? undefined : (
            <DigitCard
              sx={(theme) => ({
                alignItems: 'flex-end',
                '.header-container': {
                  justifyContent: 'flex-end',
                },
                '.content': {
                  fontSize: '1.5rem',
                },
                '.tooltip-icon': {
                  color: theme.palette.alphaLight500.main,
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
        </BeraChainProgressCardComponent>
      </BerchainMarketCardInfos>
    </BerachainWidgetSelection>
  );
}

export default InfoBlock;
