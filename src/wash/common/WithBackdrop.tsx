'use client';

import { Fragment, useMemo } from 'react';
import { DashboardLayout } from '../layouts/DashboardLayout';
import styled from '@emotion/styled';

import type { ReactElement, ReactNode } from 'react';
import { mq, colors } from '../utils/theme';
import { useAccount } from '@lifi/wallet-management';
import { ChainType } from '@lifi/sdk';
import { useWashTrading } from '../contexts/useWashTrading';

/**************************************************************************************************
 * Defining the styled components style for the WithBackdrop component
 *************************************************************************************************/
const BackdropWrapper = styled.div<{ shouldDisplayBackdrop: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  z-index: 20;
  display: flex;
  height: 100%;
  width: 100%;
  justify-content: center;
  transition: opacity 1s ease-in-out;
  opacity: ${({ shouldDisplayBackdrop }) => (shouldDisplayBackdrop ? 1 : 0)};
  pointer-events: ${({ shouldDisplayBackdrop }) =>
    shouldDisplayBackdrop ? 'auto' : 'none'};
`;

const TopBlur = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  z-index: 20;
  height: 50%;
  width: 100%;
  backdrop-filter: blur(8px);
  background: linear-gradient(
    360deg,
    ${colors.violet[100]} 0%,
    rgba(27, 16, 54, 0) 100%
  );
`;
const Background = styled.div`
  position: fixed;
  bottom: 0;
  left: 0;
  z-index: 20;
  height: 50%;
  width: 100%;
  background-color: ${colors.violet[100]};
`;
const ChildrenWrapper = styled.div`
  position: relative;
  z-index: 50;
  margin-top: 420px;
  ${mq[1]} {
    margin-top: 360px;
  }
  ${mq[0]} {
    margin-top: 320px;
  }
`;

/**************************************************************************************************
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
 *************************************************************************************************/
export function WithBackdrop(props: { children: ReactNode }): ReactElement {
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
    <Fragment>
      <BackdropWrapper shouldDisplayBackdrop={shouldDisplayBackdrop}>
        <TopBlur />
        <Background />
        <ChildrenWrapper>{props.children}</ChildrenWrapper>
      </BackdropWrapper>
      <DashboardLayout />
    </Fragment>
  );
}
