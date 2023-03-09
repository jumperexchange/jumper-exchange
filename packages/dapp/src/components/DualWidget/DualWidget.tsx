import { WidgetVariant } from '@lifi/widget';
import { Grid } from '@mui/material';
import { useSettings } from '@transferto/shared/src/hooks';
import { useCallback, useEffect, useMemo, useState } from 'react';
import ReactGA from 'react-ga';
import { LinkMap } from '../../types/';
import { Widget } from '../Widget';
import { WidgetContainer } from './DualWidget.style';
import { WidgetEvents } from './WidgetEvents';

export function DualWidget() {
  const settings = useSettings();
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
      starterVariant === 'expandable'
        ? settings.onChangeTab(0)
        : settings.onChangeTab(1);
      setStarterVariant(starterVariant);
      setStarterVariantUsed(true);
    } else {
      if (settings.activeTab === 0) {
        setStarterVariant('expandable');
      } else if (settings.activeTab === 1) {
        setStarterVariant('refuel');
      }
    }
  }, [settings, starterVariant, starterVariantUsed]);

  useEffect(() => {
    getActiveWidget();
  }, [getActiveWidget, starterVariant]);

  useEffect(() => {
    getActiveWidget();
  }, [getActiveWidget, settings.activeTab]);

  return (
    <Grid
      justifyContent="center"
      alignItems="center"
      container
      sx={{
        position: 'absolute',
        top: 0,
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        // marginTop: '64px',
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
