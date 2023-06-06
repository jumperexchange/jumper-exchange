import { WidgetVariant } from '@lifi/widget';
import { Grid, useTheme } from '@mui/material';
import {
  LOCAL_STORAGE_WALLETS_KEY,
  TestnetAlert,
} from '@transferto/shared/src';
import { useCallback, useLayoutEffect, useMemo, useState } from 'react';
import { shallow } from 'zustand/shallow';
import { useWallet } from '../../providers/WalletProvider';
import { useSettingsStore } from '../../stores';
import { LinkMap } from '../../types';
import { OnRamper } from '../OnRamper';
import { WelcomeWrapper } from '../WelcomeWrapper';
import { Widget } from '../Widget';
import { WidgetEvents } from './WidgetEvents';
import { WidgetContainer } from './Widgets.style';

export function Widgets() {
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
      console.log({ showWelcome, showFadeOut });
      await setTimeout(() => {
        setShowWelcome(false);
      }, 2000);
    }
    console.log({ showWelcome, showFadeOut });
  };

  const isWalletConnected = useMemo(() => {
    const activeWallet = JSON.parse(
      localStorage.getItem(LOCAL_STORAGE_WALLETS_KEY),
    );
    return activeWallet?.length > 0 || false;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [account.address]);

  const showWelcomeWrapper = !isWalletConnected && showWelcome;

  useLayoutEffect(() => {
    getActiveWidget();
  }, [getActiveWidget, starterVariant, activeTab]);

  return (
    <WelcomeWrapper
      showWelcome={showWelcomeWrapper}
      showFadeOut={showFadeOut}
      handleGetStarted={handleGetStarted}
    >
      {import.meta.env.MODE === 'testnet' && (
        <Grid item xs={12} mt={theme.spacing(6)}>
          <TestnetAlert />
        </Grid>
      )}
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
          <div className="onramper-wrapper">
            <OnRamper />
          </div>
        </WidgetContainer>
      ) : null}
      <WidgetEvents />
    </WelcomeWrapper>
  );
}
