/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import styled from '@emotion/styled';
import Image from 'next/image';
import { DEFAULT_NFT_COLOR, TOOLTIP_MESSAGES } from '../utils/constants';
import type { TColor } from '../utils/theme';
import { Absolute, colors, Relative } from '../utils/theme';

import { WashProgress } from './WashProgress';

import type { ReactElement, ReactNode } from 'react';
import type { TNFTItem } from '../types/types';
import { titanOne } from './fonts';
import { getPepeImage } from '../utils/getPepeImage';
import { InfoTooltip } from './InfoTooltip';
import { Button } from './Button';
import { useRouter } from 'next/navigation';

type TNftItemProps = {
  label?: string;
  nft?: TNFTItem;
  progress?: number;
  index: number;
};

/**************************************************************************************************
 * Defining the styled components style for the RevealNFTItem component
 *************************************************************************************************/
const RevealNFTContainer = styled.div`
  border-radius: 4px;
  width: 254px;
  height: 254px;
  border-radius: 16px;
`;
const Label = styled.div<{ backgroundColor: string }>`
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
const RarityLabel = styled.h2`
  transform: skewX(6px);
  color: white;
  text-transform: uppercase;
  font-size: inherit;
  font-weight: inherit;
  margin: 0;
`;

const NFTImage = styled(Image)<{ borderColor: string }>`
  position: relative;
  border-radius: 16px;
  width: 254px;
  height: 254px;
  border: 6px solid ${(props) => props.borderColor};
`;

const KeepWashingButton = styled.div<{ backgroundColor: string }>`
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  width: calc(100% - 12px);
  height: calc(100% - 12px);

  align-items: center;
  justify-content: center;
  border-radius: 10px;
  background-color: ${(props) => props.backgroundColor}CC; // 80% opacity
`;

const WashProgressWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  left: 49%;
  transform: translateX(-50%) skewX(-6deg);
  bottom: -23px;
  border-radius: 16px;
  height: 56px;
  width: 230px;
  padding: 0 8px;
`;

const RevealedLabel = styled.span`
  transform: skewX(6deg);
  ${titanOne.style};
  color: white;
  text-transform: uppercase;
  font-size: 16px;
  line-height: 24px;
  text-align: center;
`;

/************************************************************************************************
 * CollectionNFTItem Component
 *
 * Renders an NFT item card with dynamic content based on the NFT's revealed state and rarity.
 *
 * Props:
 * - nft: TNFTItem - The NFT data including reveal state, rarity, progress etc
 * - index: number - Position index used for tooltip positioning
 ************************************************************************************************/
export function CollectionNFTItem({ nft, index }: TNftItemProps): ReactElement {
  const bgColor = nft?.isRare ? colors.orange[800] : colors.violet[800];
  const borderColor = nft?.isRare ? colors.orange[800] : colors.violet[700];

  const RevealedLabelWrapper = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    position: absolute;
    left: 49%;
    transform: translateX(-50%) skewX(-6deg);
    bottom: -23px;
    border-radius: 16px;
    background-color: ${bgColor};
    height: 56px;
    width: 230px;
    padding: 0 8px;
  `;

  /**********************************************************************************************
   * getRarity
   *
   * Determines the rarity level of an NFT based on its revealed state and rarity flag:
   * - Returns 'legendary' for revealed rare NFTs
   * - Returns 'common' for revealed non-rare NFTs
   * - Returns 'unknown' for unrevealed NFTs
   *
   * Used to apply appropriate styling and labels based on NFT rarity
   **********************************************************************************************/
  function getRarity(): string {
    if (nft?.isRevealed) {
      if (nft?.isRare) {
        return 'legendary';
      }
      return 'common';
    }
    return 'unknown';
  }
  const router = useRouter();

  const StyledWashProgress = styled(WashProgress)`
    margin-top: 0px !important;
    width: 235px;
    border-radius: 12px;
  `;

  /**********************************************************************************************
   * getLabel
   *
   * Renders the label component for an NFT based on its revealed state:
   * - For revealed NFTs: Shows the NFT name with appropriate styling and rarity-based colors
   * - For unrevealed NFTs: Shows a progress bar indicating the washing progress
   *
   * The component uses skewed transforms and absolute positioning for visual styling
   * TODO: transform to proper styled component
   **********************************************************************************************/
  function getLabel(): ReactElement {
    if (nft?.isRevealed) {
      return (
        <RevealedLabelWrapper>
          <RevealedLabel>
            {nft?.isRare ? 'Golden ser Bridgealot' : 'ser basic Bridgealot'}
          </RevealedLabel>
        </RevealedLabelWrapper>
      );
    }
    return (
      <WashProgressWrapper>
        <StyledWashProgress progress={nft?.progress} />
      </WashProgressWrapper>
    );
  }

  /**********************************************************************************************
   * renderNFTImage
   *
   * Renders the NFT image based on its revealed state:
   * - For revealed NFTs: Shows the final NFT image with appropriate border color
   * - For unrevealed NFTs: Shows cleaning stage image with wash progress and "Keep Washing" button
   *
   * The border color and background colors are determined by the NFT's rarity and color properties
   **********************************************************************************************/
  function renderNFTImage(): ReactNode {
    if (nft?.isRevealed) {
      return (
        <Relative>
          <NFTImage
            src={nft?.imageUri ?? ''}
            alt={'nft-image'}
            borderColor={borderColor}
            width={320}
            height={320}
            unoptimized
          />
        </Relative>
      );
    }
    return (
      <Relative>
        <NFTImage
          src={`/wash/cleaning-stage/${getPepeImage(nft?.progress || 0, nft?.color ?? DEFAULT_NFT_COLOR)}`}
          alt={'nft-image'}
          borderColor={borderColor}
          width={320}
          height={320}
        />

        <KeepWashingButton
          backgroundColor={
            colors[(nft?.color || DEFAULT_NFT_COLOR) as TColor][800]
          }
        >
          <Button
            size={'short'}
            title={'keep washing'}
            theme={'white'}
            onClick={() => router.push('/wash')}
          />
        </KeepWashingButton>
      </Relative>
    );
  }

  return (
    <Relative style={{ width: 254 }}>
      <RevealNFTContainer>
        <Label backgroundColor={bgColor}>
          <RarityLabel>{getRarity()}</RarityLabel>
        </Label>
        {renderNFTImage()}
        {nft?.isRare && nft?.isRevealed ? (
          <Absolute top={'12px'} right={'12px'}>
            <InfoTooltip
              description={TOOLTIP_MESSAGES.goldenNft}
              position={index % 4 < 2 ? 'right' : 'left'}
            />
          </Absolute>
        ) : null}
      </RevealNFTContainer>

      {nft?.name && <div>{getLabel()}</div>}
    </Relative>
  );
}
