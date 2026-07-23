/* eslint-disable */
/* tslint:disable */
// @ts-nocheck
import config from '@/config/env-config';
/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API        ##
 * ##                                                           ##
 * ## AUTHOR: acacode                                           ##
 * ## SOURCE: https://github.com/acacode/swagger-typescript-api ##
 * ---------------------------------------------------------------
 */

export interface JumperStringResponse {
  /** @example 200 */
  status: number;
  /** @example "Success" */
  message: string;
  data: string;
  meta: Record<string, any>;
}

export type EmptyMeta = object;

export interface CacheClearDto {
  /** @example "Redis key myKey cleared successfully" */
  message: string;
}

export interface CacheClearResponse {
  /** @example 200 */
  status: number;
  /** @example "Success" */
  message: string;
  meta: EmptyMeta;
  data: CacheClearDto;
}

export interface AuthTokenDto {
  /** @example "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." */
  access_token: string;
}

export interface AuthLoginResponse {
  /** @example 200 */
  status: number;
  /** @example "Success" */
  message: string;
  meta: EmptyMeta;
  data: AuthTokenDto;
}

export interface WalletEVM {
  address: string;
  message: string;
  signature: string;
}

export interface SolanaSignature {
  type: string;
  data: number[];
}

export interface WalletSolana {
  message: string;
  signature: SolanaSignature;
  publicKey: string;
}

export interface VerifyWalletDto {
  /** EVM wallet */
  evm?: WalletEVM;
  /** Solana wallet */
  solana?: WalletSolana;
}

export interface VerifyWalletResponseDto {
  /** @example true */
  evm: boolean;
  /** @example false */
  solana: boolean;
}

export interface VerifyWalletResponseResult {
  /** @example 200 */
  status: number;
  /** @example "Success" */
  message: string;
  meta: EmptyMeta;
  data: VerifyWalletResponseDto;
}

export interface WalletVerificationDto {
  /** Origin wallet data */
  origin_wallet: WalletEVM;
  /** Destination wallet data */
  destination_wallet: WalletEVM;
}

export interface VerifyWalletsResponseDto {
  /** @example true */
  success: boolean;
  /** @example 42 */
  verification_id: number;
}

export interface VerifyWalletsResponse {
  /** @example 200 */
  status: number;
  /** @example "Success" */
  message: string;
  meta: EmptyMeta;
  data: VerifyWalletsResponseDto;
}

export interface CreateUserTrackingDto {
  /**
   * The category of the tracking event
   * @example "login"
   */
  category: string;
  /**
   * The action of the tracking event
   * @example "success"
   */
  action: string;
  /**
   * The label of the tracking event
   * @example "Login Page"
   */
  label: string;
  /**
   * The URL of the tracking event
   * @example "https://example.com/login"
   */
  url: string;
  /**
   * The referrer of the tracking event
   * @example "https://example.com/login"
   */
  referrer?: string | null;
  /**
   * The value associated with the tracking event
   * @example 1
   */
  value: number;
  /**
   * Additional data related to the tracking event
   * @example {"additionalInfo":"User clicked login button","timestamp":"2024-08-01T12:34:56.789Z"}
   */
  data: Record<string, any>;
  /**
   * Whether the user is connected
   * @example true
   */
  isConnected: boolean;
  /**
   * The browser fingerprint of the user
   * @example "abc123"
   */
  browserFingerprint: string;
  /**
   * The session ID of the user
   * @example "session123"
   */
  sessionId: string;
  /**
   * Whether the event was triggered from a mobile device
   * @example false
   */
  isMobile: boolean;
  /**
   * Wallet address of a user
   * @example "0x1234567890abcdef"
   */
  walletAddress: string;
  /**
   * Wallet provider of a user
   * @example "MetaMask"
   */
  walletProvider?: string | null;
  abTestVariants?: object;
}

export interface JumperUndefinedResponse {
  /** @example 200 */
  status: number;
  /** @example "Success" */
  message: string;
  data: string | null;
  meta: Record<string, any>;
}

export interface RewardEntity {
  /**
   * Unique identifier for the reward
   * @example 1
   */
  id: number;
  /**
   * Type of the reward
   * @example "voucher"
   */
  type: string;
  /**
   * Name of the reward
   * @example "Amazon Gift Card"
   */
  name: string;
  /**
   * Description of the reward
   * @example "A $50 Amazon gift card"
   */
  description: string | null;
  /**
   * Image URL of the reward
   * @example "https://example.com/image.png"
   */
  image: string | null;
}

export interface WalletRewardEntity {
  /**
   * Unique identifier for the wallet reward
   * @example 1
   */
  id: number;
  /**
   * Timestamp when the wallet reward was created
   * @format date-time
   * @example "2023-01-01T00:00:00Z"
   */
  timestamp: string;
  /**
   * Points associated with the wallet reward
   * @example 100
   */
  points: number;
  /**
   * Sub value associated with the wallet reward
   * @example 10.5
   */
  subValue: number;
  /** Wallet associated with the reward */
  wallet: WalletEntity;
  /** Reward associated with the wallet */
  reward: RewardEntity;
}

export interface TraitEntity {
  /**
   * Unique identifier for the wallet reward
   * @example 1
   */
  id: number;
  /**
   * Timestamp when the user trait was created
   * @format date-time
   * @example "2023-01-01T00:00:00Z"
   */
  timestamp: string;
  /** Name of the trait */
  name: string;
  /** Description of the trait */
  description: string;
  /** Type of the trait */
  type: string;
  /** Image URI of the trait */
  imageURI: string;
}

export interface WalletTraitEntity {
  /**
   * Unique identifier for the wallet reward
   * @example 1
   */
  id: number;
  /**
   * Timestamp when the user trait was created
   * @format date-time
   * @example "2023-01-01T00:00:00Z"
   */
  timestamp: string;
  /** Category of the trait */
  category: string;
  /** Sub Category of the trait */
  subCategory: string;
  /** Criteria of the trait */
  criteria: object;
  /** Trait associated with the wallet trait */
  trait: TraitEntity;
  /** Wallet associated with the traits */
  wallet: WalletEntity;
}

export interface WalletTransactionEntity {
  /**
   * Unique identifier for the wallet transaction
   * @example 1
   */
  id: number;
  /**
   * Session ID associated with the transaction
   * @example "session123"
   */
  sessionId: string;
  /**
   * Timestamp when the transaction occurred
   * @format date-time
   * @example "2023-01-01T00:00:00Z"
   */
  timestamp: string;
  /**
   * Action performed in the transaction
   * @example "transfer"
   */
  action: string;
  /**
   * Type of transaction (e.g., evm, svm)
   * @example "evm"
   */
  type: string;
  /**
   * Hash of the transaction
   * @example "0x1234567890abcdef"
   */
  transactionHash: string;
  /**
   * Status of the transaction
   * @example "success"
   */
  transactionStatus: string;
  /**
   * Chain ID from which the transaction originated
   * @example 1
   */
  fromChainId: number;
  /**
   * Chain ID to which the transaction is directed
   * @example 2
   */
  toChainId: number;
  /**
   * Token from which the transaction is made
   * @example "ETH"
   */
  fromToken: string;
  /**
   * Token to which the transaction is made
   * @example "USDT"
   */
  toToken: string;
  /**
   * Exchange used for the transaction
   * @example "Uniswap"
   */
  exchange: string;
  /**
   * Step number in the transaction process
   * @example 1
   */
  stepNumber: number;
  /**
   * Indicates if the transaction is final
   * @example false
   */
  isFinal: boolean;
  /**
   * Gas cost of the transaction
   * @example 21000
   */
  gasCost: number;
  /**
   * Gas cost in USD
   * @example 10.5
   */
  gasCostUSD: number | null;
  /**
   * Route ID associated with the transaction
   * @example "route123"
   */
  routeId: string;
  /**
   * Amount from which the transaction is made
   * @example 1
   */
  fromAmount: number;
  /**
   * Amount to which the transaction is made
   * @example 1000
   */
  toAmount: number;
  /**
   * Minimum amount to which the transaction is made
   * @example 999.9
   */
  toAmountMin: number;
  /**
   * Amount in USD from which the transaction is made
   * @example 1000
   */
  fromAmountUSD: number | null;
  /**
   * Amount in USD to which the transaction is made
   * @example 1000
   */
  toAmountUSD: number | null;
  /**
   * Error code if the transaction failed
   * @example 404
   */
  errorCode: number | null;
  /**
   * Error message if the transaction failed
   * @example "Transaction not found"
   */
  errorMessage: string | null;
  /**
   * Integrator associated with the transaction
   * @example "integrator123"
   */
  integrator: string;
  /**
   * Pathname associated with the transaction
   * @example "/api/transaction"
   */
  pathname: string | null;
  /** Wallet associated with the transaction */
  wallet: WalletEntity;
}

export interface TaskVerificationEntity {
  /**
   * Unique identifier for the quest verification
   * @example 1
   */
  id: number;
  /**
   * Timestamp when the quest verification was created
   * @format date-time
   * @example "2023-01-01T00:00:00Z"
   */
  timestamp: string;
  /**
   * Label on strapi
   * @example "test-quest-label"
   */
  label: string;
  /**
   * Slug on strapi
   * @example "test-quest-slug"
   */
  slug: string;
  /**
   * Task name on strapi
   * @example "test-quest-task-name"
   */
  taskName: string;
  /**
   * Quest id on strapi
   * @example "test-quest-id"
   */
  questId: string;
  /**
   * Step id on strapi
   * @example "0194d10e-29d6-767e-ae22-3535782e796e"
   */
  stepId: string;
  /** Wallet associated with the quest verification */
  wallet: WalletEntity;
  /**
   * Additional dynamic fields
   * @example {"customKey1":"value1","customKey2":"value2"}
   */
  additionalFields: object;
}

export interface UserTrackingEntity {
  /**
   * Unique identifier for the user tracking entry
   * @example 1
   */
  id: number;
  /**
   * Category of the tracking event
   * @example "page_view"
   */
  category: string;
  /**
   * Action of the tracking event
   * @example "click"
   */
  action: string;
  /**
   * Label of the tracking event
   * @example "signup_button"
   */
  label: string;
  /**
   * URL where the tracking event occurred
   * @example "https://example.com/signup"
   */
  url: string;
  /**
   * Value associated with the tracking event
   * @example 100
   */
  value: number;
  /**
   * Additional data associated with the tracking event
   * @example {"key":"value"}
   */
  data: object;
  /**
   * Timestamp when the tracking event occurred
   * @format date-time
   * @example "2023-01-01T00:00:00Z"
   */
  timestamp: string;
  /**
   * Indicates if the user is connected
   * @example true
   */
  isConnected: boolean;
  /**
   * IP address of the user
   * @example "192.168.1.1"
   */
  ip: string | null;
  /**
   * Browser fingerprint of the user
   * @example "abc123"
   */
  browserFingerprint: string;
  /**
   * Location of the user
   * @example "New York, USA"
   */
  location: string | null;
  /**
   * Session ID of the user
   * @example "session123"
   */
  sessionId: string;
  /**
   * User agent of the browser
   * @example "Mozilla/5.0"
   */
  browserUserAgent: string | null;
  /**
   * Indicates if the user is on a mobile device
   * @example false
   */
  isMobile: boolean;
  /** Wallet associated with the tracking event */
  wallet: WalletEntity | null;
  /** User associated with the tracking event */
  user: UserEntity;
}

export interface WalletEntity {
  /**
   * Unique wallet address
   * @example "0x1234567890abcdef"
   */
  walletAddress: string;
  /**
   * Timestamp when the wallet was created
   * @format date-time
   * @example "2023-01-01T00:00:00Z"
   */
  timestamp: string;
  /** List of rewards associated with the wallet */
  rewards: WalletRewardEntity[];
  /** List of traits associated with the wallet */
  traits: WalletTraitEntity[];
  /** List of transactions associated with the wallet */
  transactions: WalletTransactionEntity[];
  /** List of quest verifications associated with the wallet */
  taskVerifications: TaskVerificationEntity[];
  /** List of user trackings associated with the wallet */
  trackings: UserTrackingEntity[];
  /** User associated with the wallet */
  user: UserEntity;
}

export interface UserEntity {
  /**
   * Unique identifier for the user
   * @example "123e4567-e89b-12d3-a456-426614174000"
   */
  id: string;
  /**
   * Timestamp when the user was created
   * @format date-time
   * @example "2023-01-01T00:00:00Z"
   */
  timestamp: string;
  /** List of wallets associated with the user */
  wallets: WalletEntity[];
}

export interface UserItemResponse {
  /** @example 200 */
  status: number;
  /** @example "Success" */
  message: string;
  meta: EmptyMeta;
  data: UserEntity;
}

export interface UserTraitListResponse {
  /** @example 200 */
  status: number;
  /** @example "Success" */
  message: string;
  meta: EmptyMeta;
  data: WalletTraitEntity[];
}

export interface PointsRangePaginationMeta {
  total: number;
  page: number;
  limit: number;
  pagesLength: number;
}

export interface LeaderboardEntity {
  /**
   * Unique identifier for the leaderboard entry
   * @example "123e4567-e89b-12d3-a456-426614174000"
   */
  id: string;
  /**
   * Wallet address associated with the leaderboard entry
   * @example "0x1234567890abcdef1234567890abcdef12345678"
   */
  walletAddress: string;
  /**
   * Points accumulated by the wallet
   * @example 1500
   */
  points: number;
  /**
   * Position of the wallet in the leaderboard
   * @example 1
   */
  position: number;
}

export interface PointsRangeListResponse {
  /** @example 200 */
  status: number;
  /** @example "Success" */
  message: string;
  meta: PointsRangePaginationMeta;
  data: LeaderboardEntity[];
}

export interface CreateWalletTransactionDto {
  sessionId: string;
  /**
   * The browser fingerprint of the user
   * @example "abc123"
   */
  browserFingerprint?: string | null;
  action: string;
  /** Type of the transaction, e.g., 'evm', 'svm' */
  type: string;
  transactionHash?: string | null;
  transactionStatus: string;
  fromChainId: number;
  toChainId: number;
  fromToken: string;
  toToken: string;
  fromAmount: number;
  toAmount: number;
  toAmountMin?: number;
  fromAmountUSD?: number;
  toAmountUSD?: number;
  toAmountFormatted?: string | null;
  tokenCount?: number;
  gasCost?: number;
  gasCostFormatted?: string | null;
  gasCostUSD?: number;
  feeCost?: number;
  feeCostFormatted?: string | null;
  feeCostUSD?: number;
  /** @default 0 */
  stepNumber?: number;
  steps?: string | null;
  nbOfSteps?: number;
  stepIds?: string | null;
  lastStepAction?: string | null;
  routeId: string;
  exchange?: string | null;
  slippage?: number;
  maxSlippage?: string | null;
  tags?: string | null;
  time?: number;
  /** @default false */
  isFinal?: boolean;
  transactionId?: string | null;
  transactionLink?: string | null;
  errorCode?: object;
  errorCodeKey?: string;
  errorMessage?: string | null;
  message?: string | null;
  status?: string | null;
  walletAddress?: string | null;
  /**
   * Wallet provider of a user
   * @example "MetaMask"
   */
  walletProvider?: string | null;
  integrator?: string | null;
  url?: string | null;
  pathname?: string | null;
  referrer?: string | null;
  abtests?: object;
  abTestVariants?: object;
  /** @format date-time */
  timestamp: string;
}

export interface JumperNullResponse {
  /** @example 200 */
  status: number;
  /** @example "Success" */
  message: string;
  /** @example null */
  data: string | null;
  meta: Record<string, any>;
}

export interface WalletTransactionListResponse {
  /** @example 200 */
  status: number;
  /** @example "Success" */
  message: string;
  meta: EmptyMeta;
  data: WalletTransactionEntity[];
}

export interface WalletPaginationMeta {
  total: number;
  page: number;
  limit: number;
  pagesLength: number;
}

export interface WalletRewardsByNameListResponse {
  /** @example 200 */
  status: number;
  /** @example "Success" */
  message: string;
  meta: WalletPaginationMeta;
  data: WalletRewardEntity[];
}

export interface WalletRewardsSummaryDto {
  sum: number;
  level: number;
  walletRewards: WalletRewardEntity[];
}

export interface WalletRewardsSummaryResponse {
  /** @example 200 */
  status: number;
  /** @example "Success" */
  message: string;
  meta: EmptyMeta;
  data: WalletRewardsSummaryDto;
}

export interface WalletTraitListResponse {
  /** @example 200 */
  status: number;
  /** @example "Success" */
  message: string;
  meta: EmptyMeta;
  data: WalletTraitEntity[];
}

export interface RewardTypeDto {
  type: string;
  currentRangeXP: number;
  nextRangeXP: number;
  currentValue: number;
  min: number;
  max: number;
}

export interface OngoingRewardsListResponse {
  /** @example 200 */
  status: number;
  /** @example "Success" */
  message: string;
  meta: EmptyMeta;
  data: RewardTypeDto[];
}

export interface JumperStringArrayResponse {
  /** @example 200 */
  status: number;
  /** @example "Success" */
  message: string;
  data: string[];
  meta: Record<string, any>;
}

export interface LeaderboardPaginationMeta {
  total: number;
  page: number;
  limit: number;
  pagesLength: number;
}

export interface LeaderboardListResponse {
  /** @example 200 */
  status: number;
  /** @example "Success" */
  message: string;
  meta: LeaderboardPaginationMeta;
  data: LeaderboardEntity[];
}

export interface LeaderboardCenteredListResponse {
  /** @example 200 */
  status: number;
  /** @example "Success" */
  message: string;
  meta: EmptyMeta;
  data: LeaderboardEntity[];
}

export interface LeaderboardItemResponse {
  /** @example 200 */
  status: number;
  /** @example "Success" */
  message: string;
  meta: EmptyMeta;
  data: LeaderboardEntity;
}

export interface MerklUserRewardDto {
  chainId: number;
  /** Token contract address */
  address: string;
  symbol: string;
  logoURI: string;
  amountToClaim: number;
  tokenDecimals: number;
  type: 'merkl';
  amountAccumulated: number;
  /** Raw amount for the claiming contract (no decimals applied) */
  accumulatedAmountForContractBN: string;
  proof: string[];
  claimingAddress: string;
}

export interface DeFiReacherUserRewardDto {
  chainId: number;
  /** Token contract address */
  address: string;
  symbol: string;
  logoURI: string;
  amountToClaim: number;
  tokenDecimals: number;
  type: 'defi-reacher';
  campaignId: string;
  contractAddress: string;
}

export interface UserRewardsResponseDto {
  rewards: (
    | ({
        type: 'merkl';
      } & MerklUserRewardDto)
    | ({
        type: 'defi-reacher';
      } & DeFiReacherUserRewardDto)
  )[];
}

export interface RewardClaimArgsDto {
  index: string;
  account: string;
  amount: string;
  merkleProof: string[];
}

export interface RewardClaimDataDto {
  calldata: string;
  contractAddress: string;
  chainId: number;
  functionName: string;
  args: RewardClaimArgsDto;
}

export interface ValidateRewardBodyDto {
  provider: 'defi-reacher';
  txHash: string;
}

export interface RewardValidationResultDto {
  success: boolean;
  status: string;
  campaignId?: string;
  transactionHash?: string;
  walletAddress?: string;
}

export interface Chain {
  chainId: number;
  chainKey: string;
}

export interface Token {
  name: string;
  symbol: string;
  decimals: number;
  logo?: string | null;
  address: string;
  chain: Chain;
}

export interface Protocol {
  name: string;
  product?: string | null;
  version?: string | null;
  logo?: string | null;
  riskDescription?: string | null;
  url?: string | null;
}

// --- JUM-845 scoped manual addition (reconcile on next full `pnpm api` regen) ---
// Vault warning messages surfaced on the earn opportunity details page.
// Hand-added (not auto-generated) to keep the PR scoped to JUM-845.
export enum VaultMessageSeverity {
  Info = 'info',
  Warning = 'warning',
  Critical = 'critical',
}

export interface VaultMessage {
  content: string;
  severity: VaultMessageSeverity;
  /** @format date-time */
  publishedAt: string;
}
// --- end JUM-845 scoped manual addition ---

export interface EarnInteractionFlags {
  canBorrow: boolean;
  canDeposit: boolean;
  canRepay: boolean;
  canRewardClaim: boolean;
  canRewardCompound: boolean;
  canWithdraw: boolean;
}

export interface RewardApiLink {
  type: 'merkl-campaign' | 'merkl-opportunity' | 'merkl-opportunity-breakdown';
  identifier: string;
  chain?: Chain;
}

export interface APYItem {
  base: number;
  reward: number;
  intrinsic: number;
  jumperReward?: number;
  customReward?: number;
  total: number;
}

export interface EarnOpportunityHistoryItem {
  /** @format date-time */
  date: string;
  /** Total value locked in USD */
  tvlUsd: string;
  /** Total value locked in native currency */
  tvlNative: string;
  apy: APYItem;
}

export interface VaultCapacity {
  /** Remaining capacity in the vault asset native units (scale by asset.decimals); not USD. */
  remaining?: string;
  /** Max capacity in the vault asset native units (scale by asset.decimals); not USD. */
  max?: string;
  /** True when the vault has unlimited capacity (vaults.fyi sentinel); remaining/max omitted in that case. */
  unlimited?: boolean;
}

export interface VaultFees {
  /** Performance fee as a fraction (0.02 = 2%). */
  performance?: number;
  /** Management fee as a fraction (0.02 = 2%). */
  management?: number;
  /** Withdrawal fee as a fraction (0.02 = 2%). */
  withdrawal?: number;
  /** Deposit fee as a fraction (0.02 = 2%). */
  deposit?: number;
}

export interface EarnOpportunityWithLatestAnalytics {
  name: string;
  asset: Token;
  protocol: Protocol;
  isRedeemable: boolean;
  url?: string | null;
  description: string;
  tags: string[];
  rewards: Token[];
  /** JUM-845 scoped manual addition — reconcile on next full regen. */
  messages: VaultMessage[];
  lpToken: Token;
  slug: string;
  featured: boolean;
  lockupDays?: number;
  /**
   * The cap in dollar. Deprecated: use capacity instead.
   * @deprecated
   */
  capInDollar?: string;
  /** @deprecated */
  rewardsApy?: number;
  forYou: boolean;
  interactionFlags: EarnInteractionFlags;
  rewardApiLinks?: RewardApiLink[];
  latest: EarnOpportunityHistoryItem;
  capacity?: VaultCapacity;
  fees?: VaultFees;
}

export interface EarnListResponse {
  /** @example 200 */
  status: number;
  /** @example "Success" */
  message: string;
  meta: EmptyMeta;
  data: EarnOpportunityWithLatestAnalytics[];
}

export interface EarnItemResponse {
  /** @example 200 */
  status: number;
  /** @example "Success" */
  message: string;
  meta: EmptyMeta;
  data: EarnOpportunityWithLatestAnalytics;
}

export interface ApyHistoryPoint {
  /** The timestamp of the data point */
  t: number;
  /** The base APY. Null when data is unavailable. */
  base: number | null;
  /** The reward APY. Null when data is unavailable. */
  reward: number | null;
  /** The intrinsic APY from the underlying asset. Null when data is unavailable. */
  intrinsic: number | null;
  /** The total APY (base + reward + intrinsic). Null when data is unavailable. */
  total: number | null;
}

export interface ApyAnalyticsHistory {
  /** The APY data points with base, reward, and total */
  points: ApyHistoryPoint[];
}

export interface ApyAnalyticsHistoryResponse {
  /** @example 200 */
  status: number;
  /** @example "Success" */
  message: string;
  meta: EmptyMeta;
  data: ApyAnalyticsHistory;
}

export interface HistoryPoint {
  /** The timestamp of the data point, in milliseconds (Unix epoch ms). */
  t: number;
  /** The value of the data point. Null when data is unavailable. */
  v: number | string | null;
}

export interface HistoryGraph {
  /** The data points */
  points: HistoryPoint[];
}

export interface EarnOpportunityHistoryResponse {
  /** @example 200 */
  status: number;
  /** @example "Success" */
  message: string;
  meta: EmptyMeta;
  data: HistoryGraph;
}

export interface JumperFreeFormResponse {
  /** @example 200 */
  status: number;
  /** @example "Success" */
  message: string;
  data: Record<string, any> | null;
  meta: Record<string, any>;
}

export interface CallDataTxDto {
  /**
   * Address of the transaction recipient
   * @example "0x742d35Cc6634C0532925a3b8D598C2FF000f5E58"
   */
  to: string;
  /**
   * Hex-encoded calldata, 0x-prefixed
   * @example "0xabcdef"
   */
  data: string;
  /**
   * Value (in wei) to send with the transaction
   * @example "0"
   */
  value?: string;
  /**
   * Chain ID of the transaction
   * @example 1
   */
  chainId: number;
}

export interface CallDataActionDto {
  /**
   * Name of the action step
   * @example "request-redeem"
   */
  name: string;
  tx: CallDataTxDto;
}

export interface CallDataResponseDto {
  /**
   * Index of the current action in the actions array
   * @example 0
   */
  currentActionIndex: number;
  /** Ordered list of transaction steps to execute */
  actions: CallDataActionDto[];
}

export interface CallDataResponse {
  /** @example 200 */
  status: number;
  /** @example "Success" */
  message: string;
  meta: EmptyMeta;
  data: CallDataResponseDto;
}

export interface NftDto {
  /**
   * Token contract address
   * @example "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48"
   */
  address: string;
  /**
   * Chain ID
   * @example 1
   */
  chainId: number;
  /**
   * Token ID
   * @example "115224"
   */
  tokenId: string;
}

export interface TokenDto {
  /**
   * Token contract address
   * @example "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48"
   */
  address: string;
  /**
   * Chain ID
   * @example 1
   */
  chainId: number;
  /**
   * Token ticker symbol
   * @example "USDC"
   */
  symbol: string;
  /**
   * Number of decimals
   * @example 6
   */
  decimals: number;
  /**
   * Full token name
   * @example "USD Coin"
   */
  name: string;
  /**
   * LI.FI CoinKey identifier
   * @example "USDC"
   */
  coinKey?:
    | 'ETH'
    | 'MATIC'
    | 'POL'
    | 'BNB'
    | 'DAI'
    | 'FTM'
    | 'AVAX'
    | 'ONE'
    | 'FSN'
    | 'MOVR'
    | 'CELO'
    | 'FUSE'
    | 'TLOS'
    | 'CRO'
    | 'RBTC'
    | 'VLX'
    | 'GLMR'
    | 'METIS'
    | 'EVM'
    | 'MNT'
    | 'SEI'
    | 'G'
    | 'IMX'
    | 'KAIA'
    | 'OKB'
    | 'WLD'
    | 'LSK'
    | 'BERA'
    | 'S'
    | 'APE'
    | 'GHO'
    | 'WGHO'
    | 'XTZ'
    | 'HYPE'
    | 'XDC'
    | 'VIC'
    | 'FLR'
    | 'VAN'
    | 'RON'
    | 'PLUME'
    | 'NIBI'
    | 'SOPH'
    | 'XPL'
    | 'FLOW'
    | 'MON'
    | 'GUSDT'
    | 'SOL'
    | 'wSOL'
    | 'FOGO'
    | 'wFOGO'
    | 'SUI'
    | 'BTC'
    | 'BCH'
    | 'LTC'
    | 'DOGE'
    | 'ZEC'
    | 'TRX'
    | 'WTRX'
    | 'XAUt'
    | 'HEMI'
    | 'USDT'
    | 'USDC'
    | 'BUSD'
    | 'USDCe'
    | 'USDCs'
    | 'USDCn'
    | 'USDe'
    | 'USDB'
    | 'FRAX'
    | 'axlUSDC'
    | 'FDUSD'
    | 'HONEY'
    | 'BYUSD'
    | 'APEUSD'
    | 'FEUSD'
    | 'USDT0'
    | 'USDF'
    | 'USDm'
    | 'USD1'
    | 'PathUSD'
    | 'WBTC'
    | 'WETH'
    | 'SUSHI'
    | 'DODO'
    | 'MCB'
    | 'CELR'
    | 'IF'
    | 'RUNE'
    | 'WMNT'
    | 'frxETH'
    | 'wfrxETH'
    | 'WSEI'
    | 'WG'
    | 'WIMX'
    | 'WPOL'
    | 'WKAIA'
    | 'WOKB'
    | 'WBNB'
    | 'WCRO'
    | 'WBERA'
    | 'wS'
    | 'WAPE'
    | 'WXTZ'
    | 'WHYPE'
    | 'WXDC'
    | 'WVIC'
    | 'WFLR'
    | 'WVAN'
    | 'WRON'
    | 'WPLUME'
    | 'WNIBI'
    | 'WSOPH'
    | 'WFRAX'
    | 'WXPL'
    | 'WFLOW'
    | 'WMON'
    | 'pBTC'
    | 'WTLOS'
    | null;
  /**
   * Token logo URL
   * @example "https://assets.coingecko.com/coins/images/6319/thumb/usdc.png"
   */
  logoURI?: string | null;
  /**
   * Token price in USD as a string
   * @example "1.00"
   */
  priceUSD: string;
}

export interface TokenBalance {
  name: string;
  symbol: string;
  decimals: number;
  logo?: string | null;
  address: string;
  chain: Chain;
  chainType: string;
  /** The amount of the token in the native currency */
  amount: string;
  amountUSD: number;
}

export interface TokenBalances {
  balances: TokenBalance[];
  /** @format date-time */
  updatedAt: string;
}

export interface TokenBalancesResponse {
  /** @example 200 */
  status: number;
  /** @example "Success" */
  message: string;
  meta: EmptyMeta;
  data: TokenBalances;
}

export interface DefiToken {
  name: string;
  symbol: string;
  decimals: number;
  logo?: string | null;
  address: string;
  chain: Chain;
  chainType: string;
  /** The amount of the token in the native currency */
  amount: string;
  amountUSD: number;
  priceUSD: number;
}

export interface LpToken {
  name: string;
  symbol: string;
  address: string;
  decimals?: number;
  logo?: string | null;
  chain: Chain;
}

export interface ChainDefiPosition {
  source: 'chain';
  name: string;
  /** Additional context about the position */
  description?: string | null | number | null;
  assetUsd: number;
  debtUsd: number;
  netUsd: number;
  address: string;
  earn?: string | null;
  earnInteractionFlags?: EarnInteractionFlags;
  latest?: EarnOpportunityHistoryItem;
  /** @format date-time */
  unlockAt?: string;
  /** @format date-time */
  openedAt?: string;
  type: string;
  protocol: Protocol;
  chain: Chain;
  supplyTokens: DefiToken[];
  borrowTokens: DefiToken[];
  assetTokens: DefiToken[];
  collateralTokens: DefiToken[];
  rewardTokens: DefiToken[];
  lpToken?: LpToken;
}

export interface App {
  /** Unique identifier for the app, e.g., "hyperliquid", "polymarket" */
  key: string;
  /** URL to app logo */
  logo?: string | null;
  /** App website URL */
  url: string;
}

export interface AppToken {
  chainType: string;
  /** The amount of the token in the native currency */
  amount: string;
  amountUSD: number;
  name: string;
  symbol: string;
  decimals: number;
  /** URL to token logo */
  logo?: string | null;
  address: string;
  app: App;
  priceUSD: number;
}

export interface PredictionDetails {
  name: string;
  side: string;
  amount: number;
  price: number;
  claimable: boolean;
  eventEndAt?: number | null;
  isMarketClosed: boolean;
}

export interface AppDefiPosition {
  source: 'app';
  name: string;
  /** Additional context about the position */
  description?: string | null | number | null;
  assetUsd: number;
  debtUsd: number;
  netUsd: number;
  address: string;
  earn?: string | null;
  earnInteractionFlags?: EarnInteractionFlags;
  latest?: EarnOpportunityHistoryItem;
  /** @format date-time */
  unlockAt?: string;
  /** @format date-time */
  openedAt?: string;
  type: string;
  protocol: Protocol;
  app: App;
  supplyTokens: AppToken[];
  borrowTokens: AppToken[];
  assetTokens: AppToken[];
  collateralTokens: AppToken[];
  rewardTokens: AppToken[];
  predictionDetails?: PredictionDetails;
}

export interface MetadataWithUpdatedAt {
  /** @format date-time */
  updatedAt: string;
}

export interface WalletPositions {
  /** @example 200 */
  status: number;
  /** @example "Success" */
  message: string;
  meta: MetadataWithUpdatedAt;
  data: (
    | ({
        source: 'chain';
      } & ChainDefiPosition)
    | ({
        source: 'app';
      } & AppDefiPosition)
  )[];
}

export interface BalanceHistoryResponse {
  /** @example 200 */
  status: number;
  /** @example "Success" */
  message: string;
  meta: EmptyMeta;
  data: HistoryGraph;
}

export interface PnlResponseDto {
  /** The PnL value in USD */
  pnl?: number;
  /** The PnL percentage. When multiple addresses are provided, this field will be undefined */
  pnlPercentage?: number;
}

export interface TransactionsPaginationMeta {
  next?: string | null;
  pagesLength: number;
}

export interface BalanceDto {
  /** Token or NFT info */
  token?: TokenDto | NftDto | null;
  /** Token amount */
  amount: number;
  /** Token amount in USD */
  amountUsd?: number | null;
}

export interface ProtocolDto {
  /** Protocol name */
  name?: string | null;
  /** Protocol icon Url */
  icon?: string | null;
}

export interface TransactionsDto {
  /** Tokens sent in this transaction */
  fromBalances: BalanceDto[];
  /** Tokens received in this transaction */
  toBalances: BalanceDto[];
  /** Transaction operation type */
  action:
    | 'approve'
    | 'bid'
    | 'burn'
    | 'claim'
    | 'delegate'
    | 'deploy'
    | 'deposit'
    | 'execute'
    | 'mint'
    | 'receive'
    | 'revoke'
    | 'revoke_delegation'
    | 'send'
    | 'trade'
    | 'withdraw';
  /** Gas Fee paid in this transaction */
  fee: BalanceDto | null;
  /**
   * Transaction timestamp
   * @format date-time
   */
  time: string;
  /** Transaction hash */
  txHash: string;
  /** Chain ID where the transaction occurred */
  chainId: number;
  /** Protocol information for this transaction */
  protocol: ProtocolDto;
}

export interface TransactionsDtoResponse {
  /** @example 200 */
  status: number;
  /** @example "Success" */
  message: string;
  meta: TransactionsPaginationMeta;
  data: TransactionsDto[];
}

export interface PnlResponse {
  /** @example 200 */
  status: number;
  /** @example "Success" */
  message: string;
  meta: EmptyMeta;
  data: PnlResponseDto;
}

export interface CancelStepTransactionRequestDto {
  /**
   * Chain ID
   * @example 1
   */
  chainId: number;
  /** Tool/protocol identifier */
  tool: '1inch' | 'cowswap';
  /** Unique identifier for the order */
  orderId: string;
}

export interface FeeCostDto {
  /**
   * Fee name
   * @example "Protocol Fee"
   */
  name: string;
  /** Fee description */
  description?: string;
  /**
   * Fee amount
   * @example "1000000"
   */
  amount: string;
  /**
   * Fee amount in USD
   * @example "1.00"
   */
  amountUSD?: string;
  /**
   * Fee percentage
   * @example "0.1"
   */
  percentage: string;
  /** Token used for fee */
  token: TokenDto;
  /** Whether the fee is included in the amount */
  included?: boolean;
}

export interface GasCostDto {
  /**
   * Type of gas cost
   * @example "SEND"
   */
  type: string;
  /**
   * Estimated gas amount
   * @example "21000"
   */
  estimate: string;
  /**
   * Gas limit
   * @example "30000"
   */
  limit: string;
  /**
   * Gas amount in native token
   * @example "0.001"
   */
  amount: string;
  /**
   * Gas amount in USD
   * @example "2.50"
   */
  amountUSD?: string;
  /**
   * Gas price in wei
   * @example "50000000000"
   */
  price: string;
  /** Token used for gas */
  token: TokenDto;
}

export interface CancelEstimateDto {
  /** Fee costs breakdown */
  feeCosts?: FeeCostDto[];
  /** Gas costs breakdown */
  gasCosts?: GasCostDto[];
}

export interface TransactionRequestDto {
  /**
   * Chain ID
   * @example 1
   */
  chainId: number;
  /** Transaction data (hex encoded) */
  data: string;
  /** Sender address */
  from: string;
  /** Target contract address */
  to: string;
  /** Value in wei (hex encoded) */
  value?: string;
  /** Gas limit */
  gasLimit?: string;
  /** Gas price */
  gasPrice?: string;
}

export interface CancelStepTransactionResponseDto {
  /** Cost estimate for the cancellation */
  estimate?: CancelEstimateDto;
  /** Transaction request to execute (for on-chain cancellation) */
  transactionRequest?: TransactionRequestDto;
  /** EIP-712 typed data to sign (for off-chain cancellation) */
  typedData?: object[];
}

export interface CancelRelayRequestDto {
  /** Cost estimate for the cancellation */
  estimate?: CancelEstimateDto;
  /** Transaction request to execute (for on-chain cancellation) */
  transactionRequest?: TransactionRequestDto;
  /** Signed EIP-712 typed data (required for relay) */
  typedData?: object[];
  /**
   * Chain ID
   * @example 1
   */
  chainId: number;
  /** Tool/protocol identifier */
  tool: '1inch' | 'cowswap';
}

export interface RelayResponseDataDto {
  /** Unique identifier for tracking the relayed task */
  taskId: string;
  /** Explorer link to the transaction */
  txLink?: string;
}

export interface RelayResponseDto {
  /** Response status */
  status: 'ok' | 'error';
  /** Response data */
  data: RelayResponseDataDto;
}

export interface LimitOrderPaginationMeta {
  /** Max results per page, per protocol */
  limit: number;
  /** Opaque cursor to pass as `cursor` to fetch the next page (cursor-paginated protocols only), or null if there are no more results. */
  nextCursor?: string | null;
  /** Whether more results are available beyond this page. */
  hasMore?: boolean;
}

export interface LimitOrder {
  /**
   * Protocol-specific order ID
   * @example "0x1234..."
   */
  orderId: string;
  /**
   * Protocol name
   * @example "cowswap"
   */
  tool: string;
  /**
   * Chain ID
   * @example 1
   */
  chainId: number;
  /**
   * Maker wallet address
   * @example "0xabc..."
   */
  fromAddress: string;
  fromToken: TokenDto;
  /**
   * Sell amount
   * @example "1000000"
   */
  fromAmount: string;
  /**
   * Amount filled so far (sell token)
   * @example "0"
   */
  filledFromAmount: string;
  /**
   * Recipient address
   * @example "0xabc..."
   */
  toAddress?: string | null;
  toToken: TokenDto;
  /**
   * Desired buy amount
   * @example "1000000"
   */
  toAmount: string;
  /**
   * Amount filled so far (buy token)
   * @example "0"
   */
  filledToAmount: string;
  /**
   * Order creation Unix timestamp
   * @example 1700000000
   */
  createdAt: number;
  /**
   * Order expiry Unix timestamp
   * @example 1700086400
   */
  validUntil: number;
  /**
   * Fill Unix timestamp
   * @example 1700043200
   */
  filledAt?: number | null;
  /**
   * Latest fill transaction hash
   * @example "0xabc..."
   */
  txHash?: string | null;
  /** Current order status */
  status:
    | 'pending'
    | 'active'
    | 'temporarily_invalid'
    | 'partially_filled'
    | 'filled'
    | 'cancelled'
    | 'expired'
    | 'failed';
  /** Fill type */
  orderType: 'fill_or_kill' | 'partial_fill';
}

export interface LimitOrdersListResponse {
  /** @example 200 */
  status: number;
  /** @example "Success" */
  message: string;
  meta: LimitOrderPaginationMeta;
  data: LimitOrder[];
}

export interface TaskVerificationDto {
  /** Users wallet address */
  address: string;
  /** Quest id */
  questId: string;
  /** Step id */
  stepId: string;
  /**
   * Label on strapi
   * @example "test-quest-label"
   */
  label?: string | null;
  /**
   * Slug on strapi
   * @example "test-quest-slug"
   */
  slug?: string | null;
  /**
   * Task name on strapi
   * @example "test-quest-task-name"
   */
  taskName?: string | null;
  /**
   * Additional dynamic fields
   * @example {"customKey1":"value1","customKey2":"value2"}
   */
  additionalFields: object;
}

export interface TaskVerificationItemResponse {
  /** @example 200 */
  status: number;
  /** @example "Success" */
  message: string;
  meta: EmptyMeta;
  data: TaskVerificationEntity;
}

export interface TaskVerificationListResponse {
  /** @example 200 */
  status: number;
  /** @example "Success" */
  message: string;
  meta: EmptyMeta;
  data: TaskVerificationEntity[];
}

export interface MerklBoostEntryDto {
  /** @example "0x1234567890123456789012345678901234567890" */
  address: string;
  /** @example "1000000000" */
  boost: string;
}

export interface MerklBoostListResponse {
  /** @example 200 */
  status: number;
  /** @example "Success" */
  message: string;
  meta: EmptyMeta;
  data: MerklBoostEntryDto[];
}

export interface GetZapDataDto {
  /**
   * Chain name
   * @example "ethereum"
   */
  chain: string;
  /**
   * Project name
   * @example "mellow"
   */
  project: string;
  /**
   * Market address
   * @example "0x1234567890"
   */
  address: string;
}

export interface GeneratePayloadDto {
  /**
   * Chain name
   * @example "ethereum"
   */
  chain: string;
  /**
   * Project name
   * @example "mellow"
   */
  project: string;
  /**
   * Product name
   * @example "ethena_lrt_vault_susde"
   */
  product: string;
  /**
   * Method name
   * @example "deposit"
   */
  method: string;
  /**
   * Method params
   * @example "params"
   */
  params: object;
}

export interface EarnOpportunityWithScore {
  name: string;
  asset: Token;
  protocol: Protocol;
  isRedeemable: boolean;
  url?: string | null;
  description: string;
  tags: string[];
  rewards: Token[];
  /** JUM-845 scoped manual addition — reconcile on next full regen. */
  messages: VaultMessage[];
  lpToken: Token;
  slug: string;
  featured: boolean;
  lockupDays?: number;
  /**
   * The cap in dollar. Deprecated: use capacity instead.
   * @deprecated
   */
  capInDollar?: string;
  /** @deprecated */
  rewardsApy?: number;
  forYou: boolean;
  interactionFlags: EarnInteractionFlags;
  rewardApiLinks?: RewardApiLink[];
  latest: EarnOpportunityHistoryItem;
  capacity?: VaultCapacity;
  fees?: VaultFees;
}

export interface EarnOpportunities {
  /** @example 200 */
  status: number;
  /** @example "Success" */
  message: string;
  meta: MetadataWithUpdatedAt;
  data: EarnOpportunityWithScore[];
}

export interface VaultScoredDto {
  chainTier: 'Tier 1' | 'Tier 2' | 'Tier 3';
  protocolType: 'Yield' | 'Staked' | 'Locked';
  tokenCategory: 'stable' | 'eth' | 'btc' | 'else';
  protocolTier: 'Tier 1' | 'Tier 2' | 'Tier 3';
  apyTotal7d: number;
  id: string;
  score: number;
}

export interface RecommendationDto {
  summary: object;
  scores: VaultScoredDto[];
}

export interface RecommendationScoresResponse {
  /** @example 200 */
  status: number;
  /** @example "Success" */
  message: string;
  meta: EmptyMeta;
  data: RecommendationDto;
}

export type WalletVerification = object;

export interface WalletVerificationListResponse {
  /** @example 200 */
  status: number;
  /** @example "Success" */
  message: string;
  meta: EmptyMeta;
  data: WalletVerification[];
}

export interface UpdateValidityDto {
  valid: boolean;
}

export interface WalletVerificationItemResponse {
  /** @example 200 */
  status: number;
  /** @example "Success" */
  message: string;
  meta: EmptyMeta;
  data: WalletVerification;
}

export interface WalletVerificationPaginationMeta {
  total: number;
}

export interface WalletVerificationsPageResponse {
  /** @example 200 */
  status: number;
  /** @example "Success" */
  message: string;
  meta: WalletVerificationPaginationMeta;
  data: WalletVerification[];
}

export interface PerkClaimDto {
  /** Users wallet address */
  address: string;
  /** Message to sign */
  message: string;
  /** Wallet type */
  walletType?: string | null;
  /** Perk id */
  perkId: string;
  /** Inserted username for the perk claim */
  username?: string | null;
  /** Inserted email for the perk claim */
  email?: string | null;
  /** Signature of the user for the perk claim */
  signature: string;
}

export interface PerkClaimResponseDto {
  /**
   * Unique identifier for the perk
   * @example 1
   */
  id: number;
  /**
   * Timestamp when the perk claim was created
   * @format date-time
   * @example "2023-01-01T00:00:00Z"
   */
  timestamp: string;
  /**
   * Perk id on strapi
   * @example "test-perk-id"
   */
  perkId: string;
  /** Wallet associated with the perk claim */
  wallet: WalletEntity;
  /**
   * Inserted username for the perk claim
   * @example "test-username"
   */
  username: string;
  /**
   * Inserted email for the perk claim
   * @example "test-email@example.com"
   */
  email: string;
  /**
   * Promo code assigned to this claim, if the perk has a code pool
   * @example "AIRALO-XYZ-2024"
   */
  promoCode?: string;
}

export interface PerkClaimItemResponse {
  /** @example 200 */
  status: number;
  /** @example "Success" */
  message: string;
  meta: EmptyMeta;
  data: PerkClaimResponseDto;
}

export interface ActivePerkDto {
  /**
   * Strapi document id of the perk
   * @example "abc123documentId"
   */
  id: string;
  /**
   * Perk display name
   * @example "Airalo"
   */
  name: string;
  /**
   * Jumper Pass level at which this perk unlocks
   * @example 3
   */
  unlockLevel: number;
  /**
   * URL-friendly perk slug
   * @example "airalo-esim"
   */
  slug: string;
}

export interface ActivePerkListResponse {
  /** @example 200 */
  status: number;
  /** @example "Success" */
  message: string;
  meta: EmptyMeta;
  data: ActivePerkDto[];
}

export interface PerkClaimListResponse {
  /** @example 200 */
  status: number;
  /** @example "Success" */
  message: string;
  meta: EmptyMeta;
  data: PerkClaimResponseDto[];
}

export interface PerkPromoCodeInventoryEntryDto {
  /** @example "perk-1" */
  perkId: string;
  /** @example "Airalo" */
  name: string;
  /** @example 3 */
  codesConsumed: number;
  /** @example 2 */
  codesLeft: number;
}

export interface FeatureFlagResponseDto {
  /** @example "a-b-test-trade-display" */
  key: string;
  /** @example "A/B Test Trade Display" */
  name?: string;
  /** @example "test" */
  variant: string | boolean;
  /** @example ["execution_completed"] */
  events?: string[];
  /** @example 639768 */
  posthogFlagId?: number;
}

export interface FeatureFlagListResponse {
  /** @example 200 */
  status: number;
  /** @example "Success" */
  message: string;
  meta: EmptyMeta;
  data: FeatureFlagResponseDto[];
}

export interface FeatureFlagItemResponse {
  /** @example 200 */
  status: number;
  /** @example "Success" */
  message: string;
  meta: EmptyMeta;
  data: FeatureFlagResponseDto;
}

export interface UdfExchangeDto {
  /**
   * Exchange identifier
   * @example "DEFILLAMA"
   */
  value: string;
  /**
   * Exchange display name
   * @example "DefiLlama"
   */
  name: string;
  /**
   * Exchange description
   * @example "DefiLlama price feed"
   */
  desc: string;
}

export interface UdfSymbolsTypeDto {
  /**
   * Symbol type display name
   * @example "crypto"
   */
  name: string;
  /**
   * Symbol type identifier
   * @example "crypto"
   */
  value: string;
}

export interface UdfConfigDto {
  /**
   * Resolutions supported by the datafeed (numeric = minutes, suffix S/D/W/M = seconds/days/weeks/months).
   * @example ["60","240","1D","1W"]
   */
  supported_resolutions: string[];
  /** @example false */
  supports_group_request: boolean;
  /** @example false */
  supports_marks: boolean;
  /** @example true */
  supports_search: boolean;
  /** @example false */
  supports_timescale_marks: boolean;
  /** @example true */
  supports_time: boolean;
  exchanges: UdfExchangeDto[];
  symbols_types: UdfSymbolsTypeDto[];
}

export interface UdfSymbolInfoDto {
  /** @example "ETH/USDC" */
  name: string;
  /** @example "DEFILLAMA:ETH/USDC" */
  ticker: string;
  /** @example "Ethereum / USD Coin" */
  description: string;
  /** @example "crypto" */
  type: string;
  /**
   * Trading session in TradingView session format
   * @example "24x7"
   */
  session: string;
  /** @example "Etc/UTC" */
  timezone: string;
  /** @example "DEFILLAMA" */
  exchange: string;
  /** @example "DEFILLAMA" */
  listed_exchange: string;
  /**
   * Value formatter used by the chart.
   * @example "price"
   */
  format: 'price' | 'volume';
  /**
   * Minimum price movement (numerator).
   * @example 1
   */
  minmov: number;
  /**
   * Price scale: 10^(decimal places shown).
   * @example 100
   */
  pricescale: number;
  /** @example true */
  has_intraday: boolean;
  /** @example ["60","240","1D","1W"] */
  supported_resolutions: string[];
  /** @example false */
  has_no_volume?: boolean;
  /**
   * Allowed intraday resolution multipliers (in minutes).
   * @example ["1","5","60"]
   */
  intraday_multipliers?: string[];
  /** @example "USD" */
  currency_code?: string;
  /** @example "USD" */
  original_currency_code?: string;
  /** @example 8 */
  volume_precision?: number;
  /** @example "endofday" */
  data_status?: 'streaming' | 'endofday' | 'pulsed' | 'delayed_streaming';
}

export interface UdfSearchResultDto {
  /** @example "ETH/USDC" */
  symbol: string;
  /** @example "DEFILLAMA:ETH/USDC" */
  full_name: string;
  /** @example "Ethereum/USDC Coin" */
  description: string;
  /** @example "DEFILLAMA" */
  exchange: string;
  /** @example "ETH/USDC" */
  ticker: string;
  /** @example "crypto" */
  type: string;
}

export interface UdfHistoryResponseDto {
  /**
   * UDF status. Bar arrays are only present when "ok".
   * @example "ok"
   */
  s: 'ok' | 'no_data' | 'error';
  /**
   * Bar opening times (Unix seconds). Present when s = "ok".
   * @example [1700000000,1700003600]
   */
  t?: number[];
  /** @example [3000.5,3010.2] */
  o?: number[];
  /** @example [3050,3015.5] */
  h?: number[];
  /** @example [2990,3000] */
  l?: number[];
  /** @example [3010.2,3005] */
  c?: number[];
  /** @example [120.5,80.3] */
  v?: number[];
  /**
   * Error message. Set when s = "error".
   * @example "Symbol not found"
   */
  errmsg?: string;
  /**
   * Unix seconds of the next bar with data. Set when s = "no_data".
   * @example 1700100000
   */
  nextTime?: number;
}

export interface TokenPriceChangeDto {
  /**
   * 1-day price change for the token
   * @example 5.457897987
   */
  '1d': number;
  /**
   * 7-day price change for the token
   * @example -0.5565
   */
  '7d': number;
}

export interface MissionApyDto {
  /** APY contributed by each reward link, keyed by identifier. */
  apy: Record<string, number>;
  /** Sum of all reward APY contributions. */
  total: number;
}

export interface MissionApyResponse {
  /** @example 200 */
  status: number;
  /** @example "Success" */
  message: string;
  meta: EmptyMeta;
  data: MissionApyDto;
}

export interface VerifiedTokenDto {
  /**
   * Chain id the token is verified on
   * @example 4663
   */
  chainId: number;
  /**
   * Token address as listed in the allowlist
   * @example "0xD7321801CAae694090694Ff55A9323139F043B88"
   */
  address: string;
}

export interface VerifiedTokensResponseDto {
  /** Tokens curated as verified in the jumper-allowlist */
  tokens: VerifiedTokenDto[];
}

export type QueryParamsType = Record<string | number, any>;
export type ResponseFormat = keyof Omit<Body, 'body' | 'bodyUsed'>;

export interface FullRequestParams extends Omit<RequestInit, 'body'> {
  /** set parameter to `true` for call `securityWorker` for this request */
  secure?: boolean;
  /** request path */
  path: string;
  /** content type of request body */
  type?: ContentType;
  /** query params */
  query?: QueryParamsType;
  /** format of response (i.e. response.json() -> format: "json") */
  format?: ResponseFormat;
  /** request body */
  body?: unknown;
  /** base url */
  baseUrl?: string;
  /** request cancellation token */
  cancelToken?: CancelToken;
}

export type RequestParams = Omit<
  FullRequestParams,
  'body' | 'method' | 'query' | 'path'
>;

export interface ApiConfig<SecurityDataType = unknown> {
  baseUrl?: string;
  baseApiParams?: Omit<RequestParams, 'baseUrl' | 'cancelToken' | 'signal'>;
  securityWorker?: (
    securityData: SecurityDataType | null,
  ) => Promise<RequestParams | void> | RequestParams | void;
  customFetch?: typeof fetch;
}

export interface HttpResponse<
  D extends unknown,
  E extends unknown = unknown,
> extends Response {
  data: D;
  error: E;
}

type CancelToken = Symbol | string | number;

export enum ContentType {
  Json = 'application/json',
  JsonApi = 'application/vnd.api+json',
  FormData = 'multipart/form-data',
  UrlEncoded = 'application/x-www-form-urlencoded',
  Text = 'text/plain',
}

export class HttpClient<SecurityDataType = unknown> {
  public baseUrl: string = '';
  private securityData: SecurityDataType | null = null;
  private securityWorker?: ApiConfig<SecurityDataType>['securityWorker'];
  private abortControllers = new Map<CancelToken, AbortController>();
  private customFetch = (...fetchParams: Parameters<typeof fetch>) =>
    fetch(...fetchParams);

  private baseApiParams: RequestParams = {
    credentials: 'same-origin',
    headers: { Referer: config.NEXT_PUBLIC_SITE_URL },
    redirect: 'follow',
    referrerPolicy: 'strict-origin-when-cross-origin',
  };

  constructor(apiConfig: ApiConfig<SecurityDataType> = {}) {
    Object.assign(this, apiConfig);
  }

  public setSecurityData = (data: SecurityDataType | null) => {
    this.securityData = data;
  };

  protected encodeQueryParam(key: string, value: any) {
    const encodedKey = encodeURIComponent(key);
    return `${encodedKey}=${encodeURIComponent(typeof value === 'number' ? value : `${value}`)}`;
  }

  protected addQueryParam(query: QueryParamsType, key: string) {
    return this.encodeQueryParam(key, query[key]);
  }

  protected addArrayQueryParam(query: QueryParamsType, key: string) {
    const value = query[key];
    return value.map((v: any) => this.encodeQueryParam(key, v)).join('&');
  }

  protected toQueryString(rawQuery?: QueryParamsType): string {
    const query = rawQuery || {};
    const keys = Object.keys(query).filter(
      (key) => 'undefined' !== typeof query[key],
    );
    return keys
      .map((key) =>
        Array.isArray(query[key])
          ? this.addArrayQueryParam(query, key)
          : this.addQueryParam(query, key),
      )
      .join('&');
  }

  protected addQueryParams(rawQuery?: QueryParamsType): string {
    const queryString = this.toQueryString(rawQuery);
    return queryString ? `?${queryString}` : '';
  }

  private contentFormatters: Record<ContentType, (input: any) => any> = {
    [ContentType.Json]: (input: any) =>
      input !== null && (typeof input === 'object' || typeof input === 'string')
        ? JSON.stringify(input)
        : input,
    [ContentType.JsonApi]: (input: any) =>
      input !== null && (typeof input === 'object' || typeof input === 'string')
        ? JSON.stringify(input)
        : input,
    [ContentType.Text]: (input: any) =>
      input !== null && typeof input !== 'string'
        ? JSON.stringify(input)
        : input,
    [ContentType.FormData]: (input: any) => {
      if (input instanceof FormData) {
        return input;
      }

      return Object.keys(input || {}).reduce((formData, key) => {
        const property = input[key];
        formData.append(
          key,
          property instanceof Blob
            ? property
            : typeof property === 'object' && property !== null
              ? JSON.stringify(property)
              : `${property}`,
        );
        return formData;
      }, new FormData());
    },
    [ContentType.UrlEncoded]: (input: any) => this.toQueryString(input),
  };

  protected mergeRequestParams(
    params1: RequestParams,
    params2?: RequestParams,
  ): RequestParams {
    return {
      ...this.baseApiParams,
      ...params1,
      ...(params2 || {}),
      headers: {
        ...(this.baseApiParams.headers || {}),
        ...(params1.headers || {}),
        ...((params2 && params2.headers) || {}),
      },
    };
  }

  protected createAbortSignal = (
    cancelToken: CancelToken,
  ): AbortSignal | undefined => {
    if (this.abortControllers.has(cancelToken)) {
      const abortController = this.abortControllers.get(cancelToken);
      if (abortController) {
        return abortController.signal;
      }
      return void 0;
    }

    const abortController = new AbortController();
    this.abortControllers.set(cancelToken, abortController);
    return abortController.signal;
  };

  public abortRequest = (cancelToken: CancelToken) => {
    const abortController = this.abortControllers.get(cancelToken);

    if (abortController) {
      abortController.abort();
      this.abortControllers.delete(cancelToken);
    }
  };

  public request = async <T = any, E = any>({
    body,
    secure,
    path,
    type,
    query,
    format,
    baseUrl,
    cancelToken,
    ...params
  }: FullRequestParams): Promise<HttpResponse<T, E>> => {
    const secureParams =
      ((typeof secure === 'boolean' ? secure : this.baseApiParams.secure) &&
        this.securityWorker &&
        (await this.securityWorker(this.securityData))) ||
      {};
    const requestParams = this.mergeRequestParams(params, secureParams);
    const queryString = query && this.toQueryString(query);
    const payloadFormatter = this.contentFormatters[type || ContentType.Json];
    const responseFormat = format || requestParams.format;

    return this.customFetch(
      `${baseUrl || this.baseUrl || ''}${path}${queryString ? `?${queryString}` : ''}`,
      {
        ...requestParams,
        headers: {
          ...(requestParams.headers || {}),
          ...(type && type !== ContentType.FormData
            ? { 'Content-Type': type }
            : {}),
        },
        signal:
          (cancelToken
            ? this.createAbortSignal(cancelToken)
            : requestParams.signal) || null,
        body:
          typeof body === 'undefined' || body === null
            ? null
            : payloadFormatter(body),
      },
    ).then(async (response) => {
      const r = response as HttpResponse<T, E>;
      r.data = null as unknown as T;
      r.error = null as unknown as E;

      const responseToParse = responseFormat ? response.clone() : response;
      const data = !responseFormat
        ? r
        : await responseToParse[responseFormat]()
            .then((data) => {
              if (r.ok) {
                r.data = data;
              } else {
                r.error = data;
              }
              return r;
            })
            .catch((e) => {
              r.error = e;
              return r;
            });

      if (cancelToken) {
        this.abortControllers.delete(cancelToken);
      }

      if (!response.ok) throw data;
      return data;
    });
  };
}

/**
 * @title Jumper API
 * @version 1.0
 * @contact
 *
 * Swagger documentation for Jumper API
 */
export class JumperBackend<
  SecurityDataType extends unknown,
> extends HttpClient<SecurityDataType> {
  v1 = {
    /**
     * No description
     *
     * @tags Leaderboard, Public
     * @name LeaderboardControllerFindManyV1
     * @summary Get all leaderboard entries with pagination
     * @request GET:/v1/leaderboard
     */
    leaderboardControllerFindManyV1: (
      query?: {
        /**
         * Page number of the pagination
         * @example 1
         */
        page?: number;
        /**
         * Maximum number of items per page
         * @example 10
         */
        limit?: number;
      },
      params: RequestParams = {},
    ) =>
      this.request<LeaderboardListResponse, any>({
        path: `/v1/leaderboard`,
        method: 'GET',
        query: query,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags Leaderboard, Public
     * @name LeaderboardControllerFindCenteredPaginationV1
     * @summary Leaderboard X/2 before and after from position X
     * @request GET:/v1/leaderboard/centered-pagination/{position}/{entries}
     */
    leaderboardControllerFindCenteredPaginationV1: (
      position: number,
      entries: number,
      params: RequestParams = {},
    ) =>
      this.request<LeaderboardCenteredListResponse, void>({
        path: `/v1/leaderboard/centered-pagination/${position}/${entries}`,
        method: 'GET',
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags Leaderboard, Public
     * @name LeaderboardControllerFindOneByAddressV1
     * @summary Get user leaderboard data by wallet address
     * @request GET:/v1/leaderboard/{address}
     */
    leaderboardControllerFindOneByAddressV1: (
      address: string,
      params: RequestParams = {},
    ) =>
      this.request<LeaderboardItemResponse, void>({
        path: `/v1/leaderboard/${address}`,
        method: 'GET',
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags Rewards, Public
     * @name UserRewardsControllerGetUserRewardsV1
     * @summary Get claimable rewards for a wallet address
     * @request GET:/v1/rewards/users/{address}
     */
    userRewardsControllerGetUserRewardsV1: (
      address: string,
      query?: {
        /** Strapi campaign documentId — when provided, uses that campaign's merkl_rewards as the filter instead of the global config */
        jumperCampaignId?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<UserRewardsResponseDto, any>({
        path: `/v1/rewards/users/${address}`,
        method: 'GET',
        query: query,
        format: 'json',
        ...params,
      }),

    /**
     * @tags Rewards, Public
     * @name UserRewardsController_getCalldata_v1
     * @summary Get claim calldata for a reward
     * @request GET:/v1/rewards/users/{address}/calldata
     */
    userRewardsControllerGetCalldataV1: (
      address: string,
      query: {
        /** Reward provider */
        provider: 'defi-reacher';
        /** Campaign ID */
        campaignId: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<RewardClaimDataDto, any>({
        path: `/v1/rewards/users/${address}/calldata`,
        method: 'GET',
        query: query,
        format: 'json',
        ...params,
      }),

    /**
     * @tags Rewards, Public
     * @name UserRewardsController_validateReward_v1
     * @summary Validate a reward claim transaction
     * @request POST:/v1/rewards/users/{address}/validate
     */
    userRewardsControllerValidateRewardV1: (
      address: string,
      data: ValidateRewardBodyDto,
      params: RequestParams = {},
    ) =>
      this.request<RewardValidationResultDto, any>({
        path: `/v1/rewards/users/${address}/validate`,
        method: 'POST',
        body: data,
        type: ContentType.Json,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags Earn, Public
     * @name EarnControllerGetTopsV1
     * @summary Get tops for an address
     * @request GET:/v1/earn/tops
     */
    earnControllerGetTopsV1: (
      query?: {
        /**
         * The address to get tops for
         * @example "0x742d35Cc6634C0532925a3b8D598C2FF000f5E58"
         */
        address?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<EarnListResponse, any>({
        path: `/v1/earn/tops`,
        method: 'GET',
        query: query,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags Earn, Public
     * @name EarnControllerAllV1
     * @summary Get all earn opportunities
     * @request GET:/v1/earn/all
     */
    earnControllerAllV1: (
      query?: {
        /**
         * The address to filter for
         * @example "0x742d35Cc6634C0532925a3b8D598C2FF000f5E58"
         */
        address?: string;
        /**
         * Filter for opportunities where the user has positions
         * @example true
         */
        hasPositions?: boolean;
        /**
         * Whether to filter for "for you" opportunities
         * @example true
         */
        forYou?: boolean;
      },
      params: RequestParams = {},
    ) =>
      this.request<EarnListResponse, any>({
        path: `/v1/earn/all`,
        method: 'GET',
        query: query,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags Earn, Public
     * @name EarnControllerGetItemV1
     * @summary Get an earn opportunity by slug
     * @request GET:/v1/earn/items/{slug}
     */
    earnControllerGetItemV1: (slug: string, params: RequestParams = {}) =>
      this.request<EarnItemResponse, any>({
        path: `/v1/earn/items/${slug}`,
        method: 'GET',
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags Earn, Public
     * @name EarnControllerGetRelatedItemsV1
     * @summary Get related items to an earn opportunity
     * @request GET:/v1/earn/items/{slug}/related
     */
    earnControllerGetRelatedItemsV1: (
      slug: string,
      params: RequestParams = {},
    ) =>
      this.request<EarnListResponse, any>({
        path: `/v1/earn/items/${slug}/related`,
        method: 'GET',
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags Earn, Public
     * @name EarnControllerGetApyAnalyticsV1
     * @summary Get APY analytics breakdown for an earn opportunity
     * @request GET:/v1/earn/items/{slug}/analytics/apy
     */
    earnControllerGetApyAnalyticsV1: (
      slug: string,
      query: {
        /**
         * The range field to filter for
         * @example "day"
         */
        range: 'day' | 'week' | 'month' | 'year';
        /**
         * Use instant (1-day) APY instead of 7-day rolling APY
         * @example true
         */
        instant?: boolean;
      },
      params: RequestParams = {},
    ) =>
      this.request<ApyAnalyticsHistoryResponse, any>({
        path: `/v1/earn/items/${slug}/analytics/apy`,
        method: 'GET',
        query: query,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags Earn, Public
     * @name EarnControllerGetAnalyticsV1
     * @summary Get analytics for an earn opportunity
     * @request GET:/v1/earn/items/{slug}/analytics
     */
    earnControllerGetAnalyticsV1: (
      slug: string,
      query: {
        /**
         * The value field to filter for
         * @example "apy"
         */
        value: 'apy' | 'tvl';
        /**
         * The range field to filter for
         * @example "day"
         */
        range: 'day' | 'week' | 'month' | 'year';
      },
      params: RequestParams = {},
    ) =>
      this.request<EarnOpportunityHistoryResponse, any>({
        path: `/v1/earn/items/${slug}/analytics`,
        method: 'GET',
        query: query,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags Earn, Public
     * @name EarnControllerGetVaultSpecificDataV1
     * @summary Get the vault specific data for a user in a given earn opportunity
     * @request GET:/v1/earn/items/{slug}/vault-specific-data
     */
    earnControllerGetVaultSpecificDataV1: (
      slug: string,
      query: {
        address: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<JumperFreeFormResponse, any>({
        path: `/v1/earn/items/${slug}/vault-specific-data`,
        method: 'GET',
        query: query,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags Earn, Public
     * @name EarnControllerGetRequestRedeemCalldataV1
     * @summary Get request-redeem calldata for an earn opportunity
     * @request GET:/v1/earn/items/{slug}/request-redeem/call-data
     */
    earnControllerGetRequestRedeemCalldataV1: (
      slug: string,
      query: {
        address: string;
        amount: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<CallDataResponse, any>({
        path: `/v1/earn/items/${slug}/request-redeem/call-data`,
        method: 'GET',
        query: query,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags Earn, Public
     * @name EarnControllerGetClaimRedeemCalldataV1
     * @summary Get claim-redeem calldata for an earn opportunity
     * @request GET:/v1/earn/items/{slug}/claim-redeem/call-data
     */
    earnControllerGetClaimRedeemCalldataV1: (
      slug: string,
      query: {
        address: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<CallDataResponse, any>({
        path: `/v1/earn/items/${slug}/claim-redeem/call-data`,
        method: 'GET',
        query: query,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags Portfolio, Public
     * @name PortfolioControllerGetTokensForAddressV1
     * @summary Get tokens for a set of addresses
     * @request GET:/v1/portfolio/tokens
     */
    portfolioControllerGetTokensForAddressV1: (
      query?: {
        /** EVM addresses to get tokens for */
        evm?: string[];
        /** Solana Virtual Machine (SVM) addresses to get tokens for */
        svm?: string[];
        /** Move Virtual Machine (MVM) addresses to get tokens for, e.g. Sui */
        mvm?: string[];
        /** Unspent transaction output (UTXO) addresses to get tokens for, e.g. Bitcoin */
        utxo?: string[];
        /** Tron Virtual Machine (TVM) addresses to get tokens for */
        tvm?: string[];
        /**
         * The chain ids to filter for
         * @example [1,10,137]
         */
        chains?: number[];
        /**
         * The assets to filter for
         * @example ["USDC","USDT","DAI"]
         */
        assets?: string[];
        /**
         * The minimum USD amount to filter for
         * @example 5.5
         */
        minValue?: number;
        /**
         * The maximum USD amount to filter for
         * @example 25
         */
        maxValue?: number;
      },
      params: RequestParams = {},
    ) =>
      this.request<TokenBalancesResponse, any>({
        path: `/v1/portfolio/tokens`,
        method: 'GET',
        query: query,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags Portfolio, Public
     * @name PortfolioControllerGetPositionsForAddressV1
     * @summary Get positions for a set of addresses
     * @request GET:/v1/portfolio/positions
     */
    portfolioControllerGetPositionsForAddressV1: (
      query?: {
        /** EVM addresses to get positions for */
        evm?: string[];
        /** Solana Virtual Machine (SVM) addresses (reserved for future use) */
        svm?: string[];
        /** Move Virtual Machine (MVM) addresses (reserved for future use), e.g. Sui */
        mvm?: string[];
        /** Unspent transaction output (UTXO) addresses (reserved for future use), e.g. Bitcoin */
        utxo?: string[];
        /** Tron Virtual Machine (TVM) addresses (reserved for future use) */
        tvm?: string[];
        /**
         * Sort by field.
         * @example "value"
         */
        sortBy?: 'value' | 'chain' | 'asset';
        /**
         * Sort order.
         * @example "asc"
         */
        order?: 'asc' | 'desc';
        /**
         * The chain ids to filter for
         * @example [1,10,137]
         */
        chains?: number[];
        /**
         * The protocols to filter for
         * @example ["Aave","Compound","Yearn"]
         */
        protocols?: string[];
        /**
         * The position types to filter for
         * @example ["lending","staking"]
         */
        type?: string[];
        /**
         * The assets to filter for
         * @example ["USDC","USDT","DAI"]
         */
        assets?: string[];
        /**
         * The minimum USD total value to filter for
         * @example 5.5
         */
        minValue?: number;
        /**
         * The maximum USD total value to filter for
         * @example 25
         */
        maxValue?: number;
        /**
         * The earn opportunity slug to filter for
         * @example "gauntlet-usdc-prime-on-base"
         */
        earn?: string | null;
      },
      params: RequestParams = {},
    ) =>
      this.request<WalletPositions, any>({
        path: `/v1/portfolio/positions`,
        method: 'GET',
        query: query,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags Portfolio, Public
     * @name PortfolioControllerGetUserBalanceHistoryV1
     * @summary Get balance history for a set of addresses
     * @request GET:/v1/portfolio/balance/history
     */
    portfolioControllerGetUserBalanceHistoryV1: (
      query: {
        /** EVM addresses to get balance history for */
        evm?: string[];
        /** Solana Virtual Machine (SVM) addresses to get balance history for */
        svm?: string[];
        /** Move Virtual Machine (MVM) addresses to get balance history for, e.g. Sui */
        mvm?: string[];
        /** Unspent transaction output (UTXO) addresses to get balance history for, e.g. Bitcoin */
        utxo?: string[];
        /** Tron Virtual Machine (TVM) addresses to get balance history for */
        tvm?: string[];
        /**
         * Chart Range
         * @example "day"
         */
        chartPeriod: 'day' | 'week' | 'month' | '3months' | 'year' | 'all';
      },
      params: RequestParams = {},
    ) =>
      this.request<BalanceHistoryResponse, any>({
        path: `/v1/portfolio/balance/history`,
        method: 'GET',
        query: query,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags Portfolio, Public
     * @name PortfolioControllerGetUserPnlV1
     * @summary Get PnL for a set of addresses
     * @request GET:/v1/portfolio/balance/pnl
     */
    portfolioControllerGetUserPnlV1: (
      query: {
        /** EVM addresses to get Pnl for */
        evm?: string[];
        /** Solana Virtual Machine (SVM) addresses to get Pnl for */
        svm?: string[];
        /** Move Virtual Machine (MVM) addresses to get Pnl for, e.g. Sui */
        mvm?: string[];
        /** Unspent transaction output (UTXO) addresses to get Pnl for, e.g. Bitcoin */
        utxo?: string[];
        /** Tron Virtual Machine (TVM) addresses to get Pnl for */
        tvm?: string[];
        /**
         * Chart Range
         * @example "day"
         */
        chartPeriod: 'day' | 'week' | 'month' | '3months' | 'year' | 'all';
      },
      params: RequestParams = {},
    ) =>
      this.request<PnlResponse, any>({
        path: `/v1/portfolio/balance/pnl`,
        method: 'GET',
        query: query,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags Portfolio, Public
     * @name PortfolioControllerGetUserTransactionsV1
     * @summary Get transactions for a set of addresses
     * @request GET:/v1/portfolio/transactions
     */
    portfolioControllerGetUserTransactionsV1: (
      query?: {
        /** EVM address to get transactions */
        evm?: string | null;
        /** Solana Virtual Machine (SVM) address to get transactions */
        svm?: string | null;
        /** Move Virtual Machine (MVM) address to get transactions */
        mvm?: string | null;
        /** Unspent transaction output (UTXO) address to get transactions */
        utxo?: string | null;
        /** Tron Virtual Machine (TVM) address to get transactions */
        tvm?: string | null;
        /**
         * Pagination cursor for fetching the next transactions
         * @example "6"
         */
        next?: string | null;
        /**
         * Force refresh the cache
         * @example true
         */
        forceRefresh?: boolean;
        /**
         * Array of operation types to filter by
         * @example ["trade","send"]
         */
        types?: (
          | 'approve'
          | 'bid'
          | 'burn'
          | 'claim'
          | 'delegate'
          | 'deploy'
          | 'deposit'
          | 'execute'
          | 'mint'
          | 'receive'
          | 'revoke'
          | 'revoke_delegation'
          | 'send'
          | 'trade'
          | 'withdraw'
        )[];
        /**
         * Return transactions at or after this ISO 8601 date
         * @format date-time
         */
        minDate?: string;
        /**
         * Return transactions at or before this ISO 8601 date
         * @format date-time
         */
        maxDate?: string;
        /**
         * Array of Lifi Chain Ids to filter by (e.g. [1, 8543])
         * @example ["1","8543"]
         */
        chains?: number[];
        /**
         * Asset filter as repeated "chainId:address" params (e.g. ?assets=1:0xabc&assets=137:0xdef)
         * @example ["1:0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48"]
         */
        assets?: string[];
      },
      params: RequestParams = {},
    ) =>
      this.request<TransactionsDtoResponse, any>({
        path: `/v1/portfolio/transactions`,
        method: 'GET',
        query: query,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags Zaps, Public
     * @name ZapsControllerGetZapDataV1
     * @summary Get Zap data
     * @request POST:/v1/zaps/get-zap-data
     */
    zapsControllerGetZapDataV1: (
      data: GetZapDataDto,
      params: RequestParams = {},
    ) =>
      this.request<GeneratePayloadDto, any>({
        path: `/v1/zaps/get-zap-data`,
        method: 'POST',
        body: data,
        type: ContentType.Json,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags Recommendation, Public
     * @name RecommendationControllerGetTopsV1
     * @summary Get tops for an address
     * @request GET:/v1/recommendation/tops
     */
    recommendationControllerGetTopsV1: (
      query?: {
        /**
         * The address to get tops for
         * @example "0x742d35Cc6634C0532925a3b8D598C2FF000f5E58"
         */
        address?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<EarnOpportunities, any>({
        path: `/v1/recommendation/tops`,
        method: 'GET',
        query: query,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags Recommendation, Public
     * @name RecommendationControllerAllV1
     * @summary Get all earn opportunities
     * @request GET:/v1/recommendation/all
     */
    recommendationControllerAllV1: (
      query?: {
        /**
         * The address to filter for
         * @example "0x742d35Cc6634C0532925a3b8D598C2FF000f5E58"
         */
        address?: string;
        /**
         * Filter for opportunities where the user has positions
         * @example true
         */
        hasPositions?: boolean;
        /**
         * Whether to filter for "for you" opportunities
         * @example true
         */
        forYou?: boolean;
      },
      params: RequestParams = {},
    ) =>
      this.request<EarnOpportunities, any>({
        path: `/v1/recommendation/all`,
        method: 'GET',
        query: query,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags Perks, Public
     * @name PerksControllerPerkClaimV1
     * @summary Claim new perk
     * @request POST:/v1/perks/claim
     */
    perksControllerPerkClaimV1: (
      data: PerkClaimDto,
      params: RequestParams = {},
    ) =>
      this.request<PerkClaimItemResponse, any>({
        path: `/v1/perks/claim`,
        method: 'POST',
        body: data,
        type: ContentType.Json,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags Perks, Public
     * @name PerksControllerFindClaimedByAddressV1
     * @summary Get user perks claimed list by wallet address
     * @request GET:/v1/perks/claimed/address/{address}
     */
    perksControllerFindClaimedByAddressV1: (
      address: string,
      params: RequestParams = {},
    ) =>
      this.request<PerkClaimListResponse, void>({
        path: `/v1/perks/claimed/address/${address}`,
        method: 'GET',
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags Wallets, Public
     * @name WalletControllerFindWalletOngoingRewardsByAddressV1
     * @summary Get wallet rewards by wallet address
     * @request GET:/v1/wallets/{address}/ongoing-rewards
     */
    walletControllerFindWalletOngoingRewardsByAddressV1: (
      address: string,
      params: RequestParams = {},
    ) =>
      this.request<OngoingRewardsListResponse, any>({
        path: `/v1/wallets/${address}/ongoing-rewards`,
        method: 'GET',
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags Feature Flags, Public
     * @name FeatureFlagControllerGetAllV1
     * @summary Get all active feature flags evaluated for a user
     * @request GET:/v1/feature-flags
     */
    featureFlagControllerGetAllV1: (
      query: {
        distinctId: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<FeatureFlagListResponse, any>({
        path: `/v1/feature-flags`,
        method: 'GET',
        query: query,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags Feature Flags, Public
     * @name FeatureFlagControllerGetOneV1
     * @summary Get a single feature flag evaluated for a user
     * @request GET:/v1/feature-flags/{key}
     */
    featureFlagControllerGetOneV1: (
      key: string,
      query: {
        distinctId: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<FeatureFlagItemResponse, any>({
        path: `/v1/feature-flags/${key}`,
        method: 'GET',
        query: query,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags TradingView UDF, Public
     * @name UdfControllerConfigV1
     * @summary Datafeed configuration
     * @request GET:/v1/tradingview/udf/config
     */
    udfControllerConfigV1: (params: RequestParams = {}) =>
      this.request<UdfConfigDto, any>({
        path: `/v1/tradingview/udf/config`,
        method: 'GET',
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags TradingView UDF, Public
     * @name UdfControllerTimeV1
     * @summary Server time as Unix seconds (text/plain per UDF spec)
     * @request GET:/v1/tradingview/udf/time
     */
    udfControllerTimeV1: (params: RequestParams = {}) =>
      this.request<string, any>({
        path: `/v1/tradingview/udf/time`,
        method: 'GET',
        ...params,
      }),

    /**
     * No description
     *
     * @tags TradingView UDF, Public
     * @name UdfControllerSymbolsV1
     * @summary Resolve symbol info by name or ticker
     * @request GET:/v1/tradingview/udf/symbols
     */
    udfControllerSymbolsV1: (
      query: {
        /**
         * Symbol name or full name (e.g. EXCHANGE:SYMBOL)
         * @example "ETH/USDC"
         */
        symbol: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<UdfSymbolInfoDto, any>({
        path: `/v1/tradingview/udf/symbols`,
        method: 'GET',
        query: query,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags TradingView UDF, Public
     * @name UdfControllerSearchV1
     * @summary Search symbols
     * @request GET:/v1/tradingview/udf/search
     */
    udfControllerSearchV1: (
      query: {
        /**
         * User input from the search box
         * @example "ETH"
         */
        query: string;
        /**
         * Maximum number of results to return
         * @example 30
         */
        limit: number;
        /**
         * Symbol type filter (matches /config symbols_types[].value)
         * @example "crypto"
         */
        type?: string;
        /**
         * Exchange filter (matches /config exchanges[].value)
         * @example "DEFILLAMA"
         */
        exchange?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<UdfSearchResultDto[], any>({
        path: `/v1/tradingview/udf/search`,
        method: 'GET',
        query: query,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags TradingView UDF, Public
     * @name UdfControllerHistoryV1
     * @summary OHLCV history bars
     * @request GET:/v1/tradingview/udf/history
     */
    udfControllerHistoryV1: (
      query: {
        /**
         * Symbol name or full name
         * @example "ETH/USDC"
         */
        symbol: string;
        /**
         * Resolution string (e.g. "1", "5", "60", "1D", "1W", "1M", "30S"). Unsupported values surface as a UDF `{ s: "error" }` response, not HTTP 400.
         * @example "60"
         */
        resolution: string;
        /**
         * Start of the bar timeframe (Unix seconds)
         * @example 1700000000
         */
        from: number;
        /**
         * End of the bar timeframe (Unix seconds). Defaults to the current server time when omitted.
         * @example 1700100000
         */
        to?: number;
        /**
         * Number of bars before "to". When present together with "to", "from" is disregarded.
         * @example 300
         */
        countback?: number;
      },
      params: RequestParams = {},
    ) =>
      this.request<UdfHistoryResponseDto, any>({
        path: `/v1/tradingview/udf/history`,
        method: 'GET',
        query: query,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags Extended Tokens, Public
     * @name PriceChangeControllerGet1DPriceChangeV1
     * @summary Get 1-day price change for a token
     * @request GET:/v1/tokens/extended/price-change/1d
     */
    priceChangeControllerGet1DPriceChangeV1: (
      query: {
        /**
         * DefiLlama coin IDs to filter by (e.g. coingecko:ethereum). Returns all coins when omitted.
         * @example ["coingecko:ethereum","coingecko:bitcoin"]
         */
        coinIds: string[];
      },
      params: RequestParams = {},
    ) =>
      this.request<Record<string, number>, any>({
        path: `/v1/tokens/extended/price-change/1d`,
        method: 'GET',
        query: query,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags Extended Tokens, Public
     * @name PriceChangeControllerGet7DPriceChangeV1
     * @summary Get 7-day price change for a token
     * @request GET:/v1/tokens/extended/price-change/7d
     */
    priceChangeControllerGet7DPriceChangeV1: (
      query: {
        /**
         * DefiLlama coin IDs to filter by (e.g. coingecko:ethereum). Returns all coins when omitted.
         * @example ["coingecko:ethereum","coingecko:bitcoin"]
         */
        coinIds: string[];
      },
      params: RequestParams = {},
    ) =>
      this.request<Record<string, number>, any>({
        path: `/v1/tokens/extended/price-change/7d`,
        method: 'GET',
        query: query,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags Extended Tokens, Public
     * @name PriceChangeControllerGetAllPriceChangesV1
     * @summary Get all price changes for a token
     * @request GET:/v1/tokens/extended/price-change/all
     */
    priceChangeControllerGetAllPriceChangesV1: (
      query: {
        /**
         * DefiLlama coin IDs to filter by (e.g. coingecko:ethereum). Returns all coins when omitted.
         * @example ["coingecko:ethereum","coingecko:bitcoin"]
         */
        coinIds: string[];
      },
      params: RequestParams = {},
    ) =>
      this.request<Record<string, TokenPriceChangeDto>, any>({
        path: `/v1/tokens/extended/price-change/all`,
        method: 'GET',
        query: query,
        format: 'json',
        ...params,
      }),

    /**
     * @description Tokens marked as verified in the jumper-allowlist. The widget uses them to suppress the unverified-token warning.
     *
     * @tags Verified Tokens, Public
     * @name VerifiedTokensControllerGetVerifiedTokensV1
     * @summary Get the verified-token allowlist
     * @request GET:/v1/tokens/verified
     */
    verifiedTokensControllerGetVerifiedTokensV1: (params: RequestParams = {}) =>
      this.request<VerifiedTokensResponseDto, any>({
        path: `/v1/tokens/verified`,
        method: 'GET',
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags Mission, Public
     * @name MissionControllerGetApyV1
     * @summary Get reward APY breakdown for a mission
     * @request GET:/v1/mission/{slug}/apy
     */
    missionControllerGetApyV1: (slug: string, params: RequestParams = {}) =>
      this.request<MissionApyResponse, any>({
        path: `/v1/mission/${slug}/apy`,
        method: 'GET',
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags Mission, Public
     * @name MissionControllerGetTaskApyV1
     * @summary Get reward APY breakdown for a single task within a mission
     * @request GET:/v1/mission/{slug}/task/{identifier}/apy
     */
    missionControllerGetTaskApyV1: (
      slug: string,
      identifier: string,
      params: RequestParams = {},
    ) =>
      this.request<MissionApyResponse, any>({
        path: `/v1/mission/${slug}/task/${identifier}/apy`,
        method: 'GET',
        format: 'json',
        ...params,
      }),
  };
  limitOrder = {
    /**
     * No description
     *
     * @tags Orders, Public
     * @name OrdersControllerCancelOrderStepTransaction
     * @summary Get calldata/typed data to cancel a limit order
     * @request POST:/limit-order/order/cancel/calldata
     */
    ordersControllerCancelOrderStepTransaction: (
      data: CancelStepTransactionRequestDto,
      params: RequestParams = {},
    ) =>
      this.request<CancelStepTransactionResponseDto, any>({
        path: `/limit-order/order/cancel/calldata`,
        method: 'POST',
        body: data,
        type: ContentType.Json,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags Orders, Public
     * @name OrdersControllerCancelOrderRelay
     * @summary Relay a signed limit order cancellation
     * @request POST:/limit-order/order/cancel/relay
     */
    ordersControllerCancelOrderRelay: (
      data: CancelRelayRequestDto,
      params: RequestParams = {},
    ) =>
      this.request<RelayResponseDto, any>({
        path: `/limit-order/order/cancel/relay`,
        method: 'POST',
        body: data,
        type: ContentType.Json,
        format: 'json',
        ...params,
      }),

    /**
     * @description Orders are fetched per protocol and merged by creation time. `limit`/`offset` apply per protocol, so up to limit × number-of-protocols items may be returned. Advance `offset` by `limit` to page.
     *
     * @tags Orders, Public
     * @name OrdersControllerGetOrdersByUser
     * @summary List limit orders for a user address
     * @request GET:/limit-order/orders/{tool}/{address}
     */
    ordersControllerGetOrdersByUser: (
      tool: string,
      address: string,
      query?: {
        /**
         * Filter by chain IDs
         * @example [1,10,137]
         */
        chainIds?: number[];
        /** Filter by status */
        status?: (
          | 'pending'
          | 'active'
          | 'partially_filled'
          | 'filled'
          | 'cancelled'
          | 'expired'
        )[];
        /** Filter by from token address */
        fromTokenAddress?: string;
        /** Filter by to token address */
        toTokenAddress?: string;
        /**
         * Max results per protocol (not the total). Applied independently to each queried protocol, so a response may contain up to limit × number-of-protocols items.
         * @default 10
         */
        limit?: number;
        /** Opaque order cursor for order pagination. Pass the `nextCursor` from the previous response to fetch the next page; omit for the first page. */
        cursor?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<LimitOrdersListResponse, any>({
        path: `/limit-order/orders/${tool}/${address}`,
        method: 'GET',
        query: query,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags Orders, Public
     * @name OrdersControllerGetOrder
     * @summary Get a single limit order by protocol/chain/id
     * @request GET:/limit-order/order/{tool}/{chainId}/{orderId}
     */
    ordersControllerGetOrder: (
      tool: string,
      chainId: number,
      orderId: string,
      params: RequestParams = {},
    ) =>
      this.request<LimitOrder, any>({
        path: `/limit-order/order/${tool}/${chainId}/${orderId}`,
        method: 'GET',
        format: 'json',
        ...params,
      }),
  };
}
