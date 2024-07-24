'use client';

import { ChainId } from '@lifi/sdk';
import Link from 'next/link';
import { useChainTokenSelectionStore } from 'src/stores/chainTokenSelection';

import { WidgetEvent, useWidgetEvents } from '@lifi/widget';
import type { Theme } from '@mui/material';
import { useMediaQuery } from '@mui/material';
import { useEffect, useState } from 'react';
import { useMainPaths } from 'src/hooks/useMainPaths';
import { usePartnerTheme } from 'src/hooks/usePartnerTheme';
import { useSuperfest } from 'src/hooks/useSuperfest';
import { BackgroundFooterImage } from './Widgets';

export const PartnerThemeFooterImage = () => {
  const { sourceChainToken, destinationChainToken } =
    useChainTokenSelectionStore();
  const { isSuperfest } = useSuperfest();
  const { isMainPaths } = useMainPaths();
  const { hasTheme, availableWidgetThemeMode } = usePartnerTheme();
  const [widgetExpanded, setWidgetExpanded] = useState(false);
  const widgetEvents = useWidgetEvents();
  const isSmallScreen = useMediaQuery((theme: Theme) =>
    theme.breakpoints.down('lg'),
  );

  useEffect(() => {
    const handleWidgetExpanded = async (expanded: boolean) => {
      setWidgetExpanded(expanded);
    };
    widgetEvents.on(WidgetEvent.WidgetExpanded, handleWidgetExpanded);

    return () =>
      widgetEvents.off(WidgetEvent.WidgetExpanded, handleWidgetExpanded);
  }, [widgetEvents, widgetExpanded]);

  const activeChainAlert =
    sourceChainToken?.chainId === ChainId.SEI ||
    destinationChainToken?.chainId === ChainId.SEI ||
    sourceChainToken?.chainId === ChainId.SOL ||
    destinationChainToken?.chainId === ChainId.SOL;

  const showBasedOnURL = isSuperfest || isMainPaths || !!hasTheme;
  const showFooterLogo = !activeChainAlert && !isSmallScreen && showBasedOnURL;

  return (
    showFooterLogo &&
    !widgetExpanded && (
      <Link
        href={'https://superfest.optimism.io/'}
        target="_blank"
        style={{ zIndex: 100 }}
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
