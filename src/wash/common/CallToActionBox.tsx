'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { Button } from '../common/Button';
import { useWashTrading } from '../contexts/useWashTrading';
import { inter } from '../utils/fonts';
import { cl } from '../utils/utils';

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
export function CallToActionBox(props: {
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
