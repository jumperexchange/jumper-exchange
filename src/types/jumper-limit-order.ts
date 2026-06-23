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
  /** Protocol filtering options */
  protocols?: AllowDenyPreferDto;
}

export interface OrderRoutesDto {
  /**
   * User wallet address
   * @example "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb"
   */
  fromAddress: string;
  /** From token address */
  fromTokenAddress: string;
  /** To token address */
  toTokenAddress: string;
  /**
   * From token amount (in wei)
   * @example "1000000000"
   */
  fromAmount: string;
  /**
   * To token amount (desired output amount)
   * @example "1500000000"
   */
  toAmount: string;
  /** Receiver address (if different from user) */
  toAddress?: string;
  /**
   * Number of milliseconds the order is valid for
   * @example 30000
   */
  validFor?: number;
  /**
   * Allow partial fills
   * @default true
   */
  partiallyFillable?: boolean;
  /** Route options for protocol selection */
  options?: OrderRouteOptionsDto;
  /**
   * Chain ID
   * @example 1
   */
  chainId: number;
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
   * Token decimals
   * @example 6
   */
  decimals: number;
  /**
   * Token symbol
   * @example "USDC"
   */
  symbol?: string;
  /**
   * Token name
   * @example "USD Coin"
   */
  name?: string;
  /**
   * Token price in USD
   * @example "1.00"
   */
  priceUSD?: string;
}

export interface OrderActionDto {
  /**
   * Chain ID
   * @example 1
   */
  chainId: number;
  /** Source token */
  fromToken: TokenDto;
  /**
   * Amount to sell (in wei)
   * @example "1000000000000000000"
   */
  fromAmount: string;
  /**
   * Sender address
   * @example "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb"
   */
  fromAddress?: string;
  /** Destination token */
  toToken: TokenDto;
  /**
   * Desired limit order amount (in wei)
   * @example "1500000000"
   */
  toAmount: string;
  /**
   * Recipient address (if different from sender)
   * @example "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb"
   */
  toAddress?: string;
  /**
   * Quote validity duration in seconds
   * @example 300
   */
  validFor: number;
  /** Whether partial fills are allowed */
  partiallyFillable: boolean;
  /** EIP-712 typed data sent along with the action (usually permits) */
  typedData?: object[];
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
  /** Protocol providing the estimate */
  protocol: '1inch' | 'cowswap';
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
   * Minimum output amount (in wei)
   * @example "1485000000"
   */
  toAmountMin?: string;
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

export interface QuoteResponseDto {
  /**
   * Unique quote identifier
   * @example "quote-123e4567-e89b-12d3-a456-426614174000"
   */
  id: string;
  /** Order action details */
  action: OrderActionDto;
  /** Order estimate details */
  estimate: OrderEstimateDto;
}

export interface OrderRouteDto {
  /** Order quote with pricing details */
  quote: QuoteResponseDto;
  /** Protocol for this route */
  protocol: '1inch' | 'cowswap';
}

export interface FilteredProtocolDto {
  /** Protocol that was filtered out */
  protocol: '1inch' | 'cowswap';
  /** Reason for filtering */
  reason: string;
}

export interface OrderRouteErrorDto {
  /** Error code */
  code: string;
  /** Protocol that failed */
  protocol: '1inch' | 'cowswap';
  /** Error message */
  message: string;
}

export interface UnavailableRoutesDto {
  /** Protocols filtered out based on user preferences */
  filteredOut: FilteredProtocolDto[];
  /** Protocols that failed to provide quotes */
  failed: OrderRouteErrorDto[];
}

export interface OrderRoutesResponseDto {
  /** Available routes for this order */
  routes: OrderRouteDto[];
  /** Unavailable routes with reasons */
  unavailableRoutes: UnavailableRoutesDto;
}

export interface StepTransactionRequestDto {
  /**
   * Unique quote identifier
   * @example "quote-123e4567-e89b-12d3-a456-426614174000"
   */
  id: string;
  /** Order action details */
  action: OrderActionDto;
  /** Order estimate details */
  estimate: OrderEstimateDto;
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

export interface StepTransactionResponseDto {
  /**
   * Unique quote identifier
   * @example "quote-123e4567-e89b-12d3-a456-426614174000"
   */
  id: string;
  /** Order action details */
  action: OrderActionDto;
  /** Order estimate details */
  estimate: OrderEstimateDto;
  /** EIP-712 typed data to sign (for signature-based orders) */
  typedData?: object[];
  /** Transaction request to execute (for on-chain orders) */
  transactionRequest?: TransactionRequestDto;
}

export interface RelayRequestDto {
  /**
   * Unique quote identifier
   * @example "quote-123e4567-e89b-12d3-a456-426614174000"
   */
  id: string;
  /** Order action details */
  action: OrderActionDto;
  /** Order estimate details */
  estimate: OrderEstimateDto;
  /** EIP-712 typed data to sign (for signature-based orders) */
  typedData?: object[];
}

export interface RelayResponseDto {
  /**
   * Indicates if the submission was successful
   * @example true
   */
  success: boolean;
  /** Protocol providing the estimate */
  protocol: '1inch' | 'cowswap';
  /** Unique identifier for the task at hand */
  taskId: string;
}

export interface RelayerStatusRequestDto {
  /** Protocol providing the estimate */
  protocol: '1inch' | 'cowswap';
  /** Unique identifier for the task at hand */
  taskId: string;
  /**
   * Chain ID
   * @example 1
   */
  chainId: number;
}

export interface TransactionResponseDto {
  /** Transaction hash */
  txHash: string;
  /** Transaction request to execute (for on-chain orders) */
  request: TransactionRequestDto;
}

export interface StatusRequestDto {
  /** Protocol providing the estimate */
  protocol: '1inch' | 'cowswap';
  /**
   * Chain ID
   * @example 1
   */
  chainId: number;
  /** Unique identifier for the order */
  orderId?: object;
  /** Transaction response from on-chain executed transaction */
  transactionResponse?: TransactionResponseDto;
}

export interface StatusResponseDto {
  /**
   * Indicates if the submission was successful
   * @example true
   */
  success: boolean;
  /** Unique identifier for the order */
  orderId?: object;
}

export interface CancelStepTransactionRequestDto {
  /**
   * Chain ID
   * @example 1
   */
  chainId: number;
  /** Protocol providing the estimate */
  protocol: '1inch' | 'cowswap';
  /** Unique identifier for the order */
  orderId: string;
}

export interface CancelStepTransactionResponseDto {
  /**
   * Chain ID
   * @example 1
   */
  chainId: number;
  /** Protocol providing the estimate */
  protocol: '1inch' | 'cowswap';
  /** EIP-712 typed data to sign (for signature-based orders) */
  typedData?: object[];
  /** Transaction request to execute (for on-chain orders) */
  transactionRequest?: TransactionRequestDto;
}

export interface CancelRelayRequestDto {
  /**
   * Chain ID
   * @example 1
   */
  chainId: number;
  /** Protocol providing the estimate */
  protocol: '1inch' | 'cowswap';
  /** EIP-712 typed data to sign (for signature-based orders) */
  typedData?: object[];
  /** Transaction request to execute (for on-chain orders) */
  transactionRequest?: TransactionRequestDto;
}

export interface TokensResponseDto {
  /** Mapping of chain IDs to their supported tokens */
  tokens: object;
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
  orders = {
    /**
     * @description Returns all available routes with quotes from different protocols to help users make informed decisions
     *
     * @tags orders
     * @name OrdersControllerGetRoutes
     * @summary Get available routes for order execution
     * @request POST:/orders/routes
     */
    ordersControllerGetRoutes: (
      data: OrderRoutesDto,
      params: RequestParams = {},
    ) =>
      this.request<OrderRoutesResponseDto, void>({
        path: `/orders/routes`,
        method: 'POST',
        body: data,
        type: ContentType.Json,
        format: 'json',
        ...params,
      }),

    /**
     * @description Creates the execution data for a new limit order
     *
     * @tags orders
     * @name OrdersControllerStepTransaction
     * @summary Create a new limit order
     * @request POST:/orders/create
     */
    ordersControllerStepTransaction: (
      data: StepTransactionRequestDto,
      params: RequestParams = {},
    ) =>
      this.request<StepTransactionResponseDto, void>({
        path: `/orders/create`,
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
     * @summary Relay an order that is not a direct transaction
     * @request POST:/orders/relay
     */
    ordersControllerRelay: (
      data: RelayRequestDto,
      params: RequestParams = {},
    ) =>
      this.request<RelayResponseDto, void>({
        path: `/orders/relay`,
        method: 'POST',
        body: data,
        type: ContentType.Json,
        format: 'json',
        ...params,
      }),

    /**
     * @description Retrieves the status of a signed order from the protocol orderbook
     *
     * @tags orders
     * @name OrdersControllerRelayerStatus
     * @summary Gets the status of a relayed order
     * @request POST:/orders/relayerStatus
     */
    ordersControllerRelayerStatus: (
      data: RelayerStatusRequestDto,
      params: RequestParams = {},
    ) =>
      this.request<RelayResponseDto, void>({
        path: `/orders/relayerStatus`,
        method: 'POST',
        body: data,
        type: ContentType.Json,
        format: 'json',
        ...params,
      }),

    /**
     * @description Retrieves the status of a signed order from the protocol orderbook
     *
     * @tags orders
     * @name OrdersControllerOrderStatus
     * @summary Get order status
     * @request POST:/orders/status
     */
    ordersControllerOrderStatus: (
      data: StatusRequestDto,
      params: RequestParams = {},
    ) =>
      this.request<StatusResponseDto, void>({
        path: `/orders/status`,
        method: 'POST',
        body: data,
        type: ContentType.Json,
        format: 'json',
        ...params,
      }),

    /**
     * @description Creates the execution data for canceling a limit order step transaction
     *
     * @tags orders
     * @name OrdersControllerCancelOrderStepTransaction
     * @summary Cancel a limit order step transaction
     * @request POST:/orders/cancel/stepTransaction
     */
    ordersControllerCancelOrderStepTransaction: (
      data: CancelStepTransactionRequestDto,
      params: RequestParams = {},
    ) =>
      this.request<CancelStepTransactionResponseDto, void>({
        path: `/orders/cancel/stepTransaction`,
        method: 'POST',
        body: data,
        type: ContentType.Json,
        format: 'json',
        ...params,
      }),

    /**
     * @description Relays the cancellation of a limit order
     *
     * @tags orders
     * @name OrdersControllerCancelOrderRelay
     * @summary Relays a limit order cancellation
     * @request POST:/orders/cancel/relay
     */
    ordersControllerCancelOrderRelay: (
      data: CancelRelayRequestDto,
      params: RequestParams = {},
    ) =>
      this.request<RelayResponseDto, void>({
        path: `/orders/cancel/relay`,
        method: 'POST',
        body: data,
        type: ContentType.Json,
        format: 'json',
        ...params,
      }),

    /**
     * @description Retrieves all supported chains for limit orders, optionally filtered by chain type
     *
     * @tags orders
     * @name OrdersControllerGetChains
     * @summary Get supported chains for limit orders
     * @request GET:/orders/chains
     */
    ordersControllerGetChains: (
      query?: {
        /** Type of chains to filter */
        chainTypes?: string[];
      },
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/orders/chains`,
        method: 'GET',
        query: query,
        ...params,
      }),

    /**
     * @description Retrieves all supported tokens for limit orders, optionally filtered by chain
     *
     * @tags orders
     * @name OrdersControllerGetTokens
     * @summary Get supported tokens for limit orders
     * @request GET:/orders/tokens
     */
    ordersControllerGetTokens: (
      query?: {
        /** Filter By Chain type */
        chainTypes?: ('EVM' | 'SVM')[];
        /**
         * Filter by Chain Id
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
        path: `/orders/tokens`,
        method: 'GET',
        query: query,
        format: 'json',
        ...params,
      }),

    /**
     * @description Retrieves all orders for a specific user address and protocol
     *
     * @tags orders
     * @name OrdersControllerGetOrdersByUser
     * @summary Get orders by user address
     * @request GET:/orders/by-user/{address}
     */
    ordersControllerGetOrdersByUser: (
      address: string,
      query?: {
        /** Filter by protocol */
        protocols?: ('1inch' | 'cowswap')[];
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
      this.request<void, any>({
        path: `/orders/by-user/${address}`,
        method: 'GET',
        query: query,
        ...params,
      }),

    /**
     * @description Retrieves an order by its id for a specific protocol and chain
     *
     * @tags orders
     * @name OrdersControllerGetOrder
     * @summary Get order by id
     * @request GET:/orders/by-id/{protocol}/{chainId}/{orderId}
     */
    ordersControllerGetOrder: (
      protocol: '1inch' | 'cowswap',
      chainId: string,
      orderId: string,
      params: RequestParams = {},
    ) =>
      this.request<void, void>({
        path: `/orders/by-id/${protocol}/${chainId}/${orderId}`,
        method: 'GET',
        ...params,
      }),
  };
}
