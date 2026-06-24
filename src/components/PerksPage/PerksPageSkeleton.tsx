'use client';

import { SectionCard } from '@/components/Cards/SectionCard/SectionCard';
import { PageContainer } from '@/components/Containers/PageContainer';
import { AchievementsGrid } from '@/components/ProfilePage/sections/YourAchievementsSection/YourAchievementsSection.styles';
import { PerkCardSkeleton } from '@/components/composite/cards/PerkCard/PerkCardSkeleton';
import { perksSectionCardSx } from './PerksPage.styles';

// One row of placeholder cards while the page streams in.
const SKELETON_COUNT = 4;

export const PerksPageSkeleton = () => (
  <PageContainer>
    <SectionCard sx={perksSectionCardSx}>
      <AchievementsGrid>
        {Array.from({ length: SKELETON_COUNT }, (_, i) => (
          <PerkCardSkeleton key={i} />
        ))}
      </AchievementsGrid>
    </SectionCard>
  </PageContainer>
);
