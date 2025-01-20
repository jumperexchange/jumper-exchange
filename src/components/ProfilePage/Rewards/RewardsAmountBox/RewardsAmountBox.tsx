import { useAccount } from '@lifi/wallet-management';
import { Box, type Theme, Typography, useMediaQuery } from '@mui/material';
import Image from 'next/image';
import { FlexCenterRowBox } from 'src/components/Superfest/SuperfestPage/SuperfestMissionPage.style';
import { AmountInputBox } from '../RewardsCarousel.style';

export const RewardsAmountBox = ({
  isConfirmed,
  rewardAmount,
  tokenLogo,
  chainLogo,
  decimalsToShow,
}: {
  isConfirmed: boolean;
  rewardAmount: number;
  tokenLogo: string;
  chainLogo: string;
  decimalsToShow: number;
}) => {
  //HOOKS
  const { account } = useAccount();
  const isMobile = useMediaQuery((theme: Theme) =>
    theme.breakpoints.down('md'),
  );

  //CONST
  const REWARD_CHAIN_LOGO = chainLogo;
  const REWARD_TOKEN_LOGO = tokenLogo;

  return (
    <FlexCenterRowBox minWidth="96px">
      <Box marginLeft="32px">
        <Image
          src={REWARD_TOKEN_LOGO}
          alt={`token-image`}
          width={40}
          height={40}
          style={{
            borderRadius: '50%',
          }}
        />
        {isMobile ? undefined : (
          <Image
            src={REWARD_CHAIN_LOGO}
            alt="chain image"
            width={20}
            height={20}
            style={{
              borderRadius: '50%',
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
          sx={(theme) => ({
            color: theme.palette.text.primary,
          })}
        >
          {!account?.address ||
          rewardAmount === 0 ||
          !rewardAmount ||
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
