'use client';

import Typography from '@mui/material/Typography';
import { useColorScheme } from '@mui/material/styles';
import Image from 'next/image';
import { useTranslation } from 'react-i18next';
import { getResolvedMode } from '@/utils/image-generation/helpers';
import { EmptyCard, EmptyText } from './UnlockedPerksEmpty.styles';

// Themed pair lives in /public as `perks-empty-hero-{light,dark}.png`.
const PERKS_EMPTY_HERO = '/perks-empty-hero';
const HERO_SIZE = 136;

export const UnlockedPerksEmpty = () => {
  const { t } = useTranslation();
  const { mode } = useColorScheme();
  const resolvedMode = getResolvedMode(mode);

  return (
    <EmptyCard>
      <Image
        src={`${PERKS_EMPTY_HERO}-${resolvedMode}.png`}
        alt=""
        width={HERO_SIZE}
        height={HERO_SIZE}
      />
      <EmptyText>
        <Typography variant="bodyMediumStrong" color="textPrimary">
          {t('profile_page.unlockedPerks.empty.title')}
        </Typography>
        <Typography variant="bodyXSmall" color="textSecondary">
          {t('profile_page.unlockedPerks.empty.description')}
        </Typography>
      </EmptyText>
    </EmptyCard>
  );
};
