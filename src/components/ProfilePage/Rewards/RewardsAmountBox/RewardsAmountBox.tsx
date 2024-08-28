import {
  Box,
  type Theme,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import Image from 'next/image';
import { FlexCenterRowBox } from 'src/components/Superfest/SuperfestPage/SuperfestMissionPage.style';
import {
  PROFILE_CAMPAIGN_DARK_CHAIN,
  PROFILE_CAMPAIGN_DARK_TOKEN,
  PROFILE_CAMPAIGN_LIGHT_CHAIN,
  PROFILE_CAMPAIGN_LIGHT_TOKEN,
} from 'src/const/partnerTheme';

export const RewardsAmountBox = ({
  rewardAmount,
  isConfirmed,
}: {
  rewardAmount: number;
  isConfirmed: boolean;
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery((theme: Theme) =>
    theme.breakpoints.down('md'),
  );

  const REWARD_CHAIN_LOGO =
    theme.palette.mode === 'dark'
      ? PROFILE_CAMPAIGN_DARK_CHAIN
      : PROFILE_CAMPAIGN_LIGHT_CHAIN;
  const REWARD_TOKEN_LOGO =
    theme.palette.mode === 'dark'
      ? PROFILE_CAMPAIGN_DARK_TOKEN
      : PROFILE_CAMPAIGN_LIGHT_TOKEN;

  return (
    <FlexCenterRowBox>
      <Box marginLeft="32px">
        <Image
          src={REWARD_TOKEN_LOGO}
          alt="token image"
          width={64}
          height={64}
          style={{
            borderRadius: 16,
          }}
        />
        {isMobile ? undefined : (
          <Image
            src={REWARD_CHAIN_LOGO}
            alt="token image"
            width={32}
            height={32}
            style={{
              borderRadius: 16,
              border: '2px solid',
              borderColor: '#FFFFFF',
              zIndex: 10,
              marginTop: 16,
              marginLeft: -16,
            }}
          />
        )}
      </Box>
      <Box marginLeft={'8px'}>
        <Typography
          fontSize="40px"
          fontWeight={700}
          color={theme.palette.mode === 'dark' ? '#ffffff' : '#000000'}
        >
          {isConfirmed ? '0' : rewardAmount ? rewardAmount : '...'}
        </Typography>
      </Box>
    </FlexCenterRowBox>
  );
};
