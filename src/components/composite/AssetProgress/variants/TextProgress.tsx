import { FC } from 'react';
import { TextAssetProgressProps } from '../AssetProgress.types';
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
