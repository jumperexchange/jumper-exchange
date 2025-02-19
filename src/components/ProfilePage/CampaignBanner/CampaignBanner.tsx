import type { Theme } from '@mui/material';
import { useMediaQuery } from '@mui/material';
import Image from 'next/image';
import { CampaignBox } from './CampaignBanner.style';
import { CampaignInformation } from './CampaignInformation';

export const CampaignBanner = () => {
  // const { quests, isLoading: isQuestsLoading, url } = useOngoingQuests();
  const isMobile = useMediaQuery((theme: Theme) =>
    theme.breakpoints.down('md'),
  );

  return (
    <a
      href={`${process.env.NEXT_PUBLIC_SITE_URL}/campaign/lisk`}
      style={{
        textDecoration: 'none',
        color: 'inherit',
        position: 'relative',
        zIndex: 1,
      }}
      rel="noreferrer"
    >
      <CampaignBox>
        <Image
          src={`https://strapi.jumper.exchange/uploads/banner_602bc774b0.jpg`}
          alt={'top banner'}
          width={isMobile ? 320 : 640}
          height={isMobile ? 160 : 320}
          style={{ objectFit: 'contain', borderRadius: '16px' }}
        />
        <CampaignInformation
          tag={'New Ecosystem'}
          description={`Lisk was an OG Layer 1 since 2016, it became a prominent L2 in the Superchain Ecosystem recently.
Jumper is giving you the perfect occasion to explore Lisk:
$180,000 rewards will be distributed in the span of three weeks through 3 Lil Pudgies in raffles and double-digit yield boosts on major Lisk protocols (Velodrome, Beefy, Ionic).`}
        />
      </CampaignBox>
    </a>
  );
};
