import { EarnDetailsAnalyticsSkeleton } from 'src/components/EarnDetails/EarnDetailsAnalyticsSkeleton';
import { EarnDetailsSection } from 'src/components/EarnDetails/EarnDetailsSection';
import { EarnDetailsIntroSkeleton } from 'src/components/EarnDetails/EarnDetailsIntroSkeleton';

export const EarnPageSkeleton = () => {
  return (
    <>
      <EarnDetailsSection>
        <EarnDetailsIntroSkeleton />
        <EarnDetailsAnalyticsSkeleton />
      </EarnDetailsSection>
      <EarnDetailsSection>Related Markets</EarnDetailsSection>
    </>
  );
};
