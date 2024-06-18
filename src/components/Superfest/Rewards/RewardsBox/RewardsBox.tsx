import { Box, Typography } from '@mui/material';
import Image from 'next/image';
import { Button } from 'src/components/Button';
import { ProfilePageTypography } from 'src/components/ProfilePage/ProfilePage.style';

import { RewardsRightBox, RewardsdMainBox } from './RewardsBox.style';
import { useMerklRewards } from 'src/hooks/useMerklRewardsOnSpecificToken';

export const RewardsBox = ({}) => {
  const { isLoading, isSuccess, userTVL, availableRewards, activePosition } =
    useMerklRewards({
      userAddress: '0x55048e0d46f66fa00cae12905f125194cd961581',
    });

  async function handleClick() {
    console.log('hello world');
  }

  return (
    <RewardsdMainBox>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignContent: 'center',
        }}
      >
        <Image
          src={
            'https://strapi.li.finance/uploads/large_PDA_Mode_bbfc0a108d.png'
          }
          alt="Quest Card Image"
          width={240}
          height={240}
          style={{
            borderRadius: 8,
          }}
        />
      </Box>
      <RewardsRightBox>
        <Box>
          <ProfilePageTypography fontSize={'18px'} lineHeight={'24px'}>
            {'Your Active Position'}
          </ProfilePageTypography>
          <ProfilePageTypography fontSize={'18px'} lineHeight={'24px'}>
            {isSuccess ? `$${parseFloat(String(userTVL)).toFixed(2)}` : '...'}
          </ProfilePageTypography>
        </Box>
        <Box>
          <ProfilePageTypography fontSize={'18px'} lineHeight={'24px'}>
            {'Available Rewards'}
          </ProfilePageTypography>
          {isSuccess && availableRewards.length > 0
            ? availableRewards.map((elem) => {
                return (
                  <ProfilePageTypography fontSize={'18px'} lineHeight={'24px'}>
                    {elem.amountToClaim + ' ' + elem.symbol}
                  </ProfilePageTypography>
                );
              })
            : '...'}
        </Box>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignContent: 'center',
          }}
        >
          <Button
            variant="secondary"
            size="large"
            styles={{ alignItems: 'center', width: '67%' }}
            onClick={() => handleClick()}
          >
            <ProfilePageTypography
              fontSize={'16px'}
              lineHeight={'18px'}
              fontWeight={600}
              sx={{
                padding: 1,
              }}
            >
              {'Claim Rewards'}
            </ProfilePageTypography>
          </Button>
        </Box>
      </RewardsRightBox>
    </RewardsdMainBox>
  );
};
