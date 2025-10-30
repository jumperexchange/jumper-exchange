import { useTranslation } from 'react-i18next';
import useMediaQuery from '@mui/material/useMediaQuery';
import { AppPaths } from 'src/const/urls';
import { useLevelDisplayData } from '../../hooks';
import { LabelButton } from './LabelButton';
import { usePathnameWithoutLocale } from 'src/hooks/routing/usePathnameWithoutLocale';
import Typography from '@mui/material/Typography';
import { LevelIconBox } from './Buttons.style';

export const LevelButton = () => {
  const { t } = useTranslation();
  const isDesktop = useMediaQuery((theme) => theme.breakpoints.up('md'));
  const pathname = usePathnameWithoutLocale();
  const { value, isLoading } = useLevelDisplayData();

  return (
    <LabelButton
      icon={
        <LevelIconBox>
          <Typography variant="bodyXSmallStrong">{value}</Typography>
        </LevelIconBox>
      }
      label={'Pass'}
      href={AppPaths.Profile}
      id="wallet-digest-button-xp"
      isActive={pathname === AppPaths.Profile}
      isLoading={isLoading}
      isLabelVisible={isDesktop}
    />
  );
};
