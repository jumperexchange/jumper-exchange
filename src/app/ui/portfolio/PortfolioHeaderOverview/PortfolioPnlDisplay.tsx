import { BaseSurfaceSkeleton } from '@/components/core/skeletons/BaseSurfaceSkeleton/BaseSurfaceSkeleton.style';
import { Typography, useTheme } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { getPnlColor, formatPnl } from './utils';

interface PortfolioPnlDisplayProps {
  isLoading: boolean;
  pnlValue: number | null;
  pnlPercentage: number | null;
}

export const PortfolioPnlDisplay = ({
  isLoading,
  pnlValue,
  pnlPercentage,
}: PortfolioPnlDisplayProps) => {
  const { t } = useTranslation();
  const theme = useTheme();

  if (isLoading) {
    return <BaseSurfaceSkeleton variant="text" width={80} height={20} />;
  }

  return (
    <Typography
      variant="bodyMediumStrong"
      sx={{ color: getPnlColor(pnlValue, theme) }}
    >
      {formatPnl(pnlValue, pnlPercentage, t)}
    </Typography>
  );
};
