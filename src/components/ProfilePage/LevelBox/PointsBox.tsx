'use client';

import { Box, Theme, useMediaQuery } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { XPIcon } from 'src/components/illustrations/XPIcon';
import { PointsDisplay } from './PointsDisplay';
import IconHeader from '../Common/IconHeader';
import useClient from 'src/hooks/useClient';

interface PointsBoxProps {
  points?: number;
}

export const PointsBox = ({ points }: PointsBoxProps) => {
  const { t } = useTranslation();

  const isClient = useClient();
  const isMobile = useMediaQuery((theme: Theme) =>
    theme.breakpoints.down('md'),
  );

  return (
    <Box>
      {isClient && (
        <IconHeader
          tooltipKey="profile_page.pointsInfo"
          title={
            isMobile
              ? 'XP'
              : `Updated: ${t('format.date', { value: new Date() })}`
          }
          icon={<XPIcon />}
        />
      )}
      <Box display="flex" alignItems="center">
        <PointsDisplay points={points} />
      </Box>
    </Box>
  );
};
