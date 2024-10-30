'use client';

import { useEffect, useState } from 'react';
import { ChainType } from '@lifi/sdk';
import { useAccount } from '@lifi/wallet-management';

import type { ReactElement, ReactNode } from 'react';
import styled from '@emotion/styled';
import { useWashTrading } from '../contexts/useWashTrading';
import { MintLoaderLayout } from '../layouts/MintLoaderLayout';
import { RevealedNFTLayout } from '../layouts/RevealNFTLayout';
import { ConnectWalletLayout } from '../layouts/ConnectWalletLayout';
import { MintLayout } from '../layouts/MintLayout';

/**********************************************************************************************
 * WashPageOverlay: A component that manages and displays different layouts based on the
 * current state
 *
 * This component handles the following:
 * 1. Manages state for the current layout and whether it should be displayed
 * 2. Uses account and wash trading context to determine the appropriate layout
 * 3. Updates the layout based on changes in account connection, NFT state, and minting status
 * 4. Applies a fade-in/fade-out effect when switching between layouts
 *
 * The component uses useEffect to reactively update the layout based on state changes,
 * ensuring that the correct layout is always displayed according to the current application state.
 *********************************************************************************************/
export function WashPageOverlay(): ReactNode {
  const [currentLayout, set_currentLayout] = useState<ReactElement>(null);
  const [hasCurrentLayout, set_hasCurrentLayout] = useState<boolean>(false);
  const { account } = useAccount({ chainType: ChainType.SVM });
  const { reveal, mint, nft } = useWashTrading();
  const [isReady, set_isReady] = useState<boolean>(false);

  useEffect(() => {
    setTimeout(() => {
      set_isReady(true);
    }, 2000);
  }, []);

  const OverlayWrapper = styled.div<{ hasCurrentLayout: boolean }>`
    transition-property: opacity;
    transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
    transition-duration: 1000ms;
    opacity: ${hasCurrentLayout ? 1 : 0};
    pointer-events: ${hasCurrentLayout ? 'auto' : 'none'};
  `;

  /**********************************************************************************************
   * currentNFT: Extracts the NFT object from the nft state
   *
   * This line assigns the NFT object from the nft state to a local variable for easier access.
   *********************************************************************************************/
  const currentNFT = nft.nft;

  /**********************************************************************************************
   * getLayout: Determines the appropriate layout component based on the current state
   *
   * This function checks various conditions to decide which layout component to render:
   * 1. If the account is not connected, it returns an ConnectWalletLayout
   * 2. If minting is in progress, it returns a MintLoaderLayout
   * 3. If there's no NFT public key, it returns an MintLayout
   * 4. If the NFT is revealed, revealing, or the reveal screen should be displayed, it returns
   *    a RevealedNFTLayout
   * 5. If none of the above conditions are met, it returns null
   *
   * The function is memoized with useCallback to optimize performance, only re-creating when
   * its dependencies change.
   *********************************************************************************************/
  useEffect((): void => {
    if (!isReady || account.isConnecting) {
      set_hasCurrentLayout(false);
      return;
    }
    if (account.isConnected && !nft.isFetched && !nft.isLoading) {
      set_hasCurrentLayout(true);
      return;
    }

    if (!account.isConnected || (account.isConnected && !nft.isReady)) {
      set_currentLayout(<ConnectWalletLayout />);
      set_hasCurrentLayout(true);
    } else if (!currentNFT?.name && mint.isMinting) {
      set_currentLayout(<MintLoaderLayout />);
      set_hasCurrentLayout(true);
    } else if (!currentNFT?.name || !nft.isLoading) {
      set_currentLayout(<MintLayout />);
      set_hasCurrentLayout(true);
    } else if (currentNFT?.isRevealed || reveal.isRevealing) {
      set_currentLayout(<RevealedNFTLayout />);
      set_hasCurrentLayout(true);
    } else if (mint.isMinting) {
      set_currentLayout(<MintLoaderLayout />);
      set_hasCurrentLayout(true);
    } else {
      set_hasCurrentLayout(false);
    }
  }, [
    account.isConnected,
    account.isConnecting,
    currentNFT?.name,
    currentNFT?.isRevealed,
    nft.isLoading,
    nft.isFetched,
    reveal.isRevealing,
    nft.isReady,
    mint.isMinting,
    isReady,
  ]);

  return (
    <OverlayWrapper hasCurrentLayout={hasCurrentLayout}>
      {currentLayout}
    </OverlayWrapper>
  );
}
