import { Box } from '@mui/material';
import { IconHeader } from '../Common/IconHeader';
import { CenteredBox } from '../ProfilePage.style';
import { PointsDisplay } from './PointsDisplay';
interface PointsBoxProps {
  points?: number;
}

export const PointsBox = ({ points }: PointsBoxProps) => {
  return (
    <Box>
      <IconHeader tooltipKey="profile_page.pointsInfo" title="POINTS" />
      <CenteredBox>
        <PointsDisplay points={points} />
      </CenteredBox>
    </Box>
  );
};
