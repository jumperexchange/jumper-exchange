import { Box, Stack, Typography } from '@mui/material';
import {
  RewardsCarouselContainer,
  RewardsCarouselHeader,
  RewardsCarouselTitle,
} from './RewardsCarousel.style';
import { RewardsBox } from './RewardsBox/RewardsBox';
import Image from 'next/image';
import { Button } from 'src/components/Button';
import { ProfilePageTypography } from 'src/components/ProfilePage/ProfilePage.style';
import { sequel85, sora } from 'src/fonts/fonts';

export const RewardsCarousel = ({}) => {
  return (
    <RewardsCarouselContainer>
      <Box
        sx={{
          width: '100%',
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          alignContent: 'center',
          padding: '32px',
        }}
      >
        <Typography
          sx={{
            fontSize: '32px',
            lineHeight: '32px',
            fontWeight: 700,
            typography: sequel85.style.fontFamily,
          }}
        >
          You've earned:
        </Typography>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'center',
            alignContent: 'center',
            alignItems: 'center',
          }}
        >
          <Box sx={{ marginLeft: '32px' }}>
            <Image
              src={'https://strapi.li.finance/uploads/base_314252c925.png'}
              alt="token image"
              width={40}
              height={40}
              style={{
                borderRadius: 16,
              }}
            />
            <Image
              src={'https://strapi.li.finance/uploads/base_314252c925.png'}
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
          <Box sx={{ marginLeft: '8px' }}>
            <Typography
              sx={{
                fontSize: '40px',
                fontWeight: 700,
                typography: sora.style.fontFamily,
              }}
            >
              45.5145
            </Typography>
          </Box>
        </Box>
        <Button
          disabled={false}
          variant="secondary"
          size="large"
          styles={{
            width: '15%',
            marginLeft: '32px',
            alignItems: 'center',
            backgroundColor: 'transparent',
            borderColor: '#ffffff',
            border: '2px dotted',
            padding: '16px',
            '&:hover': {
              color: '#FFFFFF',
              backgroundColor: '#ff0420',
            },
          }}
        >
          <ProfilePageTypography
            fontSize="16px"
            lineHeight="18px"
            fontWeight={600}
          >
            Claim Rewards
          </ProfilePageTypography>
        </Button>
        {/* <RewardsBox /> */}
      </Box>
    </RewardsCarouselContainer>
  );
};
