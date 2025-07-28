'use client';

import { AddressCardSkeleton } from '../components/AddressCard/AddressCardSkeleton';
import { LevelCardSkeleton } from '../components/LevelCard/LevelCardSkeleton';
import { RankCardSkeleton } from '../components/RankCard/RankCardSkeleton';
import { IntroSectionContainer } from './Section.style';

export const IntroSectionSkeleton = () => {
  return (
    <IntroSectionContainer>
      <AddressCardSkeleton />
      <LevelCardSkeleton />
      <RankCardSkeleton />
    </IntroSectionContainer>
  );
};
