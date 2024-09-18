import { Box } from '@mui/material';
import { NoSelectTypographyTitle } from '../ProfilePage.style';

interface PointsDisplayProps {
  points?: number;
}

export const PointsDisplay = ({ points }: PointsDisplayProps) => (
  <Box display="flex" justifyContent="end">
    <NoSelectTypographyTitle
      lineHeight={1.25}
      fontWeight={700}
      sx={{
        fontSize: { xs: 48, sm: 80 },
        letterSpacing: '-2px',
      }}
    >
      {points || '-'}
    </NoSelectTypographyTitle>
  </Box>
);
