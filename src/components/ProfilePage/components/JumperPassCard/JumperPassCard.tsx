import BoltIcon from '@mui/icons-material/Bolt';
import CardGiftcardIcon from '@mui/icons-material/CardGiftcard';
import Box from '@mui/material/Box';
import type { Theme } from '@mui/material/styles';
import type { FC } from 'react';
import { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { SectionCard } from 'src/components/Cards/SectionCard/SectionCard';
import { SECONDS_IN_A_DAY } from 'src/const/time';
import { useGetClaimedPerks } from 'src/hooks/perks/useGetClaimedPerks';
import { useLoyaltyPass } from 'src/hooks/useLoyaltyPass';
import { ProfileContext } from 'src/providers/ProfileProvider';
import { ProgressionBar } from '../../LevelBox/ProgressionBar';
import { getLevelBasedOnPoints } from '../../utils/getLevelBasedOnPoints';
import {
  JumperPassCardContainer,
  JumperPassLevelLabel,
  JumperPassLevelLabels,
  JumperPassProgressContainer,
  JumperPassStatsContainer,
  JumperPassSubtitle,
  JumperPassTitle,
  JumperPassXp,
  JumperPassXpUnit,
  jumperPassCardSx,
} from './JumperPassCard.styles';
import { JumperPassCardSkeleton } from './JumperPassCardSkeleton';
import { PassStatChip } from './PassStatChip';

const SEVEN_DAYS_MS = 7 * SECONDS_IN_A_DAY * 1000;

const statIconSx = (theme: Theme) => ({
  fontSize: theme.spacing(3),
  color: (theme.vars || theme).palette.text.primary,
});

interface JumperPassCardProps {}

export const JumperPassCard: FC<JumperPassCardProps> = () => {
  const { walletAddress: address, isLoading: isWalletLoading } =
    useContext(ProfileContext);
  const { points = 0, pdas, isLoading } = useLoyaltyPass(address);
  const { data: claimedPerks } = useGetClaimedPerks(address);
  const { t } = useTranslation();

  const levelData = getLevelBasedOnPoints(points);
  const currentLevel = levelData.level ?? 0;
  const nextLevel = currentLevel + 1;

  const weekAgo = Date.now() - SEVEN_DAYS_MS;
  const xpThisWeek = (pdas ?? []).reduce((sum, pda) => {
    const timestamp = new Date(pda.timestamp).getTime();
    return !Number.isNaN(timestamp) && timestamp >= weekAgo
      ? sum + (pda.points ?? 0)
      : sum;
  }, 0);
  const perksUnlocked = claimedPerks?.length ?? 0;

  if (isWalletLoading || isLoading) {
    return <JumperPassCardSkeleton />;
  }

  return (
    <JumperPassCardContainer>
      <SectionCard sx={jumperPassCardSx}>
        <JumperPassStatsContainer>
          <PassStatChip
            icon={<BoltIcon sx={statIconSx} />}
            value={`${t('format.decimal2Digit', { value: xpThisWeek })} XP`}
            caption={t('profile_page.passStats.thisWeek')}
          />
          <PassStatChip
            icon={<CardGiftcardIcon sx={statIconSx} />}
            value={t('profile_page.passStats.perks', { count: perksUnlocked })}
            caption={t('profile_page.passStats.unlocked')}
          />
        </JumperPassStatsContainer>

        <JumperPassTitle>{t('profile_page.jumperPass')}</JumperPassTitle>

        <JumperPassSubtitle>
          {t('profile_page.progressTo')}{' '}
          <Box
            component="span"
            sx={(theme) => ({
              typography: 'bodySmallStrong',
              color: (theme.vars || theme).palette.text.primary,
            })}
          >
            {t('profile_page.levelWithValue', { level: nextLevel })}
          </Box>
        </JumperPassSubtitle>

        <JumperPassXp>
          {t('format.decimal2Digit', { value: points })}
          <JumperPassXpUnit>XP</JumperPassXpUnit>
        </JumperPassXp>

        <JumperPassProgressContainer>
          <ProgressionBar
            ongoingValue={points}
            levelData={levelData}
            hideLevelIndicator
          />
        </JumperPassProgressContainer>

        <JumperPassLevelLabels>
          <JumperPassLevelLabel>
            {t('profile_page.levelWithValue', { level: currentLevel })}
          </JumperPassLevelLabel>
          <JumperPassLevelLabel>
            {t('profile_page.levelWithValue', { level: nextLevel })}
          </JumperPassLevelLabel>
        </JumperPassLevelLabels>
      </SectionCard>
    </JumperPassCardContainer>
  );
};
