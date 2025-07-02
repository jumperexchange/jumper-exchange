import { useTranslation } from 'react-i18next';
import { Carousel } from 'src/components/Carousel/Carousel';
import type { CampaignWithBanner } from '../ProfilePage';
import { CampaignBanner } from './CampaignBanner';
import { CampaignBannersContainer } from './CampaignBanners.style';

export function CampaignBanners({
  campaigns,
}: {
  campaigns: CampaignWithBanner[];
}) {
  const { t } = useTranslation();

  if (campaigns.length === 1) {
    return (
      <CampaignBannersContainer>
        <CampaignBanner
          description={campaigns[0].ProfileBannerDescription}
          image={campaigns[0].ProfileBannerImage}
          slug={campaigns[0].Slug}
          tag={campaigns[0].ProfileBannerBadge}
          title={campaigns[0].ProfileBannerTitle}
        />
      </CampaignBannersContainer>
    );
  }

  return (
    <CampaignBannersContainer sx={{ position: 'relative' }}>
      <Carousel title={t('profile_page.campaigns')} hasNavigation={true}>
        {campaigns.map((campaign, index) => (
          <CampaignBanner
            key={`campaign-banner-${campaign.id}-${index}`}
            cta={campaign.ProfileBannerCTA}
            description={campaign.ProfileBannerDescription}
            image={campaign.ProfileBannerImage}
            slug={campaign.Slug}
            tag={campaign.ProfileBannerBadge}
            title={campaign.ProfileBannerTitle}
          />
        ))}
      </Carousel>
    </CampaignBannersContainer>
  );
}
