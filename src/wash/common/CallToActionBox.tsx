'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { Button } from '../common/Button';
import { useWashTrading } from '../contexts/useWashTrading';
import { inter } from '../utils/fonts';

import type { ReactElement } from 'react';
import styled from '@emotion/styled';
import { colors } from '../utils/theme';
import { mq } from '../utils/constants';

const Wrapper = styled.div<{ isMounted: boolean }>`
  width: 100%;
  border-radius: 32px;
  border: 2px solid ${colors.violet[800]};
  background-color: ${colors.violet[500]};
  box-shadow: 6px 6px 0px 0px #8000ff;
  display: flex;
  flex-direction: row;
  gap: 16px;
  overflow: hidden;
  transition: all 1000ms ease-in-out;
  transform: ${({ isMounted }) =>
    isMounted ? 'translateY(0)' : 'translateY(100%)'};
  opacity: ${({ isMounted }) => (isMounted ? 1 : 0)};

  @media (min-width: 768px) {
    width: 800px;
  }

  ${mq[0]} {
    display: none;
  }
`;

const ContentWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 1.75rem 2rem 1.75rem 0;
`;

const Title = styled.h3`
  font-size: 1.5rem;
  font-weight: 900;
  text-transform: uppercase;
  color: white;
  font-family: ${inter.style.fontFamily};
`;

const Subtitle = styled.span`
  color: rgba(255, 255, 255, 0.6);
  font-weight: 500;
  font-family: ${inter.style.fontFamily};
`;

const ButtonWrapper = styled.div`
  width: fit-content;
`;

const MobileWrapper = styled.div<{ isMounted: boolean }>`
  display: none;
  max-width: 327px;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  padding: 14px;
  overflow: hidden;
  transition: all 1000ms ease-in-out;
  transform: ${({ isMounted }) =>
    isMounted ? 'translateY(0)' : 'translateY(100%)'};
  opacity: ${({ isMounted }) => (isMounted ? 1 : 0)};
  ${mq[0]} {
    display: flex;
  }
`;

const MobileSubtitle = styled.span`
  font-size: 1rem;
  line-height: 1.5rem;
  color: white;
  opacity: 60%;
  text-align: center;
  font-weight: 500;
  max-width: 290px;
  margin: 0.5rem 0 2rem;
  font-family: ${inter.style.fontFamily};
`;

const MobileTitle = styled.h3`
  color: white;
  font-size: 1rem;
  line-height: 1.5rem;
  text-transform: uppercase;
  font-weight: 900;
  font-family: ${inter.style.fontFamily};
`;

const ImageStyled = styled(Image)`
  height: 136px;
  width: 164px;
`;

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
    <>
      <MobileWrapper isMounted={isMounted}>
        <MobileTitle>{props.title}</MobileTitle>
        <MobileSubtitle>{props.subtitle}</MobileSubtitle>
        <Button
          isBusy={mint.isMinting}
          title={'Mint new NFT'}
          theme={'pink'}
          onClick={mint.onMint}
          size={'long'}
        />
      </MobileWrapper>
      <Wrapper isMounted={isMounted}>
        <ImageStyled
          src={'/wash/call-to-action-items.png'}
          alt={'call-to-action-box'}
          width={164}
          height={136}
        />
        <ContentWrapper>
          <div>
            <Title>{props.title}</Title>
            <Subtitle>{props.subtitle}</Subtitle>
          </div>
          <ButtonWrapper>
            <Button
              isBusy={mint.isMinting}
              title={'Mint new NFT'}
              theme={'pink'}
              onClick={mint.onMint}
            />
          </ButtonWrapper>
        </ContentWrapper>
      </Wrapper>
    </>
  );
}
