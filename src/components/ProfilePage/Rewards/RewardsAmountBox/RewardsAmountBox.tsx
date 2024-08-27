import {
  Box,
  type Theme,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import Image from 'next/image';
import { FlexCenterRowBox } from 'src/components/Superfest/SuperfestPage/SuperfestMissionPage.style';

const REWARD_CHAIN_LOGO =
  'https://strapi.li.finance/uploads/Sei_Symbol_Gradient_2b107fa812.svg';
const REWARD_TOKEN_LOGO =
  'https://strapi.li.finance/uploads/Sei_Symbol_Gradient_2b107fa812.svg';

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
