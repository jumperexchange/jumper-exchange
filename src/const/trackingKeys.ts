export const UTM_SOURCE = 'jumper';

/*
  Name of an action that a user makes on the site.
  GA: in GA this is the name of the event that is fired
*/
export enum TrackingAction {
  // WalletMenu
  ConnectWallet = 'action_connect_wallet',
  ClickConnectWallet = 'action_click_connect_wallet',
  CopyAddressToClipboard = 'action_copy_addr_to_clipboard',
  DisconnectWallet = 'action_disconnect_wallet',
  OpenBlockchainExplorer = 'action_open_blockchain_explorer',
  OpenJumperScan = 'action_open_jumper_scan',
  SwitchChain = 'action_switch_chain',
  PortfolioLoaded = 'action_portfolio_loaded',

  // Widget
  OnRouteSelected = 'action_on_route_selected',
  OnRouteExecutionStarted = 'action_on_route_exec_started',
  OnRouteExecutionCompleted = 'action_on_route_exec_completed',
  OnRouteExecutionFailed = 'action_on_route_exec_failed',
  OnRouteExecutionUpdated = 'action_on_route_exec_updated',
  OnRouteHighValueLoss = 'action_on_route_high_value_loss',
  OnSourceChainAndTokenSelection = 'action_on_source_selection',
  OnDestinationChainAndTokenSelection = 'action_on_destination_selection',
  OnWidgetExpanded = 'action_on_widget_expanded',
  OnAvailableRoutes = 'action_available_routes',
  OnTokenSearch = 'action_token_search',
  OnLowAddressActivityConfirmed = 'action_on_low_address_activity_confirmed',
  ClickContribute = 'action_contribute',
  ContributeImpression = 'action_contribute_impression',
  ContributeSuccess = 'action_contribute_success',

  // Welcome_Screen
  ShowWelcomeMessageScreen = 'action_show_welcome_screen',
  CloseWelcomeScreen = 'action_close_welcome_screen',
  OpenToolModal = 'action_open_stats_modal',
  OpenWelcomeMessageLink = 'action_open_welcome_message_link',

  // Feature Card
  ClickFeatureCard = 'action_click_feature_card',
  CloseFeatureCard = 'action_close_feature_card',
  DisplayFeatureCard = 'action_display_feature_card',

  // Menu
  OpenMenu = 'action_open_submenu',
  PageLoad = 'action_pageload',
  SwitchLanguage = 'action_switch_language',
  SwitchTab = 'action_switch_tab',
  SwitchTheme = 'action_switch_theme',
  SwitchThemeTemplate = 'action_switch_theme_template',
  DownloadBrandAssets = 'action_dl_brand_assets',
  ClickConnectToWidget = 'action_click_connect_to_jumper',
  ClickXLink = 'action_click_x_link',
  ClickDiscordLink = 'action_click_discord_link',
  ClickTelegramLink = 'action_click_telegram_link',
  ClickLink3Link = 'action_click_link3_link',
  ClickJumperExchangeLink = 'action_click_jumper_exchange_link',
  ClickJumperMissionsLink = 'action_click_jumper_missions_link',
  ClickJumperLearnLink = 'action_click_jumper_learn_link',
  ClickJumperProfileLink = 'action_click_jumper_profile_link',
  ClickJumperScanLink = 'action_click_jumper-scan_link',
  ClickJumperCampaignLink = 'action_click_jumper-campaign_link',

  // Blog
  SeeAllPosts = 'action_see_all_posts',
  ClickArticleCard = 'action_click_article_card',
  ClickFeaturedArticle = 'action_click_featured_article',
  ClickBlogCTA = 'action_click_blog_cta',
  SwipeCarousel = 'action_swipe_carousel',
  ClickShareArticleFB = 'action_share_article_fb',
  ClickShareArticleLinkedIn = 'action_share_article_linked',
  ClickShareArticleX = 'action_share_article_x',
  ClickShareArticleLink = 'action_share_article_link',
  ClickAuthorsLinkedIn = 'action_click_author_linkedin',
  ClickAuthorsX = 'action_click_author_x',

  // Quests
  ClickQuestCard = 'action_click_quest_card',
  ClickMissionCta = 'action_click_mission_cta',
  ClickMissionCtaSteps = 'action_click_mission_cta_steps',

  // Pagination
  ClickPagination = 'action_click_pagination',

  // Discord
  JoinDiscordCommunity = 'action_join_discord_community',
  OpenDiscordSupport = 'action_open_discord_support',
  PoweredBy = 'action_click_powered_by',

  //Banner
  ClickBanner = 'action_click_banner',
  ClickCampaignBanner = 'action_click_campaign_banner',
}

export enum TrackingCategory {
  MainMenu = 'cat_main_menu',
  Menu = 'cat_menu',
  ErrorPage = 'cat_error_page',
  FeatureCard = 'cat_feature_card',
  Navigation = 'cat_navigation',
  LanguageMenu = 'cat_language_menu',
  ThemesMenu = 'cat_themes_menu',
  SubMenu = 'cat_submenu',
  ThemeSection = 'cat_theme_section',
  DiscordBanner = 'cat_discord_banner',
  Wallet = 'cat_wallet',
  WalletMenu = 'cat_wallet_menu',
  AddressMenu = 'cat_address_menu',
  Connect = 'cat_connect_wallet',
  Pageload = 'cat_pageload',
  WalletSelectMenu = 'cat_wallet_select_menu',
  WelcomeScreen = 'cat_welcome_screen',
  Widget = 'cat_widget',
  WidgetEvent = 'cat_widget_event',
  PoweredBy = 'cat_powered_by',
  BlogCarousel = 'cat_blog_carousel',
  BlogFeaturedArticle = 'cat_blog_featured_article',
  BlogArticlesBoard = 'cat_blog_articles_board',
  BlogArticlesCollection = 'cat_blog_articles_collection',
  BlogArticle = 'cat_blog_article',
  Missions = 'cat_missions',
  Quests = 'cat_quests',
  Banner = 'cat_banner',
  CampaignBanner = 'cat_campaign_banner',
}

// can be used as custom dimensions / metrics
export enum TrackingEventParameter {
  FeatureCardTitle = 'param_feature_card_title',
  FeatureCardId = 'param_feature_card_id',
  Tab = 'param_tab',
  ChainId = 'param_chain_id',
  Menu = 'param_menu',
  ToolModal = 'param_stats_modal',
  WelcomeMessageLink = 'param_welcome_message_link',
  SwitchedChain = 'param_switched_chain',
  SwitchedTheme = 'param_switched_theme',
  SwitchedTemplate = 'param_switched_template',
  SwitchedLanguage = 'param_switched_language',
  Wallet = 'param_wallet',
  WalletAddress = 'param_wallet_address',
  Ecosystem = 'param_ecosystem',
  Integrator = 'param_integrator',

  // Widget:
  SourceChainSelection = 'param_source_chain',
  SourceTokenSelection = 'param_source_token',
  DestinationChainSelection = 'param_destination_chain',
  DestinationTokenSelection = 'param_destination_token',

  // Pageload:
  PageloadSource = 'param_pageload_source',
  PageloadURL = 'param_pageload_url',
  PageloadDestination = 'param_pageload_destination',
  PageloadExternal = 'param_pageload_external',

  // Selection:
  RoutePosition = 'param_route_position',

  // Transaction:
  Action = 'param_action',
  ErrorCode = 'param_error_code',
  ErrorMessage = 'param_error_message',
  FeeCost = 'param_fee_cost',
  FeeCostFormatted = 'param_fee_cost_formatted',
  FeeCostUSD = 'param_fee_cost_usd',
  FromAmount = 'param_from_amount',
  FromAmountUSD = 'param_from_amount_usd',
  FromToken = 'param_from_token',
  FromChainId = 'param_from_chain_id',
  LastStepAction = 'param_last_step_action',
  Error = 'param_error',
  Exchange = 'param_exchange',
  GasCost = 'param_gas_cost',
  GasCostFormatted = 'param_gas_cost_formatted',
  GasCostUSD = 'param_gas_cost_usd',
  IsFinal = 'param_is_final',
  Message = 'param_message',
  NbOfSteps = 'param_nb_of_steps',
  RouteId = 'param_route_id',
  Routes = 'param_routes',
  SessionId = 'param_session_id',
  Slippage = 'param_slippage',
  Status = 'param_status',
  StepIds = 'param_step_ids',
  Steps = 'param_steps',
  ToToken = 'param_to_token',
  ToChainId = 'param_to_chain_id',
  Timestamp = 'param_timestamp',
  Tags = 'param_tags',
  Time = 'param_time',
  ToAmount = 'param_to_amount',
  ToAmountFormatted = 'param_to_amount_formatted',
  ToAmountUSD = 'param_to_amount_usd',
  ToAmountMin = 'param_to_amount_min',
  TransactionId = 'param_transaction_id',
  TransactionHash = 'param_transaction_hash',
  TransactionLink = 'param_transaction_link',
  TransactionStatus = 'param_transaction_status',
  Type = 'param_type',
  ValueLoss = 'param_value_loss',

  // Blog
  ArticleCardId = 'param_article_card_id',
  SwipeDirection = 'param_swipe_direction',
  ArticleTitle = 'param_article_title',
  ArticleID = 'param_article_id',

  // Pagination
  Pagination = 'param_pagination',
  PaginationCat = 'param_pagination_cat',

  // Author
  AuthorName = 'param_author_name',
  AuthorId = 'param_author_id',

  // Quests
  QuestCardTitle = 'param_quest_card_title',
  QuestCardLabel = 'param_quest_card_label',
  QuestCardId = 'param_quest_card_id',
  QuestCardPlatform = 'param_quest_card_platform',
  MissionCtaRewardId = 'param_mission_cta_reward_id',
  MissionCtaClaimingId = 'param_mission_cta_claiming_id',
  MissionCtaTitle = 'param_mission_cta_title',
  MissionCtaLabel = 'param_mission_cta_label',
  MissionCtaPartnerId = 'param_mission_cta_partner_id',
  MissionCtaCampaign = 'param_mission_cta_campaign',
  MissionCtaStepsTitle = 'param_mission_cta_steps_title',
  MissionCtaStepsLink = 'param_mission_cta_steps_link',
  MissionCtaStepsTaskStepId = 'param_mission_cta_steps_task_step_id',
  MissionCtaStepsCTA = 'param_mission_cta_steps_cta',
  MissionCtaStepsIndex = 'param_mission_cta_steps_index',

  // Search
  SearchValue = 'param_search_value',
  SearchIsAddress = 'param_search_is_address',
  SearchAddressType = 'param_search_address_type',
  SearchNumberOfResult = 'param_search_nb_result',
  SearchNothingFound = 'param_search_nothing_found',
  SearchFirstResultAddress = 'param_search_first_result_address',
  SearchFirstResultName = 'param_search_first_result_name',
  SearchFirstResultSymbol = 'param_search_first_result_symbol',
  SearchFirstResultChainId = 'param_search_first_result_chain_id',

  //Banner
  ActiveCampaign = 'param_banner_campaign',
  ActiveCampaignBanner = 'param_campaign_banner_campaign',
}
