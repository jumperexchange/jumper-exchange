import { Box } from '@mui/material';
import { numberWithCommas } from 'src/utils/formatNumbers';
import { TierboxInfoTitles } from './TierBox.style';

interface PointsDisplayProps {
  points?: number;
  defaultPoints?: number;
}

export const PointsDisplay = ({
  points,
  defaultPoints,
}: PointsDisplayProps) => {
  const title = numberWithCommas(points || defaultPoints || 0);
  return (
    <Box display="flex" justifyContent="end">
      <TierboxInfoTitles variant="headerLarge">{title}</TierboxInfoTitles>
    </Box>
  );
};
