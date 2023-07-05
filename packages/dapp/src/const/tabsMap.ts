import { WidgetSubvariant } from '@lifi/widget/types';

interface TabsMapType {
  [key: string]: {
    index: number;
    value: WidgetSubvariant | 'buy';
  };
}

export const TabsMap: TabsMapType = {
  Exchange: { index: 0, value: 'default' },
  Refuel: { index: 1, value: 'refuel' },
  Buy: { index: 2, value: 'buy' },
};
