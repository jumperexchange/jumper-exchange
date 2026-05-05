import { Tooltip } from '@/components/core/Tooltip/Tooltip';
import type { PricedToken } from '@/types/tokens';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import type { TFunction } from 'i18next';
import type { ReactElement } from 'react';
import { useTranslation } from 'react-i18next';

interface CostBreakdown {
  token: PricedToken;
  amountUSD: number;
  amount: string;
}

interface FeeBreakdownTooltipProps {
  gasCosts?: CostBreakdown[];
  feeCosts?: CostBreakdown[];
  gasless?: boolean;
  children: ReactElement<any, any>;
}

export const FeeBreakdownTooltip: React.FC<FeeBreakdownTooltipProps> = ({
  gasCosts,
  feeCosts,
  gasless,
  children,
}) => {
  const { t } = useTranslation();
  return (
    <Tooltip
      title={
        <Box>
          {gasless ? <Box>{t('tooltips.gasless')}</Box> : null}
          {gasCosts?.length && !gasless ? (
            <Box>
              {t('jumperWidget.networkCosts.fees.network')}
              {getFeeBreakdownTypography(gasCosts, t)}
            </Box>
          ) : null}
          {feeCosts?.length && !gasless ? (
            <Box
              sx={{
                mt: 0.5,
              }}
            >
              {t('jumperWidget.networkCosts.fees.provider')}
              {getFeeBreakdownTypography(feeCosts, t)}
            </Box>
          ) : null}
        </Box>
      }
      sx={{ cursor: 'help' }}
    >
      {children}
    </Tooltip>
  );
};

const getFeeBreakdownTypography = (fees: CostBreakdown[], t: TFunction) =>
  fees.map((fee, index) => (
    <Typography
      color="inherit"
      key={`${fee.token.address}${index}`}
      sx={{
        fontSize: 12,
        fontWeight: '500',
      }}
    >
      {t('format.currency', { value: fee.amountUSD })} (
      {t('format.decimal', {
        value: Number(fee.amount),
      })}{' '}
      {fee.token.symbol})
    </Typography>
  ));
