'use client';

import { ChainId } from '@lifi/sdk';
import Link from 'next/link';
import { useChainTokenSelectionStore } from 'src/stores/chainTokenSelection';

import { useMainPaths } from 'src/hooks/useMainPaths';
import { Theme, useMediaQuery } from '@mui/material';
import { BackgroundFooterImage } from './Widgets';
import { usePartnerTheme } from 'src/hooks/usePartnerTheme';
import { useSuperfest } from 'src/hooks/useSuperfest';
import { useMetaMask } from 'src/hooks/useMetaMask';

export const PartnerThemeFooterImage = () => {
  const { sourceChainToken, destinationChainToken } =
    useChainTokenSelectionStore();
  const { isSuperfest } = useSuperfest();
  const { isMainPaths } = useMainPaths();
  const { hasTheme, availableWidgetThemeMode } = usePartnerTheme();
  const { isMetaMaskConnector } = useMetaMask();

  const isMobile = useMediaQuery((theme: Theme) =>
    theme.breakpoints.down('md'),
  );

  const activeChainAlert =
    sourceChainToken?.chainId === ChainId.SEI ||
    destinationChainToken?.chainId === ChainId.SEI ||
    sourceChainToken?.chainId === ChainId.SOL ||
    destinationChainToken?.chainId === ChainId.SOL;

  const showBasedOnURL = isSuperfest || isMainPaths || !!hasTheme;
  const showFooterLogo =
    !activeChainAlert && !isMobile && showBasedOnURL && !isMetaMaskConnector;

  return (
    showFooterLogo && (
      <Link
        href={'https://superfest.optimism.io/'}
        target="_blank"
        style={{ zIndex: 9999 }}
      >
        <BackgroundFooterImage
          style={{ position: isSuperfest ? 'relative' : 'absolute' }}
          alt="footer-image"
          src={
            !!hasTheme && availableWidgetThemeMode === 'dark'
              ? 'https://strapi.li.finance/uploads/sponsorcard_superfest_dark_befdd19bcf.svg'
              : 'https://strapi.li.finance/uploads/Superfest_OP_3_575f5ddd10.svg'
          }
          width={300}
          height={200}
        />
      </Link>
    )
  );
};
