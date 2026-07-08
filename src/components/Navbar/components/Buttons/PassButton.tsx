import useMediaQuery from '@mui/material/useMediaQuery';
import { useTranslation } from 'react-i18next';
import { ProgressRing } from '@/components/core/ProgressRing/ProgressRing';
import { Tooltip } from '@/components/core/Tooltip/Tooltip';
import { AppPaths } from 'src/const/urls';
import { usePathnameWithoutLocale } from 'src/hooks/routing/usePathnameWithoutLocale';
import { usePassDisplayData } from '../../hooks';
import { PassProgressChip } from './Buttons.style';
import { LabelButton } from './LabelButton';

const RING_SIZE = 20;

export const PassButton = () => {
  const { t } = useTranslation();
  const isDesktop = useMediaQuery((theme) => theme.breakpoints.up('md'));
  const pathname = usePathnameWithoutLocale();
  const { progress, unlockedPerksCount, points, level, isLoading } =
    usePassDisplayData();

  return (
    <LabelButton
      icon={
        <Tooltip
          title={t('navbar.passXp', {
            xp: t('format.decimal2Digit', { value: points ?? 0 }),
          })}
          placement="bottom"
        >
          <PassProgressChip>
            <ProgressRing progress={progress} size={RING_SIZE} />
          </PassProgressChip>
        </Tooltip>
      }
      label={level ? t('navbar.passWithLevel', { level }) : t('navbar.pass')}
      caption={t('navbar.perksUnlocked', { count: unlockedPerksCount })}
      href={AppPaths.Profile}
      id="wallet-digest-button-xp"
      isActive={pathname === AppPaths.Profile}
      isLoading={isLoading}
      isLabelVisible={isDesktop}
    />
  );
};
