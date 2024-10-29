import { Box } from '@mui/material';
import { NoSelectTypographyTitle } from '../ProfilePage.style';

interface PointsDisplayProps {
  points?: number;
  defaultPoints?: number;
}

export const PointsDisplay = ({
  points,
  defaultPoints,
}: PointsDisplayProps) => (
  <Box display="flex" justifyContent="end">
    <NoSelectTypographyTitle>
      {points || defaultPoints || '0'}
    </NoSelectTypographyTitle>
  </Box>
);
