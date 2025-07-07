import {
  EVM,
  Solana,
  UTXO,
  Sui,
  SDKConfig,
  createConfig as lifiSdkCreateConfig,
  config as lifiSdkConfig,
} from '@lifi/sdk';
import { publicRPCList } from 'src/const/rpcList';
import getApiUrl from 'src/utils/getApiUrl';
import { create } from 'zustand';

export enum ConfigType {
  Default = 'default',
  Zap = 'zap',
}

interface SDKConfigState {
  configType: ConfigType;
  partialConfigMap: Record<ConfigType, Partial<SDKConfig>>;
  config: SDKConfig;

  initSdk: () => void;
  setConfigType: (type: ConfigType) => void;
}

const integrator = process.env.NEXT_PUBLIC_WIDGET_INTEGRATOR;

const baseConfig: SDKConfig = {
  apiKey: process.env.NEXT_PUBLIC_LIFI_API_KEY,
  apiUrl: getApiUrl(),
  providers: [EVM(), Solana(), UTXO(), Sui()],
  integrator,
  rpcUrls: {
    ...JSON.parse(process.env.NEXT_PUBLIC_CUSTOM_RPCS),
    ...publicRPCList,
  },
  preloadChains: true,
};

const zapConfig: Partial<SDKConfig> = {
  providers: [EVM(), Solana(), UTXO()],
};

const partialConfigMap = {
  [ConfigType.Default]: {},
  [ConfigType.Zap]: zapConfig,
} as const;

export const useSdkConfigStore = create<SDKConfigState>((set, get) => ({
  configType: ConfigType.Default,
  partialConfigMap: partialConfigMap,
  config: baseConfig,

  initSdk: () => {
    const initialConfig = get().config;
    lifiSdkCreateConfig(initialConfig);
  },

  setConfigType: (type) => {
    const { partialConfigMap, configType: prevType } = get();
    const partialPrevConfig = partialConfigMap[prevType] || {};
    const partialNextConfig = partialConfigMap[type];

    if (!partialNextConfig) {
      throw new Error(`No config defined for type: ${type}`);
    }

    if (partialNextConfig.providers) {
      lifiSdkConfig.setProviders(partialNextConfig.providers);
      // Reset to base config if the previous config had this field set but the current doesn't
    } else if (partialPrevConfig.providers && baseConfig.providers) {
      lifiSdkConfig.setProviders(baseConfig.providers);
    }

    if (partialNextConfig.rpcUrls) {
      lifiSdkConfig.setRPCUrls(partialNextConfig.rpcUrls);
      // Reset to base config if the previous config had this field set but the current doesn't
    } else if (partialPrevConfig.rpcUrls && baseConfig.rpcUrls) {
      lifiSdkConfig.setRPCUrls(baseConfig.rpcUrls);
    }

    if (partialNextConfig.chains) {
      lifiSdkConfig.setChains(partialNextConfig.chains);
      // Reset to base config if the previous config had this field set but the current doesn't
    } else if (partialPrevConfig.chains && baseConfig.chains) {
      lifiSdkConfig.setChains(baseConfig.chains);
    }

    const shouldOverrideOtherFields =
      partialNextConfig.apiUrl ||
      partialNextConfig.apiKey ||
      partialNextConfig.integrator ||
      partialNextConfig.preloadChains;

    if (shouldOverrideOtherFields) {
      lifiSdkConfig.set({
        apiUrl: partialNextConfig.apiUrl ?? baseConfig.apiUrl,
        apiKey: partialNextConfig.apiKey ?? baseConfig.apiKey,
        integrator: partialNextConfig.integrator ?? baseConfig.integrator,
        preloadChains:
          partialNextConfig.preloadChains ?? baseConfig.preloadChains,
      });
    }

    const fullConfig = { ...baseConfig, ...partialNextConfig };

    set({ configType: type, config: fullConfig });
  },
}));
