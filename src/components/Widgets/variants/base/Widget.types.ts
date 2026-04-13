import type { CustomInformation } from 'src/types/loyaltyPass';
import type { WidgetContext, WidgetType } from '../widgetConfig/types';
import type { FormRef } from '@lifi/widget';
import { WidgetFeeConfig } from '@lifi/widget';

export interface EntityWidgetProps {
  customInformation?: Partial<CustomInformation>;
}

export interface WidgetProps extends EntityWidgetProps {
  ctx: WidgetContext;
  type: WidgetType;
  formRef?: FormRef;
}
