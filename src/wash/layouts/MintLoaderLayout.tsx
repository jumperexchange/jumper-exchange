'use client';

import { useState } from 'react';
import Image from 'next/image';
import { titanOne } from '../common/fonts';
import styled from '@emotion/styled';

import type { ReactElement } from 'react';
import { Alignment, Fit, Layout, useRive } from '@rive-app/react-canvas';
import { mq } from '../utils/theme';

/**************************************************************************************************
 * Defining the styled components style for the RiveFallbackWrapper component
 *************************************************************************************************/
const RiveWrapper = styled.div`
  width: 300px;
  height: 360px;
  position: absolute;
  bottom: 100px;
  ${mq[0]} {
    padding-top: 48px;
    width: 200px;
    height: 240px;
  }
  ${mq[1]} {
    padding-top: 32px;
    width: 200px;
    height: 240px;
  }
`;
const RiveFallbackImage = styled(Image)<{ isLoaded: boolean }>`
  transition: opacity 0.5s ease-in;
  position: absolute;
  bottom: 0;
  left: 0;
  width: 300px;
  min-width: 300px;
  height: auto;
  bottom: 37px;
  opacity: ${({ isLoaded }) => (isLoaded ? 0 : 1)};
  ${mq[0]} {
    width: 200px;
    height: 240px;
  }
  ${mq[1]} {
    width: 200px;
    height: 240px;
  }
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
    src: '/wash/rive/mintLoader/rive.riv',
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
        src={'/wash/rive/mintLoader/fallback.png'}
        alt={'logo'}
        width={200}
        height={240}
      />
      <RiveComponent
        width={200}
        height={240}
        style={{
          position: 'absolute',
          opacity: isLoaded ? 1 : 0,
        }}
      />
    </RiveWrapper>
  );
}

/**************************************************************************************************
 * Defining the styled components style for the MintLoaderLayout component
 *************************************************************************************************/
const MintLoaderLayoutContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  padding-top: 28vh;
`;
const MintLoaderLayoutContent = styled.div`
  display: flex;
  position: relative;
  flex-direction: column;
  max-width: 560px;
  align-items: center;
  justify-content: center;
`;
const MintLoaderLayoutTitle = styled.h1`
  text-transform: uppercase;
  color: white;
  font-size: 56px;
  line-height: 56px;
  font-weight: inherit;
  margin-bottom: 16px;
  margin-top: 32px;
  margin-left: 0;
  margin-right: 0;
  text-align: center;
  font-family: ${titanOne.style.fontFamily};
  ${mq[0]} {
    font-size: 32px;
    line-height: 32px;
  }
  ${mq[1]} {
    font-size: 48px;
    line-height: 48px;
  }
`;

/**********************************************************************************************
 * MintLoaderLayout Component
 *
 * This component displays a loading screen for the NFT minting process.
 * It includes an animated image and a title message.
 ************************************************************************************************/
export function MintLoaderLayout(): ReactElement {
  return (
    <MintLoaderLayoutContainer>
      <MintLoaderLayoutContent>
        <RiveFallbackWrapper />
        <MintLoaderLayoutTitle>
          {'One dirty NFt, coming right up...'}
        </MintLoaderLayoutTitle>
      </MintLoaderLayoutContent>
    </MintLoaderLayoutContainer>
  );
}
