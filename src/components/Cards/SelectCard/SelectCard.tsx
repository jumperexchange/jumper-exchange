import React, { FC } from 'react';
import { SelectCardMode } from './SelectCard.styles';
import { SelectCardProps } from './SelectCard.types';
import { SelectCardDisplay } from './mode/SelectCardDisplay';
import { SelectCardInput } from './mode/SelectCardInput';

export const SelectCard: FC<SelectCardProps> = (props) => {
  if (props.mode === SelectCardMode.Input) {
    return <SelectCardInput {...props} />;
  }

  return <SelectCardDisplay {...props} />;
};
