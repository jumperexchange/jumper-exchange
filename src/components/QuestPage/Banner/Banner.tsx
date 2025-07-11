import type { Theme } from '@mui/material';
import { useMediaQuery } from '@mui/material';
import Image from 'next/image';
import { checkInclusion } from 'src/components/ProfilePage/checkInclusion';
import { type Quest } from 'src/types/loyaltyPass';
import { getStrapiBaseUrl } from 'src/utils/strapi/strapiHelper';
import {
  BadgeMainBox,
  BadgeRelativeBox,
  BannerBottomBox,
  BannerImageBox,
  BannerMainBox,
  BannerTitleBox,
  BannerTitleTypography,
  RewardMainBox,
  RotatingBox,
} from './Banner.style';
import { RewardBox } from './Rewards/RewardBox';
import config from '@/config/env-config';

interface BannerBoxProps {
  quest: Quest;
  pastCampaigns: string[];
  rotatingBadge?: React.JSX.Element;
}

export interface Chain {
  logo: string;
  name: string;
}

export const BannerBox = ({
  quest,
  pastCampaigns,
  rotatingBadge,
}: BannerBoxProps) => {
  const baseUrl = getStrapiBaseUrl();
  const isMobile = useMediaQuery((theme: Theme) =>
    theme.breakpoints.down('md'),
  );
  const attributes = quest;
  const rewardsIds = quest?.CustomInformation?.['rewardsIds'];
  const rewards = attributes?.CustomInformation?.['rewards'];
  const chains = attributes?.CustomInformation?.['chains'];
  const partners = attributes?.CustomInformation?.['partner'];
  // const rewardType = attributes?.CustomInformation?.['rewardType'];
  const bannerImageURL = isMobile
    ? attributes.Image?.url
    : attributes?.BannerImage?.[0]?.url;
  const imgURL = new URL(bannerImageURL, baseUrl);

  let completed = false;
  if (rewardsIds && pastCampaigns) {
    completed = checkInclusion(pastCampaigns, rewardsIds);
  }

  return (
    <>
      {rotatingBadge && rewards && rewards.amount && (
        <BadgeMainBox>
          <BadgeRelativeBox>
            <RotatingBox>{rotatingBadge}</RotatingBox>
          </BadgeRelativeBox>
        </BadgeMainBox>
      )}
      <BannerMainBox>
        <BannerImageBox>
          <Image
            src={`${imgURL}`}
            fill
            alt="Banner Image"
            style={{
              objectFit: 'cover',
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
                title={'Applications'}
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
                        `${config.NEXT_PUBLIC_STRAPI_URL}/uploads/avatar_checkmark_circle_03172fb9d6.svg`,
                      ]
                    : [
                        `${config.NEXT_PUBLIC_STRAPI_URL}/uploads/xp_cfcff186e5.png`,
                      ]
                }
                title={'Jumper XP'}
                value={String(attributes?.Points)}
              />
            ) : undefined}
          </RewardMainBox>
        </BannerBottomBox>
      </BannerMainBox>
    </>
  );
};
