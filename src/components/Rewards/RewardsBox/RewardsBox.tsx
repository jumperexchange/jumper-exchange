import { Box, Typography } from '@mui/material';
import Image from 'next/image';
import { Button } from 'src/components/Button';
import { ProfilePageTypography } from 'src/components/ProfilePage/ProfilePage.style';
import {
  QuestCardBottomBox,
  QuestCardMainBox,
  QuestCardTitleBox,
} from 'src/components/ProfilePage/QuestCard/QuestCard.style';
import { RewardsRightBox, RewardsdMainBox } from './RewardsBox.style';

export const RewardsBox = ({}) => {
  async function handleClick() {
    console.log('hello world');
  }

  return (
    <RewardsdMainBox>
      <Image
        src={'https://strapi.li.finance/uploads/large_PDA_Mode_bbfc0a108d.png'}
        alt="Quest Card Image"
        width={240}
        height={240}
        style={{
          borderRadius: 8,
        }}
      />
      <RewardsRightBox>
        <Box>
          <ProfilePageTypography fontSize={'18px'} lineHeight={'24px'}>
            {'Your Position'}
          </ProfilePageTypography>
        </Box>
        <Box>
          <ProfilePageTypography fontSize={'18px'} lineHeight={'24px'}>
            {'Available Rewards'}
          </ProfilePageTypography>
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
