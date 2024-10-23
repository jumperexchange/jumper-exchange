/** @jsxImportSource @emotion/react */
import Image from 'next/image';
import { colors } from '../utils/theme';
import { useWashTrading } from '../contexts/useWashTrading';
import { DEFAULT_NFT_COLOR } from '../utils/constants';
import { getPepeImage } from '../utils/utils';
import { css } from '@emotion/react';
import styled from '@emotion/styled';

import { Button } from './Button';
import { WashProgress } from './WashProgress';

import type { ReactElement, ReactNode } from 'react';
import type { TColor } from '../utils/theme';
import type { TNFTItem } from '../types/types';

type TNFTItemProps = {
  label?: string;
  nft?: TNFTItem;
  progress?: number;
  isSkeleton?: boolean;
};

/************************************************************************************************
 * Defining the styled components style for the NFT item component
 *************************************************************************************************/
const Label = styled.div`
  position: absolute;
  top: -12px;
  left: 50%;
  transform: translateX(-50%) skew(-6deg);
  border-radius: 4px;
  background-color: ${colors.violet[300]};
  padding: 4px 10px;
  font-size: 12px;
  font-weight: 900;
  text-transform: uppercase;
  width: 224px;
  height: 224px;
  border-radius: 16px;
  background-color: ${colors.violet[600]};
`;

const NFTSkeleton = styled.div`
  width: 224px;
  height: 224px;
  min-width: 224px;
  min-height: 224px;
  border-radius: 16px;
  background-color: ${colors.violet[600]};
  border: 4px solid ${colors.violet[800]};
`;

const NFTImage = styled(Image)<{ border: string }>`
  position: relative;
  border-radius: 16px;
  width: 224px;
  height: 224px;
  min-width: 224px;
  min-height: 224px;
  border: 4px solid ${(props) => props.border};
`;

const NFTRevealButton = styled.div<{ backgroundColor: string }>`
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  width: 100%;
  height: 100%;
  align-items: center;
  justify-content: center;
  border-radius: 1rem;
  background-color: ${(props) => props.backgroundColor}CC; // 80% opacity
`;

const WashProgressContainer = styled.div`
  position: absolute;
  bottom: -1.75rem;
  left: 50%;
`;

/************************************************************************************************
 * NFTItem Component
 *
 * This component renders an NFT item with various states such as revealed, not revealed, and
 * progress. It uses styled components for styling and handles different conditions to display
 * the appropriate NFT image or skeleton.
 *
 * Props:
 * - label: A string label for the NFT item.
 * - nft: The NFT item object containing details like progress, imageUri, color, etc.
 * - progress: A boolean indicating if the progress bar should be displayed.
 * - isSkeleton: A boolean indicating if the skeleton state should be displayed.
 *
 * The component also includes a reveal button that triggers the onReveal function when clicked.
 *************************************************************************************************/
export function NFTItem({
  label,
  nft,
  progress,
  isSkeleton,
}: TNFTItemProps): ReactElement {
  const { reveal } = useWashTrading();

  /**********************************************************************************************
   * renderNFTImage Function
   *
   * This function renders the appropriate NFT image based on the state of the NFT item.
   * It handles different conditions such as:
   * - If the user has the NFT and the progress is 100%, it displays the final NFT image.
   * - If the user has the NFT and it is revealed, it displays the revealed NFT image.
   * - If the user has the NFT but it is not revealed, it displays a placeholder image.
   * - If the user does not have the NFT, it displays a skeleton placeholder.
   *
   * Returns:
   * - ReactNode: The appropriate NFT image or skeleton placeholder.
   **********************************************************************************************/
  function renderNFTImage(): ReactNode {
    if (isSkeleton) {
      return <NFTSkeleton />;
    }
    if (nft?.progress === 100) {
      return (
        <NFTImage
          src={
            `/wash/${getPepeImage(nft?.progress || 0, nft?.color ?? DEFAULT_NFT_COLOR)}` ??
            ''
          }
          border={colors[(nft?.color || DEFAULT_NFT_COLOR) as TColor][800]}
          alt={'nft-image'}
          width={320}
          height={320}
        />
      );
    }
    if (nft?.isRevealed) {
      return (
        <NFTImage
          src={nft?.imageUri ?? ''}
          alt={'nft-image'}
          border={colors[(nft?.color || DEFAULT_NFT_COLOR) as TColor][800]}
          width={320}
          height={320}
        />
      );
    }
    if (!nft?.isRevealed) {
      return (
        <NFTImage
          src={
            `/wash/${getPepeImage(nft?.progress || 0, nft?.color ?? DEFAULT_NFT_COLOR)}` ??
            ''
          }
          alt={'nft-image'}
          border={colors[(nft?.color || DEFAULT_NFT_COLOR) as TColor][800]}
          width={320}
          height={320}
        />
      );
    }
    return <NFTSkeleton />;
  }

  return (
    <div className={'relative'}>
      {label && (
        <Label>
          <h2 className="uppercase text-white">{label}</h2>
        </Label>
      )}
      {renderNFTImage()}
      {!isSkeleton && nft?.progress === 100 ? (
        <NFTRevealButton
          backgroundColor={
            colors[(nft?.color || DEFAULT_NFT_COLOR) as TColor][800]
          }
        >
          <Button size={'short'} title={'reveal'} onClick={reveal.onReveal} />
        </NFTRevealButton>
      ) : null}

      {progress && (
        <WashProgressContainer>
          <WashProgress
            progress={nft?.progress}
            css={css`
              width: 200px !important;
            `}
          />
        </WashProgressContainer>
      )}
    </div>
  );
}
