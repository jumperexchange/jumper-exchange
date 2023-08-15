import { WidgetSubvariant } from '@lifi/widget/types';

interface TabsMapType {
  [key: string]: {
    index: number;
    value: WidgetSubvariant | 'buy';
    destination: string[];
  };
}

export const TabsMap: TabsMapType = {
  Exchange: { index: 0, value: 'default', destination: ['exchange'] },
  Refuel: { index: 1, value: 'refuel', destination: ['gas', 'refuel'] },
  Buy: { index: 2, value: 'buy', destination: ['buy'] },
};
