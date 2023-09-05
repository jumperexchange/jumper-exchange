export enum TrackingActions {
  // Widget
  AddChain = 'add-chain',
  AddToken = 'add-token',

  // WalletMenu
  ConnectWallet = 'connect-wallet',
  CopyAddressToClipboard = 'copy-addr-to-clipboard',
  Disconnect = 'disconnect',
  SwitchChain = 'switch-chain',

  // Widget
  OnRouteExecutionStarted = 'onRouteExecutionStarted',
  OnRouteExecutionCompleted = 'onRouteExecutionCompleted',
  OnRouteExecutionFailed = 'onRouteExecutionFailed',
  OnRouteExecutionUpdated = 'onRouteExecutionUpdated',
  OnRouteHighValueLoss = 'onRouteHighValueLoss',

  // Welcome-Screen
  EnterWelcomeScreen = 'enter-welcome-screen',
  OpenStatsModal = 'open-stats-modal',

  // Feature Card
  ClickLearnMore = 'click-learn-more',
  CloseFeatureCard = 'close-feature-card',

  // Menu
  OpenSubmenu = 'open-submenu',
  OpenSupportModal = 'open-support-modal',
  OpenWalletSelectMenu = 'open-wallet-select-menu',
  PageLoad = 'pageload',
  SwitchLanguage = 'switch-language',
  SwitchTab = 'switch-tab',
  SwitchTheme = 'switch-theme',
  WalletConnection = 'wallet-connection',
}

export enum TrackingCategories {
  ChainsMenu = 'chains-menu',
  MainMenu = 'main-menu',
  Menu = 'menu',
  FeatureCard = 'feature-card',
  Navigation = 'navigation',
  LanguageMenu = 'language-menu',
  SubMenu = 'sub-menu',
  ThemeMenu = 'theme-menu',
  ThemeSwitch = 'theme-switch',
  Wallet = 'wallet',
  WalletMenu = 'wallet-menu',
  WalletSelectMenu = 'wallet-select-menu',
  WelcomeScreen = 'welcome-screen',
  Widget = 'widget',
  WidgetEvent = 'widget-event',
}

// can be used as custom dimensions / metrics
export enum TrackingEventParameters {
  FeatureCardTitle = 'feature-card-title',
  FeatureCardId = 'feature-card-id',
  Tab = 'tab',
  PrevMenu = 'prev-menu',
  ChainIdAdded = 'chain-added',
  TokenAdded = 'token-added',
  TokenAddedChainId = 'token-added-chainId',
  SwitchChain = 'switch-chain',
  SubMenu = 'sub-menu',
  StatsModal = 'stats-modal',
  Theme = 'theme',
  Wallet = 'wallet',

  // Transaction:
  RouteId = 'routeId',
  Steps = 'steps',
  FromToken = 'fromToken',
  FromChainId = 'fromChainId',
  ToToken = 'toToken',
  Timestamp = 'timestamp',
  Status = 'status',
  Error = 'error',
  Message = 'message',
  TxHash = 'txhash',
  ToChainId = 'toChainId',
  FromAmount = 'fromAmount',
  ToAmount = 'toAmount',
  ToAmountUSD = 'toAmountUSD',
  ToAmountMin = 'toAmountMin',
  FromAmountUSD = 'fromAmountUSD',
  FromAddress = 'fromAddress',
}

// can be used as user_properties
export enum TrackingUserProperties {
  AddedToken = 'added_token',
  AddedChain = 'added_chain',
  Connected = 'connected',
  Theme = 'theme',
  DefaultTheme = 'default_system_theme',
  Language = 'language',
  DefaultLanguage = 'default_system_language',
  StatsModal = 'stats_modal',
  Wallet = 'wallet',
}
