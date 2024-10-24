'use client';

import { useEffect, useState } from 'react';
import { useWashTrading } from 'src/wash/contexts/useWashTrading';
import { EmptyScreenLayout } from 'src/wash/layouts/EmptyScreenLayout';
import { MintLoaderLayout } from 'src/wash/layouts/MintLoaderLayout';
import { RevealedNFTLayout } from 'src/wash/layouts/RevealNFTLayout';
import { cl } from 'src/wash/utils/utils';
import { ChainType } from '@lifi/sdk';
import { useAccount } from '@lifi/wallet-management';

import type { ReactElement, ReactNode } from 'react';

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
  const [currentLayout, set_currentLayout] = useState<ReactElement>(
    <EmptyScreenLayout />,
  );
  const [hasCurrentLayout, set_hasCurrentLayout] = useState<boolean>(false);
  const { account } = useAccount({ chainType: ChainType.SVM });
  const { reveal, mint, nft } = useWashTrading();

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
   * 1. If the account is not connected, it returns an EmptyScreenLayout
   * 2. If minting is in progress, it returns a MintLoaderLayout
   * 3. If there's no NFT public key, it returns an EmptyScreenLayout
   * 4. If the NFT is revealed, revealing, or the reveal screen should be displayed, it returns
   *    a RevealedNFTLayout
   * 5. If none of the above conditions are met, it returns null
   *
   * The function is memoized with useCallback to optimize performance, only re-creating when
   * its dependencies change.
   *********************************************************************************************/
  useEffect((): void => {
    if (!account.isConnected) {
      set_currentLayout(<EmptyScreenLayout />);
      set_hasCurrentLayout(true);
    } else if (!currentNFT?.name && mint.isMinting) {
      set_currentLayout(<MintLoaderLayout />);
      set_hasCurrentLayout(true);
    } else if (!currentNFT?.name) {
      set_currentLayout(<EmptyScreenLayout />);
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
    currentNFT?.name,
    currentNFT?.isRevealed,
    reveal.isRevealing,
    mint.isMinting,
  ]);

  return (
    <div
      className={cl(
        'transition-opacity duration-1000',
        hasCurrentLayout ? 'opacity-100' : 'opacity-0 pointer-events-none',
      )}
    >
      {currentLayout}
    </div>
  );
}
