import { CustomInformation } from 'src/types/loyaltyPass';
import { ConfigContext } from '../widgetConfig/types';

export interface EntityWidgetProps {
  customInformation?: CustomInformation;
}

export interface WidgetProps extends EntityWidgetProps {
  ctx: ConfigContext;
}
