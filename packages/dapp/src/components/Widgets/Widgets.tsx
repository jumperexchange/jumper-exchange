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
  const [activeTab, onChangeTab, welcomeScreenEntered, onWelcomeScreenEntered] =
    useSettingsStore(
      (state) => [
        state.activeTab,
        state.onChangeTab,
        state.welcomeScreenEntered,
        state.onWelcomeScreenEntered,
      ],
      shallow,
    );
  const { account } = useWallet();
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
      return;
    } else {
      event.stopPropagation();
      onWelcomeScreenEntered(true);
    }
  };

  const isWalletConnected = useMemo(() => {
    const activeWallet = JSON.parse(
      localStorage.getItem(LOCAL_STORAGE_WALLETS_KEY),
    );
    return activeWallet?.length > 0 || false;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [account.address]);

  const showWelcomeWrapper = !welcomeScreenEntered && !isWalletConnected;

  useLayoutEffect(() => {
    getActiveWidget();
  }, [getActiveWidget, starterVariant, activeTab]);

  return (
    <WelcomeWrapper
      showWelcome={showWelcomeWrapper}
      handleGetStarted={handleGetStarted}
    >
      {import.meta.env.MODE === 'testnet' && (
        <Grid item xs={12} mt={theme.spacing(6)}>
          <TestnetAlert />
        </Grid>
      )}
      <WidgetContainer
        onClick={handleGetStarted}
        showWelcome={showWelcomeWrapper}
        isActive={_starterVariant === 'expandable'}
      >
        <Widget starterVariant={'expandable'} />
      </WidgetContainer>
      <WidgetContainer
        onClick={handleGetStarted}
        showWelcome={showWelcomeWrapper}
        isActive={_starterVariant === 'refuel'}
      >
        <Widget starterVariant={'refuel'} />
      </WidgetContainer>
      {import.meta.env.VITE_ONRAMPER_ENABLED ? (
        <WidgetContainer
          onClick={handleGetStarted}
          showWelcome={showWelcomeWrapper}
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
