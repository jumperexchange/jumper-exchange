import { CustomInformation } from 'src/types/loyaltyPass';
import { WidgetContext, WidgetType } from '../widgetConfig/types';
import { FormRef, WidgetFeeConfig } from '@lifi/widget';

export interface EntityWidgetProps {
  customInformation?: Partial<CustomInformation>;
}

export interface WidgetProps extends EntityWidgetProps {
  ctx: WidgetContext;
  type: WidgetType;
  formRef?: FormRef;
  feeConfig?: WidgetFeeConfig;
}
