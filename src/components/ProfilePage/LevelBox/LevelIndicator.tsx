import { NoSelectTypography } from '@/components/ProfilePage/ProfilePage.style';
import { useTheme } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { LevelButton } from '../../Button';
import { XPIcon } from '../../illustrations/XPIcon';

interface LevelButtonProps {
  level: number;
  bound: number;
}

export const LevelIndicator = ({ level, bound }: LevelButtonProps) => {
  const { t } = useTranslation();
  const theme = useTheme();

  return (
    <LevelButton aria-label="XP Level" size="medium">
      <NoSelectTypography
        sx={{ color: 'inherit' }}
        variant="bodyXSmallStrong"
        marginRight="8px"
      >
        {t('profile_page.level')} {level} • {bound}
      </NoSelectTypography>
      <XPIcon
        size={16}
        variant="secondary"
        color={theme.palette.white.main}
        bgColor={theme.palette.primary.main}
      />
    </LevelButton>
  );
};
