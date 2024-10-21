'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { titanOne } from '../utils/fonts';
import { cl } from '../utils/utils';

import type { ReactElement } from 'react';

/**********************************************************************************************
 * MintLoaderLayout Component
 *
 * This component displays a loading screen for the NFT minting process.
 * It includes an animated image and a title message.
 *
 * Key features:
 * - Uses Next.js Image component for optimized image loading
 * - Implements a fade-in effect for the image using CSS transitions
 * - Utilizes custom fonts and utility classes for styling
 ************************************************************************************************/
export function MintLoaderLayout(): ReactElement {
  const [isMounted, set_isMounted] = useState<boolean>(false);

  useEffect(() => {
    set_isMounted(true);
  }, []);

  return (
    <div className={'flex w-full items-center justify-center'}>
      <div
        className={
          'relative flex max-w-[560px] flex-col items-center justify-center'
        }
      >
        <div
          className={
            'absolute inset-x-0 flex w-full items-center justify-center'
          }
          style={{ bottom: '166px' }}
        >
          <Image
            src={'/wash/mint-loader.png'}
            priority
            loading={'eager'}
            alt={'nft'}
            width={200}
            height={240}
            className={cl(
              'transition-opacity duration-300',
              isMounted ? 'opacity-100' : 'opacity-0',
            )}
          />
        </div>
        <h1
          className={cl(
            'uppercase text-white',
            'mb-4 mt-8 text-[56px] leading-[56px] text-center',
            titanOne.className,
          )}
        >
          {'One dirty NFt, coming right up...'}
        </h1>
      </div>
    </div>
  );
}
