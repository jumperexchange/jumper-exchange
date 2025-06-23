import type { CampaignData, StrapiMediaData } from '@/types/strapi';
import type { Theme } from '@mui/material';
import { Skeleton, useMediaQuery, useTheme } from '@mui/material';
import Link from 'next/link';
import { useState } from 'react';
import {
  TrackingAction,
  TrackingCategory,
  TrackingEventParameter,
} from 'src/const/trackingKeys';
import { useUserTracking } from 'src/hooks/userTracking';
import { getStrapiBaseUrl } from 'src/utils/strapi/strapiHelper';
import {
  BannerImage,
  BannerImageBox,
  CampaignBox,
} from './CampaignBanner.style';
import { CampaignInformation } from './CampaignInformation';

// Define the expected structure of campaigns that will be passed to this component
// This ensures type safety without exporting the types
interface CampaignWithBanner extends CampaignData {
  ProfileBannerImage: StrapiMediaData;
  ProfileBannerTitle: string;
  ProfileBannerDescription: string;
  ProfileBannerBadge: string;
  ProfileBannerCTA?: string;
  Slug: string;
}

interface CampaignBannerProps {
  image: StrapiMediaData;
  slug: string;
  tag: string;
  title: string;
  description: string;
  cta?: string;
}

export const CampaignBanner = ({
  image,
  slug,
  tag,
  title,
  description,
  cta,
}: CampaignBannerProps) => {
  const [loadingImages, setLoadingImages] = useState<{
    [key: string]: boolean;
  }>({});
  const theme = useTheme();
  const { trackEvent } = useUserTracking();
  const isMobile = useMediaQuery((theme: Theme) =>
    theme.breakpoints.down('md'),
  );
  const apiBaseUrl = getStrapiBaseUrl();

  return (
    <Link
      key={slug}
      onClick={() => {
        trackEvent({
          category: TrackingCategory.CampaignBanner,
          action: TrackingAction.ClickCampaignBanner,
          label: 'click-campaign-banner',
          data: {
            [TrackingEventParameter.ActiveCampaignBanner]: slug,
          },
        });
      }}
      href={`${process.env.NEXT_PUBLIC_SITE_URL}/campaign/${slug}`}
      style={{
        textDecoration: 'none',
        color: 'inherit',
        position: 'relative',
        zIndex: 1,
        width: '100%',
      }}
      rel="noreferrer"
    >
      <CampaignBox>
        <BannerImageBox>
          {loadingImages[slug] && (
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
            src={`${apiBaseUrl}${image.url}`}
            alt={'campaign banner'}
            width={isMobile ? 320 : 640}
            height={isMobile ? 160 : 320}
            isImageLoading={loadingImages[slug]}
            onLoadingComplete={() =>
              setLoadingImages((prev) => ({
                ...prev,
                [slug]: false,
              }))
            }
          />
        </BannerImageBox>
        <CampaignInformation
          tag={tag}
          title={title}
          description={description}
          cta={cta}
        />
      </CampaignBox>
    </Link>
  );
};
