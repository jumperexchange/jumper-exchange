import { EarnDetailsAnalyticsSkeleton } from 'src/components/EarnDetails/EarnDetailsAnalyticsSkeleton';
import { EarnDetailsSection } from 'src/components/EarnDetails/EarnDetailsSection';
import { EarnDetailsIntroSkeleton } from 'src/components/EarnDetails/EarnDetailsIntroSkeleton';
import { GoBackSkeleton } from 'src/components/composite/GoBack/GoBackSkeleton';
import { EarnRelatedMarketsSkeleton } from 'src/components/EarnRelatedMarkets/EarnRelatedMarketsSkeleton';

export const EarnPageSkeleton = () => {
  return (
    <>
      <EarnDetailsSection>
        <GoBackSkeleton />
        <EarnDetailsIntroSkeleton />
        <EarnDetailsAnalyticsSkeleton />
      </EarnDetailsSection>
      <EarnDetailsSection>
        <EarnRelatedMarketsSkeleton />
      </EarnDetailsSection>
    </>
  );
};
