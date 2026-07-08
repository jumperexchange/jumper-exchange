import { TrackingCategory } from '@/const/trackingKeys';
import type { UserTracking } from '@/hooks/userTracking';
import type { TrackTransactionDataProps } from '@/types/userTracking';
import type { JumperEventData } from '@/utils/tracking/jumperTracking';
import type { WidgetEventConfig } from '@/components/Widgets/tracking/types';

interface TrackWidgetOptions {
  enableAddressable?: boolean;
  isConversion?: boolean;
}

export const trackWidgetEvent = (
  tracking: UserTracking,
  config: WidgetEventConfig,
  label: string,
  data: JumperEventData,
  options: TrackWidgetOptions = { enableAddressable: true },
) => {
  tracking.trackEvent({
    category: TrackingCategory.WidgetEvent,
    action: config.action,
    label: config.label ?? label,
    data: { ...data, ...config.extraData } as JumperEventData,
    ...(options.enableAddressable ? { enableAddressable: true } : {}),
  });
};

export const trackWidgetTransaction = (
  tracking: UserTracking,
  config: WidgetEventConfig,
  label: string,
  data: TrackTransactionDataProps,
  options: TrackWidgetOptions = { enableAddressable: true },
) => {
  tracking.trackTransaction({
    category: TrackingCategory.WidgetEvent,
    action: config.action,
    label: config.label ?? label,
    data: { ...data, ...config.extraData } as TrackTransactionDataProps,
    ...(options.enableAddressable ? { enableAddressable: true } : {}),
    ...(options.isConversion ? { isConversion: true } : {}),
  });
};
