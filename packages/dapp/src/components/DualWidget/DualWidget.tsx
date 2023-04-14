import { WidgetVariant } from '@lifi/widget';
import { Grid } from '@mui/material';
import { useCallback, useEffect, useMemo, useState } from 'react';
import ReactGA from 'react-ga4';
import { shallow } from 'zustand/shallow';
import { useSettingsStore } from '../../stores';
import { LinkMap } from '../../types/';
import { Widget } from '../Widget';
import { WidgetContainer } from './DualWidget.style';
import { WidgetEvents } from './WidgetEvents';

export function DualWidget() {
  const [activeTab, onChangeTab] = useSettingsStore(
    (state) => [state.activeTab, state.onChangeTab],
    shallow,
  );
  const [starterVariantUsed, setStarterVariantUsed] = useState(false);
  const [_starterVariant, setStarterVariant] =
    useState<WidgetVariant>('expandable');

  const starterVariant = useMemo(() => {
    let url = window.location.pathname.slice(1);
    if (!!url && !!LinkMap[url] && url === LinkMap[url]) {
      ReactGA.send({ hitType: 'pageview', page: `/${url}` });
      if (url === LinkMap.swap) {
        return 'expandable';
      } else if (url === LinkMap.gas || url === LinkMap.refuel) {
        return 'refuel';
      }
    } else {
      return 'expandable';
    }
  }, []);

  const getActiveWidget = useCallback(() => {
    if (!starterVariantUsed) {
      starterVariant === 'expandable' ? onChangeTab(0) : onChangeTab(1);
      setStarterVariant(starterVariant);
      setStarterVariantUsed(true);
    } else {
      if (activeTab === 0) {
        setStarterVariant('expandable');
      } else if (activeTab === 1) {
        setStarterVariant('refuel');
      }
    }
  }, [activeTab, onChangeTab, starterVariant, starterVariantUsed]);

  useEffect(() => {
    getActiveWidget();
  }, [getActiveWidget, starterVariant, activeTab]);

  return (
    <Grid
      justifyContent="center"
      alignItems="center"
      container
      sx={{
        top: 0,
        display: 'flex',
        overflowX: 'hidden',
      }}
    >
      <WidgetContainer isActive={_starterVariant === 'expandable'}>
        <Widget starterVariant={'expandable'} />
      </WidgetContainer>
      <WidgetContainer isActive={_starterVariant === 'refuel'}>
        <Widget starterVariant={'refuel'} />
      </WidgetContainer>
      <WidgetEvents />
    </Grid>
  );
}
