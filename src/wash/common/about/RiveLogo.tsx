import { useState, type ReactElement } from 'react';
import styled from '@emotion/styled';
import { Alignment, Fit, Layout, useRive } from '@rive-app/react-canvas';
import Image from 'next/image';

const LogoWrapper = styled.div`
  width: 260px;
  height: 170px;
  position: absolute;
  top: 100px;
`;
const LogoImage = styled(Image)<{ isLoaded: boolean }>`
  transition: opacity 0.5s ease-in;
  position: absolute;
  top: 0;
  left: 0;
  width: 260px;
  height: 170px;
  min-width: 260px;
  min-height: 170px;
  opacity: ${({ isLoaded }) => (isLoaded ? 0 : 1)};
`;

export default function RiveLogoWrapper(): ReactElement {
  const [isLoaded, set_isLoaded] = useState<boolean>(false);
  const { RiveComponent: RiveLogo, rive } = useRive({
    src: '/wash/about/landing-logo.riv',
    autoplay: true,
    stateMachines: 'State Machine 1',
    layout: new Layout({ fit: Fit.Contain, alignment: Alignment.Center }),
    onLoad: () => {
      set_isLoaded(true);
      setTimeout(() => rive?.play(), 1000);
    },
  });

  return (
    <LogoWrapper>
      <LogoImage
        isLoaded={isLoaded}
        src={'/wash/about/logo.png'}
        alt={'logo'}
        width={260}
        height={170}
      />
      <RiveLogo
        width={260}
        height={170}
        style={{
          position: 'absolute',
          opacity: isLoaded ? 1 : 0,
        }}
      />
    </LogoWrapper>
  );
}
