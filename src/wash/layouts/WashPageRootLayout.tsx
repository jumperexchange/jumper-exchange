'use client';

import { ChainType } from '@lifi/sdk';
import { useAccount } from '@lifi/wallet-management';
import type { ReactElement } from 'react';
import { useMemo } from 'react';
import { WashBackground } from '../common/WashBackground';
import { WashPageOverlay } from '../common/WashPageOverlay';
import { WithBackdrop } from '../common/WithBackdrop';
import { useWashTrading } from '../contexts/useWashTrading';
import styled from '@emotion/styled';
import { colors } from '../utils/theme';

const WashPageRootWrapper = styled.div`
  position: relative;
  z-index: 10;
  display: flex;
  min-height: 100vh;
  width: 100%:
  height: 100%;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  overflow: hidden;
  background-color: ${colors.violet[100]};
  padding-bottom: 40px;
`;
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
    <WashPageRootWrapper>
      <WashBackground />
      <WithBackdrop shouldDisplayBackdrop={true}>
        <WashPageOverlay />
      </WithBackdrop>
    </WashPageRootWrapper>
  );
}
