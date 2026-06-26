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

export interface AllowDenyPreferDto {
  /**
   * Allowed protocols (default: all)
   * @example ["cowswap","1inch"]
   */
  allow?: string[];
  /**
   * Denied protocols (default: none)
   * @example ["cowswap"]
   */
  deny?: string[];
  /**
   * Preferred protocols - use if available, fall back to others
   * @example ["1inch"]
   */
  prefer?: string[];
}

export interface OrderRouteOptionsDto {
  /** Exchange/protocol filtering options */
  exchanges?: AllowDenyPreferDto;
}

export interface OrderRoutesDto {
  /**
   * Source chain ID
   * @example 1
   */
  fromChainId: number;
  /**
   * User wallet address
   * @example "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb"
   */
  fromAddress?: string;
  /** From token address */
  fromTokenAddress: string;
  /**
   * From token amount (in wei)
   * @example "1000000000"
   */
  fromAmount: string;
  /**
   * Destination chain ID
   * @example 1
   */
  toChainId: number;
  /** Receiver address (if different from user) */
  toAddress?: string;
  /** To token address */
  toTokenAddress: string;
  /**
   * To token amount (desired output amount)
   * @example "1500000000"
   */
  toAmount: string;
  /**
   * Unix timestamp (in seconds) until which the order should be valid
   * @example 1780000000
   */
  validUntil: number;
  /**
   * Allow partial fills
   * @default true
   */
  partiallyFillable?: boolean;
  /** Route options for exchange selection */
  options?: OrderRouteOptionsDto;
  /**
   * Integrator identifier
   * @example "jumper.exchange"
   */
  integrator?: string;
  /**
   * Referrer identifier
   * @example "jmp"
   */
  referrer?: string;
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
    | 'SUI'
    | 'BTC'
    | 'BCH'
    | 'LTC'
    | 'DOGE'
    | 'TRX'
    | 'WTRX'
    | 'XAUt'
    | 'HEMI'
    | 'USDT'
    | 'USDC'
    | 'BUSD'
    | 'USDCe'
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

export interface ActionDto {
  /**
   * Chain ID
   * @example 1
   */
  fromChainId: number;
  /** Source token */
  fromToken: TokenDto;
  /**
   * Amount to sell (in wei)
   * @example "1000000000000000000"
   */
  fromAmount: string;
  /** Sender address */
  fromAddress?: string;
  /**
   * Chain ID
   * @example 1
   */
  toChainId: number;
  /** Destination token */
  toToken: TokenDto;
  /**
   * Desired limit order amount (in wei)
   * @example "1500000000"
   */
  toAmount: string;
  /** Recipient address */
  toAddress: string;
  /**
   * Unix timestamp (in seconds) until which the order is valid
   * @example 1780000000
   */
  validUntil: number;
  /** Whether partial fills are allowed */
  partiallyFillable: boolean;
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

export interface OrderEstimateDto {
  /** Tool providing the estimate */
  tool: '1inch' | 'cowswap';
  /**
   * Amount to sell (in wei)
   * @example "1000000000000000000"
   */
  fromAmount: string;
  /**
   * Amount to sell in USD
   * @example "1000.00"
   */
  fromAmountUSD?: string;
  /**
   * Expected output amount (in wei)
   * @example "1500000000"
   */
  toAmount: string;
  /**
   * Expected output amount in USD
   * @example "1500.00"
   */
  toAmountUSD?: string;
  /**
   * Address to approve tokens to
   * @example "0x1111111254EEB25477B68fb85Ed929f73A960582"
   */
  approvalAddress?: string;
  /** Whether the approval needs to be reset to 0 first (legacy ERC-20) */
  approvalReset?: boolean;
  /** Skip token approval (e.g. for Hyperliquid) */
  skipApproval?: boolean;
  /** Skip permit usage for some HyperEVM transactions */
  skipPermit?: boolean;
  /** Fee costs breakdown */
  feeCosts?: FeeCostDto[];
  /** Gas costs breakdown */
  gasCosts?: GasCostDto[];
  /**
   * Likelihood of order execution
   * @example "high"
   */
  executionLikelihood?: 'high' | 'medium' | 'low';
  /**
   * Reason for execution likelihood assessment
   * @example "Order price is close to market price"
   */
  executionLikelihoodReason?: string;
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

export interface StepToolDetailsDto {
  /** Tool identifier key */
  key: string;
  /** Human-readable tool name */
  name: string;
  /** Tool logo URI */
  logoURI: string;
}

export interface OrderStepDto {
  /** Internal quote cache identifier */
  id?: string;
  /** Order action details */
  action: ActionDto;
  /** Execution estimate (LiFi Estimate type) */
  estimate?: OrderEstimateDto;
  /** Tool/protocol identifier */
  tool: '1inch' | 'cowswap';
  /** Transaction request to execute (for on-chain orders) */
  transactionRequest?: TransactionRequestDto;
  /** EIP-712 typed data to sign (for signature-based orders) */
  typedData?: object[];
  /** Tool details (bridge/DEX metadata) */
  toolDetails: StepToolDetailsDto;
  /** Integrator identifier */
  integrator?: string;
  /** Referrer identifier */
  referrer?: string;
}

export interface OrderRouteDto {
  /** Unique route identifier */
  id: string;
  /** Source chain ID */
  fromChainId: number;
  /** From amount in USD */
  fromAmountUSD: string;
  /** From amount in wei */
  fromAmount: string;
  /** Source token */
  fromToken: TokenDto;
  /** Sender address */
  fromAddress?: string;
  /** Destination chain ID */
  toChainId: number;
  /** To amount in USD */
  toAmountUSD: string;
  /** To amount in wei */
  toAmount: string;
  /** Minimum to amount in wei */
  toAmountMin: string;
  /** Destination token */
  toToken: TokenDto;
  /** Recipient address */
  toAddress?: string;
  /** Aggregated gas cost in USD */
  gasCostUSD?: string;
  /** Whether the route requires a chain switch */
  containsSwitchChain?: boolean;
  /** Route tags */
  tags?: ('RECOMMENDED' | 'FASTEST' | 'CHEAPEST' | 'SAFEST')[];
  /** Ordered list of steps to execute */
  steps: OrderStepDto[];
}

export interface FilteredProtocolDto {
  /** Protocol that was filtered out */
  tool: '1inch' | 'cowswap';
  /** Reason for filtering */
  reason: string;
}

export interface FailedRouteDto {
  /** Protocol that failed */
  tool: '1inch' | 'cowswap';
  /** Error message */
  message: string;
  /** Error code */
  code: string;
}

export interface UnavailableRoutesDto {
  /** Tools filtered out based on user preferences */
  filteredOut: FilteredProtocolDto[];
  /** Tools that failed to provide quotes */
  failed: FailedRouteDto[];
}

export interface OrderRoutesResponseDto {
  /** Available routes for this order */
  routes: OrderRouteDto[];
  /** Unavailable routes with reasons */
  unavailableRoutes: UnavailableRoutesDto;
}

export interface StepTransactionRequestDto {
  /** Internal quote cache identifier */
  id?: string;
  /** Order action details */
  action: ActionDto;
  /** Execution estimate (LiFi Estimate type) */
  estimate?: OrderEstimateDto;
  /** Tool/protocol identifier */
  tool: '1inch' | 'cowswap';
  /** Transaction request to execute (for on-chain orders) */
  transactionRequest?: TransactionRequestDto;
  /** EIP-712 typed data to sign (for signature-based orders) */
  typedData?: object[];
  /** Tool details (bridge/DEX metadata) */
  toolDetails: StepToolDetailsDto;
  /** Integrator identifier */
  integrator?: string;
  /** Referrer identifier */
  referrer?: string;
}

export interface StepTransactionResponseDto {
  /** Internal quote cache identifier */
  id?: string;
  /** Order action details */
  action: ActionDto;
  /** Execution estimate (LiFi Estimate type) */
  estimate?: OrderEstimateDto;
  /** Tool/protocol identifier */
  tool: '1inch' | 'cowswap';
  /** Transaction request to execute (for on-chain orders) */
  transactionRequest?: TransactionRequestDto;
  /** EIP-712 typed data to sign (for signature-based orders) */
  typedData?: object[];
  /** Tool details (bridge/DEX metadata) */
  toolDetails: StepToolDetailsDto;
  /** Integrator identifier */
  integrator?: string;
  /** Referrer identifier */
  referrer?: string;
}

export interface RelayRequestDto {
  /** Internal quote cache identifier */
  id?: string;
  /** Order action details */
  action: ActionDto;
  /** Execution estimate (LiFi Estimate type) */
  estimate?: OrderEstimateDto;
  /** Tool/protocol identifier */
  tool: '1inch' | 'cowswap';
  /** Transaction request to execute (for on-chain orders) */
  transactionRequest?: TransactionRequestDto;
  /** Signed EIP-712 typed data (required for relay) */
  typedData?: object[];
  /** Tool details (bridge/DEX metadata) */
  toolDetails: StepToolDetailsDto;
  /** Integrator identifier */
  integrator?: string;
  /** Referrer identifier */
  referrer?: string;
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

export interface RelayerStatusResponseDto {
  /** Response status discriminant */
  status: 'ok' | 'error';
  /** Relay status data, or error details when status is "error" */
  data: any;
}

export interface StatusResponseDto {
  /** Order execution status */
  status: 'NOT_FOUND' | 'INVALID' | 'PENDING' | 'DONE' | 'FAILED';
  /** Unique identifier for the order */
  orderId?: object;
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

export interface CancelEstimateDto {
  /** Fee costs breakdown */
  feeCosts?: FeeCostDto[];
  /** Gas costs breakdown */
  gasCosts?: GasCostDto[];
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

export interface TokensResponseDto {
  /** Mapping of chain IDs to their supported tokens */
  tokens: object;
}

export interface Order {
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
 * @title Limit Orders API
 * @version 1.0
 * @contact
 *
 * Unified API for limit order aggregation across multiple protocols (1inch & CoW Swap)
 */
export class JumperLimitOrder<
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
  limitOrder = {
    /**
     * @description Returns all available routes with quotes from different protocols to help users make informed decisions
     *
     * @tags orders
     * @name OrdersControllerGetRoutes
     * @summary Get available routes for order execution
     * @request POST:/limit-order/advanced/routes
     */
    ordersControllerGetRoutes: (
      data: OrderRoutesDto,
      params: RequestParams = {},
    ) =>
      this.request<OrderRoutesResponseDto, void>({
        path: `/limit-order/advanced/routes`,
        method: 'POST',
        body: data,
        type: ContentType.Json,
        format: 'json',
        ...params,
      }),

    /**
     * @description Returns the transactionRequest/typedData needed to sign and execute a step
     *
     * @tags orders
     * @name OrdersControllerStepTransaction
     * @summary Get execution details for a step
     * @request POST:/limit-order/advanced/stepTransaction
     */
    ordersControllerStepTransaction: (
      data: StepTransactionRequestDto,
      params: RequestParams = {},
    ) =>
      this.request<StepTransactionResponseDto, void>({
        path: `/limit-order/advanced/stepTransaction`,
        method: 'POST',
        body: data,
        type: ContentType.Json,
        format: 'json',
        ...params,
      }),

    /**
     * @description Submits a signed order to the protocol orderbook
     *
     * @tags orders
     * @name OrdersControllerRelay
     * @summary Relay a signed order
     * @request POST:/limit-order/advanced/relay
     */
    ordersControllerRelay: (
      data: RelayRequestDto,
      params: RequestParams = {},
    ) =>
      this.request<RelayResponseDto, void>({
        path: `/limit-order/advanced/relay`,
        method: 'POST',
        body: data,
        type: ContentType.Json,
        format: 'json',
        ...params,
      }),

    /**
     * @description Retrieves the current status of a task submitted via /advanced/relay
     *
     * @tags orders
     * @name OrdersControllerRelayerStatus
     * @summary Get the status of a relayed order
     * @request GET:/limit-order/relayer/status
     */
    ordersControllerRelayerStatus: (
      query: {
        /** Unique identifier for the task to check */
        taskId: string;
        /** Tool/bridge identifier */
        bridge?: string;
        /** Source chain ID */
        fromChain?: number;
        /** Destination chain ID */
        toChain?: number;
      },
      params: RequestParams = {},
    ) =>
      this.request<RelayerStatusResponseDto, void>({
        path: `/limit-order/relayer/status`,
        method: 'GET',
        query: query,
        format: 'json',
        ...params,
      }),

    /**
     * @description Retrieves the status of an order by task ID or transaction hash
     *
     * @tags orders
     * @name OrdersControllerOrderStatus
     * @summary Get order status
     * @request GET:/limit-order/status
     */
    ordersControllerOrderStatus: (
      query: {
        /** Tool/bridge identifier (e.g. "1inch", "cowswap") */
        bridge: string;
        /** Source chain ID */
        fromChain?: number;
        /** Destination chain ID */
        toChain?: number;
        /** Task ID from relay step (provide taskId or txHash) */
        taskId?: string;
        /** On-chain transaction hash (provide taskId or txHash) */
        txHash?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<StatusResponseDto, void>({
        path: `/limit-order/status`,
        method: 'GET',
        query: query,
        format: 'json',
        ...params,
      }),

    /**
     * @description Returns the transaction data needed to cancel a limit order
     *
     * @tags orders
     * @name OrdersControllerCancelCalldata
     * @summary Get cancellation calldata for an order
     * @request POST:/limit-order/cancel/calldata
     */
    ordersControllerCancelCalldata: (
      data: CancelStepTransactionRequestDto,
      params: RequestParams = {},
    ) =>
      this.request<CancelStepTransactionResponseDto, void>({
        path: `/limit-order/cancel/calldata`,
        method: 'POST',
        body: data,
        type: ContentType.Json,
        format: 'json',
        ...params,
      }),

    /**
     * @description Relays a signed cancellation to the protocol orderbook
     *
     * @tags orders
     * @name OrdersControllerCancelOrderRelay
     * @summary Relay a signed order cancellation
     * @request POST:/limit-order/cancel/relay
     */
    ordersControllerCancelOrderRelay: (
      data: CancelRelayRequestDto,
      params: RequestParams = {},
    ) =>
      this.request<RelayResponseDto, void>({
        path: `/limit-order/cancel/relay`,
        method: 'POST',
        body: data,
        type: ContentType.Json,
        format: 'json',
        ...params,
      }),

    /**
     * @description Retrieves all supported chains, optionally filtered by chain type
     *
     * @tags orders
     * @name OrdersControllerGetChains
     * @summary Get supported chains for limit orders
     * @request GET:/limit-order/chains
     */
    ordersControllerGetChains: (
      query?: {
        /** Type of chains to filter */
        chainTypes?: string[];
      },
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/limit-order/chains`,
        method: 'GET',
        query: query,
        ...params,
      }),

    /**
     * @description Retrieves all supported tokens, optionally filtered by chain
     *
     * @tags orders
     * @name OrdersControllerGetTokens
     * @summary Get supported tokens for limit orders
     * @request GET:/limit-order/tokens
     */
    ordersControllerGetTokens: (
      query?: {
        /** Filter by chain type */
        chainTypes?: ('EVM' | 'SVM')[];
        /**
         * Filter by chain ID
         * @example [1,10,137]
         */
        chains?: number[];
        /** Order by criteria */
        orderBy?: 'name' | 'amount' | 'price';
        /**
         * Maximum number of tokens to retrieve
         * @default 100
         */
        limit?: number;
        /**
         * Include extended token information
         * @default false
         */
        extended?: boolean;
      },
      params: RequestParams = {},
    ) =>
      this.request<TokensResponseDto[], any>({
        path: `/limit-order/tokens`,
        method: 'GET',
        query: query,
        format: 'json',
        ...params,
      }),

    /**
     * @description Retrieves all orders for a specific user address
     *
     * @tags orders
     * @name OrdersControllerGetOrdersByUser
     * @summary Get orders by user address
     * @request GET:/limit-order/{address}
     */
    ordersControllerGetOrdersByUser: (
      address: string,
      query?: {
        /** Filter by tool/protocol */
        tools?: ('1inch' | 'cowswap')[];
        /**
         * Filter by chain IDs
         * @example [1,10,137]
         */
        chainIds?: number[];
        /** Filter by order status */
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
         * Maximum number of orders
         * @default 10
         */
        limit?: number;
        /**
         * Offset for pagination
         * @default 0
         */
        offset?: number;
      },
      params: RequestParams = {},
    ) =>
      this.request<Order[], any>({
        path: `/limit-order/${address}`,
        method: 'GET',
        query: query,
        format: 'json',
        ...params,
      }),

    /**
     * @description Retrieves an order by its ID for a specific tool and chain
     *
     * @tags orders
     * @name OrdersControllerGetOrder
     * @summary Get order by ID
     * @request GET:/limit-order/{tool}/{chainId}/{orderId}
     */
    ordersControllerGetOrder: (
      tool: '1inch' | 'cowswap',
      chainId: string,
      orderId: string,
      params: RequestParams = {},
    ) =>
      this.request<Order, void>({
        path: `/limit-order/${tool}/${chainId}/${orderId}`,
        method: 'GET',
        format: 'json',
        ...params,
      }),
  };
}
