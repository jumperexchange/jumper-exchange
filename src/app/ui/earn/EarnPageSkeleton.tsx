import { EarnDetailsAnalyticsSkeleton } from 'src/components/EarnDetails/EarnDetailsAnalyticsSkeleton';
import { EarnDetailsSection } from 'src/components/EarnDetails/EarnDetailsSection';

export const EarnPageSkeleton = () => {
  return (
    <>
      <EarnDetailsSection>
        <EarnDetailsAnalyticsSkeleton />
      </EarnDetailsSection>
      <EarnDetailsSection>Related Markets</EarnDetailsSection>
    </>
  );
};
