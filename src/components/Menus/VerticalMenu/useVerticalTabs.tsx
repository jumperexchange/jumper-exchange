import { useAccount } from '@jumperexchange/wallet-management';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import Box from '@mui/material/Box';
import { useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import { Badge } from '@/components/Badge/Badge';
import { BadgeSize, BadgeVariant } from '@/components/Badge/Badge.styles';
import { CandlestickChartIcon } from '@/components/illustrations/CandlestickChartIcon';
import {
  TrackingAction,
  TrackingCategory,
  TrackingEventParameter,
} from '@/const/trackingKeys';
import { useUserTracking } from '@/hooks/userTracking/useUserTracking';
import { useABTest } from '@/hooks/useABTest';
import { AB_TEST_NAME } from '@/const/abtests';
import {
  GatekeeperStatus,
  useGatekeeperStatus,
} from '@/app/ui/gatekeeper/useGatekeeperStatus';

export const useVerticalTabs = () => {
  const { trackEvent } = useUserTracking();
  const router = useRouter();
  const { t } = useTranslation();
  const widgetAdvancedFlag = useABTest({
    feature: AB_TEST_NAME.WIDGET_ADVANCED,
  });
  const { status: advancedGatekeeperStatus } =
    useGatekeeperStatus('hasAdvanced');

  const handleClickTab = (path: string, label: string) => () => {
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

  const advancedDisabled =
    !widgetAdvancedFlag.isEnabled ||
    advancedGatekeeperStatus !== GatekeeperStatus.SUCCESS;

  const tabs = [
    {
      path: '',
      label: 'simple',
      displayLabel: t('navbar.links.simple'),
      icon: SwapHorizIcon,
      showNewBadge: false,
      disabled: false,
    },
    {
      path: 'advanced/',
      label: 'advanced',
      displayLabel: t('navbar.links.advanced'),
      icon: CandlestickChartIcon,
      showNewBadge: widgetAdvancedFlag.isEnabled,
      disabled: advancedDisabled,
    },
  ];

  return tabs.map(
    (
      { path, label, displayLabel, icon: Icon, showNewBadge, disabled },
      index,
    ) => ({
      onClick: handleClickTab(path, label),
      value: index,
      tooltip: displayLabel,
      disabled,
      icon: (
        <Box sx={{ position: 'relative', display: 'inline-flex' }}>
          <Icon
            sx={(theme) => ({
              color: disabled
                ? (theme.vars || theme).palette.iconDisabled
                : (theme.vars || theme).palette.text.primary,
            })}
          />
          {showNewBadge || disabled ? (
            <Badge
              label={disabled ? t('portfolio.views.soon') : t('promo.new')}
              size={BadgeSize.XS}
              variant={disabled ? BadgeVariant.Secondary : BadgeVariant.New}
              sx={{
                position: 'absolute',
                top: -12,
                right: -12,
                transform: 'scale(0.75)',
                transformOrigin: 'top right',
                pointerEvents: 'none',
              }}
            />
          ) : null}
        </Box>
      ),
    }),
  );
};
