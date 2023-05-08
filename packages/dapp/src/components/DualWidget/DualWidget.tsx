import { WidgetVariant } from '@lifi/widget';
import { Breakpoint, Grid, useMediaQuery, useTheme } from '@mui/material';
import { TestnetAlert } from '@transferto/shared/src';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { shallow } from 'zustand/shallow';
import { useSettingsStore } from '../../stores';
import { LinkMap } from '../../types/';
import { OnRamper } from '../OnRamper';
import { WelcomeWrapper } from '../WelcomeWrapper';
import { Widget } from '../Widget';
import { WidgetContainer } from './DualWidget.style';
import { WidgetEvents } from './WidgetEvents';

export function DualWidget() {
  const [activeTab, onChangeTab] = useSettingsStore(
    (state) => [state.activeTab, state.onChangeTab],
    shallow,
  );
  const [showWelcome, setShowWelcome] = useState(true);
  const [showFadeAnimation, setShowFadeAnimation] = useState(false);
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up('md' as Breakpoint));
  const [starterVariantUsed, setStarterVariantUsed] = useState(false);
  const [_starterVariant, setStarterVariant] = useState<WidgetVariant | 'buy'>(
    'expandable',
  );

  useEffect(() => {
    async function fadeInWidget() {
      // You can await here
      await setTimeout(() => {
        console.log('timeout');
        setShowFadeAnimation(true);
      }, 500); // ...
    }
    fadeInWidget();
  }, []); // Or [] if effect doesn't need props or state

  const starterVariant = useMemo(() => {
    let url = window.location.pathname.slice(1);
    if (Object.values(LinkMap).includes(url as LinkMap)) {
      if (url === LinkMap.Swap) {
        return 'expandable';
      } else if (url === LinkMap.Gas || url === LinkMap.Refuel) {
        return 'refuel';
      } else if (url === LinkMap.Buy) {
        return 'buy';
      }
    }
  }, []);

  const getActiveWidget = useCallback(() => {
    if (!starterVariantUsed) {
      starterVariant === 'expandable'
        ? onChangeTab(0)
        : starterVariant === 'refuel'
        ? onChangeTab(1)
        : starterVariant === 'buy'
        ? onChangeTab(2)
        : onChangeTab(0);
      setStarterVariant(starterVariant);
      setStarterVariantUsed(true);
    } else {
      if (activeTab === 0) {
        setStarterVariant('expandable');
      } else if (activeTab === 1) {
        setStarterVariant('refuel');
      } else if (activeTab === 2) {
        setStarterVariant('buy');
      }
    }
  }, [activeTab, onChangeTab, starterVariant, starterVariantUsed]);

  useEffect(() => {
    getActiveWidget();
  }, [getActiveWidget, starterVariant, activeTab]);

  return (
    <WelcomeWrapper showWelcome={showWelcome} setShowWelcome={setShowWelcome}>
      <Grid
        justifyContent="center"
        alignItems="center"
        container
        sx={{
          overflowX: 'hidden',
          position: showWelcome ? 'absolute' : 'inherit',
          top:
            showWelcome && !isDesktop
              ? '64px'
              : showWelcome && isDesktop
              ? '80px'
              : 'inherit',
          transition: 'opacity 500ms',
          zIndex: showWelcome ? '-1' : 'inherit',
          opacity: showFadeAnimation ? 1 : 0,
          // transition: 'opacity 1s linear',
        }}
      >
        {import.meta.env.MODE === 'testnet' && (
          <Grid item xs={12} mt={theme.spacing(6)}>
            <TestnetAlert />
          </Grid>
        )}
        <WidgetContainer
          item
          xs={12}
          showWelcome={showWelcome}
          isActive={_starterVariant === 'expandable'}
        >
          <Widget starterVariant={'expandable'} />
        </WidgetContainer>
        <WidgetContainer
          item
          xs={12}
          isActive={_starterVariant === 'refuel'}
          showWelcome={showWelcome}
        >
          <Widget starterVariant={'refuel'} />
        </WidgetContainer>
        <WidgetContainer
          item
          xs={12}
          isActive={_starterVariant === 'buy'}
          showWelcome={showWelcome}
        >
          <OnRamper />
        </WidgetContainer>
        <WidgetEvents />
      </Grid>
    </WelcomeWrapper>
  );
}
