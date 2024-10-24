'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';
import { Button } from '../common/Button';
import { useWashTrading } from '../contexts/useWashTrading';
import styled from '@emotion/styled';

import type { ReactElement } from 'react';
import { inter } from 'src/fonts/fonts';
import { colors, FitContent } from '../utils/theme';
import { mq } from '../utils/constants';
import { Alignment, Fit, Layout, useRive } from '@rive-app/react-canvas';

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

import { Alignment, Fit, Layout, useRive } from '@rive-app/react-canvas';

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
        alt={''}
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

/************************************************************************************************
 * Defining the styled components style for the CallToActionBox component
 *************************************************************************************************/
const CallToActionBoxWrapper = styled.div<{ isMounted: boolean }>`
  width: 100%;
  border-radius: 32px;
  border: 2px solid ${colors.violet[800]};
  background-color: ${colors.violet[500]};
  box-shadow: 6px 6px 0px 0px ${colors.violet[800]};
  display: flex;
  gap: 4px;
  overflow: hidden;
  transition: all 1000ms ease-in-out;
  transform: translateY(${({ isMounted }) => (isMounted ? '0' : '100%')});
  opacity: ${({ isMounted }) => (isMounted ? '1' : '0')};
  ${mq[0]} {
    width: 800px;
  }
`;

const CallToActionBoxContent = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  gap: 4px;
  padding-top: 28px;
  padding-bottom: 28px;
  padding-right: 32px;
`;

const CallToActionBoxTitle = styled.h3`
  font-size: 24px;
  line-height: 32px;
  font-weight: 900;
  text-transform: uppercase;
  color: #ffffff;
  font-family: ${inter.style.fontFamily};
`;

const CallToActionBoxSubtitle = styled.span`
  color: #ffffff;
  opacity: 0.6;
  font-weight: 500;
  font-family: ${inter.style.fontFamily};
`;

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
    <CallToActionBoxWrapper isMounted={isMounted}>
      <RiveFallbackWrapper />
      <CallToActionBoxContent>
        <div>
          <CallToActionBoxTitle>{props.title}</CallToActionBoxTitle>
          <CallToActionBoxSubtitle>{props.subtitle}</CallToActionBoxSubtitle>
        </div>
        <FitContent>
          <Button
            isBusy={mint.isMinting}
            title={'Mint new NFT'}
            theme={'pink'}
            onClick={mint.onMint}
          />
        </FitContent>
      </CallToActionBoxContent>
    </CallToActionBoxWrapper>
  );
}
