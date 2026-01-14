import type { FC } from 'react';
import type { TextAssetProgressProps } from '../AssetProgress.types';
import { BaseProgress } from './BaseProgress';

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
