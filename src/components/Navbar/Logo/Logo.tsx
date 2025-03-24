'use client';
import { JumperLearnLogo, JumperLogo } from '@/components/illustrations';
import { LogoWrapper } from '@/components/illustrations/Logo.style';
import { useThemeStore } from '@/stores/theme';
import ClearIcon from '@mui/icons-material/Clear';
import type { Theme } from '@mui/material';
import { useMediaQuery } from '@mui/material';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { JumperScanLogo } from 'src/components/illustrations/JumperScanLogo';
import { OptionalLink } from 'src/components/ProfilePage/OptionalLink/OptionalLink';
import {
  JUMPER_LEARN_PATH,
  JUMPER_SCAN_PATH,
  JUMPER_TX_PATH,
  JUMPER_WALLET_PATH,
} from 'src/const/urls';
import { useWelcomeScreen } from 'src/hooks/useWelcomeScreen';
import { useMenuStore } from 'src/stores/menu';

export const Logo = () => {
  const { setWelcomeScreenClosed } = useWelcomeScreen();
  const configTheme = useThemeStore((state) => state.configTheme);
  const { closeAllMenus } = useMenuStore((state) => state);

  const pathname = usePathname();
  const isLearnPage = pathname?.includes(JUMPER_LEARN_PATH);
  const isScanPage =
    pathname?.includes(JUMPER_SCAN_PATH) ||
    pathname?.includes(JUMPER_TX_PATH) ||
    pathname?.includes(JUMPER_WALLET_PATH);

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
          <Link href="/" id="jumper-logo" onClick={handleClick} style={{ display: 'flex' }}>
            <JumperLogo />
          </Link>
          {(isLearnPage || isScanPage) && (
            <PathLogo variant={isLearnPage ? 'learn' : 'scan'} />
          )}
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
              marginLeft: '5px',
              marginRight: '10px',
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
        <>
          <Link href="/" onClick={handleClick} id="jumper-logo" style={{ display: 'flex' }}>
            <JumperLogo />
          </Link>
          {(isLearnPage || isScanPage) && (
            <PathLogo variant={isLearnPage ? 'learn' : 'scan'} />
          )}
        </>
      )}
    </LogoWrapper>
  );
};

const PathLogo = ({ variant }: { variant: 'learn' | 'scan' }) => {
  let logo, path;
  switch (variant) {
    case 'scan':
      logo = <JumperScanLogo />;
      path = JUMPER_SCAN_PATH;
      break;
    case 'learn':
      logo = <JumperLearnLogo />;
      path = JUMPER_LEARN_PATH;
      break;
    default:
      return null;
  }

  return (
    <OptionalLink href={path} disabled={false}>
      {logo}
    </OptionalLink>
  );
};
