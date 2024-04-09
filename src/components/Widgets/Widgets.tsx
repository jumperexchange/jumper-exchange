import type { WidgetSubvariant } from '@lifi/widget';
import { Grid, useTheme } from '@mui/material';
import { useCallback, useLayoutEffect, useMemo, useState } from 'react';
import { OnRamper, SolanaAlert, TestnetAlert, Widget } from 'src/components';
import { LinkMap, TabsMap, ThemesMap } from 'src/const';
import { useActiveTabStore, useSettingsStore } from 'src/stores';
import type { StarterVariantType, ThemeVariantType } from 'src/types';
import { WidgetEvents } from './WidgetEvents';
import { WidgetContainer } from './Widgets.style';

export function Widgets() {
  const { activeTab, setActiveTab } = useActiveTabStore();
  const [welcomeScreenClosed, setWelcomeScreenClosed] = useSettingsStore(
    (state) => [state.welcomeScreenClosed, state.setWelcomeScreenClosed],
  );
  const theme = useTheme();
  const [starterVariantUsed, setStarterVariantUsed] = useState(false);
  const [_starterVariant, setStarterVariant] = useState<
    WidgetSubvariant | 'buy'
  >(TabsMap.Exchange.variant);
  //Question: do we want to add a new state for this?
  const [_themeVariant, setThemeVariant] =
    useState<ThemeVariantType>(undefined);

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

  const themeVariant: ThemeVariantType = useMemo(() => {
    let url = window.location.pathname.slice(1);
    if (Object.values(ThemesMap).includes(url as ThemesMap)) {
      if (url.includes(ThemesMap.Memecoins)) {
        //Question: is there a cleaner way to make the navbar not selected?
        setActiveTab(-1);
        return ThemesMap.Memecoins;
      }
    } else {
      return undefined;
    }
  }, [activeTab]);

  const getActiveWidget = useCallback(() => {
    setThemeVariant(themeVariant);

    if (!starterVariantUsed) {
      switch (starterVariant) {
        case TabsMap.Exchange.variant:
          setActiveTab(TabsMap.Exchange.index);
          break;
        case TabsMap.Refuel.variant:
          setActiveTab(TabsMap.Refuel.index);
          break;
        case TabsMap.Buy.variant:
          setActiveTab(TabsMap.Buy.index);
          break;
        default:
          setActiveTab(TabsMap.Exchange.index);
      }
      console.log('heree in the activeWidget');
      console.log(starterVariant);
      setStarterVariant(starterVariant);
      setStarterVariantUsed(true);
    } else {
      switch (activeTab) {
        case TabsMap.Exchange.index:
          setStarterVariant(TabsMap.Exchange.variant);
          break;
        case TabsMap.Refuel.index:
          setStarterVariant(TabsMap.Refuel.variant);
          break;
        case TabsMap.Buy.index:
          setStarterVariant(TabsMap.Buy.variant);
          break;
        default:
          setStarterVariant(TabsMap.Exchange.variant);
      }
    }
  }, [
    activeTab,
    setActiveTab,
    starterVariant,
    starterVariantUsed,
    themeVariant,
  ]);

  const handleCloseWelcomeScreen = () => {
    setWelcomeScreenClosed(true);
  };

  useLayoutEffect(() => {
    getActiveWidget();
  }, [getActiveWidget, starterVariant, activeTab, themeVariant]);

  return (
    <>
      {import.meta.env.MODE === 'testnet' && (
        <Grid item xs={12} mt={theme.spacing(3)}>
          <TestnetAlert />
        </Grid>
      )}
      <WidgetContainer
        onClick={handleCloseWelcomeScreen}
        isActive={_starterVariant === TabsMap.Exchange.variant}
        welcomeScreenClosed={welcomeScreenClosed}
      >
        <Widget
          starterVariant={TabsMap.Exchange.variant as WidgetSubvariant}
          //Question: do we want to merge starterVariant and themeVariant together?
          themeVariant={themeVariant}
        />
      </WidgetContainer>
      <WidgetContainer
        onClick={handleCloseWelcomeScreen}
        isActive={_starterVariant === TabsMap.Refuel.variant}
        welcomeScreenClosed={welcomeScreenClosed}
      >
        <Widget starterVariant={TabsMap.Refuel.variant as WidgetSubvariant} />
      </WidgetContainer>
      <SolanaAlert />
      {import.meta.env.VITE_ONRAMPER_ENABLED ? (
        <WidgetContainer
          onClick={handleCloseWelcomeScreen}
          isActive={_starterVariant === TabsMap.Buy.variant}
          welcomeScreenClosed={welcomeScreenClosed}
        >
          <OnRamper />
        </WidgetContainer>
      ) : null}
      <WidgetEvents />
    </>
  );
}
