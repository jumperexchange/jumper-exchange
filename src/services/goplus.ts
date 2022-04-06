import { ChainId, getChainById } from '@lifinance/sdk'
import axios from 'axios'
import { ethers } from 'ethers'
import { isSharedArrayBuffer } from 'util/types'

const API = 'https://api.gopluslabs.io/api/v1'

const SUPPORTED_CHAINS = [
  ChainId.ETH,
  ChainId.BSC,
  ChainId.HEC,
  ChainId.POL,
  ChainId.ARB,
  ChainId.AVA,
]

// Data format is incomplete and based on sample requests
// Based on the chain responses may contain more or less data
// The documentation does not contain information about what variables are available where:
// https://docs.gopluslabs.io/reference/token-info-response-detail
interface Holder {
  address: string
  is_locked: boolean
  tag: string
  is_contract: boolean
  balance: string // float
  percent: string // float
}
interface Dex {
  name: string
  liquidity: string // float
  pair: string
}
interface TokenSecurityDataRaw {
  is_airdrop_scam: string
  buy_tax: string
  cannot_sell_all: string
  creator_address: string
  creator_balance: string // float
  creator_percent: string // float
  dex: Dex[]
  holder_count: string
  holders: Holder[]
  is_in_dex: string
  is_open_source: string
  is_proxy: string
  lp_holder_count: string
  lp_holders: Holder[]
  lp_total_supply: string // float
  owner_address: string
  owner_balance: string
  owner_percent: string
  sell_tax: string
  total_supply: string
  token_name: string
  token_symbol: string
}
interface TokenSecurityData {
  is_airdrop_scam: boolean
  buy_tax: boolean
  cannot_sell_all: boolean
  creator_address: string
  creator_balance: string // float
  creator_percent: string // float
  dex: Dex[]
  holder_count: string
  holders: Holder[]
  is_in_dex: boolean
  is_open_source: boolean
  is_proxy: boolean
  lp_holder_count: string
  lp_holders: Holder[]
  lp_total_supply: string // float
  owner_address: string
  owner_balance: string
  owner_percent: string
  sell_tax: boolean
  total_supply: string
  token_name: string
  token_symbol: string
}
export enum TokenSecurityState {
  SAFE = 'safe',
  UNSAFE = 'unsafe',
  UNVALIDATED = 'unvalidated',
}
export interface TokenSecurity {
  state: TokenSecurityState
  data?: TokenSecurityData
  explorerUrl: string
  goplusUrl?: string
}

const map: Record<number, Record<string, Promise<TokenSecurity>>> = {}

const stringToBoolean = (input: string): boolean => {
  return input === '1'
}

const parseTokenSecurityDataRaw = (data: TokenSecurityDataRaw): TokenSecurityData => {
  return {
    ...data,
    is_airdrop_scam: stringToBoolean(data.is_airdrop_scam),
    buy_tax: stringToBoolean(data.buy_tax),
    cannot_sell_all: stringToBoolean(data.cannot_sell_all),
    is_in_dex: stringToBoolean(data.is_in_dex),
    is_open_source: stringToBoolean(data.is_open_source),
    is_proxy: stringToBoolean(data.is_proxy),
    sell_tax: stringToBoolean(data.sell_tax),
  }
}

const loadTokenSecurity = async (
  chainId: ChainId,
  tokenAddress: string,
): Promise<TokenSecurityData | undefined> => {
  if (!SUPPORTED_CHAINS.includes(chainId)) {
    return undefined
  }

  interface TokenSecurityResponse {
    code: number // 1
    message: 'OK'
    result: Record<string, TokenSecurityDataRaw>
  }

  try {
    const result = await axios.get<TokenSecurityResponse>(
      `${API}/token_security/${chainId}?contract_addresses=${tokenAddress}`,
    )
    return parseTokenSecurityDataRaw(result.data.result[tokenAddress])
  } catch (e) {
    return undefined
  }
}

const isSafeToken = (data: TokenSecurityData) => {
  if (!data.is_open_source) {
    return false // unable to verify - dangerous
  }

  if (data.is_airdrop_scam) {
    return false // clearly scam
  }

  if (data.sell_tax || data.buy_tax) {
    return false // can't be used and potential scam
  }

  return true
}

const generateTokenSecurity = async (
  chainId: ChainId,
  tokenAddress: string,
): Promise<TokenSecurity> => {
  // handle native tokens
  if (tokenAddress === ethers.constants.AddressZero) {
    return {
      state: TokenSecurityState.SAFE,
      explorerUrl: `${getChainById(chainId).metamask.blockExplorerUrls[0]}address/${tokenAddress}`,
    }
  }

  const data = await loadTokenSecurity(chainId, tokenAddress)

  const secure = data ? isSafeToken(data) : false

  const tokenSecurity = {
    state: data
      ? secure
        ? TokenSecurityState.SAFE
        : TokenSecurityState.UNSAFE
      : TokenSecurityState.UNVALIDATED,
    data: data,
    explorerUrl: `${getChainById(chainId).metamask.blockExplorerUrls[0]}address/${tokenAddress}`,
    goplusUrl: data ? `https://gopluslabs.io/token-security/${chainId}/${tokenAddress}` : undefined,
  }
  return tokenSecurity
}

const getTokenSecurity = async (chainId: ChainId, tokenAddress: string): Promise<TokenSecurity> => {
  if (!map[chainId]) {
    map[chainId] = {}
  }
  if (!map[chainId][tokenAddress]) {
    map[chainId][tokenAddress] = generateTokenSecurity(chainId, tokenAddress)
  }
  return map[chainId][tokenAddress]
}

export const goplus = {
  getTokenSecurity,
}
