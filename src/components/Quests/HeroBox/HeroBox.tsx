import { Box, type Theme, Typography, useMediaQuery } from '@mui/material';
import Link from 'next/link';
import { Button } from 'src/components/Button';
import { HeroButtonBox, HeroMainBox } from './HeroBox.style';

interface HeroBoxProps {
  title: string;
  logoMobile: JSX.Element;
  logoDesktop: JSX.Element;
  url: string;
}

export const HeroBox = ({
  title,
  logoMobile,
  logoDesktop,
  url,
}: HeroBoxProps) => {
  const isMobile = useMediaQuery((theme: Theme) =>
    theme.breakpoints.down('md'),
  );

  return (
    <HeroMainBox>
      <Box
        sx={{
          height: { xs: '160px', md: '400px' },
          width: { xs: '384px', md: '960px' },
        }}
      >
        {isMobile ? logoMobile : logoDesktop}
      </Box>
      <Link style={{ textDecoration: 'none' }} href={url} target="_blank">
        <HeroButtonBox>
          <Button
            id="learn-more-button"
            disabled={false}
            variant="primary"
            size="large"
            styles={{
              color: '#ffffff',
              alignItems: 'center',
              minWidth: { xs: '300px', md: '400px' },
              padding: '16px',
            }}
          >
            <Typography
              variant="bodyMediumStrong"
              lineHeight="18px"
              fontWeight={600}
            >
              {String('Learn More').toUpperCase()}
            </Typography>
          </Button>
        </HeroButtonBox>
      </Link>
    </HeroMainBox>
  );
};
