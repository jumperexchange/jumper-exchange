'use client';

import { Fragment, useEffect, useMemo, useState } from 'react';
import { RevealNFTItem } from '../common/RevealNFTItem';
import { useWashTrading } from '../contexts/useWashTrading';
import { countExtraXPFromItems } from '../utils/utils';
import styled from '@emotion/styled';

import type { ReactElement } from 'react';
import { CallToActionBox } from '../common/CallToActionBox';
import { titanOne } from 'src/wash/common/WithFonts';
import { inter } from 'src/fonts/fonts';

/************************************************************************************************
 * Defining the styled components style for the RevealedNFTLayout component
 *************************************************************************************************/
const RevealedNFTLayoutContainer = styled.div<{ mounted: boolean }>`
  position: relative;
  margin-top: -28dvh;
  display: flex;
  width: 100%;
  flex-direction: column;
  align-items: center;
  padding-top: 152px;
  transition:
    opacity 300ms ease-in-out,
    scale 300ms ease-in-out;
  opacity: ${({ mounted }) => (mounted ? 1 : 0)};
  scale: ${({ mounted }) => (mounted ? 1 : 0)};
`;
const RevealedNFTLayoutTitle = styled.h1`
  text-transform: uppercase;
  color: white;
  font-size: 56px;
  line-height: 56px;
  text-align: center;
  font-family: ${titanOne.style.fontFamily};
`;
const RevealedNFTLayoutSubtitle = styled.span`
  color: white;
  margin-top: 8px;
  margin-bottom: 40px;
  font-weight: 500;
  font-size: 1.5rem;
  line-height: 2rem;
  font-family: ${inter.style.fontFamily};
`;
const RevealedNFTLayoutCallToActionBox = styled.div`
  margin-top: 66px;
`;

/************************************************************************************************
 * RevealedNFTLayout Component
 *
 * This component is responsible for displaying the NFT reveal screen. It shows the revealed NFT,
 * its rarity, and associated rewards. The component also includes a call-to-action for minting
 * another NFT.
 *
 * The component relies on the useWashTrading hook for accessing NFT and reveal state data.
 ************************************************************************************************/
export function RevealedNFTLayout(): ReactElement {
  const { reveal, nft, items } = useWashTrading();
  const [isMounted, set_isMounted] = useState<boolean>(false);

  useEffect(() => {
    setTimeout(() => set_isMounted(true), 0); // 0 to make sure the animation is played after a smooth delay
  }, []);

  /**********************************************************************************************
   * currentNFT: Extracts the NFT object from the nft state
   * hasNFT: Extracts the hasNFT boolean from the nft state
   *
   * These lines assign the NFT object and hasNFT boolean from the nft state to local variables
   * for easier access.
   *********************************************************************************************/
  const currentNFT = nft.nft;

  /**********************************************************************************************
   * Determine the title to display based on the reveal state and NFT rarity
   *
   * This useMemo hook calculates the appropriate title for the NFT reveal screen.
   * It considers two factors:
   * 1. Whether the NFT is currently being revealed (isRevealing)
   * 2. The rarity of the NFT (nft?.isRare)
   *********************************************************************************************/
  const title = useMemo(() => {
    if (reveal.isRevealing) {
      return 'Let’s see what you got!';
    }
    return currentNFT?.isRare ? 'Wtf, no way!' : 'Common chad dub';
  }, [reveal.isRevealing, currentNFT?.isRare]);

  /**********************************************************************************************
   * Determine the subtitle to display based on the reveal state and NFT rarity
   *
   * This useMemo hook calculates the appropriate subtitle for the NFT reveal screen.
   * It considers two factors:
   * 1. Whether the NFT is currently being revealed (isRevealing)
   * 2. The rarity of the NFT (nft?.isRare)
   *********************************************************************************************/
  const subtitle = useMemo(() => {
    if (reveal.isRevealing) {
      return 'Loading your NFT, fingers crossed anon!';
    }
    if (currentNFT?.isRare) {
      return '+500 Jumper points';
    }
    return '+5 Jumper points';
  }, [reveal.isRevealing, currentNFT?.isRare]);

  if (!currentNFT) {
    return <Fragment />;
  }

  /**********************************************************************************************
   * Render the RevealNFTLayout component
   *********************************************************************************************/
  return (
    <RevealedNFTLayoutContainer mounted={isMounted}>
      <RevealedNFTLayoutTitle>{title}</RevealedNFTLayoutTitle>
      <RevealedNFTLayoutSubtitle>{subtitle}</RevealedNFTLayoutSubtitle>

      <RevealNFTItem
        nft={currentNFT}
        label={currentNFT?.isRare ? 'Legendary' : 'Common'}
        isRevealing={reveal.isRevealing || reveal.hasCanceledReveal}
      />

      <RevealedNFTLayoutCallToActionBox>
        {!reveal.isRevealing && (
          <CallToActionBox
            title={`up to +${countExtraXPFromItems(items?.items)}% exp on next nft`}
            subtitle={
              'Mint another NFT and receive additional progress from start!'
            }
          />
        )}
      </RevealedNFTLayoutCallToActionBox>
    </RevealedNFTLayoutContainer>
  );
}
