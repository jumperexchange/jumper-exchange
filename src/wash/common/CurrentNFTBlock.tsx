import { Fragment, type ReactElement, useMemo } from 'react';
import Image from 'next/image';
import { DEFAULT_NFT_COLOR, TOOLTIP_MESSAGES } from '../utils/constants';
import { cl } from '../utils/utils';

import { titanOne } from '../utils/fonts';
import { BoostItem } from './BoostItem';
import { InfoPopup } from './InfoPopup';
import { NFTItem } from './NFTItem';
import { RevealRaysBackground } from './RaysBackground';
import { WashProgress } from './WashProgress';

import { WashH1, type TColor } from '../utils/theme';
import type { TItems, TNFTItem, TProgress } from '../types/types';
import type { TCleaningItem } from '../types/wash';

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
    <div
      className={cl(
        'relative flex h-[344px] w-[776px] gap-x-14 rounded-[32px] border-4 border-violet-800 p-8  shadow-[6px_6px_0px_0px_#8000FF]',
        canBeRevealed ? 'bg-violet-600 overflow-hidde' : 'bg-violet-500',
      )}
    >
      {canBeRevealed ? <RevealRaysBackground /> : null}
      <BorderStroke
        color={props.nft?.color || DEFAULT_NFT_COLOR}
        isSkeleton={props.isSkeleton}
      />
      <div className={'z-50 grid gap-3'}>
        <WashH1>{'Current nft'}</WashH1>
        <NFTItem nft={props.nft} isSkeleton={props.isSkeleton} />
      </div>

      <div className={'z-50 mt-12'}>
        <Fragment>
          <div className={'mb-2 flex items-center gap-2'}>
            <h2 className={`uppercase text-white ${titanOne.className}`}>
              {'Progress'}
            </h2>
            <InfoPopup description={TOOLTIP_MESSAGES.progress} />
          </div>
          <WashProgress
            isSkeleton={props.isSkeleton}
            progress={props.washProgress}
          />
        </Fragment>

        <Fragment>
          <div className={'mt-5 flex items-center gap-2'}>
            <h2 className={`uppercase text-white ${titanOne.className}`}>
              {'Power ups'}
            </h2>
            <InfoPopup description={TOOLTIP_MESSAGES.powerUp} />
          </div>
          <div className={'mt-3 flex w-full justify-between gap-x-4'}>
            <BoostItem
              isSkeleton={props.isSkeleton}
              boostType={'soap'}
              amount={props.items?.item1 ?? 0}
              handleUseItem={props.handleUseItem}
              disabled={canBeRevealed}
            />
            <BoostItem
              isSkeleton={props.isSkeleton}
              boostType={'sponge'}
              amount={props.items?.item2 ?? 0}
              handleUseItem={props.handleUseItem}
              disabled={canBeRevealed}
            />
            <BoostItem
              isSkeleton={props.isSkeleton}
              boostType={'cleanser'}
              amount={props.items?.item3 ?? 0}
              handleUseItem={props.handleUseItem}
              disabled={canBeRevealed}
            />
          </div>
        </Fragment>
      </div>
    </div>
  );
}
