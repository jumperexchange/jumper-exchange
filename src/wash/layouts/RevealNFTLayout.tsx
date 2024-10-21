'use client';

import { Fragment, useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import { Button } from '../common/Button';
import { RevealNFTItem } from '../common/RevealNFTItem';
import { useWashTrading } from '../contexts/useWashTrading';
import { inter, titanOne } from '../utils/fonts';
import { cl, countExtraXPFromItems } from '../utils/utils';

import type { ReactElement } from 'react';

/************************************************************************************************
 * CallToActionBox Component
 *
 * This component renders a call-to-action box with a title, subtitle, and a button.
 * It includes an animation effect that slides the box into view after a delay.
 *
 * Props:
 * - title: string - The main title text for the call-to-action
 * - subtitle: string - The secondary text providing additional context
 ************************************************************************************************/
function CallToActionBox(props: {
  title: string;
  subtitle: string;
}): ReactElement {
  const { mint } = useWashTrading();
  const [isMounted, set_isMounted] = useState<boolean>(false);

  useEffect(() => {
    setTimeout(() => set_isMounted(true), 1000);
  }, []);

  return (
    <div
      className={cl(
        'w-full rounded-[32px] border-2 border-violet-800 bg-violet-500 shadow-[6px_6px_0px_0px_#8000FF] md:w-[800px]',
        'flex flex-row gap-4 overflow-hidden transition-all duration-1000 ease-in-out',
        isMounted ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0',
      )}
    >
      <Image
        src={'/wash/call-to-action-items.png'}
        alt={'call-to-action-box'}
        className={'h-[136px] w-[164px]'}
        width={164}
        height={136}
      />
      <div
        className={'flex flex-row items-center justify-between gap-4 py-7 pr-8'}
      >
        <div>
          <h3
            className={cl(
              'text-2xl font-black uppercase text-white ',
              inter.className,
            )}
          >
            {props.title}
          </h3>
          <span className={cl('text-white/60 font-medium', inter.className)}>
            {props.subtitle}
          </span>
        </div>
        <div className={'w-fit'}>
          <Button
            isBusy={mint.isMinting}
            title={'Mint new NFT'}
            theme={'pink'}
            onClick={mint.onMint}
          />
        </div>
      </div>
    </div>
  );
}

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
    <div
      className={cl(
        'relative mt-[-28dvh] flex w-full flex-col items-center pt-[152px]',
        'transition-all duration-600 ease-in-out',
        isMounted ? 'opacity-100 scale-100' : 'opacity-0 scale-0',
      )}
    >
      <h1
        className={cl(
          'uppercase text-white',
          'text-[56px] text-center leading-[56px]',
          titanOne.className,
        )}
      >
        {title}
      </h1>
      <span
        className={cl(
          'mt-2 mb-10 text-white font-medium text-2xl',
          inter.className,
        )}
      >
        {subtitle}
      </span>

      <RevealNFTItem
        nft={currentNFT}
        label={currentNFT?.isRare ? 'Legendary' : 'Common'}
        isRevealing={reveal.isRevealing}
      />

      <div className={'mt-16 pt-0.5'}>
        {!reveal.isRevealing && (
          <CallToActionBox
            title={`up to +${countExtraXPFromItems(items?.items)}% exp on next nft`}
            subtitle={
              'Mint another NFT and receive additional progress from start!'
            }
          />
        )}
      </div>
    </div>
  );
}
