/*
  Name of an action that a user makes on the site. 
  GA: in GA this is the name of the even that is fired
*/
export enum TrackingActions {
  // Widget
  AddChain = 'add_chain',
  AddToken = 'add_token',

  // WalletMenu
  ConnectWallet = 'connect_wallet',
  CopyAddressToClipboard = 'copy_addr_to_clipboard',
  Disconnect = 'disconnect_wallet',
  SwitchChain = 'switch_chain',

  // Widget
  OnRouteExecutionStarted = 'on_route_exec_started',
  OnRouteExecutionCompleted = 'on_route_exec_completed',
  OnRouteExecutionFailed = 'on_route_exec_failed',
  OnRouteExecutionUpdated = 'on_route_exec_updated',
  OnRouteHighValueLoss = 'on_route_high_value_loss',

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
  RouteId = 'event_route_id',
  Steps = 'event_steps',
  FromToken = 'event_from_token',
  FromChainId = 'event_from_chain_id',
  ToToken = 'event_to_token',
  Timestamp = 'event_timestamp',
  SubStatus = 'event_substatus',
  Status = 'event_status',
  Error = 'event_error',
  Message = 'event_message',
  GasCostUSD = 'event_gas_cost_usd',
  TxHash = 'event_tx_hash',
  TxLink = 'event_tx_link',
  ToChainId = 'event_to_chain_id',
  FromAmount = 'event_from_amount',
  ToAmount = 'event_to_amount',
  ToAmountUSD = 'event_to_amount_usd',
  ToAmountMin = 'event_to_amount_min',
  FromAmountUSD = 'event_from_amount_usd',
  Variant = 'event_variant',
  Type = 'event_type',
  ErrorCode = 'event_error_code',
  ErrorMessage = 'event_error_message',
  InsuranceState = 'event_insurance_state',
  InsuranceFeeAmountUSD = 'event_insurance_fee_amount_usd',
  ValueLoss = 'event_value_loss',
}
