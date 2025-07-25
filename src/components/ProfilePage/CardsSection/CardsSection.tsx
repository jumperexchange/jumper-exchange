'use client';

import { SectionCard } from 'src/components/Cards/SectionCard/SectionCard';
import { CardsSectionContainer } from './CardsSection.style';
import { CardsTabs } from './CardsTabs';

export const CardsSection = () => {
  return (
    // <CardsSectionShell>
    <SectionCard>
      <CardsSectionContainer>
        <CardsTabs />
      </CardsSectionContainer>
    </SectionCard>
    // </CardsSectionShell>
  );
};
