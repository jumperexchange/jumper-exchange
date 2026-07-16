'use client';

import { Tooltip } from '@/components/core/Tooltip/Tooltip';
import { usePortfolioState } from '@/providers/PortfolioProvider/PortfolioContext';
import ErrorOutlineOutlined from '@mui/icons-material/ErrorOutlineOutlined';
import { Box } from '@mui/material';
import { useTranslation } from 'react-i18next';

export const PortfolioPnlChartDisclaimer = () => {
  const { t } = useTranslation();
  const {
    sources: { pnlChart: pnlChartSource },
  } = usePortfolioState();
  const pnlChartDisclaimer = t('portfolio.overviewCard.pnlChartDisclaimer');

  const showDisclaimer =
    !pnlChartSource.isLoading &&
    (!pnlChartSource.isEmpty || pnlChartSource.isRefreshing);

  if (!showDisclaimer) {
    return null;
  }

  return (
    <Tooltip title={pnlChartDisclaimer}>
      <Box
        component="span"
        aria-label={pnlChartDisclaimer}
        sx={{
          display: 'inline-flex',
          alignItems: 'center',
          cursor: 'help',
          color: 'textSecondary',
        }}
      >
        <ErrorOutlineOutlined sx={{ fontSize: 16 }} />
      </Box>
    </Tooltip>
  );
};
