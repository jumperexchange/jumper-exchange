'use client';

import { Fragment, useCallback, useState } from 'react';
import { Button } from '../common/Button';
import { CurrentNFTBlock } from '../common/CurrentNFTBlock';
import { Modal } from '../common/Modal';
import { QuestsList } from '../common/Quests';
import { useWashTrading } from '../contexts/useWashTrading';
import { inter, titanOne } from '../utils/fonts';
import { cl, widgetConfig } from '../utils/utils';
import { LiFiWidget } from '@lifi/widget';

import type { ReactElement } from 'react';
import type { TCleaningItem } from '../types/wash';

export function DashboardLayout(): ReactElement {
  const [shouldOverkillNumber, set_shouldOverkillNumber] =
    useState<TCleaningItem | null>(null);
  const { items, wash, nft } = useWashTrading();

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
   * @param powerUp - The power-up level to be used (1, 2, or 3)
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
      <Modal
        isOpen={!!shouldOverkillNumber}
        onClose={() => set_shouldOverkillNumber(null)}
      >
        <div className={'flex max-w-[400px] flex-col'}>
          <h1 className={`text-3xl uppercase text-white ${titanOne.className}`}>
            {'Ooooverkill'}
          </h1>
          <p
            className={cl(
              'text-sm text-center mt-4 mb-8 text-white font-medium',
              inter.className,
            )}
          >
            {
              'You’re about to use a boost that gives more % than your current NFT has left. Or you could save it for the next NFT you want to wash. Your call anon.'
            }
          </p>
          <div className={'flex justify-center gap-2 rounded-3xl'}>
            <Button
              title={'Cancel'}
              theme={'white'}
              onClick={() => {
                set_shouldOverkillNumber(null);
              }}
            />
            <Button
              title={'Proceed'}
              theme={'pink'}
              onClick={() => {
                if (!shouldOverkillNumber) {
                  return;
                }
                wash.onWash(shouldOverkillNumber);
                set_shouldOverkillNumber(null);
              }}
            />
          </div>
        </div>
      </Modal>

      <div
        className={
          'relative z-0 mt-40 flex h-min w-full max-w-6xl justify-center gap-6 pt-6'
        }
      >
        <div className={'flex flex-col gap-6'}>
          <div className={'flex flex-col gap-6'}>
            <CurrentNFTBlock
              nft={currentNFT}
              washProgress={currentNFT?.progress ?? 0}
              items={items.items}
              handleUseItem={handleUseItem}
              isSkeleton={!hasNFT}
            />
            <QuestsList isSkeleton={!hasNFT} />
          </div>
        </div>
        <div
          className={cl(
            ' size-min rounded-[32px] border-2 border-violet-800 shadow-[6px_6px_0px_0px_#8000FF]',
          )}
        >
          <LiFiWidget integrator={'Mom'} config={widgetConfig} />
        </div>
      </div>
    </Fragment>
  );
}
