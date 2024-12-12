import { Box } from '@mui/material';
import { IconHeader } from '../Common/IconHeader';
import { PointsDisplay } from './PointsDisplay';
import { useTranslation } from 'react-i18next';
import { XPIcon } from 'src/components/illustrations/XPIcon';

interface PointsBoxProps {
  points?: number;
}

export const PointsBox = ({ points }: PointsBoxProps) => {
  const { t } = useTranslation();
  return (
    <Box>
      <IconHeader
        tooltipKey="profile_page.pointsInfo"
        title={`Updated: ${t('format.date', { value: new Date() })}`}
        icon={<XPIcon size={20} />}
      />
      <Box display="flex" alignItems="center">
        <PointsDisplay points={points} />
      </Box>
    </Box>
  );
};
