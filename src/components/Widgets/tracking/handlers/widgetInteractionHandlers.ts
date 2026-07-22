import type {
  FormFieldChanged,
  RouteHighValueLossUpdate,
  SettingUpdated,
} from '@jumperexchange/widget';
import { TrackingEventParameter } from '@/const/trackingKeys';
import type { WidgetEventsConfig } from '@/components/Widgets/WidgetEventsManager';
import { trackWidgetEvent } from '@/components/Widgets/tracking/trackWidgetEvent';
import type {
  HandlerContext,
  WidgetEventConfig,
} from '@/components/Widgets/tracking/types';
import {
  parseFormFieldChangedToTrackingData,
  parseWidgetSettingsToTrackingData,
} from '@/utils/tracking/widget';

export const createChangeSettingsHandler = (
  config: WidgetEventConfig,
  ctx: HandlerContext,
): WidgetEventsConfig => ({
  settingUpdated: async (settings: SettingUpdated) => {
    trackWidgetEvent(
      ctx.tracking,
      config,
      'change_settings',
      parseWidgetSettingsToTrackingData(settings),
    );
  },
});

export const createRouteHighValueLossHandler = (
  config: WidgetEventConfig,
  ctx: HandlerContext,
): WidgetEventsConfig => ({
  routeHighValueLoss: async (update: RouteHighValueLossUpdate) => {
    trackWidgetEvent(ctx.tracking, config, 'click_high_value_loss_accepted', {
      [TrackingEventParameter.FromAmountUSD]: update.fromAmountUSD,
      [TrackingEventParameter.ToAmountUSD]: update.toAmountUSD,
      [TrackingEventParameter.GasCostUSD]: update.gasCostUSD || '',
      [TrackingEventParameter.FeeCostUSD]: update.feeCostUSD || '',
      [TrackingEventParameter.ValueLoss]: update.valueLoss,
      [TrackingEventParameter.Timestamp]: new Date(Date.now()).toUTCString(),
    });
  },
});

export const createLowAddressActivityConfirmedHandler = (
  config: WidgetEventConfig,
  ctx: HandlerContext,
): WidgetEventsConfig => ({
  lowAddressActivityConfirmed: async (props: {
    address: string;
    chainId: number;
  }) => {
    trackWidgetEvent(
      ctx.tracking,
      config,
      'confirm_low_address_activity_confirmed',
      {
        [TrackingEventParameter.WalletAddress]: props.address,
        [TrackingEventParameter.ChainId]: props.chainId,
      },
    );
  },
});

export const createSendToWalletToggledHandler = (
  config: WidgetEventConfig,
  ctx: HandlerContext,
): WidgetEventsConfig => ({
  sendToWalletToggled: async (sendToWallet: boolean) => {
    trackWidgetEvent(ctx.tracking, config, 'send_to_wallet_toggled', {
      [TrackingEventParameter.SendToWallet]: sendToWallet,
    });
  },
});

export const createFormFieldChangedHandler = (
  config: WidgetEventConfig,
  ctx: HandlerContext,
): WidgetEventsConfig => ({
  formFieldChanged: async (data: FormFieldChanged) => {
    if (!data || data.fieldName !== 'toAddress') {
      return;
    }

    trackWidgetEvent(
      ctx.tracking,
      config,
      'form_field_changed',
      parseFormFieldChangedToTrackingData(data),
    );
  },
});
