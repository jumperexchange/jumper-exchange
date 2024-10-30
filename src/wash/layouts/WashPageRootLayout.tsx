'use client';

import { WashBackground } from '../common/WashBackground';
import { WithBackdrop } from '../common/WithBackdrop';
import { WashPageOverlay } from '../common/WashPageOverlay';
import type { ReactElement } from 'react';
import styled from '@emotion/styled';
import { colors } from '../utils/theme';

const WashPageRootWrapper = styled.div`
  position: relative;
  z-index: 10;
  display: flex;
  min-height: 100vh;
  width: 100%:
  height: 100%;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  overflow: hidden;
  background-color: ${colors.violet[100]};
  padding-bottom: 40px;
`;

export function WashPageRootLayout(): ReactElement {
  return (
    <WashPageRootWrapper>
      <WashBackground />
      <WithBackdrop>
        <WashPageOverlay />
      </WithBackdrop>
    </WashPageRootWrapper>
  );
}
