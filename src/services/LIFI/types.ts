

export type Order = 'BEST_VALUE' | 'BEST_FEE' | 'BEST_FEE_GAS' // FAST, LESS_INTERACTIONS, SECURITY, ....

export interface RouteOptions {
  order?: Order               // (default : BEST_VALUE)
  slippage?: number           // (default : 3.0)
  infiniteApproval?: boolean  // (default : false)
  allowSwitchChain?: boolean  // (default : false) // eg. on mobile wallets and not metamask wallets we can't automatically change chains
  encryptionSupport?: boolean // (default : false)
  allowLiFiContract?: boolean // (default : false) // while in beta
  bridges?: string[]          // (default: [all]) horizon (withlist), -hop (blacklist), +nxtp (preferr)
  exchanges?: string[]        // (default: [all]) uniswap (withlist), -sushi (blacklist), +paraswap (preferr), uniswap=all uniswap instances, uniswap-pol=specific uniswap instance
}

export interface RoutesRequest {
  fromChainId: number
  fromAmount: string
  fromTokenAddress: string
  fromTokenDecimals?: number
  fromAddress?: string

  toChainId: number
  toTokenAddress: string
  toTokenDecimals?: number
  toAddress?: string

  options?: RouteOptions
}
