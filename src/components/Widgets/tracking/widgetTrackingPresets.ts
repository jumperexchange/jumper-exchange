import { TrackingAction, TrackingEventDataAction } from '@/const/trackingKeys';
import type { WidgetEventTrackerConfig } from '@/components/Widgets/tracking/types';

export type WidgetTrackingVariant =
  | 'main'
  | 'advanced'
  | 'private'
  | 'limit'
  | 'mission'
  | 'zap'
  | 'earnDeposit'
  | 'earnWithdraw';

interface VariantExecutionActions {
  started: TrackingAction;
  updated?: TrackingAction;
  completed: TrackingAction;
  failed: TrackingAction;
  dataStarted: TrackingEventDataAction;
  dataUpdated?: TrackingEventDataAction;
  dataCompleted: TrackingEventDataAction;
  dataFailed: TrackingEventDataAction;
}

interface VariantActions {
  sourceChainAndTokenSelection?: TrackingAction;
  destinationChainAndTokenSelection?: TrackingAction;
  availableRoutes: TrackingAction;
  changeSettings?: TrackingAction;
  routeHighValueLoss?: TrackingAction;
  lowAddressActivityConfirmed?: TrackingAction;
  sendToWalletToggled?: TrackingAction;
  formFieldChanged?: TrackingAction;
  execution: VariantExecutionActions;
}

const SHARED_ROUTE_INTERACTION = {
  routeSelected: { action: TrackingAction.OnRouteSelected },
  chainPinned: { action: TrackingAction.OnChainPinned },
} as const satisfies Pick<
  WidgetEventTrackerConfig,
  'routeSelected' | 'chainPinned'
>;

const VARIANT_ACTIONS: Record<WidgetTrackingVariant, VariantActions> = {
  advanced: {
    sourceChainAndTokenSelection:
      TrackingAction.OnSourceChainAndTokenSelectionAdvanced,
    availableRoutes: TrackingAction.OnAvailableRoutesAdvanced,
    changeSettings: TrackingAction.OnChangeSettingsAdvanced,
    routeHighValueLoss: TrackingAction.OnRouteHighValueLoss,
    lowAddressActivityConfirmed: TrackingAction.OnLowAddressActivityConfirmed,
    sendToWalletToggled: TrackingAction.OnSendToWalletToggled,
    formFieldChanged: TrackingAction.OnFormFieldChanged,
    execution: {
      started: TrackingAction.OnRouteExecutionStartedAdvanced,
      completed: TrackingAction.OnRouteExecutionCompletedAdvanced,
      failed: TrackingAction.OnRouteExecutionFailedAdvanced,
      dataStarted: TrackingEventDataAction.ExecutionStartAdvanced,
      dataCompleted: TrackingEventDataAction.ExecutionCompletedAdvanced,
      dataFailed: TrackingEventDataAction.ExecutionFailedAdvanced,
    },
  },
  main: {
    sourceChainAndTokenSelection: TrackingAction.OnSourceChainAndTokenSelection,
    destinationChainAndTokenSelection:
      TrackingAction.OnDestinationChainAndTokenSelection,
    availableRoutes: TrackingAction.OnAvailableRoutes,
    changeSettings: TrackingAction.OnChangeSettings,
    routeHighValueLoss: TrackingAction.OnRouteHighValueLoss,
    lowAddressActivityConfirmed: TrackingAction.OnLowAddressActivityConfirmed,
    sendToWalletToggled: TrackingAction.OnSendToWalletToggled,
    formFieldChanged: TrackingAction.OnFormFieldChanged,
    execution: {
      started: TrackingAction.OnRouteExecutionStarted,
      updated: TrackingAction.OnRouteExecutionUpdated,
      completed: TrackingAction.OnRouteExecutionCompleted,
      failed: TrackingAction.OnRouteExecutionFailed,
      dataStarted: TrackingEventDataAction.ExecutionStart,
      dataUpdated: TrackingEventDataAction.ExecutionUpdated,
      dataCompleted: TrackingEventDataAction.ExecutionCompleted,
      dataFailed: TrackingEventDataAction.ExecutionFailed,
    },
  },
  private: {
    availableRoutes: TrackingAction.OnAvailableRoutesPrivate,
    execution: {
      started: TrackingAction.OnRouteExecutionStartedPrivate,
      completed: TrackingAction.OnRouteExecutionCompletedPrivate,
      failed: TrackingAction.OnRouteExecutionFailedPrivate,
      dataStarted: TrackingEventDataAction.ExecutionStartPrivate,
      dataCompleted: TrackingEventDataAction.ExecutionCompletedPrivate,
      dataFailed: TrackingEventDataAction.ExecutionFailedPrivate,
    },
  },
  limit: {
    sourceChainAndTokenSelection:
      TrackingAction.OnSourceChainAndTokenSelectionLimit,
    availableRoutes: TrackingAction.OnAvailableRoutesLimit,
    changeSettings: TrackingAction.OnChangeSettingsLimit,
    execution: {
      started: TrackingAction.OnRouteExecutionStartedLimit,
      completed: TrackingAction.OnRouteExecutionCompletedLimit,
      failed: TrackingAction.OnRouteExecutionFailedLimit,
      dataStarted: TrackingEventDataAction.ExecutionStartLimit,
      dataCompleted: TrackingEventDataAction.ExecutionCompletedLimit,
      dataFailed: TrackingEventDataAction.ExecutionFailedLimit,
    },
  },
  mission: {
    sourceChainAndTokenSelection:
      TrackingAction.OnSourceChainAndTokenSelectionMission,
    availableRoutes: TrackingAction.OnAvailableRoutesMission,
    changeSettings: TrackingAction.OnChangeSettingsMission,
    execution: {
      started: TrackingAction.OnRouteExecutionStartedMission,
      completed: TrackingAction.OnRouteExecutionCompletedMission,
      failed: TrackingAction.OnRouteExecutionFailedMission,
      dataStarted: TrackingEventDataAction.ExecutionStartMission,
      dataCompleted: TrackingEventDataAction.ExecutionCompletedMission,
      dataFailed: TrackingEventDataAction.ExecutionFailedMission,
    },
  },
  zap: {
    sourceChainAndTokenSelection:
      TrackingAction.OnSourceChainAndTokenSelectionZap,
    availableRoutes: TrackingAction.OnAvailableRoutesZap,
    changeSettings: TrackingAction.OnChangeSettingsZap,
    execution: {
      started: TrackingAction.OnRouteExecutionStartedZap,
      completed: TrackingAction.OnRouteExecutionCompletedZap,
      failed: TrackingAction.OnRouteExecutionFailedZap,
      dataStarted: TrackingEventDataAction.ExecutionStartZap,
      dataCompleted: TrackingEventDataAction.ExecutionCompletedZap,
      dataFailed: TrackingEventDataAction.ExecutionFailedZap,
    },
  },
  earnDeposit: {
    sourceChainAndTokenSelection:
      TrackingAction.OnSourceChainAndTokenSelectionEarnDeposit,
    availableRoutes: TrackingAction.OnAvailableRoutesEarnDeposit,
    changeSettings: TrackingAction.OnChangeSettingsEarnDeposit,
    execution: {
      started: TrackingAction.OnRouteExecutionStartedEarnDeposit,
      completed: TrackingAction.OnRouteExecutionCompletedEarnDeposit,
      failed: TrackingAction.OnRouteExecutionFailedEarnDeposit,
      dataStarted: TrackingEventDataAction.ExecutionStartEarnDeposit,
      dataCompleted: TrackingEventDataAction.ExecutionCompletedEarnDeposit,
      dataFailed: TrackingEventDataAction.ExecutionFailedEarnDeposit,
    },
  },
  earnWithdraw: {
    destinationChainAndTokenSelection:
      TrackingAction.OnDestinationChainAndTokenSelectionEarnWithdraw,
    availableRoutes: TrackingAction.OnAvailableRoutesEarnWithdraw,
    changeSettings: TrackingAction.OnChangeSettingsEarnWithdraw,
    execution: {
      started: TrackingAction.OnRouteExecutionStartedEarnWithdraw,
      completed: TrackingAction.OnRouteExecutionCompletedEarnWithdraw,
      failed: TrackingAction.OnRouteExecutionFailedEarnWithdraw,
      dataStarted: TrackingEventDataAction.ExecutionStartEarnWithdraw,
      dataCompleted: TrackingEventDataAction.ExecutionCompletedEarnWithdraw,
      dataFailed: TrackingEventDataAction.ExecutionFailedEarnWithdraw,
    },
  },
};

export interface CreateWidgetTrackerConfigOptions {
  includeRouteSelected?: boolean;
  includeChainPinned?: boolean;
  extra?: Partial<WidgetEventTrackerConfig>;
}

const buildExecutionConfig = (
  actions: VariantActions,
): Pick<
  WidgetEventTrackerConfig,
  | 'routeExecutionStarted'
  | 'routeExecutionUpdated'
  | 'routeExecutionCompleted'
  | 'routeExecutionFailed'
> => {
  const { execution } = actions;
  const config: Pick<
    WidgetEventTrackerConfig,
    | 'routeExecutionStarted'
    | 'routeExecutionUpdated'
    | 'routeExecutionCompleted'
    | 'routeExecutionFailed'
  > = {
    routeExecutionStarted: {
      action: execution.started,
      dataAction: execution.dataStarted,
    },
    routeExecutionCompleted: {
      action: execution.completed,
      dataAction: execution.dataCompleted,
    },
    routeExecutionFailed: {
      action: execution.failed,
      dataAction: execution.dataFailed,
    },
  };

  if (execution.updated && execution.dataUpdated) {
    config.routeExecutionUpdated = {
      action: execution.updated,
      dataAction: execution.dataUpdated,
    };
  }

  return config;
};

export const createWidgetTrackerConfig = (
  variant: WidgetTrackingVariant,
  options: CreateWidgetTrackerConfigOptions = {},
): WidgetEventTrackerConfig => {
  const {
    includeRouteSelected = variant !== 'private',
    includeChainPinned = variant !== 'private',
    extra = {},
  } = options;

  const actions = VARIANT_ACTIONS[variant];
  const config: WidgetEventTrackerConfig = {
    availableRoutes: { action: actions.availableRoutes },
    ...buildExecutionConfig(actions),
  };

  if (actions.sourceChainAndTokenSelection) {
    config.sourceChainAndTokenSelection = {
      action: actions.sourceChainAndTokenSelection,
    };
  }

  if (actions.destinationChainAndTokenSelection) {
    config.destinationChainAndTokenSelection = {
      action: actions.destinationChainAndTokenSelection,
    };
  }

  if (actions.changeSettings) {
    config.changeSettings = { action: actions.changeSettings };
  }

  if (actions.routeHighValueLoss) {
    config.routeHighValueLoss = { action: actions.routeHighValueLoss };
  }

  if (actions.lowAddressActivityConfirmed) {
    config.lowAddressActivityConfirmed = {
      action: actions.lowAddressActivityConfirmed,
    };
  }

  if (actions.sendToWalletToggled) {
    config.sendToWalletToggled = { action: actions.sendToWalletToggled };
  }

  if (actions.formFieldChanged) {
    config.formFieldChanged = { action: actions.formFieldChanged };
  }

  if (includeRouteSelected) {
    config.routeSelected = SHARED_ROUTE_INTERACTION.routeSelected;
  }

  if (includeChainPinned) {
    config.chainPinned = SHARED_ROUTE_INTERACTION.chainPinned;
  }

  return { ...config, ...extra };
};
