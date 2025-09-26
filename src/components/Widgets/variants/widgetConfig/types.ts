import { EVMProvider, WidgetConfig } from '@lifi/widget';
import { StarterVariantType } from 'src/types/internal';
import {
  TaskType,
  TaskWidgetInformationChainData,
  TaskWidgetInformationTokenData,
  TaskWidgetInformationWalletData,
} from 'src/types/strapi';
import { ThemeProps } from 'src/types/theme';
import { TFunction, i18n } from 'i18next';
import { Hex } from 'viem';
import { Theme as MuiTheme } from '@mui/material/styles';

export type EnglishLanguageResource = NonNullable<
  WidgetConfig['languageResources']
>['en'];

// Widget types
export type WidgetType = 'main' | 'mission' | 'zap';

// Hook dependencies interface
export interface HookDependencies {
  translation: {
    i18n: i18n;
    t: TFunction<'translation', undefined>;
  };
  theme: Pick<ThemeProps, 'widgetTheme' | 'configTheme'> & {
    muiTheme: MuiTheme;
  };
  wallet: {
    openWalletMenu: () => void;
  };
}

// Form data interface
export interface FormData {
  sourceChain?: TaskWidgetInformationChainData;
  sourceToken?: TaskWidgetInformationTokenData;
  destinationChain?: TaskWidgetInformationChainData;
  destinationToken?: TaskWidgetInformationTokenData;
  fromAmount?: string;
  toAddress?: TaskWidgetInformationWalletData;
  minFromAmountUSD?: number;
}

export interface CommonWidgetContext {
  integrator?: string;
  keyPrefix?: string;
  variant?: WidgetConfig['variant'];
  formData?: FormData;
  allowChains?: number[];
  allowFromChains?: number[];
  allowToChains?: number[];
  theme?: WidgetConfig['theme'];
}

// Widget-specific context interfaces
export interface MainWidgetContext extends CommonWidgetContext {
  starterVariant: StarterVariantType;
  partnerName: string;
  bridgeConditions?: {
    isAGWToNonABSChain?: boolean;
    isBridgeFromHypeToArbNativeUSDC?: boolean;
    isBridgeFromEvmToHype?: boolean;
  };
  isConnectedAGW?: boolean;
}

export interface MissionWidgetContext extends CommonWidgetContext {
  taskType?: TaskType;
  allowBridge?: string | null;
  allowExchange?: string | null;
  overrideHeader?: string;
}

export interface ZapWidgetContext extends MissionWidgetContext {
  taskType: TaskType.Zap;
  zapToAddress?: Hex;
  zapProviders?: EVMProvider[];
  zapPoolName?: string;
}

// Union type for all contexts
export type WidgetContext =
  | MainWidgetContext
  | MissionWidgetContext
  | ZapWidgetContext;

export const isMissionContext = (
  context: WidgetContext,
): context is MissionWidgetContext | ZapWidgetContext => {
  return 'taskType' in context;
};

export const isZapContext = (
  context: WidgetContext,
): context is ZapWidgetContext => {
  return isMissionContext(context) && context.taskType === TaskType.Zap;
};
