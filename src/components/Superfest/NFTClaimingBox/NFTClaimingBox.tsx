import { Box, Typography, Divider } from '@mui/material';
import Image from 'next/image';
import { Button } from 'src/components/Button';
import { ProfilePageTypography } from 'src/components/ProfilePage/ProfilePage.style';
import {
  NFTClaimingContainer,
  NFTClaimingHeader,
  NFTClaimingTitle,
} from './NFTClaimingBox.style';

export const NFTClaimingBox = ({}) => {
  async function handleClick() {
    console.log('hello world');
  }

  return (
    <NFTClaimingContainer>
      <NFTClaimingHeader>
        <NFTClaimingTitle>{'Mint your Wristband'}</NFTClaimingTitle>
      </NFTClaimingHeader>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignContent: 'center',
          marginTop: '16px',
          gap: '32px',
        }}
      >
        <Box
          sx={{
            width: '280px',
            height: '400px',
            textAlign: 'center',
          }}
        >
          <Box
            sx={{
              display: 'flex',
              padding: '4px',
              flexDirection: 'column',
              justifyContent: 'center',
              alignContent: 'center',
              backgroundColor: '#dffe00',
              color: '#000000',
              height: '25%',
              borderRadius: '20px',
            }}
          >
            <Typography>Mode</Typography>
          </Box>
          <Box
            sx={{
              display: 'flex',
              padding: '4px',
              flexDirection: 'column',
              justifyContent: 'space-between',
              alignContent: 'center',
              backgroundColor: '#dffe00',
              color: '#000000',
              height: '75%',
              borderRadius: '20px',
            }}
          >
            <Typography>Lorem Ipsum</Typography>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                alignContent: 'center',
                textAlign: 'center',
              }}
            >
              <Button
                styles={{
                  backgroundColor: '#FFFFFF',
                  color: '#000000',
                  width: '67%',
                }}
              >
                Mint Now
              </Button>
            </Box>
          </Box>
        </Box>
        <Box
          sx={{
            width: '280px',
            height: '400px',
            textAlign: 'center',
          }}
        >
          <Box
            sx={{
              display: 'flex',
              padding: '4px',
              flexDirection: 'column',
              justifyContent: 'center',
              alignContent: 'center',
              backgroundColor: '#374ef1',
              height: '25%',
              borderRadius: '20px',
            }}
          >
            <Typography>Base</Typography>
          </Box>
          <Box
            sx={{
              display: 'flex',
              padding: '4px',
              flexDirection: 'column',
              justifyContent: 'space-between',
              alignContent: 'center',
              backgroundColor: '#374ef1',
              height: '75%',
              borderRadius: '20px',
            }}
          >
            <Typography>Lorem Ipsum</Typography>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                alignContent: 'center',
                textAlign: 'center',
              }}
            >
              <Button
                styles={{
                  backgroundColor: '#FFFFFF',
                  color: '#000000',
                  width: '67%',
                }}
              >
                Mint Now
              </Button>
            </Box>
          </Box>
        </Box>
        <Box
          sx={{
            width: '280px',
            height: '400px',
            textAlign: 'center',
          }}
        >
          <Box
            sx={{
              display: 'flex',
              padding: '4px',
              flexDirection: 'column',
              justifyContent: 'center',
              alignContent: 'center',
              backgroundColor: '#ff0320',
              height: '25%',
              borderRadius: '20px',
            }}
          >
            <Typography>Optimism</Typography>
          </Box>
          <Box
            sx={{
              display: 'flex',
              padding: '4px',
              flexDirection: 'column',
              justifyContent: 'space-between',
              alignContent: 'center',
              backgroundColor: '#ff0320',
              height: '75%',
              borderRadius: '20px',
            }}
          >
            <Typography>Lorem Ipsum</Typography>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                alignContent: 'center',
                textAlign: 'center',
              }}
            >
              <Button
                styles={{
                  backgroundColor: '#FFFFFF',
                  color: '#000000',
                  width: '67%',
                }}
              >
                Mint Now
              </Button>
            </Box>
          </Box>
        </Box>
        <Box
          sx={{
            width: '280px',
            height: '400px',
            textAlign: 'center',
          }}
        >
          <Box
            sx={{
              display: 'flex',
              padding: '4px',
              flexDirection: 'column',
              justifyContent: 'center',
              alignContent: 'center',
              backgroundColor: '#000000',
              height: '25%',
              borderRadius: '20px',
            }}
          >
            <Typography>Fraxtal</Typography>
          </Box>
          <Box
            sx={{
              display: 'flex',
              padding: '4px',
              flexDirection: 'column',
              justifyContent: 'space-between',
              alignContent: 'center',
              backgroundColor: '#000000',
              height: '75%',
              borderRadius: '20px',
            }}
          >
            <Typography>Lorem Ipsum</Typography>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                alignContent: 'center',
                textAlign: 'center',
              }}
            >
              <Button
                styles={{
                  backgroundColor: '#FFFFFF',
                  color: '#000000',
                  width: '67%',
                }}
              >
                Mint Now
              </Button>
            </Box>
          </Box>
        </Box>
      </Box>
    </NFTClaimingContainer>
  );
};
