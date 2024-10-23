import styled from '@emotion/styled';
import Image from 'next/image';
import { Fragment, useMemo, type ReactElement } from 'react';
import { DEFAULT_NFT_COLOR, TOOLTIP_MESSAGES } from '../utils/constants';
import { cl } from '../utils/utils';

import { BoostItem } from './BoostItem';
import { InfoPopup } from './InfoPopup';
import { NFTItem } from './NFTItem';
import { RevealRaysBackground } from './RaysBackground';
import { WashProgress } from './WashProgress';

import type { TItems, TNFTItem, TProgress } from '../types/types';
import type { TCleaningItem } from '../types/wash';
import { colors, WashH2, type TColor } from '../utils/theme';
import { titanOne } from './fonts';

/************************************************************************************************
 * BorderStroke Component
 *
 * This component renders a decorative border stroke image for the NFT block.
 *
 * Props:
 * - color: TColor - The color of the stroke image to be used
 * - isSkeleton: boolean - Indicates if the component is in a loading state
 *
 * The component uses Next.js Image for optimized image loading and applies conditional
 * styling based on the isSkeleton prop.
 ************************************************************************************************/
function BorderStroke(props: {
  color: TColor;
  isSkeleton?: boolean;
}): ReactElement {
  return (
    <div className={'absolute -left-7 -top-8 z-50 min-w-[830px]'}>
      <Image
        src={`/wash/stroke-${props.color || DEFAULT_NFT_COLOR}.png`}
        className={cl(
          'size-full transition-opacity',
          props.isSkeleton ? 'opacity-0' : 'opacity-100',
        )}
        loading={'eager'}
        priority
        width={1680}
        height={800}
        alt={'stroke'}
      />
    </div>
  );
}

/************************************************************************************************
 * Defining the styled components style for the ProgressSection component
 *************************************************************************************************/
const ProgressSectionHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
  padding-left: 8px;
`;
const ProgressSectionTitle = styled.h2`
  font-family: ${titanOne.style.fontFamily};
  text-transform: uppercase;
  color: white;
`;

/************************************************************************************************
 * ProgressSection Component
 *
 * This component renders the progress section of the NFT block, including a title, info popup,
 * and a progress bar.
 *
 * Props:
 * - isSkeleton: boolean - Indicates if the component is in a loading state
 * - washProgress: TProgress - The current progress value to be displayed
 *
 * The component uses styled components and custom UI elements to create a consistent look
 * with the rest of the application.
 ************************************************************************************************/
function ProgressSection(props: {
  isSkeleton?: boolean;
  washProgress: TProgress;
}): ReactElement {
  return (
    <Fragment>
      <ProgressSectionHeader>
        <ProgressSectionTitle>{'Progress'}</ProgressSectionTitle>
        <InfoPopup description={TOOLTIP_MESSAGES.progress} />
      </ProgressSectionHeader>
      <WashProgress
        isSkeleton={props.isSkeleton}
        progress={props.washProgress}
      />
    </Fragment>
  );
}

/************************************************************************************************
 * Defining the styled components style for the PowerupSection component
 *************************************************************************************************/
const PowerUpSectionHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 16px;
  padding-left: 8px;
  margin-top: 20px;
`;
const PowerUpSectionTitle = styled.h2`
  font-family: ${titanOne.style.fontFamily};
  text-transform: uppercase;
  color: white;
`;
const PowerUpSectionItems = styled.div`
  display: flex;
  width: 100%;
  column-gap: 16px;
`;

/************************************************************************************************
 * PowerupSection Component
 *
 * This component renders the power-up section of the NFT block, including a title, info popup,
 * and three BoostItem components for different types of power-ups.
 *
 * Props:
 * - isSkeleton: boolean - Indicates if the component is in a loading state
 * - items: TItems - The current items available to the user
 * - handleUseItem: (item: TCleaningItem) => Promise<void> - Function to handle using an item
 * - canBeRevealed: boolean - Indicates if the NFT can be revealed (disables power-ups)
 *
 * The component uses styled components and custom UI elements to create a consistent look
 * with the rest of the application.
 ************************************************************************************************/
function PowerupSection(props: {
  isSkeleton?: boolean;
  items?: TItems;
  handleUseItem: (item: TCleaningItem) => Promise<void>;
  canBeRevealed: boolean;
}): ReactElement {
  return (
    <Fragment>
      <PowerUpSectionHeader>
        <PowerUpSectionTitle>{'Power ups'}</PowerUpSectionTitle>
        <InfoPopup description={TOOLTIP_MESSAGES.powerUp} />
      </PowerUpSectionHeader>
      <PowerUpSectionItems>
        <BoostItem
          isSkeleton={props.isSkeleton}
          boostType={'soap'}
          amount={props.items?.soap ?? 0}
          handleUseItem={props.handleUseItem}
          disabled={props.canBeRevealed}
        />
        <BoostItem
          isSkeleton={props.isSkeleton}
          boostType={'sponge'}
          amount={props.items?.sponge ?? 0}
          handleUseItem={props.handleUseItem}
          disabled={props.canBeRevealed}
        />
        <BoostItem
          isSkeleton={props.isSkeleton}
          boostType={'cleanser'}
          amount={props.items?.cleanser ?? 0}
          handleUseItem={props.handleUseItem}
          disabled={props.canBeRevealed}
        />
      </PowerUpSectionItems>
    </Fragment>
  );
}

/************************************************************************************************
 * Defining the styled components style for the CurrentNFTBlock component
 *************************************************************************************************/
const CurrentNFTBlockContainer = styled.div<{ backgroundColor: string }>`
  position: relative;
  display: flex;
  padding: 32px;
  padding-right: 64px;
  border-radius: 32px;
  border: 4px solid ${colors.violet[800]};
  box-shadow: 6px 6px 0px 0px ${colors.violet[800]};
  background-color: ${({ backgroundColor }) => backgroundColor};
  column-gap: 32px;
`;

type TCurrentNFTBlockProps = {
  nft?: TNFTItem;
  items?: TItems;
  washProgress: TProgress;
  handleUseItem: (item: TCleaningItem) => Promise<void>;
  isSkeleton?: boolean;
};
//TODO: Split this component
export function CurrentNFTBlock(props: TCurrentNFTBlockProps): ReactElement {
  /**********************************************************************************************
   * Determines if the NFT can be revealed based on its progress and current reveal status.
   * An NFT can be revealed when:
   * 1. Its progress is 100% (fully cleaned)
   * 2. It has not been revealed yet
   * This memoized value is used to control the UI and functionality related to NFT revelation.
   *********************************************************************************************/
  const canBeRevealed = useMemo(() => {
    return (props.nft?.progress || 0) === 100 && !props.nft?.isRevealed;
  }, [props.nft?.progress, props.nft?.isRevealed]);

  /**********************************************************************************************
   * Renders the current NFT block with relevant information and controls.
   *********************************************************************************************/
  return (
    <CurrentNFTBlockContainer
      backgroundColor={canBeRevealed ? colors.violet[600] : colors.violet[500]}
    >
      {canBeRevealed ? <RevealRaysBackground /> : null}
      <BorderStroke
        color={props.nft?.color || DEFAULT_NFT_COLOR}
        isSkeleton={props.isSkeleton}
      />
      <div style={{ zIndex: 50 }}>
        <WashH2 style={{ marginBottom: '24px' }}>{'Current NFT'}</WashH2>
        <NFTItem nft={props.nft} isSkeleton={props.isSkeleton} />
      </div>

      <div className={'z-50'} style={{ marginTop: '42px' }}>
        <ProgressSection
          isSkeleton={props.isSkeleton}
          washProgress={props.washProgress}
        />

        <PowerupSection
          isSkeleton={props.isSkeleton}
          items={props.items}
          handleUseItem={props.handleUseItem}
          canBeRevealed={canBeRevealed}
        />
      </div>
    </CurrentNFTBlockContainer>
  );
}
