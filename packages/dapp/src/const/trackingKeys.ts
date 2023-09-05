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
  Widget = 'widget',
  WidgetEvent = 'widget-event',
}

export enum TrackingParameters {
  Connected = 'connected',
  Theme = 'theme',
  DefaultTheme = 'default_system_theme',
  AddedToken = 'added_token',
  AddedChain = 'added_chain',
  DefaultLanguage = 'default_system_language',
  Language = 'language',
  Wallet = 'wallet',
}
