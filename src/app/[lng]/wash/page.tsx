'use client';

import { ChainType } from '@lifi/sdk';
import { useAccount } from '@lifi/wallet-management';
import { Fragment, useEffect, useMemo, useState } from 'react';
import { WashBackground } from 'src/wash/common/WashBackground';
import {
  useWashTrading,
  WashTradingContextApp,
} from 'src/wash/contexts/useWashTrading';
import { DashboardLayout } from 'src/wash/layouts/DashboardLayout';
import { EmptyScreenLayout } from 'src/wash/layouts/EmptyScreenLayout';
import { MintLoaderLayout } from 'src/wash/layouts/MintLoaderLayout';
import { RevealedNFTLayout } from 'src/wash/layouts/RevealNFTLayout';
import { cl } from 'src/wash/utils/utils';

import type { ReactElement, ReactNode } from 'react';

/**********************************************************************************************
 * WithBackdrop: A component that wraps content with a conditional backdrop
 *
 * This component creates a layered backdrop effect with the following features:
 * 1. A conditional opacity based on the shouldDisplayBackdrop prop
 * 2. A top gradient overlay with blur effect
 * 3. A solid color bottom overlay
 * 4. Centered content with a specific vertical offset
 * 5. A DashboardLayout component rendered alongside the backdrop
 *
 * Props:
 * - children: ReactNode - The content to be displayed within the backdrop
 * - shouldDisplayBackdrop: boolean - Determines if the backdrop should be visible
 *********************************************************************************************/
function WithBackdrop(props: {
  children: ReactNode;
  shouldDisplayBackdrop: boolean;
}): ReactElement {
  return (
    <Fragment>
      <div
        className={cl(
          'absolute left-0 top-0 z-20 flex size-full justify-center transition-opacity duration-1000',
          props.shouldDisplayBackdrop
            ? 'opacity-100'
            : 'opacity-0 pointer-events-none',
        )}
      >
        <div
          className={'absolute left-0 top-0 z-20 h-1/2 w-full'}
          style={{
            background:
              'linear-gradient(360deg, #1B1036 0%, rgba(27, 16, 54, 0) 100%)',
            backdropFilter: 'blur(8px)',
          }}
        />
        <div
          className={'absolute bottom-0 left-0 z-20 h-1/2 w-full bg-violet-100'}
        />
        <div className={'relative z-50 mt-[28dvh]'}>{props.children}</div>
      </div>
      <DashboardLayout />
    </Fragment>
  );
}

/**********************************************************************************************
 * Overlay: A component that manages and displays different layouts based on the current state
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
function Overlay(): ReactNode {
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

function WashPage(): ReactElement {
  const { account } = useAccount({ chainType: ChainType.SVM });
  const { reveal, mint, nft } = useWashTrading();

  /**********************************************************************************************
   * currentNFT: Extracts the NFT object from the nft state
   *
   * This line assigns the NFT object from the nft state to a local variable for easier access.
   *********************************************************************************************/
  const currentNFT = nft.nft;

  /**********************************************************************************************
   * shouldDisplayBackdrop: Determines if the backdrop should be displayed
   *
   * This memoized value checks various conditions to decide if the backdrop should be shown:
   * 1. Account is not connected
   * 2. NFT public key is missing
   * 3. Minting is in progress
   * 4. NFT is revealed
   * 5. NFT is in the process of revealing
   * 6. Reveal screen should be displayed
   *********************************************************************************************/
  const shouldDisplayBackdrop = useMemo(() => {
    return (
      !account.isConnected ||
      !currentNFT?.name ||
      mint.isMinting ||
      currentNFT?.isRevealed ||
      reveal.isRevealing
    );
  }, [
    account.isConnected,
    mint.isMinting,
    currentNFT?.name,
    currentNFT?.isRevealed,
    reveal.isRevealing,
  ]);

  return (
    <div
      className={
        'relative z-10 flex min-h-screen w-full flex-col items-center justify-start overflow-hidden bg-violet-100 pb-10'
      }
    >
      <WashBackground />
      <WithBackdrop shouldDisplayBackdrop={shouldDisplayBackdrop}>
        <Overlay />
      </WithBackdrop>
    </div>
  );
}

export default function WithRevealContext(): ReactElement {
  return (
    <WashTradingContextApp>
      <WashPage />
    </WashTradingContextApp>
  );
}
