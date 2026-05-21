import { getProfileBannerCampaigns } from 'src/app/lib/getProfileBannerCampaigns';
import { isBannerCampaign } from 'src/utils/isBannerCampaign';
import { BannerCampaign } from './BannerCampaign/BannerCampaign';

export const MissionsPageBanner = async () => {
  const { data: campaigns } = await getProfileBannerCampaigns();
  const validBannerCampaigns = campaigns?.filter(isBannerCampaign) || [];

  return <BannerCampaign campaigns={validBannerCampaigns} />;
};
