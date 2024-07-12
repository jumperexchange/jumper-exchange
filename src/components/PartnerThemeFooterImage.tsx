import { ChainId } from '@lifi/sdk';
import Link from 'next/link';
import { useChainTokenSelectionStore } from 'src/stores/chainTokenSelection';

import { useMainPaths } from 'src/hooks/useMainPaths';
import type { Theme } from '@mui/material';
import { useMediaQuery } from '@mui/material';
import { BackgroundFooterImage } from './Widgets';
import { useSettingsStore } from '@/stores/settings';

export const PartnerThemeFooterImage = () => {
  const { sourceChainToken, destinationChainToken } =
    useChainTokenSelectionStore();
  const { isMainPaths } = useMainPaths();
  const configTheme = useSettingsStore((state) => state.configTheme);

  const isMobile = useMediaQuery((theme: Theme) =>
    theme.breakpoints.down('md'),
  );

  if (!configTheme?.footerImageUrl) {
    return;
  }

  const activeChainAlert =
    sourceChainToken?.chainId === ChainId.SEI ||
    destinationChainToken?.chainId === ChainId.SEI ||
    sourceChainToken?.chainId === ChainId.SOL ||
    destinationChainToken?.chainId === ChainId.SOL;

  return (
    !activeChainAlert &&
    !isMobile &&
    isMainPaths && (
      <Link
        href={'https://superfest.optimism.io/'}
        target="_blank"
        style={{ zIndex: 1 }}
      >
        <BackgroundFooterImage
          alt="footer-image"
          src={configTheme?.footerImageUrl?.href}
          width={300}
          height={200}
        />
      </Link>
    )
  );
};
