import LanguageIcon from '@mui/icons-material/Language';
import XIcon from '@mui/icons-material/X';
import type { Theme } from '@mui/material';
import { Box, useMediaQuery, useTheme } from '@mui/material';
import Image from 'next/image';
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
            <CampaignTitle>Explore Berachain</CampaignTitle>
            <CampaignDescription>{`Jumper is joining forces with elite Berachain protocols, The Honey Jar, Stakestone, Infrared, Beraborrow, and BurrBear, to find out which community reigns supreme and to give you a shot at winning $100k in rewards!`}</CampaignDescription>
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
                      sx={(theme) => ({
                        width: '16px',
                        height: '16px',
                        color: theme.palette.white.main,
                      })}
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
          </VerticalCenterBox>
        </Box>

        {!isMobile && (
          <VerticalCenterBox>
            <CampaignDigitInfoBox>
              <CardInfoTypogragphy fontSize={14}>
                Total Rewards
              </CardInfoTypogragphy>
              <CardInfoTypogragphy fontSize={32}>{'$100k'}</CardInfoTypogragphy>
            </CampaignDigitInfoBox>
          </VerticalCenterBox>
        )}
      </Box>
    </CampaignHeaderBoxBackground>
  );
};
