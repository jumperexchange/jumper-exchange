'use client';
import { JumperLearnLogo, JumperLogo } from '@/components/illustrations';
import { LogoWrapper } from '@/components/illustrations/Logo.style';
import ClearIcon from '@mui/icons-material/Clear';
import type { Theme } from '@mui/material';
import { useMediaQuery, useTheme } from '@mui/material';
import Image from 'next/image';
import { JumperLogoBlack } from 'src/components/illustrations/JumperLogoBlack';
import { useSettingsStore } from '@/stores/settings';

type LogoProps = {
  variant: 'default' | 'learn' | 'superfest';
};

export const Logo = ({ variant }: LogoProps) => {
  const logo = variant === 'default' ? <JumperLogo /> : <JumperLearnLogo />;
  const configTheme = useSettingsStore((state) => state.configTheme);
  const isMobile = useMediaQuery((theme: Theme) =>
    theme.breakpoints.down('md'),
  );
  const theme = useTheme();

  console.log('logo', configTheme);

  // if (variant === 'superfest') {
  //   return <JumperLogoBlack />;
  // }

  return (
    <LogoWrapper>
      {!isMobile && configTheme?.logo ? (
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
            src={configTheme.logo?.url.href}
            width={configTheme.logo?.width}
            height={configTheme.logo?.height}
          />
        </>
      ) : (
        logo
      )}
    </LogoWrapper>
  );
};
