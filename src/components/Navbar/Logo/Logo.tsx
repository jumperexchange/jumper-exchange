'use client';
import { JumperLearnLogo, JumperLogo } from '@/components/illustrations';
import { LogoWrapper } from '@/components/illustrations/Logo.style';
import { usePartnerTheme } from '@/hooks/usePartnerTheme';
import ClearIcon from '@mui/icons-material/Clear';
import type { Theme } from '@mui/material';
import { useMediaQuery, useTheme } from '@mui/material';
import Image from 'next/image';
import { JumperLogoBlack } from 'src/components/illustrations/JumperLogoBlack';

type LogoProps = {
  variant: 'default' | 'learn' | 'superfest';
};

export const Logo = ({ variant }: LogoProps) => {
  const logo = variant === 'default' ? <JumperLogo /> : <JumperLearnLogo />;
  const { logoUrl, hasTheme, logo: partnerLogo, ...props } = usePartnerTheme();
  const isMobile = useMediaQuery((theme: Theme) =>
    theme.breakpoints.down('md'),
  );
  const theme = useTheme();

  console.log('gtefds', logoUrl, hasTheme, partnerLogo, props);

  // if (variant === 'superfest') {
  //   return <JumperLogoBlack />;
  // }

  return (
    <LogoWrapper>
      {!!hasTheme && !isMobile && logoUrl && partnerLogo ? (
        <>
          {logo}
          <ClearIcon
            width="32px"
            height="32px"
            sx={{
              color:
                theme.palette.mode === 'light'
                  ? theme.palette.black.main
                  : theme.palette.grey[500],
              width: '32px',
              height: '32px',
              marginLeft: theme.spacing(-2),
              marginRight: theme.spacing(2),
            }}
          />
          <Image
            alt="jumper-partner-logo"
            src={logoUrl.href}
            width={partnerLogo?.width}
            height={partnerLogo?.height}
          />
        </>
      ) : (
        logo
      )}
    </LogoWrapper>
  );
};
