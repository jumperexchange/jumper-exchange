import { Box } from '@mui/material';
import { IconHeader } from '../Common/IconHeader';
import { PointsDisplay } from './PointsDisplay';
interface PointsBoxProps {
  points?: number;
}

export const PointsBox = ({ points }: PointsBoxProps) => {
  return (
    <Box>
      <IconHeader tooltipKey="profile_page.pointsInfo" title="XP" />
      <Box display="flex" alignItems="center">
        <PointsDisplay points={points} />
      </Box>
    </Box>
  );
};
