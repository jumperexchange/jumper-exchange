'use client';

import { type ReactElement } from 'react';
import { RaysBackground } from 'src/wash/common/RaysBackground';
import { WashTradingContextApp } from 'src/wash/contexts/useWashTrading';
import styled from '@emotion/styled';
import Image from 'next/image';
import { titanOne } from 'src/wash/common/WithFonts';
import RiveLogoWrapper from 'src/wash/common/about/RiveLogo';
import { AboutRouterWithContext } from 'src/wash/common/about/AboutRouter';
import RiveSlideshowWrapper from 'src/wash/common/about/RiveSlideshow';
import { mq } from 'src/wash/utils/constants';

const Wrapper = styled.div`
  position: relative;
  padding-top: 220px;
  z-index: 10;
  display: flex;
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

  ${mq[0]} {
    font-size: 40px;
    line-height: 48px;
  }
`;

const Description = styled.p`
  text-align: center;
  font-size: 1.5rem;
  line-height: 2rem;
  color: white;

  ${mq[0]} {
    font-size: 1rem;
    line-height: 1.5rem;
  }
`;

const GoldenSpan = styled.span`
  font-weight: 900;
  color: #ffc306;
`;

const HowDoIWash = styled.h2`
  text-align: center;
  font-family: ${titanOne.style.fontFamily};
  font-size: 2.5rem;
  line-height: 3rem;
  text-transform: uppercase;
  color: white;
  margin-top: 60px;

  ${mq[0]} {
    margin-top: 20px;
  }
`;

const StepImage = styled(Image)`
  max-width: 360px;

  ${mq[0]} {
    max-width: 343px;
  }
`;

const StepsWrapper = styled.div`
  margin: 40px 0 80px;
  display: flex;
  column-gap: 48px;
  justify-content: center;

  ${mq[0]} {
    flex-direction: column;
    gap: 24px;
    justify-content: center;
  }
`;

const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 40px;
  ${mq[0]} {
    width: 100%;
    padding-left: 1rem;
    padding-right: 1rem;
  }
`;

function AboutPage(): ReactElement {
  return (
    <Wrapper>
      <RaysBackground />
      <Content />
      <RiveLogoWrapper />

      <ContentWrapper>
        <Heading>{'Swap. wash. and win.'}</Heading>
        <Description>
          {"Trade on Jumper to 'wash clean' your NFT,"}
          <br /> {'reveal a '}
          <GoldenSpan>{'Golden Ser Bridgealot'}</GoldenSpan>
          {' to win big!'}
        </Description>

        <AboutRouterWithContext />

        <RiveSlideshowWrapper />

        <HowDoIWash>{'"How do I wash trade?"'}</HowDoIWash>

        <StepsWrapper>
          <StepImage
            src={'/wash/about/step-1.png'}
            width={1080}
            height={1080}
            alt={'step-1'}
          />
          <StepImage
            src={'/wash/about/step-2.png'}
            width={1080}
            height={1080}
            alt={'step-2'}
          />
          <StepImage
            src={'/wash/about/step-3.png'}
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
