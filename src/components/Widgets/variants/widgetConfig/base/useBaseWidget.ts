import { useWalletMenu } from '@lifi/wallet-management';
import { HiddenUI, RequiredUI, WidgetConfig } from '@lifi/widget';
import { useMemo } from 'react';
import { useThemeStore } from 'src/stores/theme/ThemeStore';
import envConfig from '@/config/env-config';

export const useBaseWidget = () => {
  const [widgetTheme] = useThemeStore((state) => [
    state.widgetTheme,
    state.configTheme,
  ]);

  const { openWalletMenu } = useWalletMenu();

  const baseConfig = useMemo(() => {
    return {
      integrator: envConfig.NEXT_PUBLIC_WIDGET_INTEGRATOR,
      appearance: widgetTheme.config.appearance,
      keyPrefix: 'jumper-custom',
      apiKey: envConfig.NEXT_PUBLIC_LIFI_API_KEY,
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
      defaultUI: { navigationHeaderTitleNoWrap: false },
      requiredUI: [RequiredUI.ToAddress],
      walletConfig: {
        onConnect() {
          openWalletMenu();
        },
      },
      theme: {
        ...widgetTheme.config.theme,
        container: {
          maxHeight: '100%',
          maxWidth: 'unset',
          borderRadius: 24,
          boxShadow: '0px 4px 24px 0px rgba(0, 0, 0, 0.08)', // @TODO Figma: elevation 4
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
