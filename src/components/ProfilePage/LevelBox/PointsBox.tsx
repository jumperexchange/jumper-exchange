'use client';

import { Box } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { XPIcon } from 'src/components/illustrations/XPIcon';
import useClient from 'src/hooks/useClient';
import IconHeader from '../Common/IconHeader';
import { PointsDisplay } from './PointsDisplay';

interface PointsBoxProps {
  points?: number;
}

export const PointsBox = ({ points }: PointsBoxProps) => {
  const { t } = useTranslation();
  const isClient = useClient();

  return (
    <Box>
      {isClient && (
        <IconHeader
          tooltipKey="profile_page.pointsInfo"
          title={`Updated: ${t('format.date', { value: new Date() })}`}
          icon={<XPIcon />}
          className="hide-icon-header-title-on-mobile"
        />
      )}
      <Box display="flex" alignItems="center">
        <PointsDisplay points={points} />
      </Box>
    </Box>
  );
};
