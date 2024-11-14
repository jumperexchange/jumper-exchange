import { Fragment, type ReactElement, useMemo } from 'react';
import Image from 'next/image';
import { DEFAULT_NFT_COLOR, TOOLTIP_MESSAGES } from '../utils/constants';
import styled from '@emotion/styled';

import { BoostItem } from './BoostItem';
import { NFTItem } from './NFTItem';
import { RevealRaysBackground } from './RaysBackground';
import { WashProgress } from './WashProgress';

import { colors, mq, WashH2, type TColor } from '../utils/theme';
import type { TItems, TNFTItem } from '../types/types';
import type { TCleaningItem } from '../types/wash';
import { titanOne } from './fonts';
import { InfoTooltip } from './InfoTooltip';

const ImageWrapper = styled.div`
  position: absolute;
  left: -24px;
  right: -24px;
  top: -26px;
  z-index: 50;
  ${mq[0]} {
    display: none;
  }
`;

const MobileImageWrapper = styled.div`
  position: absolute;
  display: none;
  left: -24px;
  top: -28px;
  width: 390px;
  ${mq[0]} {
    display: block;
  }
`;

const StyledImage = styled(Image, {
  shouldForwardProp: (prop) => prop !== 'isSkeleton',
})<{ isSkeleton: boolean }>`
  width: 100%;
  height: auto;
  max-width: 100%;
  transition-property: opacity;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 150ms;
  opacity: ${(props) => (props.isSkeleton ? 0 : 1)};
`;

/************************************************************************************************
/**************************************************************************************************
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
  isSkeleton: boolean;
}): ReactElement {
  return (
    <>
      <MobileImageWrapper>
        <StyledImage
          isSkeleton={props.isSkeleton}
          src={`/wash/stroke-${props.color || DEFAULT_NFT_COLOR}-mobile.png`}
          loading={'eager'}
          priority
          width={1612}
          height={808}
          alt={'stroke'}
        />
      </MobileImageWrapper>
      <ImageWrapper>
        <StyledImage
          isSkeleton={props.isSkeleton}
          src={`/wash/stroke-${props.color || DEFAULT_NFT_COLOR}.png`}
          loading={'eager'}
          priority
          width={1612}
          height={808}
          alt={'stroke'}
        />
      </ImageWrapper>
    </>
  );
}

/**************************************************************************************************
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
  font-size: inherit;
  font-weight: inherit;
  margin: 0;
`;

/**************************************************************************************************
 * ProgressSection Component
 *
 * This component renders the progress section of the NFT block, including a title, info popup,
 * and a progress bar.
 *
 * Props:
 * - isSkeleton: boolean - Indicates if the component is in a loading state
 * - washProgress: number - The current progress value to be displayed
 *
 * The component uses styled components and custom UI elements to create a consistent look
 * with the rest of the application.
 ************************************************************************************************/
function ProgressSection(props: {
  isSkeleton?: boolean;
  washProgress: number;
}): ReactElement {
  return (
    <Fragment>
      <ProgressSectionHeader>
        <ProgressSectionTitle>{'Progress'}</ProgressSectionTitle>
        <InfoTooltip description={TOOLTIP_MESSAGES.progress} />
      </ProgressSectionHeader>
      <WashProgress
        isSkeleton={props.isSkeleton}
        progress={props.washProgress}
      />
    </Fragment>
  );
}

/**************************************************************************************************
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
  font-size: inherit;
  font-weight: inherit;
  margin: 0;
`;
const PowerUpSectionItems = styled.div`
  display: flex;
  width: 100%;
  column-gap: 16px;
`;

/**************************************************************************************************
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
        <InfoTooltip description={TOOLTIP_MESSAGES.powerUp} />
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

/**************************************************************************************************
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
  ${mq[0]} {
    flex-direction: column;
    padding: 24px;
    padding-right: 24px;
    width: 343px;
  }
  ${mq[1]} {
    padding: 32px;
    padding-right: 32px;
  }
`;

const InfoSection = styled.div`
  display: flex;
  z-index: 50;
  margin-top: 42px;
  flex-direction: column;
  align-items: start;
`;

const ImageSection = styled.div`
  display: flex;
  z-index: 50;
  flex-direction: column;
  align-items: center;
`;

type TCurrentNFTBlockProps = {
  nft?: TNFTItem;
  items?: TItems;
  washProgress: number;
  handleUseItem: (item: TCleaningItem) => Promise<void>;
  isSkeleton: boolean;
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
    <>
      <CurrentNFTBlockContainer
        backgroundColor={
          canBeRevealed ? colors.violet[600] : colors.violet[500]
        }
      >
        {canBeRevealed ? <RevealRaysBackground /> : null}
        <BorderStroke
          color={props.nft?.color || DEFAULT_NFT_COLOR}
          isSkeleton={props.isSkeleton}
        />
        <ImageSection>
          <WashH2 style={{ marginBottom: '24px' }}>{'Current NFT'}</WashH2>
          <NFTItem nft={props.nft} isSkeleton={props.isSkeleton} />
        </ImageSection>

        <InfoSection>
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
        </InfoSection>
      </CurrentNFTBlockContainer>
    </>
  );
}
