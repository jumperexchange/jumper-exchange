import type { CustomInformation } from 'src/types/loyaltyPass';
import type { WidgetContext, WidgetType } from '../widgetConfig/types';
import type { FormRef } from '@jumperexchange/widget';
import { WidgetFeeConfig } from '@jumperexchange/widget';

export interface EntityWidgetProps {
  customInformation?: Partial<CustomInformation>;
}

export interface WidgetProps extends EntityWidgetProps {
  ctx: WidgetContext;
  type: WidgetType;
  formRef?: FormRef;
  isLoading?: boolean;
  /** Fires whenever LiFiWidget is mounted/shown (including after readiness remounts). */
  onFormReady?: () => void;
}
