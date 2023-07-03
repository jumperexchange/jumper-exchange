import { WidgetSubvariant } from '@lifi/widget';
import { Grid, useTheme } from '@mui/material';
import { TestnetAlert } from '@transferto/shared/src';
import { useCallback, useLayoutEffect, useMemo, useState } from 'react';
import { shallow } from 'zustand/shallow';
import { TabsMap } from '../../const/tabsMap';
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
  const [showWelcome, setShowWelcome] = useState(true);
  const theme = useTheme();
  const [starterVariantUsed, setStarterVariantUsed] = useState(false);
  const [_starterVariant, setStarterVariant] = useState<
    WidgetSubvariant | 'buy'
  >('default');

  const starterVariant = useMemo(() => {
    let url = window.location.pathname.slice(1);
    if (Object.values(LinkMap).includes(url as LinkMap)) {
      if (url === LinkMap.Exchange) {
        return 'default';
      } else if (url === LinkMap.Gas || url === LinkMap.Refuel) {
        return 'refuel';
      } else if (url === LinkMap.Buy) {
        return 'buy';
      }
    }
  }, []);

  const getActiveWidget = useCallback(() => {
    if (!starterVariantUsed) {
      starterVariant === 'default'
        ? onChangeTab(TabsMap.Exchange)
        : starterVariant === 'refuel'
        ? onChangeTab(TabsMap.Refuel)
        : starterVariant === 'buy'
        ? onChangeTab(TabsMap.Buy)
        : onChangeTab(TabsMap.Exchange);
      setStarterVariant(starterVariant);
      setStarterVariantUsed(true);
    } else {
      if (activeTab === TabsMap.Exchange) {
        setStarterVariant('default');
      } else if (activeTab === TabsMap.Refuel) {
        setStarterVariant('refuel');
      } else if (activeTab === TabsMap.Buy) {
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
      setShowWelcome(false);
      onWelcomeScreenEntered(true);
    }
  };

  const showWelcomeWrapper = !welcomeScreenEntered && showWelcome;

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
        isActive={_starterVariant === 'default'}
      >
        <Widget starterVariant={'default'} />
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
