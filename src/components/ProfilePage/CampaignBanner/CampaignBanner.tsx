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
            src={`https://strapi.jumper.exchange/uploads/Berachain_V2_11ac1c04d0.png`}
            alt={'top banner'}
            width={imageWidth}
            height={imageHeight}
            isImageLoading={isImageLoading}
            onLoadingComplete={() => setIsImageLoading(false)}
          />
        </BannerImageBox>
        <CampaignInformation
          tag={'Ecosystem Campaign'}
          title={'Jump into Bera'}
          description={
            'Jumper is joining forces with elite Berachain protocols — Beraborrow, Beratrax, Kodiak, Berabot, Ramen, Beranames — to find out which community reigns supreme and to give you a shot at winning +$75k in rewards!'
          }
        />
      </CampaignBox>
    </Link>
  );
};
