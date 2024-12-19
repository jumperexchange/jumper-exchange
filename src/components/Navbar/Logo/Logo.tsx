'use client';
import { JumperLearnLogo, JumperLogo } from '@/components/illustrations';
import { LogoWrapper } from '@/components/illustrations/Logo.style';
import { useThemeStore } from '@/stores/theme';
import ClearIcon from '@mui/icons-material/Clear';
import type { Theme } from '@mui/material';
import { useMediaQuery, useTheme } from '@mui/material';
import Image from 'next/image';
import { JumperScanLogo } from 'src/components/illustrations/JumperScanLogo';

type LogoProps = {
  variant: 'default' | 'learn' | 'scan' | 'superfest';
};

export const Logo = ({ variant }: LogoProps) => {
  const logo =
    variant === 'scan' ? (
      <JumperScanLogo />
    ) : variant === 'default' ? (
      <JumperLogo />
    ) : (
      <JumperLearnLogo />
    );
  const configTheme = useThemeStore((state) => state.configTheme);
  const isMobile = useMediaQuery((theme: Theme) =>
    theme.breakpoints.down('md'),
  );
  const theme = useTheme();

  // if (variant === 'superfest') {
  //   return <JumperLogoBlack />;
  // }

  return (
    <LogoWrapper>
      {!isMobile && configTheme?.logo?.url ? (
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
              width: '16px',
              height: '16px',
              marginLeft: theme.spacing(-2),
              marginRight: theme.spacing(2),
              alignSelf: 'center',
            }}
          />
          <Image
            alt="jumper-partner-logo"
            src={configTheme.logo?.url.href}
            width={configTheme.logo?.width}
            height={configTheme.logo?.height}
            style={{ width: 'auto', height: 'auto' }}
          />
        </>
      ) : (
        logo
      )}
    </LogoWrapper>
  );
};
