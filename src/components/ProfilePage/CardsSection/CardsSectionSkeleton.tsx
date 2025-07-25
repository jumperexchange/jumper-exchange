import { SectionCard } from 'src/components/Cards/SectionCard/SectionCard';
import { CardsSectionContainer, CardsSectionShell } from './CardsSection.style';
import { CardsTabsSkeletons } from './CardsTabsSkeletons';

export const CardsSectionSkeleton = () => {
  return (
    <CardsSectionShell>
      <SectionCard>
        <CardsSectionContainer>
          <CardsTabsSkeletons />
        </CardsSectionContainer>
      </SectionCard>
    </CardsSectionShell>
  );
};
