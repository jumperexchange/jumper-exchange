import { SuperfestLogo } from 'src/components/illustrations/SuperfestLogo';
import { HeroButtonBox, HeroMainBox } from './HeroBox.style';
import { Button } from 'src/components/Button';
import { SoraTypography } from '../Superfest.style';
import Link from 'next/link';
import { type Theme, useMediaQuery } from '@mui/material';
import { SuperfestPresentedBy } from 'src/components/illustrations/SuperfestPresentedBy';

export const HeroBox = () => {
  const isMobile = useMediaQuery((theme: Theme) =>
    theme.breakpoints.down('md'),
  );

  return (
    <HeroMainBox>
      <>{isMobile ? <SuperfestPresentedBy /> : <SuperfestLogo />}</>
      <Link
        style={{ textDecoration: 'none' }}
        href={'https://www.superchain.eco/'}
        target="_blank"
      >
        <HeroButtonBox>
          <Button
            disabled={false}
            variant="primary"
            size="large"
            styles={{
              color: '#ffffff',
              alignItems: 'center',
              minWidth: '400px',
              padding: '16px',
            }}
          >
            <SoraTypography fontSize="16px" lineHeight="18px" fontWeight={600}>
              {String('Learn More').toUpperCase()}
            </SoraTypography>
          </Button>
        </HeroButtonBox>
      </Link>
    </HeroMainBox>
  );
};
