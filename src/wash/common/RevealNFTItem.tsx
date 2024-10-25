/** @jsxImportSource @emotion/react */
import { type ReactElement, useMemo } from 'react';
import Image from 'next/image';
import { colors, mq } from '../utils/theme';
import { DEFAULT_NFT_COLOR } from '../utils/constants';
import { getPepeImage } from '../utils/utils';
import styled from '@emotion/styled';
import { RevealsBackground } from './RevealBackground';
import type { TNFTItem } from '../types/types';
import { Alignment, Fit, Layout, useRive } from '@rive-app/react-canvas';
import { titanOne } from './WithFonts';

type TRevealNFTItem = {
  label: string;
  nft: TNFTItem;
  isRevealing: boolean;
};

/**************************************************************************************************
 * Defining the styled components style for the RevealNFTItem component
 *************************************************************************************************/
const RevealNFTContainer = styled.div<{ backgroundColor: string }>`
  border-radius: 4px;
  background-color: ${(props) => props.backgroundColor};
  width: 320px;
  height: 320px;
  border-radius: 24px;
  ${mq[1]} {
    width: 216px;
    height: 216px;
  }
`;
const NFTLabelBox = styled.div<{ backgroundColor: string }>`
  position: absolute;
  top: -12px;
  left: 50%;
  transform: translateX(-50%) skewX(-6deg);
  border-radius: 4px;
  font-size: 12px;
  line-height: 12px;
  font-weight: 900;
  text-align: center;
  text-transform: uppercase;
  width: 100px;
  height: 24px;
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${(props) => props.backgroundColor};
`;
const NFTLabel = styled.h2<{ isRevealing: boolean }>`
  opacity: ${(props) => (props.isRevealing ? 0 : 1)};
  transition: opacity 0.5s ease-in-out;
`;
const NFTLabelSkeleton = styled.h2<{ isRevealing: boolean }>`
  animation: ${(props) =>
    props.isRevealing
      ? 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite'
      : 'none'};
  opacity: ${(props) => (props.isRevealing ? 1 : 0)};
  transition: opacity 0.5s ease-in-out;
`;

const NFTImageBox = styled.div<{
  backgroundColor: string;
  borderColor: string;
}>`
  position: relative;
  border-radius: 24px;
  width: 320px;
  height: 320px;
  overflow: hidden;
  background-color: ${(props) => props.backgroundColor};
  border: 4px solid ${(props) => props.borderColor};

  ${mq[1]} {
    width: 216px;
    height: 216px;
  }
`;
const NFTImage = styled(Image)<{ isRevealing: boolean }>`
  opacity: ${(props) => (props.isRevealing ? 0 : 1)};
  transition: opacity 0.5s ease-in-out;
  position: absolute;
  width: 320px;
  height: 320px;
  inset: 0;

  ${mq[1]} {
    width: 216px;
    height: 216px;
  }
`;
const NFTImageSkeleton = styled.div<{ isRevealing: boolean }>`
  animation: ${(props) =>
    props.isRevealing
      ? 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite'
      : 'none'};
  opacity: ${(props) => (props.isRevealing ? 1 : 0)};
  transition: opacity 0.5s ease-in-out;
  position: absolute;
  inset: 0;
  width: 320px;
  height: 320px;
  background-color: ${colors.violet[600]};
`;

const NFTNameBox = styled.div<{ backgroundColor: string }>`
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  left: 50%;
  transform: translateX(-50%) skewX(-6deg);
  bottom: -30px;
  border-radius: 16px;
  background-color: ${(props) => props.backgroundColor};
  height: 64px;
  width: 242px;
  padding: 0 16px;
`;
const NFTName = styled.span<{ isRevealing: boolean }>`
  opacity: ${(props) => (props.isRevealing ? 0 : 1)};
  transition: opacity 0.5s ease-in-out;
  transform: skewX(6deg);
  ${titanOne.style};
  color: white;
  text-transform: uppercase;
  font-size: 20px;
  line-height: 20px;
  text-align: center;
`;

const RiveBox = styled.div<{ isRevealing: boolean }>`
  position: absolute;
  inset: 2px;
  overflow: hidden;
  border-radius: 24px;
  opacity: ${(props) => (props.isRevealing ? 1 : 0)};
  transition: opacity 0.5s ease-in-out;
`;

/**********************************************************************************************
 * RevealNFTItem Component
 *
 * This component renders an NFT item with reveal functionality. It displays the NFT's image,
 * label, and name, and handles the revealing animation state.
 *
 * Props:
 * - label: string - The label to display for the NFT
 * - nft: TNFTItem - The NFT object containing details like name, rarity, and progress
 * - isRevealing: boolean - Whether the NFT is currently in the revealing state
 *
 * The component uses styled components for styling and handles different visual states based on
 * whether the NFT is rare and if it's currently being revealed.
 ************************************************************************************************/
export function RevealNFTItem({
  label,
  nft,
  isRevealing,
}: TRevealNFTItem): ReactElement {
  const colorToUse = useMemo(() => {
    if (isRevealing) {
      return colors.violet;
    }
    return nft.isRare ? colors.orange : colors.violet;
  }, [isRevealing, nft.isRare]);

  const { RiveComponent } = useRive({
    src: '/wash/rive/reveal/rive.riv',
    stateMachines: 'State Machine 1',
    layout: new Layout({
      fit: Fit.None,
      alignment: Alignment.Center,
    }),
    autoplay: true,
  });

  return (
    <div style={{ position: 'relative' }}>
      <RevealNFTContainer backgroundColor={colorToUse[800]}>
        <NFTLabelBox backgroundColor={colorToUse[800]}>
          <NFTLabelSkeleton isRevealing={isRevealing} />
          <NFTLabel isRevealing={isRevealing}>{label}</NFTLabel>
        </NFTLabelBox>
        <NFTImageBox
          backgroundColor={
            !isRevealing && nft.isRare ? colors.gold[800] : colorToUse[800]
          }
          borderColor={colorToUse[700]}
        >
          <NFTImageSkeleton isRevealing={isRevealing} />
          <NFTImage
            isRevealing={isRevealing}
            unoptimized
            src={
              nft.imageUri ||
              `/wash/cleaning-stage/${getPepeImage(100, nft?.color ?? DEFAULT_NFT_COLOR)}` ||
              ''
            }
            alt={'nft-image'}
            width={320}
            height={320}
          />
        </NFTImageBox>
        <RiveBox isRevealing={isRevealing}>
          <RiveComponent />
        </RiveBox>

        <RevealsBackground isRare={!isRevealing && nft.isRare} />
      </RevealNFTContainer>

      <NFTNameBox backgroundColor={colorToUse[800]}>
        <NFTName isRevealing={isRevealing}>
          {nft.isRare ? 'ser Golden Bridgealot' : 'ser basic Bridgealot'}
        </NFTName>
      </NFTNameBox>
    </div>
  );
}
