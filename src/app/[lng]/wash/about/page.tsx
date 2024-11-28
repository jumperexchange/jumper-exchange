'use client';

import { type ReactElement } from 'react';
import styled from '@emotion/styled';
import RiveLogoWrapper from '../../../../wash/common/about/RiveLogo';
import RiveSlideshowWrapper from '../../../../wash/common/about/RiveSlideshow';
import { RaysBackground } from '../../../../wash/common/RaysBackground';
import { titanOne } from '../../../../wash/common/fonts';
import { mq } from '../../../../wash/utils/theme';
import Link from 'next/link';
import { Button } from 'src/wash/common/Button';

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
  min-height: 100vh;
`;
const ButtonWrapper = styled.div`
  display: flex;
  margin: 40px 0 64px;
  max-width: 1200px;
  justify-content: center;
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
  margin: 0;
  margin-bottom: 1rem;
  font-weight: inherit;
  margin-top: 40px;

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
  margin: 0;

  ${mq[0]} {
    font-size: 1rem;
    line-height: 1.5rem;
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

export default function AboutPage(): ReactElement {
  return (
    <Wrapper>
      <RaysBackground />
      <Content />
      <RiveLogoWrapper />

      <ContentWrapper>
        <Heading>{'jump into the next big thing.'}</Heading>
        <Description>
          {'The game might be over, but head to Jumper'}
          <br />
          {'keep winning with the Jumper Loyalty Pass.'}
        </Description>

        <ButtonWrapper>
          <Link href={'/'}>
            <Button title={'Go to Jumper'} theme={'pink'} size={'long'} />
          </Link>
        </ButtonWrapper>
      </ContentWrapper>
    </Wrapper>
  );
}
