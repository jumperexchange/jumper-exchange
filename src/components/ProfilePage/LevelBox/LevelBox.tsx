import { Box } from '@mui/material';
import { IconHeader } from '../Common/IconHeader';
import { PointsDisplay } from './PointsDisplay';
interface LevelBoxProps {
  level?: number;
  loading: boolean;
}

export const LevelBox = ({ level }: LevelBoxProps) => {
  return (
    <Box>
      <IconHeader tooltipKey="profile_page.levelInfo" title="LEVEL" />
      <PointsDisplay points={level} />
    </Box>
  );
};
