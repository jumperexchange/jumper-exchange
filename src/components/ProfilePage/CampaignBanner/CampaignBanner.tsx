import type { Theme } from '@mui/material';
import { Skeleton, useMediaQuery } from '@mui/material';
import Link from 'next/link';
import { useState } from 'react';
import {
  BannerImage,
  BannerImageBox,
  CampaignBox,
} from './CampaignBanner.style';
import { CampaignInformation } from './CampaignInformation';

export const CampaignBanner = () => {
  // const { quests, isLoading: isQuestsLoading, url } = useOngoingQuests();
  const [isImageLoading, setIsImageLoading] = useState(true);
  const isMobile = useMediaQuery((theme: Theme) =>
    theme.breakpoints.down('md'),
  );

  const imageWidth = isMobile ? 320 : 640;
  const imageHeight = isMobile ? 160 : 320;

  return (
    <Link
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
        <BannerImageBox>
          {isImageLoading && (
            <Skeleton
              variant="rectangular"
              width="100%"
              height="100%"
              sx={{
                borderRadius: '16px',
                position: 'absolute',
                top: 0,
                left: 0,
                zIndex: 1,
              }}
            />
          )}
          <BannerImage
            src={`https://strapi.jumper.exchange/uploads/banner_602bc774b0.jpg`}
            alt={'top banner'}
            width={imageWidth}
            height={imageHeight}
            isImageLoading={isImageLoading}
            onLoadingComplete={() => setIsImageLoading(false)}
          />
        </BannerImageBox>
        <CampaignInformation
          tag={'Ecosystem Campaign'}
          title={'Enjoy DeFi on Lisk'}
          description={
            'Jumper is partnering with leading Lisk protocols -Velodrome and Morpho- to offer up to 20% APY on stables and ETH pools, up to $20M in deposits and other exciting rewards.'
          }
        />
      </CampaignBox>
    </Link>
  );
};
