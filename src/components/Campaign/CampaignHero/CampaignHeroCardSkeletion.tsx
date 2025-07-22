import { Base } from 'src/components/Widgets/variants/base/Widget.stories';
import {
  BaseSkeletonBox,
  CampaignHeroCardContainer,
  CampaignHeroCardContentContainer,
} from './CampaignHero.style';
import { CampaignHeroImageSkeleton } from './CampaignHeroImageSkeleton';

export const CampaignHeroCardSkeleton = () => {
  return (
    <CampaignHeroCardContainer>
      <CampaignHeroImageSkeleton />
      <CampaignHeroCardContentContainer>
        <BaseSkeletonBox
          variant="rounded"
          sx={{
            width: '100%',
            fontSize: 40,
          }}
        />
        <BaseSkeletonBox
          variant="text"
          sx={{
            width: '100%',
            fontSize: 18, // 24
          }}
        />
        <BaseSkeletonBox
          variant="text"
          sx={{
            width: '60%',
            fontSize: 18,
          }}
        />
      </CampaignHeroCardContentContainer>
    </CampaignHeroCardContainer>
  );
};
