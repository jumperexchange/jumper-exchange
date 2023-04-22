import { WidgetVariant } from '@lifi/widget';
import { Grid } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { TestnetAlert } from '@transferto/shared/src';
import { useSettings } from '@transferto/shared/src/hooks';
import { useCallback, useEffect, useMemo, useState } from 'react';
import ReactGA from 'react-ga4';
import { LinkMap } from '../../types/';
import { OnRamper } from '../OnRamper';
import { Widget } from '../Widget';
import { WidgetContainer } from './DualWidget.style';
import { WidgetEvents } from './WidgetEvents';

export function DualWidget() {
  const settings = useSettings();
  const theme = useTheme();
  const [starterVariantUsed, setStarterVariantUsed] = useState(false);
  const [_starterVariant, setStarterVariant] = useState<WidgetVariant | 'buy'>(
    'expandable',
  );

  const starterVariant = useMemo(() => {
    let url = window.location.pathname.slice(1);
    if (!!url && !!LinkMap[url] && url === LinkMap[url]) {
      ReactGA.send({ hitType: 'pageview', page: `/${url}` });
      if (url === LinkMap.swap) {
        return 'expandable';
      } else if (url === LinkMap.gas || url === LinkMap.refuel) {
        return 'refuel';
      } else if (url === LinkMap.buy) {
        return 'buy';
      }
    }
  }, []);

  const getActiveWidget = useCallback(() => {
    if (!starterVariantUsed) {
      starterVariant === 'expandable'
        ? settings.onChangeTab(0)
        : starterVariant === 'refuel'
        ? settings.onChangeTab(1)
        : settings.onChangeTab(2);
      setStarterVariant(starterVariant);
      setStarterVariantUsed(true);
    } else {
      if (settings.activeTab === 0) {
        setStarterVariant('expandable');
      } else if (settings.activeTab === 1) {
        setStarterVariant('refuel');
      } else if (settings.activeTab === 2) {
        setStarterVariant('buy');
      }
    }
  }, [settings, starterVariant, starterVariantUsed]);

  useEffect(() => {
    getActiveWidget();
  }, [getActiveWidget, starterVariant, settings.activeTab]);

  return (
    <Grid
      justifyContent="center"
      alignItems="center"
      container
      sx={{
        overflowX: 'hidden',
      }}
    >
      {import.meta.env.MODE === 'testnet' && (
        <Grid item xs={12} mt={theme.spacing(6)}>
          <TestnetAlert />
        </Grid>
      )}

      <WidgetContainer item xs={12} isActive={_starterVariant === 'expandable'}>
        <Widget starterVariant={'expandable'} />
      </WidgetContainer>
      <WidgetContainer item xs={12} isActive={_starterVariant === 'refuel'}>
        <Widget starterVariant={'refuel'} />
      </WidgetContainer>
      <WidgetContainer item xs={12} isActive={_starterVariant === 'buy'}>
        <OnRamper />
      </WidgetContainer>
      <WidgetEvents />
    </Grid>
  );
}
