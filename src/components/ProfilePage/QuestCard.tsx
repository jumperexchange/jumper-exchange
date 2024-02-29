import { Box, Container, Stack, Typography, useTheme } from '@mui/material';
import { useUserTracking } from 'src/hooks';
import { Button } from '../Button';
import { CarouselNavigationButton } from './CarouselContainer.style';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

export const QuestCard = ({ active, title, image, points }: any) => {
  const theme = useTheme();
  const { trackPageload, trackEvent } = useUserTracking();

  return (
    <Box
      sx={{
        backgroundColor: '#FFFFFF',
        height: '392px',
        width: '272px',
        borderRadius: '24px',
        textAlign: 'center',
      }}
    >
      <img
        src={image}
        width={'240px'}
        height={'240px'}
        style={{
          borderRadius: '24px',
          marginTop: 16,
        }}
      />

      <Box
        style={{
          paddingTop: 16,
          paddingBottom: 16,
          paddingLeft: 32,
          paddingRight: 32,
        }}
      >
        <Box
          sx={{
            textAlign: 'left',
            height: '32px',
          }}
        >
          <Typography
            sx={{
              fontSize: '20px',
              fontWeight: 700,
              // fontFamily: 'Urbanist',
              lineHeight: '20px',
              fontStyle: 'normal',
            }}
          >
            {' '}
            {title}
          </Typography>
        </Box>
        <Box
          sx={{
            marginTop: '16px',
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Typography
            sx={{
              color: '#31007A',
              fontFamily: 'Inter',
              fontSize: '32px',
              fontStyle: 'normal',
              fontWeight: 700,
              lineHeight: '40px' /* 125% */,
            }}
          >
            {' '}
            +{points}
          </Typography>
          {active ? (
            <Button variant="secondary">
              <Typography
                sx={{
                  color: '#31007A',
                  fontFamily: 'Inter',
                  fontSize: '16px',
                  fontStyle: 'normal',
                  fontWeight: 600,
                  lineHeight: '18px' /* 125% */,
                }}
              >
                Join
              </Typography>
              <CarouselNavigationButton>
                <ArrowForwardIcon sx={{ width: '22px', height: '22px' }} />
              </CarouselNavigationButton>
            </Button>
          ) : null}
        </Box>
      </Box>
    </Box>
  );
};
