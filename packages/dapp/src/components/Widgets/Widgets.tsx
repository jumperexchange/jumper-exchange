import { WidgetSubvariant } from '@lifi/widget';
import { Grid, useTheme } from '@mui/material';
import { TestnetAlert } from '@transferto/shared/src';
import {
  MouseEventHandler,
  useCallback,
  useLayoutEffect,
  useMemo,
  useState,
} from 'react';
import { TabsMap } from '../../const/tabsMap';
import { useActiveTabStore, useSettingsStore } from '../../stores';
import { LinkMap, StarterVariantType } from '../../types';
import { OnRamper } from '../OnRamper';
import { WelcomeWrapper } from '../WelcomeWrapper';
import { Widget } from '../Widget';
import { WidgetEvents } from './WidgetEvents';
import { WidgetContainer } from './Widgets.style';

export function Widgets() {
  const { activeTab, setActiveTab } = useActiveTabStore();
  const [welcomeScreenEntered, onWelcomeScreenEntered] = useSettingsStore(
    (state) => [state.welcomeScreenEntered, state.onWelcomeScreenEntered],
  );
  const theme = useTheme();
  const [starterVariantUsed, setStarterVariantUsed] = useState(false);
  const [_starterVariant, setStarterVariant] = useState<
    WidgetSubvariant | 'buy'
  >(TabsMap.Exchange.variant);

  const starterVariant: StarterVariantType = useMemo(() => {
    let url = window.location.pathname.slice(1);
    if (Object.values(LinkMap).includes(url as LinkMap)) {
      if (!!TabsMap.Buy.destination.filter((el) => el === url).length) {
        return TabsMap.Buy.variant;
      } else if (
        !!TabsMap.Refuel.destination.filter((el) => el === url).length
      ) {
        return TabsMap.Refuel.variant;
      } else {
        return TabsMap.Exchange.variant;
      }
    } else {
      // default and fallback: Exchange-Tab
      return TabsMap.Exchange.variant;
    }
  }, []);

  const getActiveWidget = useCallback(() => {
    if (!starterVariantUsed) {
      starterVariant === TabsMap.Exchange.variant
        ? setActiveTab(TabsMap.Exchange.index)
        : starterVariant === TabsMap.Refuel.variant
        ? setActiveTab(TabsMap.Refuel.index)
        : starterVariant === TabsMap.Buy.variant
        ? setActiveTab(TabsMap.Buy.index)
        : setActiveTab(TabsMap.Exchange.index);
      setStarterVariant(starterVariant);
      setStarterVariantUsed(true);
    } else {
      if (activeTab === TabsMap.Exchange.index) {
        setStarterVariant(TabsMap.Exchange.variant);
      } else if (activeTab === TabsMap.Refuel.index) {
        setStarterVariant(TabsMap.Refuel.variant);
      } else if (activeTab === TabsMap.Buy.index) {
        setStarterVariant(TabsMap.Buy.variant);
      }
    }
  }, [activeTab, setActiveTab, starterVariant, starterVariantUsed]);

  const handleGetStarted: MouseEventHandler<HTMLDivElement> = (event) => {
    const classList = (event.target as HTMLElement).classList;
    if (
      classList.contains?.('stats-card') ||
      classList.contains?.('link-lifi')
    ) {
      return;
    } else {
      event.stopPropagation();
      onWelcomeScreenEntered(true);
    }
  };

  useLayoutEffect(() => {
    getActiveWidget();
  }, [getActiveWidget, starterVariant, activeTab]);

  return (
    <WelcomeWrapper
      showWelcome={!welcomeScreenEntered}
      handleGetStarted={handleGetStarted}
    >
      {import.meta.env.MODE === 'testnet' && (
        <Grid item xs={12} mt={theme.spacing(6)}>
          <TestnetAlert />
        </Grid>
      )}
      <WidgetContainer
        onClick={handleGetStarted}
        showWelcome={!welcomeScreenEntered}
        isActive={_starterVariant === TabsMap.Exchange.variant}
      >
        <Widget starterVariant={TabsMap.Exchange.variant as WidgetSubvariant} />
      </WidgetContainer>
      <WidgetContainer
        onClick={handleGetStarted}
        showWelcome={!welcomeScreenEntered}
        isActive={_starterVariant === TabsMap.Refuel.variant}
      >
        <Widget starterVariant={TabsMap.Refuel.variant as WidgetSubvariant} />
      </WidgetContainer>
      {import.meta.env.VITE_ONRAMPER_ENABLED ? (
        <WidgetContainer
          onClick={handleGetStarted}
          showWelcome={!welcomeScreenEntered}
          isActive={_starterVariant === TabsMap.Buy.variant}
          sx={{ width: '392px' }}
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
