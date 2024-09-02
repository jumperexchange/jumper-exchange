import { Box, Typography, useTheme } from '@mui/material';
import Image from 'next/image';
import { EarnedTypography } from '../../Rewards/RewardsCarousel.style';
import { FlexCenterRowBox } from 'src/components/Superfest/SuperfestPage/SuperfestMissionPage.style';
import {
  PROFILE_CAMPAIGN_DARK_CHAIN,
  PROFILE_CAMPAIGN_DARK_COLOR,
  PROFILE_CAMPAIGN_LIGHT_CHAIN,
  PROFILE_CAMPAIGN_LIGHT_COLOR,
} from 'src/const/partnerRewardsTheme';

export const TempTitle = () => {
  const theme = useTheme();

  const IMAGE_LOGO =
    theme.palette.mode === 'dark'
      ? PROFILE_CAMPAIGN_DARK_CHAIN
      : PROFILE_CAMPAIGN_LIGHT_CHAIN;

  return (
    <FlexCenterRowBox marginBottom={'16px'}>
      <Box
        marginRight="8px"
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignContent: 'center',
          alignItems: 'center',
        }}
      >
        <Image
          src={IMAGE_LOGO}
          alt="token image"
          width={48}
          height={44}
          style={{
            borderRadius: 16,
          }}
        />
      </Box>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignContent: 'center',
          alignItems: 'center',
        }}
      >
        <EarnedTypography
          color={
            theme.palette.mode === 'dark'
              ? PROFILE_CAMPAIGN_DARK_COLOR
              : PROFILE_CAMPAIGN_LIGHT_COLOR
          }
        >
          Super SEIyan Week
        </EarnedTypography>
        <Typography
          marginTop={'4px'}
          fontSize={'18px'}
          lineHeight={'18px'}
          fontWeight={500}
          color={
            theme.palette.mode === 'dark'
              ? PROFILE_CAMPAIGN_DARK_COLOR
              : PROFILE_CAMPAIGN_LIGHT_COLOR
          }
        >
          $300,000 SEI rewards to win
        </Typography>
      </Box>
    </FlexCenterRowBox>
  );
};
