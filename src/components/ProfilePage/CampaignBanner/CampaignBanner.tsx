import { useTranslation } from 'react-i18next';
import { useOngoingQuests } from 'src/hooks/useOngoingQuests';
import { Button } from 'src/components/Button';
import { Box, Theme, Typography, useMediaQuery, useTheme } from '@mui/material';
import { CampaignBox } from './CampaignBanner.style';
import Image from 'next/image';
import { getContrastAlphaColor } from 'src/utils/colors';
import { openInNewTab } from 'src/utils/openInNewTab';
import { useRouter } from 'next/navigation';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
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
          description={
            'Lisk is a Layer 2 blockchain platform designed to simplify decentralized app development using JavaScript and TypeScript. Its modular SDK enables seamless custom blockchain creation, while interoperability and scalability ensure efficient performance. Lisk empowers innovation with ease and flexibility.'
          }
        />
      </CampaignBox>
    </a>
  );
};
