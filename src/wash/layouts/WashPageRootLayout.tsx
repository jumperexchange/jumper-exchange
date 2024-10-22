'use client';

import { useMemo } from 'react';
import { WashBackground } from 'src/wash/common/WashBackground';
import { useWashTrading } from 'src/wash/contexts/useWashTrading';
import { ChainType } from '@lifi/sdk';
import { useAccount } from '@lifi/wallet-management';

import type { ReactElement } from 'react';
import { WithBackdrop } from 'src/wash/common/WithBackdrop';
import { WashPageOverlay } from 'src/wash/common/WashPageOverlay';

export function WashPageRootLayout(): ReactElement {
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
        // TODO: remove classname
        'relative z-10 flex min-h-screen w-full flex-col items-center justify-start overflow-hidden bg-violet-100 pb-10'
      }
    >
      <WashBackground />
      <WithBackdrop shouldDisplayBackdrop={shouldDisplayBackdrop}>
        <WashPageOverlay />
      </WithBackdrop>
    </div>
  );
}
