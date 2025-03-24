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
import {
  JUMPER_LEARN_PATH,
  JUMPER_SCAN_PATH,
  JUMPER_TX_PATH,
  JUMPER_WALLET_PATH,
} from 'src/const/urls';

export const Logo = ({ handleClick }: { handleClick?: () => void }) => {
  const configTheme = useThemeStore((state) => state.configTheme);

  const pathname = usePathname();
  const isLearnPage = pathname?.includes(JUMPER_LEARN_PATH);
  const isScanPage =
    pathname?.includes(JUMPER_SCAN_PATH) ||
    pathname?.includes(JUMPER_TX_PATH) ||
    pathname?.includes(JUMPER_WALLET_PATH);

  let logoHref, logo;
  if (isScanPage) {
    logoHref = JUMPER_SCAN_PATH;
    logo = <JumperScanLogo />;
  } else if (isLearnPage) {
    logoHref = JUMPER_LEARN_PATH;
    logo = <JumperLearnLogo />;
  } else {
    logoHref = '/';
    logo = <JumperLogo />;
  }
  const isMobile = useMediaQuery((theme: Theme) =>
    theme.breakpoints.down('md'),
  );

  return (
    <LogoWrapper>
      {!isMobile && configTheme?.logo?.url ? (
        <>
          <Link
            href="/"
            onClick={handleClick ? handleClick : undefined}
            style={{ display: 'flex' }}
          >
            {logo}
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
            <Image
              alt="jumper-partner-logo"
              src={configTheme.logo?.url.href}
              width={configTheme.logo?.width}
              height={configTheme.logo?.height}
              style={{ width: 'auto', height: 'auto' }}
            />
          </Link>
        </>
      ) : (
        <Link
          href={logoHref}
          onClick={handleClick ? handleClick : undefined}
          style={{ display: 'flex' }}
        >
          {logo}
        </Link>
      )}
    </LogoWrapper>
  );
};
