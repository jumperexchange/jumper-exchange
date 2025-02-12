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
            (market?.Image?.url ? (
              <Image
                src={`${baseUrl}${market.Image.url}`}
                alt="Protocol image"
                width={market.Image.width}
                height={market.Image.height}
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
            {market?.Title ? (
              <Typography variant="titleSmall">{market.Title}</Typography>
            ) : (
              <Skeleton
                variant="rectangular"
                sx={{ height: '32px', width: '160px' }}
              />
            )}
            {market?.Description && (
              <Typography variant="bodyMedium">{market.Description}</Typography>
            )}
            <SocialInfosBox detailInformation={detailInformation} />
          </Stack>
        </Stack>
      </ZapActionProtocolCard>
    </ZapActionProtocolIntro>
  );
};
