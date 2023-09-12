export enum TrackingActions {
  // Widget
  AddChain = 'add_chain',
  AddToken = 'add_token',

  // WalletMenu
  ConnectWallet = 'connect_wallet',
  CopyAddressToClipboard = 'copy_addr_to_clipboard',
  Disconnect = 'disconnect',
  SwitchChain = 'switch_chain',

  // Widget
  OnRouteExecutionStarted = 'on_route_exec_started',
  OnRouteExecutionCompleted = 'on_route_exec_completed',
  OnRouteExecutionFailed = 'on_route_exec_failed',
  OnRouteExecutionUpdated = 'on_route_exec_updated',
  OnRouteHighValueLoss = 'on_route_high_vloss',

  // Welcome_Screen
  EnterWelcomeScreen = 'enter_welcome_screen',
  OpenStatsModal = 'open_stats_modal',

  // Feature Card
  ClickLearnMore = 'click_learn_more',
  CloseFeatureCard = 'close_feature_card',

  // Menu
  OpenSubmenu = 'open_submenu',
  OpenSupportModal = 'open_support_modal',
  OpenWalletSelectMenu = 'open_wallet_select_menu',
  PageLoad = 'pageload',
  SwitchLanguage = 'switch_language',
  SwitchTab = 'switch_tab',
  SwitchTheme = 'switch_theme',
}

export enum TrackingCategories {
  ChainsMenu = 'chains_menu',
  MainMenu = 'main_menu',
  Menu = 'menu',
  FeatureCard = 'feature_card',
  Navigation = 'navigation',
  LanguageMenu = 'language_menu',
  SubMenu = 'submenu',
  ThemeMenu = 'theme_menu',
  ThemeSwitch = 'theme_switch',
  Wallet = 'wallet',
  WalletMenu = 'wallet_menu',
  WalletSelectMenu = 'wallet_select_menu',
  WelcomeScreen = 'welcome_screen',
  Widget = 'widget',
  WidgetEvent = 'widget_event',
}

// can be used as custom dimensions / metrics
export enum TrackingEventParameters {
  FeatureCardTitle = 'feature_card_title',
  FeatureCardId = 'feature_card_id',
  Tab = 'tab',
  PrevMenu = 'prev_menu',
  ChainId = 'chain_id',
  ChainName = 'chain_name',
  ChainIdAdded = 'chain_added',
  SubMenu = 'submenu',
  StatsModal = 'stats_modal',
  SwitchedChain = 'switched_chain',
  SwitchedTheme = 'switched_theme',
  SwitchedLanguage = 'switched_language',
  TokenAdded = 'token_added',
  TokenAddedChainId = 'token_added_chain_id',
  Wallet = 'wallet',

  // Transaction:
  RouteId = 'route_id',
  Steps = 'steps',
  FromToken = 'from_token',
  FromChainId = 'from_chain_id',
  ToToken = 'to_token',
  Timestamp = 'timestamp',
  SubStatus = 'substatus',
  Status = 'status',
  Error = 'error',
  Message = 'message',
  GasCostUSD = 'gas_cost_usd',
  TxHash = 'tx_hash',
  TxLink = 'tx_link',
  ToChainId = 'to_chain_id',
  FromAmount = 'from_amount',
  ToAmount = 'to_amount',
  ToAmountUSD = 'to_amount_usd',
  ToAmountMin = 'to_amount_min',
  FromAmountUSD = 'from_amount_usd',
  Variant = 'variant',
  Type = 'type',
  ErrorCode = 'error_code',
  ErrorMessage = 'error_message',
  InsuranceState = 'insurance_state',
  InsuranceFeeAmountUSD = 'insurance_fee_amount_usd',
  ValueLoss = 'value_loss',
}

// can be used as user_properties
export enum TrackingUserProperties {
  AddedToken = 'added_token',
  AddedChain = 'added_chain',
  ChainId = 'chain_id',
  Connected = 'connected',
  HadEnteredWelcomeScreen = 'had_entered_welcome_screen',
  HadConnected = 'had_connected',
  HadAcceptedHighValueLoss = 'had_accepted_hv_loss',
  HadFailure = 'had_failure',
  HadSuccessfulTx = 'had_succesful_tx',
  Theme = 'theme',
  DefaultTheme = 'default_system_theme',
  Language = 'language',
  DefaultLanguage = 'default_system_language',
  StatsModal = 'stats_modal',
  Wallet = 'wallet',
}
