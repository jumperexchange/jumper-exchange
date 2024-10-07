import { type Theme, Typography, useMediaQuery } from '@mui/material';
import Link from 'next/link';
import { Button } from 'src/components/Button';
import { SuperfestLogo } from 'src/components/illustrations/SuperfestLogo';
import { SuperfestPresentedBy } from 'src/components/illustrations/SuperfestPresentedBy';
import { HeroButtonBox, HeroMainBox } from './HeroBox.style';

export const HeroBox = () => {
  const isMobile = useMediaQuery((theme: Theme) =>
    theme.breakpoints.down('md'),
  );

  return (
    <HeroMainBox>
      <>{isMobile ? <SuperfestPresentedBy /> : <SuperfestLogo />}</>
      <Link
        style={{ textDecoration: 'none' }}
        href={'https://superfest.optimism.io/'}
        target="_blank"
      >
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
            {
              //* todo: check typography (sora) *//
            }
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
