import Image from 'next/image';
import { type Quest } from 'src/types/loyaltyPass';
import {
  BannerImageBox,
  BannerBottomBox,
  BannerMainBox,
  BannerTitleBox,
  RewardMainBox,
  BannerTitleTypography,
} from './Banner.style';
import { RewardBox } from './Rewards/RewardBox';
import { checkInclusion } from '../../ActiveSuperfestMissionsCarousel/ActiveSuperfestMissionsCarousel';

interface SuperfestMissionPageVar {
  quest: Quest;
  baseUrl: string;
  pastCampaigns: string[];
}

export interface Chain {
  logo: string;
  name: string;
}

export const BannerBox = ({
  quest,
  baseUrl,
  pastCampaigns,
}: SuperfestMissionPageVar) => {
  const attributes = quest?.attributes;
  const claimingIds = quest.attributes?.CustomInformation?.['claimingIds'];
  const rewards = attributes?.CustomInformation?.['rewards'];
  const chains = attributes?.CustomInformation?.['chains'];
  const partners = attributes?.CustomInformation?.['partner'];

  console.log('hereee');
  let completed = false;
  console.log(pastCampaigns);
  if (claimingIds && pastCampaigns) {
    completed = checkInclusion(pastCampaigns, claimingIds);
  }

  return (
    <BannerMainBox>
      <BannerImageBox>
        <Image
          src={`${new URL(
            attributes?.BannerImage?.data[0]?.attributes?.url,
            baseUrl,
          )}`}
          fill
          objectFit="cover"
          alt="Banner Image"
          style={{
            borderTopLeftRadius: '8px',
            borderTopRightRadius: '8px',
          }}
        />
      </BannerImageBox>
      <BannerBottomBox>
        <BannerTitleBox>
          <BannerTitleTypography>{attributes?.Title}</BannerTitleTypography>
        </BannerTitleBox>
        <RewardMainBox>
          {/* chains  */}
          {chains && chains.length > 0 ? (
            <RewardBox
              logos={chains.map((chain: Chain) => chain.logo)}
              title={'Supported Chains'}
              value={chains.length > 0 ? chains[0].name : ''}
            />
          ) : undefined}
          {/* partner  */}
          {partners && partners.length > 0 ? (
            <RewardBox
              logos={partners.map((partner: Chain) => partner.logo)}
              title={'Sponsored by'}
              value={partners.length > 0 ? partners[0].name : ''}
            />
          ) : undefined}
          {/* rewards  */}
          {rewards && rewards.amount ? (
            <RewardBox
              logos={[rewards.logo]}
              title={'Total Rewards'}
              value={`${rewards.amount} ${rewards.name}`}
            />
          ) : undefined}
          {/* Points  */}
          {attributes && attributes?.Points ? (
            <RewardBox
              logos={
                completed
                  ? [
                      'https://strapi.li.finance/uploads/avatar_checkmark_circle_03172fb9d6.svg',
                    ]
                  : ['https://strapi.li.finance/uploads/xp_cfcff186e5.png']
              }
              title={'Jumper XP'}
              value={
                true
                  ? `+${String(attributes?.Points)}`
                  : String(attributes?.Points)
              }
            />
          ) : undefined}
        </RewardMainBox>
      </BannerBottomBox>
    </BannerMainBox>
  );
};
