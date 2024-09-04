import { type Theme, useMediaQuery } from '@mui/material';
import Link from 'next/link';
import { Button } from 'src/components/Button';
import { SoraTypography } from 'src/components/Superfest/Superfest.style';
import { HeroButtonBox, HeroMainBox } from './HeroBox.style';

interface HeroBoxProps {
  title: string;
  logoMobile?: JSX.Element;
  logoDesktop?: JSX.Element;
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
      <>{isMobile ? logoMobile : logoDesktop}</>
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
            <SoraTypography fontSize="16px" lineHeight="18px" fontWeight={600}>
              {String(title).toUpperCase()}
            </SoraTypography>
          </Button>
        </HeroButtonBox>
      </Link>
    </HeroMainBox>
  );
};
