import { Box } from '@mui/material';
import { NoSelectTypographyTitle } from '@/components/ProfilePage/ProfilePage.style';

interface PointsDisplayProps {
  points?: number;
  defaultPoints?: number;
}

export const PointsDisplay = ({
  points,
  defaultPoints,
}: PointsDisplayProps) => (
  <Box display="flex" justifyContent="end">
    <NoSelectTypographyTitle
      lineHeight={1.25}
      fontWeight={700}
      sx={{
        fontSize: { xs: 48, sm: 80 },
        letterSpacing: '-2px',
      }}
    >
      {points || defaultPoints || '0'}
    </NoSelectTypographyTitle>
  </Box>
);
