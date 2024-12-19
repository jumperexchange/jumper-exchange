import { Box } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { LvlIcon } from 'src/components/illustrations/IconLVL';
import { IconHeader } from '../Common/IconHeader';
import { PointsDisplay } from './PointsDisplay';
interface LevelBoxProps {
  level?: number;
  loading: boolean;
}

export const LevelBox = ({ level }: LevelBoxProps) => {
  const { t } = useTranslation();

  return (
    <Box>
      <IconHeader
        icon={<LvlIcon />}
        tooltipKey="profile_page.levelInfo"
        title={t('profile_page.level')}
      />
      <PointsDisplay points={level} defaultPoints={1} />
    </Box>
  );
};
