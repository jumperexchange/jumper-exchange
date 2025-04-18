import type { CampaignData } from '@/types/strapi';
import type { Theme } from '@mui/material';
import { Box, Skeleton, useMediaQuery, useTheme } from '@mui/material';
import Link from 'next/link';
import { useState } from 'react';
import { getStrapiBaseUrl } from 'src/utils/strapi/strapiHelper';
import {
  BannerImage,
  BannerImageBox,
  CampaignBox,
} from './CampaignBanner.style';
import { CampaignInformation } from './CampaignInformation';

interface CampaignBannerProps {
  campaigns: CampaignData[];
}

export const CampaignBanner = ({ campaigns }: CampaignBannerProps) => {
  const [loadingImages, setLoadingImages] = useState<{
    [key: string]: boolean;
  }>({});
  const theme = useTheme();
  const isMobile = useMediaQuery((theme: Theme) =>
    theme.breakpoints.down('md'),
  );

  const imageWidth = isMobile ? 320 : 640;
  const imageHeight = isMobile ? 160 : 320;

  const apiBaseUrl = getStrapiBaseUrl();

  return (
    <Box display="flex" flexDirection="column">
      {campaigns.map((campaign) => {
        if (
          !campaign.ProfileBannerImage ||
          !campaign.ProfileBannerTitle ||
          !campaign.ProfileBannerDescription
        ) {
          return null;
        }

        return (
          <Link
            key={campaign.Slug}
            href={`${process.env.NEXT_PUBLIC_SITE_URL}/campaign/${campaign.Slug}`}
            style={{
              marginTop: theme.spacing(4),
              textDecoration: 'none',
              color: 'inherit',
              position: 'relative',
              zIndex: 1,
            }}
            rel="noreferrer"
          >
            <CampaignBox>
              <BannerImageBox>
                {loadingImages[campaign.Slug] && (
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
                  src={`${apiBaseUrl}${campaign.ProfileBannerImage.url}`}
                  alt={'campaign banner'}
                  width={imageWidth}
                  height={imageHeight}
                  isImageLoading={loadingImages[campaign.Slug]}
                  onLoadingComplete={() =>
                    setLoadingImages((prev) => ({
                      ...prev,
                      [campaign.Slug]: false,
                    }))
                  }
                />
              </BannerImageBox>
              <CampaignInformation
                tag={campaign.ProfileBannerBadge}
                title={campaign.ProfileBannerTitle}
                description={campaign.ProfileBannerDescription}
                cta={campaign.ProfileBannerCTA}
              />
            </CampaignBox>
          </Link>
        );
      })}
    </Box>
  );
};
