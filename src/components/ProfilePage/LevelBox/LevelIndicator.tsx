import { useTranslation } from 'react-i18next';
import { LevelButton } from '../../Button';
import { XPIcon } from '../../illustrations/XPIcon';
import { NoSelectTypography } from '../ProfilePage.style';

interface LevelButtonProps {
  level: number;
  bound: number;
}

export const LevelIndicator = ({ level, bound }: LevelButtonProps) => {
  const { t } = useTranslation();

  return (
    <LevelButton aria-label="XP Level" size="medium">
      <NoSelectTypography
        sx={{ color: 'inherit' }}
        variant="bodyXSmallStrong"
        marginRight="8px"
      >
        {t('profile_page.level')} {level} • {bound}
      </NoSelectTypography>
      <XPIcon size={16} />
    </LevelButton>
  );
};
