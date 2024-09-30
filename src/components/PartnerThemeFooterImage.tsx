'use client';
import { useThemeStore } from '@/stores/theme';
import { ChainId } from '@lifi/types';
import type { Theme } from '@mui/material';
import { useMediaQuery } from '@mui/material';
import Link from 'next/link';
import { useMainPaths } from 'src/hooks/useMainPaths';
import { useSuperfest } from 'src/hooks/useSuperfest';
import { useChainTokenSelectionStore } from 'src/stores/chainTokenSelection';
import { BackgroundFooterImage } from './Widgets';

export const PartnerThemeFooterImage = () => {
  const { sourceChainToken, destinationChainToken } =
    useChainTokenSelectionStore();
  const { isSuperfest } = useSuperfest();
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

  const showBasedOnURL =
    isSuperfest || isMainPaths || !!configTheme?.footerImageUrl;
  const showFooterLogo = !activeChainAlert && !isSmallScreen && showBasedOnURL;

  return (
    showFooterLogo &&
    configTheme?.footerImageUrl && (
      <Link
        href={'https://superfest.optimism.io/'}
        target="_blank"
        style={{ zIndex: 100 }}
      >
        <BackgroundFooterImage
          style={{ position: isSuperfest ? 'relative' : 'absolute' }}
          alt="footer-image"
          src={configTheme?.footerImageUrl?.href}
          width={300}
          height={200}
        />
      </Link>
    )
  );
};
