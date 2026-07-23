import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import Box from '@mui/material/Box';
import type { Theme } from '@mui/material/styles';
import { useRouter } from 'next/navigation';
import type { ElementType } from 'react';
import { useTranslation } from 'react-i18next';
import { TabFeatureBadge } from '@/components/FeatureBadge/TabFeatureBadge';
import { prepareWidgetSurfaceNavigation } from '@/components/Widgets/variants/widgetConfig/utils';
import { CandlestickChartIcon } from '@/components/illustrations/CandlestickChartIcon';
import {
  TrackingAction,
  TrackingCategory,
  TrackingEventParameter,
} from '@/const/trackingKeys';
import { useAdvancedAccess } from '@/hooks/useAdvancedAccess';
import { usePathnameWithoutLocale } from '@/hooks/routing/usePathnameWithoutLocale';
import { useUserTracking } from '@/hooks/userTracking/useUserTracking';

const normalizeVerticalTabPath = (path: string) => {
  const withLeadingSlash = path.startsWith('/') ? path : `/${path}`;
  return withLeadingSlash.replace(/\/+$/, '') || '/';
};

export const useVerticalTabs = () => {
  const { trackEvent } = useUserTracking();
  const router = useRouter();
  const pathname = usePathnameWithoutLocale();
  const { t } = useTranslation();
  const { isAllowed: advancedAllowed } = useAdvancedAccess();

  const handleClickTab = (path: string, label: string) => () => {
    const targetPath = normalizeVerticalTabPath(path === '' ? '/' : path);
    const currentPath = normalizeVerticalTabPath(pathname || '/');
    if (currentPath === targetPath) {
      return;
    }

    prepareWidgetSurfaceNavigation();
    router.push(`/${path}`);
    trackEvent({
      category: TrackingCategory.Navigation,
      action: TrackingAction.SwitchTab,
      label: `switch_tab_to_${label}`,
      data: { [TrackingEventParameter.Tab]: label },
      disableTrackingTool: [],
      enableAddressable: true,
    });
  };

  const advancedDisabled = !advancedAllowed;

  const tabs: {
    path: string;
    label: string;
    displayLabel: string;
    icon: ElementType;
    featureKey?: string;
    disabled: boolean;
  }[] = [
    {
      path: '',
      label: 'simple',
      displayLabel: t('navbar.links.simple'),
      icon: SwapHorizIcon,
      disabled: false,
    },
    {
      path: 'advanced/',
      label: 'advanced',
      displayLabel: t('navbar.links.advanced'),
      icon: CandlestickChartIcon,
      featureKey: 'widget-advanced',
      disabled: advancedDisabled,
    },
  ];

  return tabs.map(
    (
      { path, label, displayLabel, icon: Icon, featureKey, disabled },
      index,
    ) => ({
      onClick: handleClickTab(path, label),
      value: index,
      tooltip: displayLabel,
      disabled,
      icon: (
        <Box sx={{ position: 'relative', display: 'inline-flex' }}>
          <Icon
            sx={(theme: Theme) => ({
              color: disabled
                ? (theme.vars || theme).palette.iconDisabled
                : (theme.vars || theme).palette.text.primary,
            })}
          />
          {featureKey ? (
            <TabFeatureBadge featureKey={featureKey} disabled={disabled} />
          ) : null}
        </Box>
      ),
    }),
  );
};
