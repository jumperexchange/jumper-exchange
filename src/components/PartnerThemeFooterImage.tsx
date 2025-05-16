'use client';
import { useThemeStore } from '@/stores/theme';
import { ChainId } from '@lifi/sdk';
import type { Theme } from '@mui/material';
import { useMediaQuery } from '@mui/material';
import Link from 'next/link';
import { useMainPaths } from 'src/hooks/useMainPaths';
import { useChainTokenSelectionStore } from 'src/stores/chainTokenSelection';
import { BackgroundFooterImage } from './Widgets';

export const PartnerThemeFooterImage = () => {
  const { sourceChainToken, destinationChainToken } =
    useChainTokenSelectionStore();
  const { isMainPaths } = useMainPaths();
  const configTheme = useThemeStore((state) => state.configTheme);

  const isSmallScreen = useMediaQuery((theme: Theme) =>
    theme.breakpoints.down('lg'),
  );

  if (!configTheme?.footerImageUrl) {
    return;
  }

  const activeChainAlert =
    sourceChainToken?.chainId === ChainId.SEI ||
    destinationChainToken?.chainId === ChainId.SEI ||
    sourceChainToken?.chainId === ChainId.SOL ||
    destinationChainToken?.chainId === ChainId.SOL;

  const showBasedOnURL = isMainPaths || !!configTheme?.footerImageUrl;
  const showFooterLogo = !activeChainAlert && !isSmallScreen && showBasedOnURL;

  return (
    showFooterLogo &&
    configTheme?.partnerUrl &&
    configTheme?.footerImageUrl && (
      <Link
        href={configTheme?.partnerUrl.href}
        target="_blank"
        style={{ zIndex: 100 }}
      >
        <BackgroundFooterImage
          style={{ position: 'absolute' }}
          alt="footer-image"
          src={configTheme?.footerImageUrl?.href}
          width={300}
          height={200}
        />
      </Link>
    )
  );
};
