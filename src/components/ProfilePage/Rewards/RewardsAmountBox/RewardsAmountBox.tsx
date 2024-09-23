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
} from 'src/const/partnerRewardsTheme';
import { useAccounts } from 'src/hooks/useAccounts';
import { AmountInputBox } from '../RewardsCarousel.style';

export const RewardsAmountBox = ({
  isSuccess,
  isConfirmed,
  rewardAmount,
  tokenLogo,
  chainLogo,
  decimalsToShow,
}: {
  isSuccess: boolean;
  isConfirmed: boolean;
  rewardAmount: number;
  tokenLogo: string;
  chainLogo: string;
  decimalsToShow: number;
}) => {
  //HOOKS
  const { account } = useAccounts();
  const theme = useTheme();
  const isMobile = useMediaQuery((theme: Theme) =>
    theme.breakpoints.down('md'),
  );

  //CONST
  const REWARD_CHAIN_LOGO = chainLogo; // theme.palette.mode === 'dark' ?
  const REWARD_TOKEN_LOGO = tokenLogo; // theme.palette.mode === 'dark' ?

  return (
    <FlexCenterRowBox minWidth="96px">
      <Box marginLeft="32px">
        <Image
          src={REWARD_TOKEN_LOGO}
          alt="token image"
          width={40}
          height={40}
          style={{
            borderRadius: 16,
          }}
        />
        {isMobile ? undefined : (
          <Image
            src={REWARD_CHAIN_LOGO}
            alt="chain image"
            width={15}
            height={15}
            style={{
              borderRadius: 16,
              border: '2px solid',
              borderColor: '#FFFFFF',
              zIndex: 10,
              marginTop: 20,
              marginLeft: -12,
            }}
          />
        )}
      </Box>
      <AmountInputBox>
        <Typography
          fontSize="24px"
          lineHeight="32px"
          fontWeight={700}
          color={theme.palette.mode === 'dark' ? '#ffffff' : '#000000'}
        >
          {!account?.address ||
          (isSuccess && (rewardAmount === 0 || !rewardAmount)) ||
          isConfirmed
            ? '0'
            : rewardAmount
              ? rewardAmount.toFixed(decimalsToShow)
              : '...'}
        </Typography>
      </AmountInputBox>
    </FlexCenterRowBox>
  );
};
