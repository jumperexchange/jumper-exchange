'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';
import { Button } from '../common/Button';
import { useWashTrading } from '../contexts/useWashTrading';
import { cl } from '../utils/utils';
import styled from '@emotion/styled';
import type { ReactElement } from 'react';
import { inter } from 'src/fonts/fonts';
import { Alignment, Fit, Layout, useRive } from '@rive-app/react-canvas';
import { colors } from '../utils/theme';

/**************************************************************************************************
 * Defining the styled components style for the RiveFallbackWrapper component
 *************************************************************************************************/
const RiveWrapper = styled.div`
  width: 164px;
  min-width: 164px;
  height: 136px;
  min-height: 136px;
  position: relative;
`;
const RiveFallbackImage = styled(Image)<{ isLoaded: boolean }>`
  transition: opacity 0.5s ease-in;
  position: absolute;
  bottom: 0;
  left: 0;
  width: 164px;
  min-width: 164px;
  height: 136px;
  min-height: 136px;
  opacity: ${({ isLoaded }) => (isLoaded ? 0 : 1)};
`;

/**************************************************************************************************
 * RiveFallbackWrapper Component
 *
 * This component handles the loading and display of a Rive animation with a fallback image.
 * It uses the useRive hook to load and control the Rive animation, and manages the visibility
 * of the fallback image based on the loading state of the Rive component.
 ************************************************************************************************/
function RiveFallbackWrapper(): ReactElement {
  const [isLoaded, set_isLoaded] = useState<boolean>(false);
  const { RiveComponent, rive } = useRive({
    src: '/wash/rive/callToAction/rive.riv',
    autoplay: true,
    stateMachines: 'State Machine 1',
    layout: new Layout({ fit: Fit.Contain, alignment: Alignment.Center }),
    onLoad: () => {
      set_isLoaded(true);
      setTimeout(() => rive?.play(), 1000);
    },
  });

  return (
    <RiveWrapper>
      <RiveFallbackImage
        isLoaded={isLoaded}
        src={'/wash/rive/callToAction/fallback.png'}
        alt={'logo'}
        width={164}
        height={136}
      />
      <RiveComponent
        width={164}
        height={136}
        style={{
          position: 'absolute',
          opacity: isLoaded ? 1 : 0,
        }}
      />
    </RiveWrapper>
  );
}

/**************************************************************************************************
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
        `w-full rounded-[32px] border-2 border-violet-800 bg-violet-500 shadow-[6px_6px_0px_0px_${colors.violet[800]}] md:w-[800px]`,
        'flex flex-row gap-4 overflow-hidden transition-all duration-1000 ease-in-out',
        isMounted ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0',
      )}
    >
      <RiveFallbackWrapper />
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
