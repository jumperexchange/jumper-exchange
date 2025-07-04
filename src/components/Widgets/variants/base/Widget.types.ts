import { CustomInformation } from 'src/types/loyaltyPass';
import { ConfigContext } from '../widgetConfig/types';

export interface EntityWidgetProps {
  customInformation?: Partial<CustomInformation>;
}

export interface WidgetProps extends EntityWidgetProps {
  ctx: ConfigContext;
}
