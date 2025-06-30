'use client';

import {
  CustomSubvariant,
  HiddenUI,
  LiFiWidget,
  WidgetSubvariant,
} from '@lifi/widget';
import { useMemo } from 'react';
import { ClientOnly } from 'src/components/ClientOnly';
import { useThemeStore } from 'src/stores/theme/ThemeStore';

export const MissionWidget = () => {
  const [widgetTheme] = useThemeStore((state) => [
    state.widgetTheme,
    state.configTheme,
  ]);

  const config = useMemo(() => {
    return {
      integrator: 'Test',
      appearance: widgetTheme.config.appearance,
      subvariant: 'custom' as WidgetSubvariant,
      subvariantOptions: {
        custom: 'swap' as CustomSubvariant,
      },
      hiddenUI: [
        HiddenUI.Appearance,
        HiddenUI.Language,
        HiddenUI.PoweredBy,
        HiddenUI.WalletMenu,
        HiddenUI.ToAddress,
        HiddenUI.ReverseTokensButton,
        HiddenUI.History,
      ],
      theme: {
        ...widgetTheme.config.theme,
        container: {
          maxHeight: 820,
          maxWidth: 'unset',
          borderRadius: 24,
        },
      },
      useRecommendedRoute: true,
      languageResources: {
        en: {
          header: {
            exchange: `Deposit to Lisk using Jumper`,
            deposit: `Deposit to OP Pool on Velodrome`, // Need to adjust for zaps
            swap: `Swap to OP on Lisk`,
          },
        },
      },
    };
  }, [widgetTheme.config]);

  return (
    <ClientOnly>
      <LiFiWidget config={config} integrator={config.integrator} />
    </ClientOnly>
  );
};
