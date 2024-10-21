'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { titanOne } from '../utils/fonts';
import styled from '@emotion/styled';

import type { ReactElement } from 'react';

/************************************************************************************************
 * Defining the styled components style for the MintLoaderLayout component
 *************************************************************************************************/
const MintLoaderLayoutContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
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
  margin-bottom: 16px;
  margin-top: 32px;
  text-align: center;
  font-family: ${titanOne.style.fontFamily};
`;
const MintLoaderLayoutImageContainer = styled.div`
  position: absolute;
  display: flex;
  width: 100%;
  justify-content: center;
  align-items: center;
  left: 0;
  right: 0;
  bottom: 166px;
`;
const MintLoaderLayoutImage = styled(Image)<{ mounted: boolean }>`
  transition: opacity 300ms ease-in-out;
  opacity: ${({ mounted }) => (mounted ? 1 : 0)};
`;

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
    <MintLoaderLayoutContainer>
      <MintLoaderLayoutContent>
        <MintLoaderLayoutImageContainer>
          <MintLoaderLayoutImage
            src={'/wash/mint-loader.png'}
            priority
            loading={'eager'}
            alt={'nft'}
            width={200}
            height={240}
            mounted={isMounted}
          />
        </MintLoaderLayoutImageContainer>
        <MintLoaderLayoutTitle>
          {'One dirty NFt, coming right up...'}
        </MintLoaderLayoutTitle>
      </MintLoaderLayoutContent>
    </MintLoaderLayoutContainer>
  );
}
