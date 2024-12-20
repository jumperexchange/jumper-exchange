import { Box } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { TierboxInfoTitles } from './TierBox.style';

interface PointsDisplayProps {
  points?: number;
  defaultPoints?: number;
}

export const PointsDisplay = ({
  points,
  defaultPoints,
}: PointsDisplayProps) => {
  const { t } = useTranslation();
  return (
    <Box display="flex" justifyContent="end">
      <TierboxInfoTitles variant="headerLarge">
        {t('format.decimal2Digit', { value: points || defaultPoints || 0 })}
      </TierboxInfoTitles>
    </Box>
  );
};
