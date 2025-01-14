import { Box, Theme, Typography, useMediaQuery, useTheme } from '@mui/material';
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
            <CampaignTitle>Lisk your Limits</CampaignTitle>
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
                <InformationShareLink
                  href={websiteLink}
                  style={{
                    textDecoration: 'none',
                  }}
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
                </InformationShareLink>
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
              <CardInfoTypogragphy fontSize={32}>{'$300k'}</CardInfoTypogragphy>
            </CampaignDigitInfoBox>
          </VerticalCenterBox>
        )}
      </Box>
    </CampaignHeaderBoxBackground>
  );
};
