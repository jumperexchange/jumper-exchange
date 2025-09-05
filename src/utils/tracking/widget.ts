import { SettingUpdated } from '@lifi/widget';
import { isObject } from 'lodash';
import { TrackingEventParameter } from 'src/const/trackingKeys';

const stringifyValue = (value: any): string => {
  if (Array.isArray(value)) {
    return value.join(',');
  }
  if (isObject(value)) {
    return JSON.stringify(value);
  }
  return value?.toString() ?? '';
};

export const parseWidgetSettingsToTrackingData = (settings: SettingUpdated) => {
  const isAutoSlippage = settings.newSettings.slippage === 'auto';
  return {
    [TrackingEventParameter.GasPriceSettings]:
      settings.newSettings.gasPrice ?? '',
    [TrackingEventParameter.SlippageLevelSettings]: isAutoSlippage
      ? ''
      : (settings.newSettings.slippage ?? ''),
    [TrackingEventParameter.SlippageStatusSettings]: isAutoSlippage
      ? 'auto'
      : 'manual',
    [TrackingEventParameter.RoutePrioritySettings]:
      settings.newSettings.routePriority ?? '',
    [TrackingEventParameter.EnableAutoRefuelSettings]:
      settings.newSettings.enabledAutoRefuel ?? '',
    [TrackingEventParameter.EnabledBridgesSettings]:
      settings.newSettings.enabledBridges?.join(',') ?? '',
    [TrackingEventParameter.EnabledExchangesSettings]:
      settings.newSettings.enabledExchanges?.join(',') ?? '',
    [TrackingEventParameter.DisabledBridgesSettings]:
      settings.newSettings.disabledBridges?.join(',') ?? '',
    [TrackingEventParameter.DisabledExchangesSettings]:
      settings.newSettings.disabledExchanges?.join(',') ?? '',
    [TrackingEventParameter.UpdatedSetting]: settings.setting ?? '',
    [TrackingEventParameter.NewSettingValue]: stringifyValue(settings.newValue),
    [TrackingEventParameter.PreviousSettingValue]: stringifyValue(
      settings.oldValue,
    ),
  };
};
