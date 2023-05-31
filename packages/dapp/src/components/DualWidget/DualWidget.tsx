import { WidgetVariant } from '@lifi/widget';
import { Fade, Grid, useTheme } from '@mui/material';
import {
  LOCAL_STORAGE_WALLETS_KEY,
  TestnetAlert,
} from '@transferto/shared/src';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { shallow } from 'zustand/shallow';
import { DexsAndBridgesInfosProvider } from '../../providers/DexsAndBridgesInfosProvider';
import { useWallet } from '../../providers/WalletProvider';
import { useSettingsStore } from '../../stores';
import { LinkMap } from '../../types/';
import { NavbarHeight } from '../Navbar/Navbar.style';
import { OnRamper } from '../OnRamper';
import { WelcomeWrapper } from '../WelcomeWrapper';
import { Widget } from '../Widget';
import { WidgetContainer } from './DualWidget.style';
import { WidgetEvents } from './WidgetEvents';

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

  const handleGetStarted = async (event) => {
    const classList = event?.target?.classList;
    if (
      classList?.contains?.('stats-card') ||
      classList?.contains?.('link-lifi')
    ) {
      return 0;
    } else {
      event.stopPropagation();
      setShowFadeOut(true);
      await setTimeout(() => {
        // setShowWelcome(false);
      }, 600);
    }
  };

  const isWalletConnected = useMemo(() => {
    const activeWallet = JSON.parse(
      localStorage.getItem(LOCAL_STORAGE_WALLETS_KEY),
    );
    return activeWallet?.length > 0 || false;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [account.isActive]);

  const showWelcomeWrapper = !isWalletConnected && showWelcome;

  useEffect(() => {
    getActiveWidget();
  }, [getActiveWidget, starterVariant, activeTab]);

  return (
    <DexsAndBridgesInfosProvider>
      <WelcomeWrapper
        showWelcome={showWelcomeWrapper}
        showFadeOut={showFadeOut}
        handleGetStarted={handleGetStarted}
      >
        <Grid
          justifyContent="center"
          alignItems="center"
          container
          sx={{
            overflow: 'hidden',
            position:
              showWelcomeWrapper && !showFadeOut
                ? 'absolute'
                : showWelcomeWrapper && showFadeOut
                ? 'relative'
                : 'relative',
            // top: showWelcomeWrapper ? `-${NavbarHeight.SM}` : 'inherit', // 12.5%            },
            height: showWelcomeWrapper && !showFadeOut ? '50%' : '100%',
            transition: 'opacity 500ms',
            top: showWelcomeWrapper && !showFadeOut ? 0 : NavbarHeight.SM,
            zIndex: showWelcomeWrapper ? '1300' : 'inherit',
            // [theme.breakpoints.up('sm' as Breakpoint)]: {
            //   position: 'relative',
            //   // top: showWelcomeWrapper ? `-${NavbarHeight.SM}` : 'inherit', // 12.5%            },
            // },
            // [theme.breakpoints.up('md' as Breakpoint)]: {
            //   top: showWelcomeWrapper ? `-${NavbarHeight.LG}` : 'inherit', // 12.5%            },
            // },
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
              showWelcome={showWelcomeWrapper}
              showFadeOut={showFadeOut}
              isActive={_starterVariant === 'expandable'}
              sx={{
                opacity: '1',
                transition: 'opacity 500ms',
                zIndex: 100,
              }}
            >
              <Widget starterVariant={'expandable'} />
            </WidgetContainer>
          </Fade>
          <WidgetContainer
            item
            xs={12}
            onClick={handleGetStarted}
            showWelcome={showWelcomeWrapper}
            showFadeOut={showFadeOut}
            isActive={_starterVariant === 'refuel'}
          >
            <Widget starterVariant={'refuel'} />
          </WidgetContainer>
          {import.meta.env.VITE_ONRAMPER_ENABLED ? (
            <WidgetContainer
              item
              xs={12}
              onClick={handleGetStarted}
              showWelcome={showWelcomeWrapper}
              showFadeOut={showFadeOut}
              isActive={_starterVariant === 'buy'}
            >
              <OnRamper />
            </WidgetContainer>
          ) : null}
          <WidgetEvents />
        </Grid>
      </WelcomeWrapper>
    </DexsAndBridgesInfosProvider>
  );
}
