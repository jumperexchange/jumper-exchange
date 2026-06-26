'use client';

import { JumperPassCardSkeleton } from '../components/JumperPassCard/JumperPassCardSkeleton';
import { RankCardSkeleton } from '../components/RankCard/RankCardSkeleton';
import { IntroHeroRow } from './Section.style';

export const IntroSectionSkeleton = () => {
  return (
    <IntroHeroRow>
      <JumperPassCardSkeleton />
      <RankCardSkeleton />
    </IntroHeroRow>
  );
};
