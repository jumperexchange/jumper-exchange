import type { WidgetConfig, WidgetProvider } from '@lifi/widget';
import type { StarterVariantType } from 'src/types/internal';
import type {
  TaskWidgetInformationChainData,
  TaskWidgetInformationTokenData,
  TaskWidgetInformationWalletData,
} from 'src/types/strapi';
import { TaskType } from 'src/types/strapi';
import type { WidgetThemeConfig } from 'src/types/theme';
import type { PartnerThemeConfig } from 'src/types/PartnerThemeConfig';
import type { TFunction, i18n } from 'i18next';
import type { Hex } from 'viem';
import type { Theme as MuiTheme } from '@mui/material/styles';

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
  theme: {
    widgetTheme: WidgetThemeConfig;
    configTheme: Partial<PartnerThemeConfig>;
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
  disabledUI?: WidgetConfig['disabledUI'];
  hiddenUI?: WidgetConfig['hiddenUI'];
}

// Widget-specific context interfaces
export interface MainWidgetContext extends CommonWidgetContext {
  starterVariant: StarterVariantType;
  partnerName: string;
  bridgeConditions?: {
    isAGWToNonABSChain?: boolean;
    isBridgeFromHypeToArbNativeUSDC?: boolean;
    isBridgeFromEvmToHype?: boolean;
    isPrivateSwapSelected?: boolean;
    toAddress?: string;
  };
  isConnectedAGW?: boolean;
}

export interface MissionWidgetContext extends CommonWidgetContext {
  taskType?: TaskType;
  subTaskType?: 'withdraw' | 'deposit';
  allowBridge?: string | null;
  allowExchange?: string | null;
  overrideHeader?: string;
}

export interface ZapWidgetContext extends MissionWidgetContext {
  taskType: TaskType.Zap;
  zapToAddress?: Hex;
  zapProviders?: WidgetProvider[];
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
