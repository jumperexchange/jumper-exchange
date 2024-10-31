import { Box } from '@mui/material';
import { TierboxInfoTitles } from './TierBox.style';

interface PointsDisplayProps {
  points?: number;
  defaultPoints?: number;
}

export const PointsDisplay = ({
  points,
  defaultPoints,
}: PointsDisplayProps) => (
  <Box display="flex" justifyContent="end">
    <TierboxInfoTitles variant="headerLarge">
      {points || defaultPoints || '0'}
    </TierboxInfoTitles>
  </Box>
);
