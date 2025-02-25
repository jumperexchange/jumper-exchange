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
      href={`${process.env.NEXT_PUBLIC_SITE_URL}/campaign/berachain`}
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
          src={`https://strapi.jumper.exchange/uploads/Berachain_V1_a7ef8c5f9f.jpg`}
          alt={'top banner'}
          width={isMobile ? 320 : 640}
          height={isMobile ? 160 : 320}
          style={{ objectFit: 'contain', borderRadius: '16px' }}
        />
        <CampaignInformation
          tag={'Protocols'}
          title={'Discover Protocols'}
          description={`Jumper is joining forces with elite Berachain protocols—The Honey Jar, Stakestone, Infrared, Beraborrow, and BurrBear—to find out which community reigns supreme and to give you a shot at winning $100k in rewards!`}
        />
      </CampaignBox>
    </a>
  );
};
