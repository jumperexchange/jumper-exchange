'use client';

import ReceiptLongOutlined from '@mui/icons-material/ReceiptLongOutlined';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { useTranslation } from 'react-i18next';

export const OrdersEmptyState = () => {
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
        <ReceiptLongOutlined
          sx={{ width: 24, height: 24, color: 'textSecondary' }}
        />
      </Box>
      <Typography variant="bodySmall" color="textSecondary">
        {t('limitOrders.ordersEmptyState')}
      </Typography>
    </Box>
  );
};
