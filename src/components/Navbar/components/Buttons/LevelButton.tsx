import { useTranslation } from 'react-i18next';
import useMediaQuery from '@mui/material/useMediaQuery';
import { AppPaths } from 'src/const/urls';
import AvatarBadge from 'src/components/AvatarBadge/AvatarBadge';
import { useLevelDisplayData } from '../../hooks';
import { LabelButton } from './LabelButton';
import { usePathnameWithoutLocale } from 'src/hooks/routing/usePathnameWithoutLocale';

export const LevelButton = () => {
  const { t } = useTranslation();
  const isDesktop = useMediaQuery((theme) => theme.breakpoints.up('md'));
  const pathname = usePathnameWithoutLocale();
  const {
    imageAlt: levelImageAlt,
    imageUrl: levelImageUrl,
    value,
    isLoading,
  } = useLevelDisplayData();

  return (
    <LabelButton
      icon={
        <AvatarBadge
          avatarSrc={levelImageUrl}
          alt={`${levelImageAlt} wallet icon`}
          avatarSize={32}
          maskEnabled={false}
          sx={(theme) => ({
            border: '2px solid',
            borderColor: (theme.vars || theme).palette.surface1.main,
          })}
        />
      }
      label={t('profile_page.levelWithValue', { level: value })}
      href={AppPaths.Profile}
      id="wallet-digest-button-xp"
      isActive={pathname === AppPaths.Profile}
      isLoading={isLoading}
      isLabelVisible={isDesktop}
    />
  );
};
