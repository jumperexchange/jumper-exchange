import { Box, Typography } from '@mui/material';
import Image from 'next/image';
import { Button } from 'src/components/Button';
import { ProfilePageTypography } from 'src/components/ProfilePage/ProfilePage.style';

import { RewardsRightBox, RewardsdMainBox } from './RewardsAmountBox.style';
import { useMerklRewards } from 'src/hooks/useMerklRewardsOnSpecificToken';
import { FlexCenterRowBox } from '../../SuperfestPage/SuperfestMissionPage.style';
import { sora } from 'src/fonts/fonts';

export const RewardsAmountBox = ({
  rewardAmount,
}: {
  rewardAmount: number;
}) => {
  return (
    <FlexCenterRowBox>
      <Box marginLeft="32px">
        <Image
          src={'https://strapi.li.finance/uploads/op_dddbaa6b32.png'}
          alt="token image"
          width={40}
          height={40}
          style={{
            borderRadius: 16,
          }}
        />
        <Image
          src={'https://strapi.li.finance/uploads/op_dddbaa6b32.png'}
          alt="token image"
          width={15}
          height={15}
          style={{
            borderRadius: 16,
            border: '2px solid',
            borderColor: '#FFFFFF',
            zIndex: 10,
            marginTop: 16,
            marginLeft: -8,
          }}
        />
      </Box>
      <Box marginLeft={'8px'}>
        <Typography
          sx={{
            fontSize: '40px',
            fontWeight: 700,
            typography: sora.style.fontFamily,
          }}
        >
          {rewardAmount ?? '...'}
        </Typography>
      </Box>
    </FlexCenterRowBox>
  );
};
