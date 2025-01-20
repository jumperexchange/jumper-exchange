'use client';

import type { Theme } from '@mui/material';
import { Skeleton, Stack, Typography, useMediaQuery } from '@mui/material';
import Image from 'next/image';
import type { CustomInformation, Quest } from 'src/types/loyaltyPass';
import { getStrapiBaseUrl } from 'src/utils/strapi/strapiHelper';
import { ZapActionProtocolCard, ZapActionProtocolIntro } from './ZapInfo.style';
import { SocialInfosBox } from './SocialInfosBox';

interface ZapProtocolIntroProps {
  market?: Quest;
  detailInformation?: CustomInformation;
}

export const ZapProtocolIntro = ({
  market,
  detailInformation,
}: ZapProtocolIntroProps) => {
  const baseUrl = getStrapiBaseUrl();

  const isMobile = useMediaQuery((theme: Theme) =>
    theme.breakpoints.down('md'),
  );

  return (
    <ZapActionProtocolIntro>
      <ZapActionProtocolCard>
        <Stack spacing={2} direction="row">
          {!isMobile &&
            (market?.attributes?.Image.data.attributes?.url ? (
              <Image
                src={`${baseUrl}${market.attributes?.Image.data.attributes?.url}`}
                alt="Protocol image"
                width={market.attributes?.Image.data.attributes?.width}
                height={market.attributes?.Image.data.attributes?.height}
                style={{
                  width: 192,
                  height: 'auto',
                  objectFit: 'contain',
                  borderRadius: 32,
                }}
              />
            ) : (
              <Skeleton
                variant="circular"
                sx={{ width: '192px', height: '192px', flexShrink: 0 }}
              />
            ))}
          <Stack spacing={2} direction="column">
            {market?.attributes?.Title ? (
              <Typography variant="titleSmall">
                {market.attributes?.Title}
              </Typography>
            ) : (
              <Skeleton
                variant="rectangular"
                sx={{ height: '32px', width: '160px' }}
              />
            )}
            {market?.attributes?.Description && (
              <Typography variant="bodyMedium">
                {market.attributes?.Description}
              </Typography>
            )}
            <SocialInfosBox detailInformation={detailInformation} />
          </Stack>
        </Stack>
      </ZapActionProtocolCard>
    </ZapActionProtocolIntro>
  );
};
