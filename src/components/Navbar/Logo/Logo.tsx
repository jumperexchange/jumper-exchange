'use client';
import { JumperLearnLogo, JumperLogo } from '@/components/illustrations';
import { LogoWrapper } from '@/components/illustrations/Logo.style';
import { useThemeStore } from '@/stores/theme';
import ClearIcon from '@mui/icons-material/Clear';
import type { Theme } from '@mui/material';
import { useMediaQuery } from '@mui/material';
import Image from 'next/image';
import Link from 'next/link';
import { JumperScanLogo } from 'src/components/illustrations/JumperScanLogo';
import { OptionalLink } from 'src/components/ProfilePage/OptionalLink/OptionalLink';
import { useWelcomeScreen } from 'src/hooks/useWelcomeScreen';
import { useMenuStore } from 'src/stores/menu';

type LogoProps = {
  variant: 'default' | 'learn' | 'scan' | 'superfest';
};

export const Logo = ({ variant }: LogoProps) => {
  const { setWelcomeScreenClosed } = useWelcomeScreen();
  const configTheme = useThemeStore((state) => state.configTheme);

  const { closeAllMenus } = useMenuStore((state) => state);

  const logo =
    variant === 'scan' ? (
      <JumperScanLogo />
    ) : variant === 'default' ? (
      <JumperLogo />
    ) : (
      <JumperLearnLogo />
    );
  const isMobile = useMediaQuery((theme: Theme) =>
    theme.breakpoints.down('md'),
  );

  const handleClick = () => {
    closeAllMenus();
    setWelcomeScreenClosed(false);
  };

  return (
    <LogoWrapper>
      {!isMobile && configTheme?.logo?.url ? (
        <>
          <Link href="/" onClick={handleClick} style={{ display: 'flex' }}>
            {logo}
          </Link>
          <ClearIcon
            width="32px"
            height="32px"
            sx={(theme) => ({
              color:
                theme.palette.mode === 'light'
                  ? theme.palette.black.main
                  : theme.palette.grey[500],
              width: '16px',
              height: '16px',
              marginLeft: theme.spacing(-2),
              marginRight: theme.spacing(2),
              alignSelf: 'center',
            })}
          />
          <OptionalLink disabled={!configTheme.uid} href={configTheme.uid}>
            <Image
              alt="jumper-partner-logo"
              src={configTheme.logo?.url.href}
              width={configTheme.logo?.width}
              height={configTheme.logo?.height}
              style={{ width: 'auto', height: 'auto' }}
            />
          </OptionalLink>
        </>
      ) : (
        <Link href="/" onClick={handleClick} style={{ display: 'flex' }}>
          {logo}
        </Link>
      )}
    </LogoWrapper>
  );
};
