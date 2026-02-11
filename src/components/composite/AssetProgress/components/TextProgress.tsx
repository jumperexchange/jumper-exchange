import type { FC } from 'react';
import { BaseProgress } from './BaseProgress';
import type { TextAssetProgressProps } from '../types';

export const TextProgress: FC<Omit<TextAssetProgressProps, 'variant'>> = ({
  text,
  progress,
  amount,
}) => {
  return (
    <BaseProgress progress={progress} amount={amount}>
      {text}
    </BaseProgress>
  );
};
