import DateRangeRoundedIcon from '@mui/icons-material/DateRangeRounded';
import Image from 'next/image';
import { Quest } from 'src/types/loyaltyPass';
import {
  BannerImageBox,
  DateChainBox,
  SupportedChainsBox,
  BannerBottomBox,
  BannerMainBox,
  QuestDatesBox,
  BannerTitleBox,
  RewardMainBox,
  BannerTitleTypography,
} from './Banner.style';
import {
  FlexCenterRowBox,
  FlexCenterSpaceRowBox,
} from '../SuperfestMissionPage.style';
import {
  CenteredBox,
  Sequel85Typography,
  SoraTypography,
} from '../../Superfest.style';
import { RewardBox } from './Rewards/RewardBox';

interface SuperfestMissionPageVar {
  quest: Quest;
  baseUrl: string;
}

export interface Chain {
  logo: string;
  name: string;
}

export const BannerBox = ({ quest, baseUrl }: SuperfestMissionPageVar) => {
  const attributes = quest?.attributes;
  const rewards = attributes?.CustomInformation?.['rewards'];
  const chains = attributes?.CustomInformation?.['chains'];
  const partners = attributes?.CustomInformation?.['partner'];

  console.log('---------');
  console.log(partners);

  return (
    <BannerMainBox>
      <BannerImageBox>
        <Image
          src={`${new URL(
            attributes.BannerImage?.data[0]?.attributes?.url,
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
          <BannerTitleTypography>{attributes.Title}</BannerTitleTypography>
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
              title={'Rewards'}
              value={`${rewards.amount} ${rewards.name}`}
            />
          ) : undefined}
          {/* Points  */}
          {attributes && attributes.Points ? (
            <RewardBox
              logos={['https://strapi.li.finance/uploads/xp_cfcff186e5.png']}
              title={'Points'}
              value={String(attributes.Points)}
            />
          ) : undefined}
        </RewardMainBox>
      </BannerBottomBox>
    </BannerMainBox>
  );
};
