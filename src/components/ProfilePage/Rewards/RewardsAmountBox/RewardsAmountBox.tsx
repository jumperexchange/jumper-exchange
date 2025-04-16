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
}: {
  isConfirmed: boolean;
  rewardAmount: number;
  tokenLogo: string;
  chainLogo: string;
}) => {
  //HOOKS
  const { account } = useAccount();
  const isMobile = useMediaQuery((theme: Theme) =>
    theme.breakpoints.down('md'),
  );

  return (
    <FlexCenterRowBox minWidth="96px">
      <Box marginLeft="32px">
        <Image
          src={tokenLogo}
          alt={`token-image`}
          width={40}
          height={40}
          style={{
            borderRadius: '50%',
          }}
        />
        {isMobile ? undefined : (
          <Image
            src={chainLogo}
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
              ? Intl.NumberFormat('en-US', {
                  style: 'decimal',
                  notation: 'standard',
                  useGrouping: true,
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 8,
                }).format(rewardAmount)
              : '...'}
        </Typography>
      </AmountInputBox>
    </FlexCenterRowBox>
  );
};
