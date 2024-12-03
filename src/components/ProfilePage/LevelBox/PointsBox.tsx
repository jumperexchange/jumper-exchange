import { Box } from '@mui/material';
import { IconHeader } from '../Common/IconHeader';
import { PointsDisplay } from './PointsDisplay';
import { XPIcon } from 'src/components/illustrations/XPIcon';
import { XPIconHeader } from 'src/components/illustrations/IconXP';
interface PointsBoxProps {
  points?: number;
}

export const PointsBox = ({ points }: PointsBoxProps) => {
  const currentDate = new Date();
  const formattedDate = currentDate.toLocaleDateString('en-US', options);

  return (
    <Box>
      <IconHeader
        tooltipKey="profile_page.pointsInfo"
        title={`Updated: ${formattedDate}`}
        icon={<XPIconHeader size={20} />}
      />
      <Box display="flex" alignItems="center">
        <PointsDisplay points={points} />
      </Box>
    </Box>
  );
};
