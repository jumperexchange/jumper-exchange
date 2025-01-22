import type { Theme } from '@mui/material';
import { Box, Typography, useMediaQuery, useTheme } from '@mui/material';
import Image from 'next/image';
import LanguageIcon from '@mui/icons-material/Language';
import XIcon from '@mui/icons-material/X';
import {
  CampaignDigitInfoBox,
  CampaignHeaderBoxBackground,
  CampaignTitle,
  CardInfoTypogragphy,
  ColoredProtocolShareButton,
  InformationShareLink,
  VerticalCenterBox,
} from './CampaignHeader.style';

export const CampaignHeader = ({
  bannerImage,
  tokenImage,
  websiteLink,
  Xlink,
}: {
  bannerImage: string;
  tokenImage: string;
  websiteLink?: string;
  Xlink?: string;
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery((theme: Theme) =>
    theme.breakpoints.down('md'),
  );

  return (
    <CampaignHeaderBoxBackground
      sx={{
        backgroundImage: `url(${bannerImage})`,
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
            src={tokenImage}
            alt={'top banner'}
            width={132}
            height={132}
            style={{ objectFit: 'contain', borderRadius: '50%' }}
          />
          <VerticalCenterBox>
            <CampaignTitle>Explore Lisk</CampaignTitle>
            <Box display="flex" gap="8px">
              {Xlink && (
                <InformationShareLink
                  href={Xlink}
                  style={{
                    textDecoration: 'none',
                  }}
                >
                  <ColoredProtocolShareButton>
                    <XIcon
                      sx={{
                        width: '16px',
                        height: '16px',
                        color: theme.palette.white.main,
                      }}
                    />
                  </ColoredProtocolShareButton>
                </InformationShareLink>
              )}

              {websiteLink && (
                <a
                  href={websiteLink}
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
                      sx={{
                        width: '16px',
                        height: '16px',
                        color: theme.palette.white.main,
                      }}
                    />
                  </ColoredProtocolShareButton>
                </a>
              )}
            </Box>
          </VerticalCenterBox>
        </Box>

        {!isMobile && (
          <VerticalCenterBox>
            <CampaignDigitInfoBox>
              <CardInfoTypogragphy fontSize={14}>
                Total Rewards
              </CardInfoTypogragphy>
              <CardInfoTypogragphy fontSize={32}>{'$200k'}</CardInfoTypogragphy>
            </CampaignDigitInfoBox>
          </VerticalCenterBox>
        )}
      </Box>
    </CampaignHeaderBoxBackground>
  );
};
