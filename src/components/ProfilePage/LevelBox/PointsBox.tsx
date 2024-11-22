import { Box } from '@mui/material';
import { IconHeader } from '../Common/IconHeader';
import { CenteredBox } from '@/components/ProfilePage/ProfilePage.style';
import { PointsDisplay } from './PointsDisplay';
interface PointsBoxProps {
  points?: number;
}

export const PointsBox = ({ points }: PointsBoxProps) => {
  return (
    <Box>
      <IconHeader tooltipKey="profile_page.pointsInfo" title="XP" />
      <CenteredBox>
        <PointsDisplay points={points} />
      </CenteredBox>
    </Box>
  );
};
