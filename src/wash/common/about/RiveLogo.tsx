import type { ReactElement } from 'react';
import styled from '@emotion/styled';
import { Alignment, Fit, Layout, useRive } from '@rive-app/react-canvas';

const LogoWrapper = styled.div`
  width: 260px;
  height: 170px;
  position: absolute;
  top: 100px;
`;

export default function RiveLogoWrapper(): ReactElement {
  const { RiveComponent: RiveLogo } = useRive({
    src: '/wash/landing-logo.riv',
    autoplay: true,
    stateMachines: 'State Machine 1',
    layout: new Layout({
      fit: Fit.Cover,
      alignment: Alignment.Center,
    }),
  });

  return (
    <LogoWrapper>
      <RiveLogo />
    </LogoWrapper>
  );
}
