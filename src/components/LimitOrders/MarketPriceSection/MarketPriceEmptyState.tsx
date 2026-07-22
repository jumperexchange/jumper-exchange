'use client';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { useTranslation } from 'react-i18next';
import { CandlestickChartIcon } from '@/components/illustrations/CandlestickChartIcon';

export const MarketPriceEmptyState = () => {
  const { t } = useTranslation();

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        gap: 2,
        minHeight: 220,
      }}
    >
      <Box
        sx={(theme) => ({
          background: (theme.vars || theme).palette.alpha100.main,
          borderRadius: `${theme.shape.radius16}px`,
          p: theme.spacing(2.5),
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        })}
      >
        <CandlestickChartIcon
          width={40}
          height={40}
          sx={{ color: 'textSecondary' }}
        />
      </Box>
      <Typography variant="bodySmall" color="textSecondary">
        {t('limitOrders.marketPriceEmptyState')}
      </Typography>
    </Box>
  );
};
