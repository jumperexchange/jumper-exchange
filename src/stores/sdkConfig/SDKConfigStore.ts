import { EVM, Solana, UTXO, Sui, SDKConfig } from '@lifi/sdk';
import { publicRPCList } from 'src/const/rpcList';
import getApiUrl from 'src/utils/getApiUrl';
import { create } from 'zustand';

type ConfigType = 'default' | 'zap';

interface SDKConfigState {
  configType: ConfigType;
  configMap: Record<ConfigType, SDKConfig>;
  config: SDKConfig;

  setConfigType: (type: ConfigType) => void;
  updateConfigForType: (type: ConfigType, partial: Partial<SDKConfig>) => void;
}

const defaultConfig: SDKConfig = {
  apiKey: process.env.NEXT_PUBLIC_LIFI_API_KEY,
  apiUrl: getApiUrl(),
  providers: [EVM(), Solana(), UTXO(), Sui()],
  integrator: process.env.NEXT_PUBLIC_WIDGET_INTEGRATOR,
  rpcUrls: {
    ...JSON.parse(process.env.NEXT_PUBLIC_CUSTOM_RPCS),
    ...publicRPCList,
  },
  preloadChains: true,
};

const zapConfig: SDKConfig = {
  apiKey: process.env.NEXT_PUBLIC_LIFI_API_KEY,
  apiUrl: process.env.NEXT_PUBLIC_LIFI_API_URL,
  providers: [EVM(), Solana(), UTXO()],
  integrator: process.env.NEXT_PUBLIC_WIDGET_INTEGRATOR,
  rpcUrls: {
    ...JSON.parse(process.env.NEXT_PUBLIC_CUSTOM_RPCS),
    ...publicRPCList,
  },
  preloadChains: true,
};

export const useSdkConfigStore = create<SDKConfigState>((set, get) => ({
  configType: 'default',
  configMap: {
    default: defaultConfig,
    zap: zapConfig,
  },
  config: defaultConfig,

  setConfigType: (type) => {
    const configMap = get().configMap;
    const nextConfig = configMap[type];
    if (!nextConfig) throw new Error(`No config defined for type: ${type}`);

    set({ configType: type, config: nextConfig });
  },

  updateConfigForType: (type, partial) => {
    const currentMap = get().configMap;
    const existing = currentMap[type] || {};
    const updated = { ...existing, ...partial };

    const currentType = get().configType;

    set({
      configMap: {
        ...currentMap,
        [type]: updated,
      },
      ...(currentType === type ? { config: updated } : {}),
    });
  },
}));
