'use client';

import { Fragment, useCallback, useRef, useState } from 'react';
import { Button } from '../common/Button';
import { CurrentNFTBlock } from '../common/CurrentNFTBlock';
import { Modal } from '../common/Modal';
import { QuestsList } from '../common/Quests';
import { useWashTrading } from '../contexts/useWashTrading';
import { widgetConfig } from '../utils/utils';
import type { FormState } from '@lifi/widget';
import { LiFiWidget, WidgetSkeleton } from '@lifi/widget';
import styled from '@emotion/styled';

import type { ReactElement } from 'react';
import type { TCleaningItem } from '../types/wash';
import { colors, WashH1 } from '../utils/theme';
import { mq } from '../utils/theme';
import { SwapWarningWrapper } from '../common/SwapWarning';
import { ClientOnly } from '../../components/ClientOnly';
import { inter } from '../../fonts/fonts';

const ModalContent = styled.div`
  display: flex;
  max-width: 400px;
  flex-direction: column;
`;

const ButtonsWrapper = styled.div`
  display: flex;
  justify-content: center;
  gap: 8px;
  border-radius: 1.5rem;
`;

const OverkillWarning = styled.p`
  font-size: 14px;
  line-height: 20px;
  text-align: center;
  margin: 1rem 0 2rem;
  color: white;
  font-weight: 500;
  font-family: ${inter.style.fontFamily};
`;

/**************************************************************************************************
 * OverkillModal: A modal component to warn users about potential overkill when using an item
 *
 * This component displays a warning modal when a user is about to use a boost that exceeds
 * the remaining progress needed for the current NFT. It provides options to cancel or proceed
 * with the action.
 *
 * Props:
 * - shouldOverkillNumber: The cleaning item that would cause an overkill, or null if not active
 * - set_shouldOverkillNumber: Function to update the overkill state
 ***********************************************************************************************/
export function OverkillModal(props: {
  shouldOverkillNumber: TCleaningItem | null;
  set_shouldOverkillNumber: (item: TCleaningItem | null) => void;
}): ReactElement {
  const { wash } = useWashTrading();

  return (
    <Modal
      isOpen={!!props.shouldOverkillNumber}
      onClose={() => props.set_shouldOverkillNumber(null)}
    >
      <ModalContent>
        <WashH1>{'Ooooverkill'}</WashH1>
        <OverkillWarning>
          {
            'You’re about to use a boost that gives more % than your current NFT has left. Or you could save it for the next NFT you want to wash. Your call anon.'
          }
        </OverkillWarning>
        <ButtonsWrapper>
          <Button
            title={'Cancel'}
            theme={'white'}
            onClick={() => {
              props.set_shouldOverkillNumber(null);
            }}
          />
          <Button
            title={'Proceed'}
            theme={'pink'}
            onClick={() => {
              if (!props.shouldOverkillNumber) {
                return;
              }
              wash.onWash(props.shouldOverkillNumber);
              props.set_shouldOverkillNumber(null);
            }}
          />
        </ButtonsWrapper>
      </ModalContent>
    </Modal>
  );
}

/**************************************************************************************************
 * Defining the styled components style for the DashboardLayout component
 *************************************************************************************************/
const DashboardLayoutContainer = styled.div`
  column-gap: 32px;
  display: flex;
  position: relative;
  z-index: 0;
  margin-top: 10rem;
  height: min-content;
  width: 100%;
  max-width: 1200px;
  flex-direction: row;
  justify-content: center;
  padding-top: 24px;
  ${mq[0]} {
    flex-direction: column-reverse;
    align-items: center;
    row-gap: 24px;
    max-width: 343px;
    margin-top: 5rem;
  }
`;
const WashSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 32px;
  max-width: 760px;

  ${mq[0]} {
    align-items: center;
  }
`;
const SwapSection = styled.div`
  width: 408px;
  min-width: 408px;
  height: min-content;
  border: 2px solid ${colors.violet[800]};
  box-shadow: 6px 6px 0px 0px ${colors.violet[800]};
  border-radius: 32px;

  ${mq[0]} {
    width: 343px;
    max-width: unset;
    min-width: unset;
    border: none;
    box-shadow: none;
  }
`;

const WarngingSwapWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;

  ${mq[1]} {
    gap: 1rem;
  }
`;

/**************************************************************************************************
 * DashboardLayout: Main component for the washing dashboard
 *
 * This component orchestrates the layout and functionality of the NFT washing dashboard.
 * It manages the state for overkill warnings, handles item usage, and renders the main
 * sections of the dashboard including the current NFT block, quests list, and swap widget.
 *
 * The component uses the useWashTrading context to access NFT, item, and washing functionalities.
 ************************************************************************************************/
export function DashboardLayout(): ReactElement {
  const [shouldOverkillNumber, set_shouldOverkillNumber] =
    useState<TCleaningItem | null>(null);
  const { user, wash, nft } = useWashTrading();
  const formRef = useRef<FormState>(null);

  /**********************************************************************************************
   * currentNFT: Extracts the NFT object from the nft state
   * hasNFT: Extracts the hasNFT boolean from the nft state
   *
   * These lines assign the NFT object and hasNFT boolean from the nft state to local variables
   * for easier access.
   *********************************************************************************************/
  const currentNFT = nft.nft;
  const { hasNFT } = nft;

  /**********************************************************************************************
   * handleUseItem: Manages the use of power-up items for washing NFTs
   *
   * This function checks if using a power-up would exceed the remaining progress needed for the
   * NFT. If it would, it sets a state to prompt the user about potential overkill.
   * Otherwise, it proceeds with washing the NFT using the selected power-up.
   *
   * @param item - The cleaning item to be used
   * @returns A Promise that resolves when the action is completed
   *********************************************************************************************/
  const handleUseItem = useCallback(
    async (item: TCleaningItem): Promise<void> => {
      if (currentNFT?.progress && 100 - currentNFT?.progress < item.boost) {
        return set_shouldOverkillNumber(item);
      }
      return wash.onWash(item);
    },
    [currentNFT?.progress, wash],
  );

  return (
    <Fragment>
      <OverkillModal
        shouldOverkillNumber={shouldOverkillNumber}
        set_shouldOverkillNumber={set_shouldOverkillNumber}
      />
      <DashboardLayoutContainer>
        <WashSection>
          <CurrentNFTBlock
            nft={currentNFT}
            washProgress={currentNFT?.progress ?? 0}
            items={user.items}
            handleUseItem={handleUseItem}
            isSkeleton={!hasNFT}
          />
          <QuestsList isSkeleton={!hasNFT} formRef={formRef} />
        </WashSection>
        <WarngingSwapWrapper>
          <SwapSection>
            <ClientOnly fallback={<WidgetSkeleton config={widgetConfig} />}>
              <LiFiWidget
                integrator={'Mom'}
                config={widgetConfig}
                formRef={formRef}
              />
            </ClientOnly>
          </SwapSection>
          <SwapWarningWrapper />
        </WarngingSwapWrapper>
      </DashboardLayoutContainer>
    </Fragment>
  );
}
