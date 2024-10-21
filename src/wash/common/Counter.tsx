import { type ReactElement } from 'react';
import { cl } from '../utils/utils';

import { IconBlock } from './icons/IconBlock';

type TCounterProps = {
  amount: number;
  isDisabled?: boolean;
};

export function Counter({ amount, isDisabled }: TCounterProps): ReactElement {
  const getBgColor = (): string => {
    if (amount === 0 || isDisabled) {
      return 'bg-pink-300';
    }
    return 'bg-pink-800';
  };

  const getLabel = (): string | number | ReactElement => {
    if (isDisabled) {
      return <IconBlock />;
    }
    if (amount > 99) {
      return '99+';
    }
    return amount ?? 0;
  };

  return (
    <div
      className={cl(
        'text-white w-min flex items-center justify-center',
        'rounded-3xl text-sm px-3 py-[2px] skew-x-6 font-black',
        getBgColor(),
      )}
    >
      {getLabel()}
    </div>
  );
}
