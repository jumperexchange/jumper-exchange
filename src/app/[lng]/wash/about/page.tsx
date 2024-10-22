'use client';

import type { ReactElement } from 'react';
import { Button } from 'src/wash/common/Button';
import { RaysBackground } from 'src/wash/common/RaysBackground';
import {
  useWashTrading,
  WashTradingContextApp,
} from 'src/wash/contexts/useWashTrading';
import styled from '@emotion/styled';
import Image from 'next/image';
import { Alignment, Fit, Layout, useRive } from '@rive-app/react-canvas';
import { ChainType } from '@lifi/sdk';
import { useAccount, useWalletMenu } from '@lifi/wallet-management';
import { useRouter } from 'next/navigation';
import { titanOne } from 'src/wash/common/WithFonts';

const Wrapper = styled.div`
  position: relative;
  padding-top: 220px;
  z-index: 10;
  display: flex;
  max-height: 1800px;
  min-height: 100vh;
  width: 100%;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  overflow: hidden;
`;

const Content = styled.div`
  display: flex;
  height: min-content;
  width: 100%;
  max-width: 72rem;
  justify-content: center;
  padding-top: 1.5rem;
`;

const Heading = styled.h1`
  font-family: ${titanOne.style.fontFamily};
  font-size: 56px;
  line-height: 56px;
  text-transform: uppercase;
  color: white;
  text-align: center;
  margin-bottom: 1rem;
`;

const Description = styled.p`
  text-align: center;
  font-size: 1.5rem;
  line-height: 2rem;
  color: white;
`;

const GoldenSpan = styled.span`
  font-weight: 900;
  color: #ffc306;
`;

const ButtonWrapper = styled.div`
  display: flex;
  margin: 40px 0 64px;
  max-width: 1200px;
  justify-content: center;
`;

const HowDoIWash = styled.h2`
  text-align: center;
  font-family: ${titanOne.style.fontFamily};
  font-size: 2.5rem;
  line-height: 3rem;
  text-transform: uppercase;
  color: white;
  margin-top: 60px;
`;

const StepImage = styled(Image)`
  max-width: 360px;
`;

const StepsWrapper = styled.div`
  margin: 40px 0 80px;
  display: flex;
  column-gap: 48px;
  justify-content: center;
`;

const LogoWrapper = styled.div`
  width: 260px;
  height: 170px;
  position: absolute;
  top: 100px;
`;

const RiveCarouselWrapper = styled.div`
  width: 3405px;
  height: 360px;
`;

const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 40px;
`;

function AboutPage(): ReactElement {
  const { mint, nft } = useWashTrading();
  const { account } = useAccount({ chainType: ChainType.SVM });
  const { openWalletMenu } = useWalletMenu();
  const router = useRouter();

  const { RiveComponent: RiveLogo } = useRive({
    src: '/wash/landing-logo.riv',
    autoplay: true,
    stateMachines: 'State Machine 1',
    layout: new Layout({
      fit: Fit.Cover,
      alignment: Alignment.Center,
    }),
  });

  const { RiveComponent: RiveCarousel } = useRive({
    src: '/wash/landing_foam-nft.riv',
    autoplay: true,
    layout: new Layout({
      fit: Fit.Fill,
      alignment: Alignment.Center,
    }),
    stateMachines: 'State Machine 1',
  });

  /************************************************************************************************
   * getButton: Function to determine which button to display based on the current state
   * This function checks the following conditions:
   * 1. If the wallet is not connected, it returns a "Connect wallet" button
   * 2. If the user has an NFT that's not revealed, it returns a "Wash NFT" button
   * 3. Otherwise, it returns a "Mint NFT" button
   ************************************************************************************************/
  const getButton = (): ReactElement => {
    if (!account.isConnected) {
      return (
        <Button
          title={'Connect wallet'}
          theme={'pink'}
          size={'long'}
          onClick={async () => {
            if (!account.isConnected) {
              openWalletMenu();
            }
          }}
        />
      );
    }
    if (nft.hasNFT && !nft.nft?.isRevealed) {
      return (
        <Button
          title={'Wash NFT'}
          theme={'pink'}
          size={'long'}
          onClick={() => router.push('/wash')}
        />
      );
    }
    return (
      <Button
        title={'Mint NFT'}
        theme={'pink'}
        size={'long'}
        onClick={mint.onMint}
        isBusy={mint.isMinting}
      />
    );
  };

  return (
    <Wrapper>
      <RaysBackground />
      <Content />
      <LogoWrapper>
        <RiveLogo />
      </LogoWrapper>

      <ContentWrapper>
        <Heading>{'Swap. wash. and win.'}</Heading>
        <Description>
          {"Trade on Jumper to 'wash clean' your NFT,"}
          <br /> {'reveal a '}
          <GoldenSpan>{'Golden Ser Bridgealot'}</GoldenSpan>
          {' to win big!'}
        </Description>

        <ButtonWrapper>{getButton()}</ButtonWrapper>
        <RiveCarouselWrapper>
          <RiveCarousel />
        </RiveCarouselWrapper>

        <HowDoIWash>{'"How do I wash trade?"'}</HowDoIWash>

        <StepsWrapper>
          <StepImage
            src={'/wash/step-1.png'}
            width={1080}
            height={1080}
            alt={'step-1'}
          />
          <StepImage
            src={'/wash/step-2.png'}
            width={1080}
            height={1080}
            alt={'step-2'}
          />
          <StepImage
            src={'/wash/step-3.png'}
            width={1080}
            height={1080}
            alt={'step-3'}
          />
        </StepsWrapper>
      </ContentWrapper>
    </Wrapper>
  );
}

export default function WithContext(): ReactElement {
  return (
    <WashTradingContextApp>
      <AboutPage />
    </WashTradingContextApp>
  );
}
