import { WidgetVariant } from '@lifi/widget';
import { Breakpoint, Fade, Grid, useTheme } from '@mui/material';
import { TestnetAlert } from '@transferto/shared/src';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { shallow } from 'zustand/shallow';
import { useSettingsStore } from '../../stores';
import { LinkMap } from '../../types/';
import { NavbarHeight } from '../Navbar/Navbar.style';
import { OnRamper } from '../OnRamper';
import { WelcomeWrapper } from '../WelcomeWrapper';
import { Widget } from '../Widget';
import { GlowBackground } from '../Widget/Widget.style';
import { WidgetContainer } from './DualWidget.style';
import { WidgetEvents } from './WidgetEvents';

export function DualWidget() {
  const [showFadeOut, setShowFadeOut] = useState(false);
  const [activeTab, onChangeTab] = useSettingsStore(
    (state) => [state.activeTab, state.onChangeTab],
    shallow,
  );
  const [showWelcome, setShowWelcome] = useState(true);
  const theme = useTheme();
  const [starterVariantUsed, setStarterVariantUsed] = useState(false);
  const [_starterVariant, setStarterVariant] = useState<WidgetVariant | 'buy'>(
    'expandable',
  );

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

  const handleGetStarted = async () => {
    setShowFadeOut(true);
    console.log('handleGetStartet Begin...');
    await setTimeout(() => {
      console.log('timeout');
      setShowWelcome(false);
    }, 300);
  };

  useEffect(() => {
    getActiveWidget();
  }, [getActiveWidget, starterVariant, activeTab]);

  return (
    <WelcomeWrapper
      showWelcome={showWelcome}
      setShowWelcome={setShowWelcome}
      showFadeOut={showFadeOut}
      handleGetStarted={handleGetStarted}
    >
      <Grid
        justifyContent="center"
        alignItems="center"
        container
        sx={{
          overflow: 'hidden',
          position: 'absolute',
          top: showWelcome ? NavbarHeight.XS : 'inherit',
          transition: 'opacity 500ms',
          zIndex: showWelcome ? '1' : 'inherit',
          [theme.breakpoints.up('sm' as Breakpoint)]: {
            // height: NavbarHeight.SM,
            // paddingTop: theme.spacing(4, 6),
            top: showWelcome ? NavbarHeight.SM : 'inherit',
          },
          [theme.breakpoints.up('md' as Breakpoint)]: {
            // paddingTop: theme.spacing(6),
            // height: NavbarHeight.LG,
            top: showWelcome ? NavbarHeight.LG : 'inherit',
          },
        }}
      >
        {import.meta.env.MODE === 'testnet' && (
          <Grid item xs={12} mt={theme.spacing(6)}>
            <TestnetAlert />
          </Grid>
        )}
        <Fade in={true} easing={{ enter: '500ms' }}>
          <WidgetContainer
            item
            xs={12}
            onClick={handleGetStarted}
            className="widget-container"
            showWelcome={showWelcome}
            isActive={_starterVariant === 'expandable'}
            sx={{ opacity: '1', transition: 'opacity 500ms' }}
          >
            <Widget starterVariant={'expandable'} />
            <GlowBackground className="glow-bg" />
          </WidgetContainer>
        </Fade>
        <WidgetContainer
          item
          xs={12}
          onClick={handleGetStarted}
          showWelcome={showWelcome}
          isActive={_starterVariant === 'refuel'}
        >
          <Widget starterVariant={'refuel'} />
          <GlowBackground className="glow-bg" />
        </WidgetContainer>
        <WidgetContainer
          item
          xs={12}
          onClick={handleGetStarted}
          showWelcome={showWelcome}
          isActive={_starterVariant === 'buy'}
        >
          <OnRamper />
        </WidgetContainer>
        <WidgetEvents />
      </Grid>
    </WelcomeWrapper>
  );
}
