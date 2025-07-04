import { useWalletMenu } from '@lifi/wallet-management';
import { HiddenUI, RequiredUI, WidgetConfig } from '@lifi/widget';
import { useMemo } from 'react';
import { useThemeStore } from 'src/stores/theme/ThemeStore';

export const useBaseWidget = () => {
  const [widgetTheme] = useThemeStore((state) => [
    state.widgetTheme,
    state.configTheme,
  ]);

  const { openWalletMenu } = useWalletMenu();

  const baseConfig = useMemo(() => {
    return {
      integrator: process.env.NEXT_PUBLIC_WIDGET_INTEGRATOR,
      appearance: widgetTheme.config.appearance,
      keyPrefix: 'jumper-custom',
      apiKey: process.env.NEXT_PUBLIC_LIFI_API_KEY,
      variant: 'compact',
      hiddenUI: [
        HiddenUI.Appearance,
        HiddenUI.Language,
        HiddenUI.PoweredBy,
        HiddenUI.WalletMenu,
        HiddenUI.ToAddress, // @Note this should be dependant on the task type?
        HiddenUI.ReverseTokensButton,
        HiddenUI.History,
      ],
      requiredUI: [RequiredUI.ToAddress],
      walletConfig: {
        onConnect() {
          openWalletMenu();
        },
      },
      theme: {
        ...widgetTheme.config.theme,
        container: {
          maxHeight: 820,
          maxWidth: 'unset',
          borderRadius: 24,
        },
        header: {
          // @Note this needs a workaround to be able to show title on multiple lines
          whiteSpace: 'break-spaces !important',
        },
      },
    } as WidgetConfig;
  }, [widgetTheme.config, openWalletMenu]);

  return baseConfig;
};
