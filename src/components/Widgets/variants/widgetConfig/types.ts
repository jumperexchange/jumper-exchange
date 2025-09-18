import { EVMProvider, WidgetConfig } from '@lifi/widget';
import { StarterVariantType } from 'src/types/internal';
import {
  TaskType,
  TaskWidgetInformationChainData,
  TaskWidgetInformationTokenData,
  TaskWidgetInformationWalletData,
} from 'src/types/strapi';

export type ConfigContext = {
  overrideHeader?: string;
  baseOverrides?: Partial<WidgetConfig>;
  baseVariant?: string;
  includeZap?: boolean;
  zapToAddress?: `0x${string}`;
  zapProviders?: EVMProvider[];
  zapPoolName?: string;

  taskType?: TaskType;

  // Need to make these more generic
  destinationChain?: TaskWidgetInformationChainData;
  destinationToken?: TaskWidgetInformationTokenData;
  sourceChain?: TaskWidgetInformationChainData;
  sourceToken?: TaskWidgetInformationTokenData;
  fromAmount?: string;
  toAddress?: TaskWidgetInformationWalletData;
  allowBridge?: string | null;
  allowExchange?: string | null;

  includeRouteLabels?: boolean;

  useMainWidget?: boolean;

  starterVariant?: StarterVariantType;
  partnerName?: string;

  [key: string]: any;
};

export type ConfigOverrideHook = (ctx: ConfigContext) => Partial<WidgetConfig>;
