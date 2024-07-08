import { ChainId } from '@lifi/sdk';
import Link from 'next/link';
import { useChainTokenSelectionStore } from 'src/stores/chainTokenSelection';

import { useMainPaths } from 'src/hooks/useMainPaths';
import { Theme, useMediaQuery } from '@mui/material';
import { BackgroundFooterImage } from './Widgets';
import { usePartnerTheme } from 'src/hooks/usePartnerTheme';

export const PartnerThemeFooterImage = () => {
  const { sourceChainToken, destinationChainToken } =
    useChainTokenSelectionStore();
  const { isMainPaths } = useMainPaths();
  const { hasTheme, availableWidgetThemeMode } = usePartnerTheme();

  const isMobile = useMediaQuery((theme: Theme) =>
    theme.breakpoints.down('md'),
  );

  const activeChainAlert =
    sourceChainToken?.chainId === ChainId.SEI ||
    destinationChainToken?.chainId === ChainId.SEI ||
    sourceChainToken?.chainId === ChainId.SOL ||
    destinationChainToken?.chainId === ChainId.SOL;

  return (
    !activeChainAlert &&
    !isMobile &&
    (isMainPaths || !!hasTheme) && (
      <Link href={'https://li.fi'} target="_blank" style={{ zIndex: 1 }}>
        <BackgroundFooterImage
          alt="footer-image"
          src={
            !!hasTheme && availableWidgetThemeMode === 'dark'
              ? 'https://strapi.li.finance/uploads/superfest_light_sponsor_card_f92597365f.svg'
              : 'https://strapi.li.finance/uploads/Superfest_sponsor_card_f3996bea6c.svg'
          }
          width={300}
          height={200}
        />
      </Link>
    )
  );
};
