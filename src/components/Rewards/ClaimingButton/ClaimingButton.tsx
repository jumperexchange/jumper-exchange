import { Box } from '@mui/material';
import { Button } from 'src/components/Button';
import { ProfilePageTypography } from 'src/components/ProfilePage/ProfilePage.style';

export const ClaimingButton = ({}) => {
  async function handleClick() {
    console.log('hello world');
  }

  return (
    <Box sx={{ width: '25%' }}>
      <Button
        variant="secondary"
        size="large"
        styles={{ alignItems: 'center', width: '100%' }}
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
  );
};
