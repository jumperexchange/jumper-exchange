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
  >(TabsMap.Exchange.value);

  const starterVariant: StarterVariantType = useMemo(() => {
    let url = window.location.pathname.slice(1);
    if (Object.values(LinkMap).includes(url as LinkMap)) {
      if (url === TabsMap.Exchange.value) {
        return TabsMap.Exchange.value;
      } else if (url === TabsMap.Refuel.value) {
        return TabsMap.Refuel.value;
      } else {
        return TabsMap.Buy.value;
      }
    } else {
      return TabsMap.Exchange.value;
    }
  }, []);

  const getActiveWidget = useCallback(() => {
    if (!starterVariantUsed) {
      starterVariant === TabsMap.Exchange.value
        ? setActiveTab(TabsMap.Exchange.index)
        : starterVariant === TabsMap.Refuel.value
        ? setActiveTab(TabsMap.Refuel.index)
        : starterVariant === TabsMap.Buy.value
        ? setActiveTab(TabsMap.Buy.index)
        : setActiveTab(TabsMap.Exchange.index);
      setStarterVariant(starterVariant);
      setStarterVariantUsed(true);
    } else {
      if (activeTab === TabsMap.Exchange.index) {
        setStarterVariant(TabsMap.Exchange.value);
      } else if (activeTab === TabsMap.Refuel.index) {
        setStarterVariant(TabsMap.Refuel.value);
      } else if (activeTab === TabsMap.Buy.index) {
        setStarterVariant(TabsMap.Buy.value);
      }
    }
  }, [activeTab, setActiveTab, starterVariant, starterVariantUsed]);

  const handleGetStarted: MouseEventHandler<HTMLDivElement> = (event) => {
    const classList = (event?.target as HTMLElement)?.classList;
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
        isActive={_starterVariant === TabsMap.Exchange.value}
      >
        <Widget starterVariant={TabsMap.Exchange.value as WidgetSubvariant} />
      </WidgetContainer>
      <WidgetContainer
        onClick={handleGetStarted}
        showWelcome={!welcomeScreenEntered}
        isActive={_starterVariant === TabsMap.Refuel.value}
      >
        <Widget starterVariant={TabsMap.Refuel.value as WidgetSubvariant} />
      </WidgetContainer>
      {import.meta.env.VITE_ONRAMPER_ENABLED ? (
        <WidgetContainer
          onClick={handleGetStarted}
          showWelcome={!welcomeScreenEntered}
          isActive={_starterVariant === TabsMap.Buy.value}
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
