import styled from '@emotion/styled';
import { Fragment, useEffect, useState, type ReactElement } from 'react';
import { IconInfo } from './icons/IconInfo';
import { useWidgetEvents, WidgetEvent } from '@lifi/widget';
import { mq } from '../utils/theme';

const WarningWrapper = styled.div<{ isMounted: boolean }>`
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
  transition: all 1000ms ease-in-out;
  transform: translateY(${({ isMounted }) => (isMounted ? '0' : '50%')});
  opacity: ${({ isMounted }) => (isMounted ? '1' : '0')};
  width: 408px;
  ${mq[0]} {
    width: 343px;
    margin-bottom: 2rem;
  }
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

function SwapWarning(): ReactElement {
  const [isMounted, set_isMounted] = useState<boolean>(false);

  useEffect(() => {
    setTimeout(() => set_isMounted(true), 300);
  }, []);

  return (
    <WarningWrapper isMounted={isMounted}>
      <WarningIcon color={'#835E00'} />
      <WarningContent>
        <WarningHeading>Warning</WarningHeading>
        <WarningText>
          Pls anon! Don't close this tab while swapping or you might lose your
          progress!
        </WarningText>
      </WarningContent>
    </WarningWrapper>
  );
}

export function SwapWarningWrapper(): ReactElement {
  const [shouldDisplayWarning, set_shouldDisplayWarning] =
    useState<boolean>(false);
  const widgetEvents = useWidgetEvents();

  useEffect(() => {
    const onStarted = async (): Promise<void> => {
      set_shouldDisplayWarning(true);
    };

    const onCompleted = async (): Promise<void> => {
      set_shouldDisplayWarning(false);
    };

    widgetEvents.on(WidgetEvent.RouteExecutionStarted, onStarted);
    widgetEvents.on(WidgetEvent.RouteExecutionUpdated, onStarted);
    widgetEvents.on(WidgetEvent.RouteExecutionFailed, onCompleted);
    widgetEvents.on(WidgetEvent.RouteExecutionCompleted, onCompleted);

    return () => {
      widgetEvents.off(WidgetEvent.RouteExecutionStarted, onStarted);
      widgetEvents.off(WidgetEvent.RouteExecutionUpdated, onStarted);
      widgetEvents.off(WidgetEvent.RouteExecutionFailed, onCompleted);
      widgetEvents.off(WidgetEvent.RouteExecutionCompleted, onCompleted);
    };
  }, [widgetEvents]);

  return shouldDisplayWarning ? <SwapWarning /> : <Fragment />;
}
