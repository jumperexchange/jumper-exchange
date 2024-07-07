'use client';
import { JumperLearnLogo, JumperLogo } from '@/components/illustrations';
import { LogoWrapper } from '@/components/illustrations/Logo.style';
import { usePartnerTheme } from '@/hooks/usePartnerTheme';
import ClearIcon from '@mui/icons-material/Clear';
import { useTheme } from '@mui/material';
import Image from 'next/image';
import { JumperLogoBlack } from 'src/components/illustrations/JumperLogoBlack';

type LogoProps = {
  variant: 'default' | 'learn' | 'superfest';
};

export const Logo = ({ variant }: LogoProps) => {
  let logo = <JumperLogo />;

  if (variant === 'learn') {
    logo = <JumperLearnLogo />;
  } else if (variant === 'superfest') {
    logo = <JumperLogoBlack />;
  }

  const { logo: partnerLogo, activeUid } = usePartnerTheme();
  const theme = useTheme();

  console.log({
    link: partnerLogo && partnerLogo?.logoUrl?.href,
    width: partnerLogo?.logoObj?.width,
    height: partnerLogo?.logoObj?.height,
  });
  return (
    <LogoWrapper>
      {activeUid && partnerLogo?.logoUrl && partnerLogo.logoObj ? (
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
            src={partnerLogo?.logoUrl.href}
            width={partnerLogo?.logoObj?.width}
            height={partnerLogo?.logoObj?.height}
          />
        </>
      ) : (
        logo
      )}
    </LogoWrapper>
  );
};
