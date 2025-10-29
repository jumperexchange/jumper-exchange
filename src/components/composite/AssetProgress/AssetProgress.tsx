import { FC } from 'react';
import {
  AssetProgressProps,
  AssetProgressVariant,
  ProtocolAssetProgressProps,
  TextAssetProgressProps,
  TokenAssetProgressProps,
} from './AssetProgress.types';
import { TextProgress } from './variants/TextProgress';
import { ProtocolProgress } from './variants/ProtocolProgress';
import { TokenProgress } from './variants/TokenProgress';

export const AssetProgress: FC<AssetProgressProps> = ({ variant, ...rest }) => {
  if (variant === AssetProgressVariant.Token) {
    return <TokenProgress {...(rest as TokenAssetProgressProps)} />;
  }
  if (variant === AssetProgressVariant.Protocol) {
    return <ProtocolProgress {...(rest as ProtocolAssetProgressProps)} />;
  }
  return <TextProgress {...(rest as TextAssetProgressProps)} />;
};
