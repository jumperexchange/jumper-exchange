import { WidgetVariant } from '@lifi/widget';
import { Breakpoint, Fade, Grid, useTheme } from '@mui/material';
import { TestnetAlert } from '@transferto/shared/src';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { shallow } from 'zustand/shallow';
import { useWallet } from '../../providers/WalletProvider';
import { useSettingsStore } from '../../stores';
import { LinkMap } from '../../types/';
import { NavbarHeight } from '../Navbar/Navbar.style';
import { OnRamper } from '../OnRamper';
import { WelcomeWrapper } from '../WelcomeWrapper';
import { Widget } from '../Widget';
import { GlowBackground } from '../Widget/Widget.style';
import { WidgetContainer } from './DualWidget.style';
import { WidgetEvents } from './WidgetEvents';

export const LOCAL_STORAGE_WALLETS_KEY = 'li.fi-wallets';

export function DualWidget() {
  const [showFadeOut, setShowFadeOut] = useState(false);
  const [activeTab, onChangeTab] = useSettingsStore(
    (state) => [state.activeTab, state.onChangeTab],
    shallow,
  );
  const { account } = useWallet();
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
    await setTimeout(() => {
      setShowWelcome(false);
    }, 300);
  };

  const isWalletConnected = useMemo(() => {
    const activeWallet = JSON.parse(
      localStorage.getItem(LOCAL_STORAGE_WALLETS_KEY),
    );
    return activeWallet?.length > 0 || false;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [account.isActive]);

  useEffect(() => {
    getActiveWidget();
  }, [getActiveWidget, starterVariant, activeTab]);

  return (
    <WelcomeWrapper
      showWelcome={!isWalletConnected && showWelcome}
      showFadeOut={!isWalletConnected && showFadeOut}
      handleGetStarted={handleGetStarted}
    >
      <Grid
        justifyContent="center"
        alignItems="center"
        container
        sx={{
          overflow: 'hidden',
          position: 'absolute',
          top: !isWalletConnected && showWelcome ? NavbarHeight.XS : 'inherit',
          transition: 'opacity 500ms',
          zIndex: !isWalletConnected && showWelcome ? '1' : 'inherit',
          [theme.breakpoints.up('sm' as Breakpoint)]: {
            top:
              !isWalletConnected && showWelcome ? NavbarHeight.SM : 'inherit',
          },
          [theme.breakpoints.up('md' as Breakpoint)]: {
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
            showWelcome={!isWalletConnected && showWelcome}
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
          showWelcome={!isWalletConnected && showWelcome}
          isActive={_starterVariant === 'refuel'}
        >
          <Widget starterVariant={'refuel'} />
          <GlowBackground className="glow-bg" />
        </WidgetContainer>
        <WidgetContainer
          item
          xs={12}
          onClick={handleGetStarted}
          showWelcome={!isWalletConnected && showWelcome}
          isActive={_starterVariant === 'buy'}
        >
          <OnRamper />
        </WidgetContainer>
        <WidgetEvents />
      </Grid>
    </WelcomeWrapper>
  );
}
