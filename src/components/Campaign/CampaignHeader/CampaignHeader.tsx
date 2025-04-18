'use client';

import type { CampaignData } from '@/types/strapi';
import LanguageIcon from '@mui/icons-material/Language';
import XIcon from '@mui/icons-material/X';
import type { Theme } from '@mui/material';
import { Box, useMediaQuery } from '@mui/material';
import Image from 'next/image';
import { getStrapiBaseUrl } from 'src/utils/strapi/strapiHelper';
import {
  CampaignDescription,
  CampaignDigitInfoBox,
  CampaignHeaderBoxBackground,
  CampaignTitle,
  CardInfoTypogragphy,
  ColoredProtocolShareButton,
  InformationShareLink,
  VerticalCenterBox,
} from './CampaignHeader.style';

interface CampaignHeaderProps {
  campaign: CampaignData;
}

export const CampaignHeader = ({ campaign }: CampaignHeaderProps) => {
  const isMobile = useMediaQuery((theme: Theme) =>
    theme.breakpoints.down('md'),
  );
  const apiBaseUrl = getStrapiBaseUrl();

  return (
    <CampaignHeaderBoxBackground
      sx={{
        backgroundImage: `url(${apiBaseUrl}${campaign.Background.url})`,
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
          width: '100%',
        }}
      >
        <Box display="flex" flexDirection="row">
          <Image
            src={`${apiBaseUrl}${campaign.Icon.url}`}
            alt={'campaign icon'}
            width={132}
            height={132}
            style={{ objectFit: 'contain', borderRadius: '50%' }}
          />
          <VerticalCenterBox>
            <CampaignTitle lightMode={campaign.LightMode}>
              {campaign.Title}
            </CampaignTitle>
            <CampaignDescription lightMode={campaign.LightMode}>
              {campaign.Description}
            </CampaignDescription>
            {(!!campaign.XUrl || !!campaign.InfoUrl) && (
              <Box
                sx={(theme) => ({
                  display: 'flex',
                  gap: theme.spacing(1),
                  marginTop: theme.spacing(1),
                })}
              >
                {campaign.XUrl && (
                  <InformationShareLink
                    href={campaign.XUrl}
                    style={{
                      textDecoration: 'none',
                    }}
                  >
                    <ColoredProtocolShareButton>
                      <XIcon
                        sx={(theme) => ({
                          width: '16px',
                          height: '16px',
                          color: theme.palette.white.main,
                        })}
                      />
                    </ColoredProtocolShareButton>
                  </InformationShareLink>
                )}

                {campaign.InfoUrl && (
                  <a
                    href={campaign.InfoUrl}
                    target="_blank"
                    style={{
                      textDecoration: 'none',
                      color: 'inherit',
                      display: 'flex',
                      alignItems: 'center',
                    }}
                    rel="noreferrer"
                  >
                    <ColoredProtocolShareButton>
                      <LanguageIcon
                        sx={(theme) => ({
                          width: '16px',
                          height: '16px',
                          color: theme.palette.white.main,
                        })}
                      />
                    </ColoredProtocolShareButton>
                  </a>
                )}
              </Box>
            )}
          </VerticalCenterBox>
        </Box>

        {!isMobile && !!campaign.BenefitLabel && !!campaign.BenefitValue && (
          <VerticalCenterBox>
            <CampaignDigitInfoBox
              sx={(theme) => ({ backgroundColor: campaign.BenefitColor })}
            >
              <CardInfoTypogragphy fontSize={14}>
                {campaign.BenefitLabel}
              </CardInfoTypogragphy>
              <CardInfoTypogragphy fontSize={32}>
                {campaign.BenefitValue}
              </CardInfoTypogragphy>
            </CampaignDigitInfoBox>
          </VerticalCenterBox>
        )}
      </Box>
    </CampaignHeaderBoxBackground>
  );
};
