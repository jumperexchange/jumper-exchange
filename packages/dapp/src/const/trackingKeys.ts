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
  DisconnectWallet = 'disconnect_wallet',
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
  ClickLearnMore = 'click_cta',
  CloseFeatureCard = 'close_feature_card',
  DisplayFeatureCard = 'display_feature_card',

  // Menu
  OpenMenu = 'open_submenu',
  PageLoad = 'pageload',
  SwitchLanguage = 'switch_language',
  SwitchTab = 'switch_tab',
  SwitchTheme = 'switch_theme',
}

export enum TrackingCategories {
  ChainsMenu = 'cat_chains_menu',
  MainMenu = 'cat_main_menu',
  Menu = 'cat_menu',
  FeatureCard = 'cat_feature_card',
  Navigation = 'cat_navigation',
  LanguageMenu = 'cat_language_menu',
  SubMenu = 'cat_submenu',
  ThemeMenu = 'cat_theme_menu',
  ThemeSwitch = 'cat_theme_switch',
  Wallet = 'cat_wallet',
  WalletMenu = 'cat_wallet_menu',
  WalletSelectMenu = 'cat_wallet_select_menu',
  WelcomeScreen = 'cat_welcome_screen',
  Widget = 'cat_widget',
  WidgetEvent = 'cat_widget_event',
}

// can be used as custom dimensions / metrics
export enum TrackingEventParameters {
  FeatureCardTitle = 'param_feature_card_title',
  FeatureCardId = 'param_feature_card_id',
  Tab = 'param_tab',
  PrevMenu = 'param_prev_menu',
  ChainId = 'param_chain_id',
  ChainName = 'param_chain_name',
  ChainIdAdded = 'param_chain_added',
  Menu = 'param_menu',
  StatsModal = 'param_stats_modal',
  SwitchedChain = 'param_switched_chain',
  SwitchedTheme = 'param_switched_theme',
  SwitchedLanguage = 'param_switched_language',
  AddedTokenAddress = 'param_token_added',
  AddedTokenName = 'param_token_added_chain_id',
  Wallet = 'param_wallet',

  // Transaction:
  RouteId = 'param_route_id',
  Steps = 'param_steps',
  FromToken = 'param_from_token',
  FromChainId = 'param_from_chain_id',
  ToToken = 'param_to_token',
  Timestamp = 'param_timestamp',
  SubStatus = 'param_substatus',
  Status = 'param_status',
  Error = 'param_error',
  Message = 'param_message',
  GasCostUSD = 'param_gas_cost_usd',
  TxHash = 'param_tx_hash',
  TxLink = 'param_tx_link',
  ToChainId = 'param_to_chain_id',
  FromAmount = 'param_from_amount',
  ToAmount = 'param_to_amount',
  ToAmountUSD = 'param_to_amount_usd',
  ToAmountMin = 'param_to_amount_min',
  FromAmountUSD = 'param_from_amount_usd',
  Variant = 'param_variant',
  Type = 'param_type',
  ErrorCode = 'param_error_code',
  ErrorMessage = 'param_error_message',
  InsuranceState = 'param_insurance_state',
  InsuranceFeeAmountUSD = 'param_insurance_fee_amount_usd',
  ValueLoss = 'param_value_loss',
}
