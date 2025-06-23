import { useTranslation } from 'react-i18next';
import { CarouselContainer } from 'src/components/Blog';
import { CampaignWithBanner } from '../ProfilePage';
import { CampaignBanner } from './CampaignBanner';
import { CampaignBannersContainer } from './CampaignBanners.style';

export const CampaignBanners = ({
  campaigns,
}: {
  campaigns: CampaignWithBanner[];
}) => {
  const { t } = useTranslation();
  if (campaigns.length === 1) {
    return (
      <CampaignBannersContainer>
        <CampaignBanner
          image={campaigns[0].ProfileBannerImage}
          slug={campaigns[0].Slug}
          tag={campaigns[0].ProfileBannerBadge}
          title={campaigns[0].ProfileBannerTitle}
          description={campaigns[0].ProfileBannerDescription}
        />
      </CampaignBannersContainer>
    );
  }

  return (
    <CampaignBannersContainer>
      <CarouselContainer title={t('profile_page.campaigns')}>
        {campaigns.map((campaign, index) => (
          <CampaignBanner
            image={campaign.ProfileBannerImage}
            slug={campaign.Slug}
            tag={campaign.ProfileBannerBadge}
            title={campaign.ProfileBannerTitle}
            description={campaign.ProfileBannerDescription}
            cta={campaign.ProfileBannerCTA}
            key={`campaign-banner-${campaign.id}-${index}`}
          />
        ))}
      </CarouselContainer>
    </CampaignBannersContainer>
  );
};
