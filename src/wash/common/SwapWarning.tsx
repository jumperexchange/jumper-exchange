import styled from '@emotion/styled';
import type { ReactElement } from 'react';
import { IconInfo } from './icons/IconInfo';

const Warning = styled.div`
  background-color: #ffe5004d;
  border: 2px solid #ffc700;
  backdrop-filter: blur(32px);
  box-shadow: 6px 6px 0px 0px #ffb800;
  border-radius: 28px;
  color: white;
  padding: 1rem 1.5rem;
  display: flex;
  gap: 1rem;
  font-weight: 500;
  align-items: center;
`;
const WarningHeading = styled.p`
  font-size: 14px;
  line-height: 20px;
  color: white;
  font-weight: 700;
  text-transform: uppercase;
`;
const WarningText = styled.p`
  font-size: 14px;
  line-height: 20px;
  color: white;
`;
const WarningContent = styled.div`
  display: flex;
  flex-direction: column;
`;
const WarningIcon = styled(IconInfo)`
  color: #ffc700;
  min-width: 23px;
`;

export function SwapWarning(): ReactElement {
  return (
    <Warning>
      <WarningIcon color={'#835E00'} />
      <WarningContent>
        <WarningHeading>Warning</WarningHeading>
        <WarningText>
          Pls anon! Don't close this tab while swapping or you might lose your
          progress!
        </WarningText>
      </WarningContent>
    </Warning>
  );
}
