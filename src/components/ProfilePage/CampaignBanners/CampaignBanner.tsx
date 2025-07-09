import type { StrapiMediaData } from '@/types/strapi';
import type { Theme } from '@mui/material';
import { Skeleton, useMediaQuery } from '@mui/material';
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
import config from '@/config/env-config';

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
  const { trackEvent } = useUserTracking();
  const isMobile = useMediaQuery((theme: Theme) =>
    theme.breakpoints.down('md'),
  );
  const apiBaseUrl = getStrapiBaseUrl();

  return (
    <Link
      key={slug}
      href={`${config.NEXT_PUBLIC_SITE_URL}/campaign/${slug}`}
      rel="noreferrer"
      style={{
        textDecoration: 'none',
        color: 'inherit',
        position: 'relative',
        zIndex: 1,
        width: '100%',
      }}
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
    >
      <CampaignBox>
        <BannerImageBox>
          {loadingImages[slug] && (
            <Skeleton
              height="100%"
              sx={{
                borderRadius: '16px',
                position: 'absolute',
                top: 0,
                left: 0,
                zIndex: 1,
              }}
              variant="rectangular"
              width="100%"
            />
          )}
          <BannerImage
            alt={`${title} banner`}
            height={isMobile ? 160 : 320}
            isImageLoading={loadingImages[slug]}
            src={`${apiBaseUrl}${image.url}`}
            width={isMobile ? 320 : 640}
            onLoadingComplete={() =>
              setLoadingImages((prev) => ({
                ...prev,
                [slug]: false,
              }))
            }
          />
        </BannerImageBox>
        <CampaignInformation
          cta={cta}
          description={description}
          tag={tag}
          title={title}
        />
      </CampaignBox>
    </Link>
  );
};
