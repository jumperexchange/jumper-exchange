import { EVMProvider, WidgetConfig } from '@lifi/widget';
import {
  TaskType,
  TaskWidgetInformationChainData,
  TaskWidgetInformationTokenData,
  TaskWidgetInformationWalletData,
} from 'src/types/loyaltyPass';

export type ConfigContext = {
  overrideHeader?: string;
  baseOverrides?: Partial<WidgetConfig>;
  baseVariant?: string;
  includeZap?: boolean;
  zapToAddress?: `0x${string}`;
  zapProviders?: EVMProvider[];

  taskType?: TaskType;

  // Need to make these more generic
  destinationChain?: TaskWidgetInformationChainData;
  destinationToken?: TaskWidgetInformationTokenData;
  sourceChain?: TaskWidgetInformationChainData;
  sourceToken?: TaskWidgetInformationTokenData;
  fromAmount?: string;
  toAddress?: TaskWidgetInformationWalletData;

  [key: string]: any;
};

export type ConfigOverrideHook = (ctx: ConfigContext) => Partial<WidgetConfig>;
