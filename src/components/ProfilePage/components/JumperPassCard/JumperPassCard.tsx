import type { Theme } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import type { FC } from 'react';
import { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { SectionCard } from '@/components/Cards/SectionCard/SectionCard';
import { GiftIcon } from '@/components/illustrations/GiftIcon';
import { FatBoltIcon } from '@/components/illustrations/FatBoltIcon';
import { useUnlockedPerks } from '@/hooks/perks/useUnlockedPerks';
import { useLoyaltyPass } from '@/hooks/useLoyaltyPass';
import { ProfileContext } from '@/providers/ProfileProvider';
import type { PerksDataAttributes } from '@/types/strapi';
import { ProgressionBar } from '@/components/ProfilePage/LevelBox/ProgressionBar';
import { getLastSettledMonthXP } from '@/components/ProfilePage/utils/getLastSettledMonthXP';
import { getLevelBasedOnPoints } from '@/components/ProfilePage/utils/getLevelBasedOnPoints';
import {
  JumperPassCardContainer,
  JumperPassLevelLabels,
  JumperPassProgressContainer,
  JumperPassStatsContainer,
  JumperPassTitle,
  jumperPassCardSx,
} from './JumperPassCard.styles';
import { JumperPassCardSkeleton } from './JumperPassCardSkeleton';
import { PassStatChip } from './PassStatChip';

const statIconSx = (theme: Theme) => ({
  fontSize: theme.spacing(3),
  color: (theme.vars || theme).palette.accent1.main,
});

interface JumperPassCardProps {
  perks: PerksDataAttributes[];
}

export const JumperPassCard: FC<JumperPassCardProps> = ({ perks }) => {
  const { walletAddress: address, isLoading: isWalletLoading } =
    useContext(ProfileContext);
  const { points = 0, pdas, isLoading } = useLoyaltyPass(address);
  const { unlockedPerks } = useUnlockedPerks(perks);
  const { t } = useTranslation();

  const levelData = getLevelBasedOnPoints(points);
  const currentLevel = levelData.level ?? 0;
  const nextLevel = currentLevel + 1;

  const xpLastMonth = getLastSettledMonthXP(pdas ?? []);
  const perksUnlocked = unlockedPerks.length;

  if (isWalletLoading || isLoading) {
    return <JumperPassCardSkeleton />;
  }

  return (
    <JumperPassCardContainer>
      <SectionCard sx={jumperPassCardSx}>
        <JumperPassStatsContainer>
          <PassStatChip
            icon={<FatBoltIcon sx={statIconSx} />}
            value={`${t('format.decimal2Digit', { value: xpLastMonth })} XP`}
            caption={t('profile_page.passStats.lastMonth')}
          />
          {perksUnlocked > 0 && (
            <PassStatChip
              icon={<GiftIcon sx={statIconSx} />}
              value={t('profile_page.passStats.perks', {
                count: perksUnlocked,
              })}
              caption={t('profile_page.passStats.unlocked')}
            />
          )}
        </JumperPassStatsContainer>

        <JumperPassTitle variant="bodyXLarge">
          {t('profile_page.jumperPass')}
        </JumperPassTitle>

        {points === 0 ? (
          <Typography variant="bodySmall" color="textSecondary">
            {t('profile_page.beginJourney')}
          </Typography>
        ) : (
          <Typography variant="bodySmall" color="textSecondary">
            {t('profile_page.progressTo')}{' '}
            <Typography
              component="span"
              variant="bodySmallStrong"
              color="textPrimary"
            >
              {t('profile_page.levelWithValue', { level: nextLevel })}
            </Typography>
          </Typography>
        )}

        <Typography variant="titleLarge" color="textPrimary">
          {t('format.decimal2Digit', { value: points })}
          <Typography
            component="span"
            variant="bodyLargeStrong"
            color="textSecondary"
            sx={{ ml: 0.5 }}
          >
            XP
          </Typography>
        </Typography>

        <JumperPassProgressContainer>
          <ProgressionBar
            ongoingValue={points}
            levelData={levelData}
            hideLevelIndicator
          />
        </JumperPassProgressContainer>

        <JumperPassLevelLabels>
          <Typography variant="bodyXXSmall" color="textPrimary">
            {t('profile_page.levelWithValue', { level: currentLevel })}
          </Typography>
          <Typography variant="bodyXXSmall" color="textPrimary">
            {t('profile_page.levelWithValue', { level: nextLevel })}
          </Typography>
        </JumperPassLevelLabels>
      </SectionCard>
    </JumperPassCardContainer>
  );
};
