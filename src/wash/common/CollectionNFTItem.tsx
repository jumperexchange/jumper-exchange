/** @jsxImportSource @emotion/react */
import Image from 'next/image';
import { colors } from '../utils/theme';
import { DEFAULT_NFT_COLOR } from '../utils/constants';
import { getPepeImage } from '../utils/utils';
import { css } from '@emotion/react';
import styled from '@emotion/styled';

import { WashProgress } from './WashProgress';

import type { ReactElement, ReactNode } from 'react';
import type { TNFTItem } from '../types/types';
import { titanOne } from 'src/wash/common/WithFonts';

type TNftItemProps = {
  label?: string;
  nft?: TNFTItem;
  progress?: number;
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

const NFTImage = styled(Image)<{ borderColor: string }>`
  position: relative;
  border-radius: 16px;
  width: 254px;
  height: 254px;
  border: 6px solid ${(props) => props.borderColor};
`;

/**************************************************************************************************
 *
 *************************************************************************************************/
export function CollectionNFTItem({ nft }: TNftItemProps): ReactElement {
  function getRarity(): string {
    if (nft?.isRevealed) {
      if (nft?.isRare) {
        return 'legendary';
      }
      return 'common';
    }
    return 'unknown';
  }

  function getLabel(): ReactElement {
    if (nft?.isRevealed) {
      return (
        <div
          css={css`
            display: flex;
            justify-content: center;
            align-items: center;
            position: absolute;
            left: 49%;
            transform: translateX(-50%) skewX(-6deg);
            bottom: -23px;
            border-radius: 16px;
            background-color: ${nft?.isRare
              ? colors.orange[800]
              : colors.violet[800]};
            height: 56px;
            width: 230px;
            padding: 0 8px;
          `}
        >
          <span
            css={css`
              transform: skewX(6deg);
              ${titanOne.style};
              color: white;
              text-transform: uppercase;
              font-size: 16px;
              line-height: 24px;
              text-align: center;
            `}
          >
            {nft?.isRare ? 'Golden ser Bridgealot' : 'ser basic Bridgealot'}
          </span>
        </div>
      );
    }
    return (
      <div
        css={css`
          display: flex;
          justify-content: center;
          align-items: center;
          position: absolute;
          left: 49%;
          transform: translateX(-50%) skewX(-6deg);
          bottom: -12px;
          border-radius: 16px;
          height: 56px;
          width: 230px;
          padding: 0 8px;
        `}
      >
        <WashProgress
          progress={nft?.progress}
          className={'!mt-0 w-[235px] !rounded-xl'}
        />
      </div>
    );
  }

  /**********************************************************************************************
   *
   **********************************************************************************************/
  function renderNFTImage(): ReactNode {
    if (nft?.isRevealed) {
      return (
        <NFTImage
          src={nft?.imageUri ?? ''}
          alt={'nft-image'}
          borderColor={nft?.isRare ? colors.orange[800] : colors.violet[700]}
          width={320}
          height={320}
          unoptimized
        />
      );
    }
    return (
      <NFTImage
        src={`/wash/${getPepeImage(nft?.progress || 0, nft?.color ?? DEFAULT_NFT_COLOR)}`}
        alt={'nft-image'}
        borderColor={nft?.isRare ? colors.orange[800] : colors.violet[700]}
        width={320}
        height={320}
      />
    );
  }

  return (
    <div
      css={css`
        position: relative;
        width: 254px;
      `}
    >
      <RevealNFTContainer>
        <Label
          backgroundColor={
            nft?.isRare ? colors.orange[800] : colors.violet[800]
          }
        >
          <h2
            className="uppercase text-white"
            css={css`
              transform: skewX(6px);
            `}
          >
            {getRarity()}
          </h2>
        </Label>
        {renderNFTImage()}
      </RevealNFTContainer>

      {nft?.name && <div>{getLabel()}</div>}
    </div>
  );
}
