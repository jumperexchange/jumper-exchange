/* eslint-disable */
/* tslint:disable */
// @ts-nocheck
/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API        ##
 * ##                                                           ##
 * ## AUTHOR: acacode                                           ##
 * ## SOURCE: https://github.com/acacode/swagger-typescript-api ##
 * ---------------------------------------------------------------
 */

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
  referrer: string;
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
  walletProvider: string;
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

export interface WalletVerificationDto {
  /** Origin wallet data */
  origin_wallet: WalletEVM;
  /** Destination wallet data */
  destination_wallet: WalletEVM;
}

export interface CreateWalletTransactionDto {
  sessionId: string;
  /**
   * The browser fingerprint of the user
   * @example "abc123"
   */
  browserFingerprint: string;
  action: string;
  /** Type of the transaction, e.g., 'evm', 'svm' */
  type: string;
  transactionHash?: string;
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
  toAmountFormatted?: string;
  gasCost?: number;
  gasCostFormatted?: string;
  gasCostUSD?: number;
  feeCost?: number;
  feeCostFormatted?: string;
  feeCostUSD?: number;
  /** @default 0 */
  stepNumber?: number;
  steps?: string;
  nbOfSteps?: number;
  stepIds?: string;
  lastStepAction?: string;
  routeId: string;
  exchange?: string;
  slippage?: number;
  tags?: string;
  time?: number;
  /** @default false */
  isFinal?: boolean;
  transactionId?: string;
  transactionLink?: string;
  errorCode?: object;
  errorMessage?: string;
  message?: string;
  status?: string;
  walletAddress: string;
  /**
   * Wallet provider of a user
   * @example "MetaMask"
   */
  walletProvider: string;
  integrator: string;
  url?: string;
  pathname?: string;
  referrer?: string;
  abtests?: object;
  /** @format date-time */
  timestamp: string;
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
   * Additional dynamic fields
   * @example {"customKey1":"value1","customKey2":"value2"}
   */
  additionalFields: object;
}

export interface Network {
  chainId: number;
  key: string;
}

export interface Token {
  name: string;
  symbol: string;
  decimals: number;
  logo: string;
  address: string;
  chain: Network;
}

export interface Protocol {
  name: string;
  product: string;
  version: string;
  logo: string;
}

export interface EarnOpportunity {
  name: string;
  network: Network;
  asset: Token;
  protocol: Protocol;
  url: string;
  description: string;
  tags: string[];
  rewards: string[];
  lpToken: Token;
  slug: string;
  featured: boolean;
}

export type WalletVerification = object;

export interface UpdateValidityDto {
  valid: boolean;
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

export interface HttpResponse<D extends unknown, E extends unknown = unknown>
  extends Response {
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
    headers: {},
    redirect: 'follow',
    referrerPolicy: 'no-referrer',
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
      const r = response.clone() as HttpResponse<T, E>;
      r.data = null as unknown as T;
      r.error = null as unknown as E;

      const data = !responseFormat
        ? r
        : await response[responseFormat]()
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
  healthcheck = {
    /**
     * No description
     *
     * @tags Healthcheck
     * @name AppControllerGetHello
     * @summary Healthcheck endpoint for kubernetes
     * @request GET:/healthcheck
     */
    appControllerGetHello: (params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/healthcheck`,
        method: 'GET',
        ...params,
      }),
  };
  database = {
    /**
     * No description
     *
     * @tags Database operations
     * @name DatabaseControllerRunMigrations
     * @summary [dev only] Running database migrations
     * @request GET:/database/run-migrations
     */
    databaseControllerRunMigrations: (params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/database/run-migrations`,
        method: 'GET',
        ...params,
      }),

    /**
     * No description
     *
     * @tags Database operations
     * @name DatabaseControllerSeedDatabase
     * @summary [dev only] Seed database with random data for X number of users
     * @request GET:/database/seed/{users}
     */
    databaseControllerSeedDatabase: (
      users: number,
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/database/seed/${users}`,
        method: 'GET',
        ...params,
      }),

    /**
     * No description
     *
     * @tags Database operations
     * @name DatabaseControllerCreateView
     * @summary Create materialized view for leaderboard
     * @request GET:/database/create-leaderboard-view
     */
    databaseControllerCreateView: (params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/database/create-leaderboard-view`,
        method: 'GET',
        ...params,
      }),

    /**
     * No description
     *
     * @tags Database operations
     * @name DatabaseControllerCreateViewForXp
     * @summary Create materialized view for XP
     * @request GET:/database/create-xp-view
     */
    databaseControllerCreateViewForXp: (params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/database/create-xp-view`,
        method: 'GET',
        ...params,
      }),

    /**
     * No description
     *
     * @tags Database operations
     * @name DatabaseControllerCreateViewForXpExtended
     * @summary Create materialized view for XP extended
     * @request GET:/database/create-xp-extended-view
     */
    databaseControllerCreateViewForXpExtended: (params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/database/create-xp-extended-view`,
        method: 'GET',
        ...params,
      }),

    /**
     * No description
     *
     * @tags Database operations
     * @name DatabaseControllerRefreshView
     * @summary Refresh materialized view for leaderboard
     * @request GET:/database/refresh-leaderboard-view
     */
    databaseControllerRefreshView: (params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/database/refresh-leaderboard-view`,
        method: 'GET',
        ...params,
      }),

    /**
     * No description
     *
     * @tags Database operations
     * @name DatabaseControllerRefreshViewForXp
     * @summary Refresh materialized view for xp
     * @request GET:/database/refresh-xp-view
     */
    databaseControllerRefreshViewForXp: (params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/database/refresh-xp-view`,
        method: 'GET',
        ...params,
      }),

    /**
     * No description
     *
     * @tags Database operations
     * @name DatabaseControllerRefreshViewForXpExtended
     * @summary Refresh materialized view for xp extended
     * @request GET:/database/refresh-xp-extended-view
     */
    databaseControllerRefreshViewForXpExtended: (params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/database/refresh-xp-extended-view`,
        method: 'GET',
        ...params,
      }),

    /**
     * No description
     *
     * @tags Database operations
     * @name DatabaseControllerMoveWalletRewards
     * @summary Move rewards from extended table and create users/wallets if necessary
     * @request GET:/database/move-wallet-rewards
     */
    databaseControllerMoveWalletRewards: (params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/database/move-wallet-rewards`,
        method: 'GET',
        ...params,
      }),

    /**
     * No description
     *
     * @tags Database operations
     * @name DatabaseControllerDropViewForXpExtended
     * @summary Drop materialized view for XP extended
     * @request GET:/database/drop-xp-extended-view
     */
    databaseControllerDropViewForXpExtended: (params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/database/drop-xp-extended-view`,
        method: 'GET',
        ...params,
      }),
  };
  v1 = {
    /**
     * No description
     *
     * @tags Users
     * @name UserControllerCreateEventV1
     * @summary Create new user event
     * @request POST:/v1/users/events
     */
    userControllerCreateEventV1: (
      data: CreateUserTrackingDto,
      params: RequestParams = {},
    ) =>
      this.request<UserTrackingEntity, any>({
        path: `/v1/users/events`,
        method: 'POST',
        body: data,
        type: ContentType.Json,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags Users
     * @name UserControllerFindOneByAddressV1
     * @summary Get user by wallet address
     * @request GET:/v1/users/{address}
     */
    userControllerFindOneByAddressV1: (
      address: string,
      params: RequestParams = {},
    ) =>
      this.request<UserEntity, void>({
        path: `/v1/users/${address}`,
        method: 'GET',
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags Users
     * @name UserControllerFindTraitsByUserIdV1
     * @summary Get traits by user id
     * @request GET:/v1/users/{userId}/traits
     * @secure
     */
    userControllerFindTraitsByUserIdV1: (
      userId: string,
      params: RequestParams = {},
    ) =>
      this.request<WalletTraitEntity, void>({
        path: `/v1/users/${userId}/traits`,
        method: 'GET',
        secure: true,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags PostHog
     * @name PostHogControllerGetFeatureFlagV1
     * @request GET:/v1/posthog/feature-flag
     */
    postHogControllerGetFeatureFlagV1: (
      query: {
        key: string;
        distinctId: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/v1/posthog/feature-flag`,
        method: 'GET',
        query: query,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Auth
     * @name AuthControllerLoginV1
     * @summary Login user
     * @request POST:/v1/auth/login
     */
    authControllerLoginV1: (
      data: {
        username: string;
        password: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<void, void>({
        path: `/v1/auth/login`,
        method: 'POST',
        body: data,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Auth
     * @name AuthControllerGenerateApiKeyV1
     * @summary Generate new API key
     * @request GET:/v1/auth/generate-api-key
     * @secure
     */
    authControllerGenerateApiKeyV1: (
      query: {
        name: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<void, void>({
        path: `/v1/auth/generate-api-key`,
        method: 'GET',
        query: query,
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Auth
     * @name AuthControllerGetApiKeyV1
     * @summary Get API key by name
     * @request GET:/v1/auth/get-api-key
     * @secure
     */
    authControllerGetApiKeyV1: (
      query: {
        name: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<void, void>({
        path: `/v1/auth/get-api-key`,
        method: 'GET',
        query: query,
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Auth
     * @name AuthControllerVerifyWalletV1
     * @summary Verify wallet
     * @request POST:/v1/auth/verify-wallet
     */
    authControllerVerifyWalletV1: (
      data: VerifyWalletDto,
      params: RequestParams = {},
    ) =>
      this.request<VerifyWalletDto, void>({
        path: `/v1/auth/verify-wallet`,
        method: 'POST',
        body: data,
        type: ContentType.Json,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags Auth
     * @name AuthControllerVerifyWalletsV1
     * @summary Verify two EVM wallets for migration
     * @request POST:/v1/auth/verify-wallets
     */
    authControllerVerifyWalletsV1: (
      data: WalletVerificationDto,
      params: RequestParams = {},
    ) =>
      this.request<void, void>({
        path: `/v1/auth/verify-wallets`,
        method: 'POST',
        body: data,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Wallets
     * @name WalletControllerGetWalletsByPointRangeV1
     * @summary Get wallets between a range of points
     * @request GET:/v1/wallets/points-range
     * @secure
     */
    walletControllerGetWalletsByPointRangeV1: (
      query: {
        minPoints: number;
        maxPoints: number;
        page: number;
        limit: number;
      },
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/v1/wallets/points-range`,
        method: 'GET',
        query: query,
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Wallets
     * @name WalletControllerCreateWalletTransactionV1
     * @summary Create new wallet transaction
     * @request POST:/v1/wallets/transactions
     */
    walletControllerCreateWalletTransactionV1: (
      data: CreateWalletTransactionDto,
      params: RequestParams = {},
    ) =>
      this.request<CreateWalletTransactionDto, any>({
        path: `/v1/wallets/transactions`,
        method: 'POST',
        body: data,
        type: ContentType.Json,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags Wallets
     * @name WalletControllerFindWalletTransactionsByWalletAddressV1
     * @summary Get wallet transactions by wallet address
     * @request GET:/v1/wallets/transactions/{address}
     */
    walletControllerFindWalletTransactionsByWalletAddressV1: (
      address: string,
      params: RequestParams = {},
    ) =>
      this.request<WalletTransactionEntity, any>({
        path: `/v1/wallets/transactions/${address}`,
        method: 'GET',
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags Wallets
     * @name WalletControllerFindWalletRewardsByRewardNameV1
     * @summary Get wallets by reward name
     * @request GET:/v1/wallets/rewards/{name}
     * @secure
     */
    walletControllerFindWalletRewardsByRewardNameV1: (
      name: string,
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
      this.request<WalletRewardEntity, void>({
        path: `/v1/wallets/rewards/${name}`,
        method: 'GET',
        query: query,
        secure: true,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags Wallets
     * @name WalletControllerFindWalletRewardsByAddressV1
     * @summary Get wallet rewards by wallet address
     * @request GET:/v1/wallets/{address}/rewards
     */
    walletControllerFindWalletRewardsByAddressV1: (
      address: string,
      params: RequestParams = {},
    ) =>
      this.request<WalletRewardEntity, any>({
        path: `/v1/wallets/${address}/rewards`,
        method: 'GET',
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags Wallets
     * @name WalletControllerFindWalletTraitsByAddressV1
     * @summary Get wallet traits by wallet address
     * @request GET:/v1/wallets/{address}/traits
     */
    walletControllerFindWalletTraitsByAddressV1: (
      address: string,
      params: RequestParams = {},
    ) =>
      this.request<WalletTraitEntity, any>({
        path: `/v1/wallets/${address}/traits`,
        method: 'GET',
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags Wallets
     * @name WalletControllerFindWalletOngoingRewardsByAddressV1
     * @summary Get wallet rewards by wallet address
     * @request GET:/v1/wallets/{address}/ongoing-rewards
     */
    walletControllerFindWalletOngoingRewardsByAddressV1: (
      address: string,
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/v1/wallets/${address}/ongoing-rewards`,
        method: 'GET',
        ...params,
      }),

    /**
     * No description
     *
     * @tags Wallets
     * @name WalletControllerFindWalletFeatureCardsByAddressV1
     * @summary Get wallet feature cards by wallet address
     * @request GET:/v1/wallets/{address}/feature-cards
     */
    walletControllerFindWalletFeatureCardsByAddressV1: (
      address: string,
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/v1/wallets/${address}/feature-cards`,
        method: 'GET',
        ...params,
      }),

    /**
     * No description
     *
     * @tags Leaderboard
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
      this.request<LeaderboardEntity[], any>({
        path: `/v1/leaderboard`,
        method: 'GET',
        query: query,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags Leaderboard
     * @name LeaderboardControllerFindCenteredPaginationV1
     * @summary Leaderboard X/2 before and after from position X
     * @request GET:/v1/leaderboard/centered-pagination/{position}/{entries}
     */
    leaderboardControllerFindCenteredPaginationV1: (
      position: number,
      entries: number,
      params: RequestParams = {},
    ) =>
      this.request<LeaderboardEntity, void>({
        path: `/v1/leaderboard/centered-pagination/${position}/${entries}`,
        method: 'GET',
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags Leaderboard
     * @name LeaderboardControllerFindOneByAddressV1
     * @summary Get user leaderboard data by wallet address
     * @request GET:/v1/leaderboard/{address}
     */
    leaderboardControllerFindOneByAddressV1: (
      address: string,
      params: RequestParams = {},
    ) =>
      this.request<LeaderboardEntity, void>({
        path: `/v1/leaderboard/${address}`,
        method: 'GET',
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags Zaps
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
     * @tags TasksVerification
     * @name TasksVerificationControllerTaskVerificationV1
     * @summary Verify new quest
     * @request POST:/v1/tasks_verification
     */
    tasksVerificationControllerTaskVerificationV1: (
      data: TaskVerificationDto,
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/v1/tasks_verification`,
        method: 'POST',
        body: data,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags TasksVerification
     * @name TasksVerificationControllerGetTasksVerificationListV1
     * @summary Get tasks verification list
     * @request GET:/v1/tasks_verification/{questId}
     * @secure
     */
    tasksVerificationControllerGetTasksVerificationListV1: (
      questId: string,
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/v1/tasks_verification/${questId}`,
        method: 'GET',
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags TasksVerification
     * @name TasksVerificationControllerFindTaskVerificationV1
     * @summary Get user quest verification by wallet address
     * @request GET:/v1/tasks_verification/verify/{address}
     */
    tasksVerificationControllerFindTaskVerificationV1: (
      address: string,
      params: RequestParams = {},
    ) =>
      this.request<TaskVerificationEntity[], void>({
        path: `/v1/tasks_verification/verify/${address}`,
        method: 'GET',
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags Earn
     * @name EarnControllerGetTopsV1
     * @summary Get tops for an address
     * @request GET:/v1/earn/tops
     */
    earnControllerGetTopsV1: (
      query: {
        /**
         * The address to get tops for
         * @example "0x742d35Cc6634C0532925a3b8D598C2FF000f5E58"
         */
        address: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<EarnOpportunity[], any>({
        path: `/v1/earn/tops`,
        method: 'GET',
        query: query,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags Earn
     * @name EarnControllerFilterV1
     * @summary Filter earn opportunities
     * @request GET:/v1/earn/filter
     */
    earnControllerFilterV1: (
      query: {
        /**
         * The chain id to filter for
         * @example 1
         */
        chainId: number;
      },
      params: RequestParams = {},
    ) =>
      this.request<EarnOpportunity[], any>({
        path: `/v1/earn/filter`,
        method: 'GET',
        query: query,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags Earn
     * @name EarnControllerGetItemV1
     * @summary Get an earn opportunity by slug
     * @request GET:/v1/earn/items/{slug}
     */
    earnControllerGetItemV1: (slug: string, params: RequestParams = {}) =>
      this.request<EarnOpportunity, any>({
        path: `/v1/earn/items/${slug}`,
        method: 'GET',
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags Hacked Wallets
     * @name HackedWalletsControllerMigrateWalletRewardsV1
     * @summary Migrate wallet rewards from origin to destination wallet
     * @request POST:/v1/hacked-wallets/{verificationId}/migrate
     * @secure
     */
    hackedWalletsControllerMigrateWalletRewardsV1: (
      verificationId: number,
      params: RequestParams = {},
    ) =>
      this.request<void, void>({
        path: `/v1/hacked-wallets/${verificationId}/migrate`,
        method: 'POST',
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Hacked Wallets
     * @name HackedWalletsControllerGetPendingMigrationsV1
     * @summary Get all pending migrations
     * @request GET:/v1/hacked-wallets/pending
     * @secure
     */
    hackedWalletsControllerGetPendingMigrationsV1: (
      params: RequestParams = {},
    ) =>
      this.request<WalletVerification[], any>({
        path: `/v1/hacked-wallets/pending`,
        method: 'GET',
        secure: true,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags Hacked Wallets
     * @name HackedWalletsControllerGetMigratedMigrationsV1
     * @summary Get all migrated wallets
     * @request GET:/v1/hacked-wallets/migrated
     * @secure
     */
    hackedWalletsControllerGetMigratedMigrationsV1: (
      params: RequestParams = {},
    ) =>
      this.request<WalletVerification[], any>({
        path: `/v1/hacked-wallets/migrated`,
        method: 'GET',
        secure: true,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags Hacked Wallets
     * @name HackedWalletsControllerUpdateVerificationValidityV1
     * @summary Update verification validity status
     * @request POST:/v1/hacked-wallets/{verificationId}/validity
     * @secure
     */
    hackedWalletsControllerUpdateVerificationValidityV1: (
      verificationId: number,
      data: UpdateValidityDto,
      params: RequestParams = {},
    ) =>
      this.request<WalletVerification, void>({
        path: `/v1/hacked-wallets/${verificationId}/validity`,
        method: 'POST',
        body: data,
        secure: true,
        type: ContentType.Json,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags Hacked Wallets
     * @name HackedWalletsControllerGetAllVerificationsV1
     * @summary Get all wallet verifications
     * @request GET:/v1/hacked-wallets
     * @secure
     */
    hackedWalletsControllerGetAllVerificationsV1: (
      query?: {
        /**
         * Page number (default: 1)
         * @example 1
         */
        page?: number;
        /**
         * Items per page (default: 10, max: 100)
         * @example 10
         */
        limit?: number;
      },
      params: RequestParams = {},
    ) =>
      this.request<
        {
          results?: WalletVerification[];
          /** Total number of verifications */
          total?: number;
        },
        any
      >({
        path: `/v1/hacked-wallets`,
        method: 'GET',
        query: query,
        secure: true,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags Cache
     * @name CacheControllerClearRedisCacheV1
     * @summary Clear redis key
     * @request DELETE:/v1/cache/{redisKey}/clear
     * @secure
     */
    cacheControllerClearRedisCacheV1: (
      redisKey: string,
      params: RequestParams = {},
    ) =>
      this.request<void, void>({
        path: `/v1/cache/${redisKey}/clear`,
        method: 'DELETE',
        secure: true,
        ...params,
      }),
  };
  p = {
    /**
     * No description
     *
     * @tags Lifi proxy
     * @name LifiControllerPost
     * @request POST:/p/lifi/rpc/{chainId}
     */
    lifiControllerPost: (chainId: string, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/p/lifi/rpc/${chainId}`,
        method: 'POST',
        ...params,
      }),

    /**
     * No description
     *
     * @tags Lifi proxy
     * @name LifiControllerGetGet
     * @request GET:/p/lifi/{paths}
     */
    lifiControllerGetGet: (paths: string[], params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/p/lifi/${paths}`,
        method: 'GET',
        ...params,
      }),

    /**
     * No description
     *
     * @tags Lifi proxy
     * @name LifiControllerGetPost
     * @request POST:/p/lifi/{paths}
     */
    lifiControllerGetPost: (paths: string[], params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/p/lifi/${paths}`,
        method: 'POST',
        ...params,
      }),

    /**
     * No description
     *
     * @tags Lifi proxy
     * @name LifiControllerGetPut
     * @request PUT:/p/lifi/{paths}
     */
    lifiControllerGetPut: (paths: string[], params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/p/lifi/${paths}`,
        method: 'PUT',
        ...params,
      }),

    /**
     * No description
     *
     * @tags Lifi proxy
     * @name LifiControllerGetDelete
     * @request DELETE:/p/lifi/{paths}
     */
    lifiControllerGetDelete: (paths: string[], params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/p/lifi/${paths}`,
        method: 'DELETE',
        ...params,
      }),

    /**
     * No description
     *
     * @tags Lifi proxy
     * @name LifiControllerGetPatch
     * @request PATCH:/p/lifi/{paths}
     */
    lifiControllerGetPatch: (paths: string[], params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/p/lifi/${paths}`,
        method: 'PATCH',
        ...params,
      }),

    /**
     * No description
     *
     * @tags Lifi proxy
     * @name LifiControllerGetOptions
     * @request OPTIONS:/p/lifi/{paths}
     */
    lifiControllerGetOptions: (paths: string[], params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/p/lifi/${paths}`,
        method: 'OPTIONS',
        ...params,
      }),

    /**
     * No description
     *
     * @tags Lifi proxy
     * @name LifiControllerGetHead
     * @request HEAD:/p/lifi/{paths}
     */
    lifiControllerGetHead: (paths: string[], params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/p/lifi/${paths}`,
        method: 'HEAD',
        ...params,
      }),

    /**
     * No description
     *
     * @tags Lifi proxy
     * @name LifiControllerGetSearch
     * @request SEARCH:/p/lifi/{paths}
     */
    lifiControllerGetSearch: (paths: string[], params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/p/lifi/${paths}`,
        method: 'SEARCH',
        ...params,
      }),
  };
  zaps = {
    /**
     * No description
     *
     * @tags Zaps proxy
     * @name ZapsControllerGetGet
     * @request GET:/zaps/{paths}
     */
    zapsControllerGetGet: (paths: string, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/zaps/${paths}`,
        method: 'GET',
        ...params,
      }),

    /**
     * No description
     *
     * @tags Zaps proxy
     * @name ZapsControllerGetPost
     * @request POST:/zaps/{paths}
     */
    zapsControllerGetPost: (paths: string, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/zaps/${paths}`,
        method: 'POST',
        ...params,
      }),

    /**
     * No description
     *
     * @tags Zaps proxy
     * @name ZapsControllerGetPut
     * @request PUT:/zaps/{paths}
     */
    zapsControllerGetPut: (paths: string, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/zaps/${paths}`,
        method: 'PUT',
        ...params,
      }),

    /**
     * No description
     *
     * @tags Zaps proxy
     * @name ZapsControllerGetDelete
     * @request DELETE:/zaps/{paths}
     */
    zapsControllerGetDelete: (paths: string, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/zaps/${paths}`,
        method: 'DELETE',
        ...params,
      }),

    /**
     * No description
     *
     * @tags Zaps proxy
     * @name ZapsControllerGetPatch
     * @request PATCH:/zaps/{paths}
     */
    zapsControllerGetPatch: (paths: string, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/zaps/${paths}`,
        method: 'PATCH',
        ...params,
      }),

    /**
     * No description
     *
     * @tags Zaps proxy
     * @name ZapsControllerGetOptions
     * @request OPTIONS:/zaps/{paths}
     */
    zapsControllerGetOptions: (paths: string, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/zaps/${paths}`,
        method: 'OPTIONS',
        ...params,
      }),

    /**
     * No description
     *
     * @tags Zaps proxy
     * @name ZapsControllerGetHead
     * @request HEAD:/zaps/{paths}
     */
    zapsControllerGetHead: (paths: string, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/zaps/${paths}`,
        method: 'HEAD',
        ...params,
      }),

    /**
     * No description
     *
     * @tags Zaps proxy
     * @name ZapsControllerGetSearch
     * @request SEARCH:/zaps/{paths}
     */
    zapsControllerGetSearch: (paths: string, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/zaps/${paths}`,
        method: 'SEARCH',
        ...params,
      }),
  };
}
