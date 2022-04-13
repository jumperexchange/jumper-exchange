import { ChainId, getChainById } from '@lifinance/sdk'
import axios from 'axios'
import { ethers } from 'ethers'

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
  // Contract Security (https://docs.gopluslabs.io/reference/token-info-response-detail/contract-security)
  is_open_source: string
  is_proxy?: string
  is_mintable?: string
  owner_address: string
  can_take_back_ownership?: string
  owner_change_balance?: string

  // Trading Security (https://docs.gopluslabs.io/reference/token-info-response-detail/trading-security)
  buy_tax?: string
  sell_tax?: string
  cannot_sell_all?: string
  slippage_modifiable?: string
  is_honeypot?: string
  transfer_pausable?: string
  is_blacklisted?: string // holder list in contract
  is_whitelisted?: string // holder list in contract
  is_in_dex: string
  dex: Dex[]
  anti_whale?: string

  // Info Security (https://docs.gopluslabs.io/reference/token-info-response-detail/info-security)
  token_name: string
  token_symbol: string
  holder_count: string // number
  total_supply: string
  holders: Holder[] // top 10
  owner_balance?: string // number
  owner_percent?: string // float
  creator_address: string
  creator_balance?: string // number
  creator_percent?: string // float
  lp_holder_count?: string // number
  lp_total_supply?: string // float
  lp_holders?: Holder[]
  is_true_token?: string // boolean
  is_airdrop_scam?: string // boolean
  trust_list?: string // boolean
}
interface TokenSecurityData {
  // Contract Security
  is_open_source: boolean
  is_proxy?: boolean
  is_mintable?: boolean
  owner_address?: string
  can_take_back_ownership?: boolean
  owner_change_balance?: boolean

  // Trading Security
  buy_tax?: boolean
  sell_tax?: boolean
  cannot_sell_all?: boolean
  slippage_modifiable?: boolean
  is_honeypot?: boolean
  transfer_pausable?: boolean
  is_blacklisted?: boolean // holder list in contract
  is_whitelisted?: boolean // holder list in contract
  is_in_dex: boolean
  dex: Dex[]
  anti_whale?: boolean

  // Info Security
  token_name: string
  token_symbol: string
  holder_count: string // number
  total_supply: string
  holders: Holder[] // top 10
  owner_balance?: string // number
  owner_percent?: string // float
  creator_address: string
  creator_balance?: string // number
  creator_percent?: string // float
  lp_holder_count?: string // number
  lp_total_supply?: string // float
  lp_holders?: Holder[]
  is_true_token?: boolean
  is_airdrop_scam?: boolean
  trust_list?: boolean
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
const stringToBooleanOptional = (input?: string): boolean | undefined => {
  if (input === undefined) {
    return undefined
  }
  return stringToBoolean(input)
}

const parseTokenSecurityDataRaw = (data: TokenSecurityDataRaw): TokenSecurityData => {
  return {
    ...data,

    // Contract Security
    is_open_source: stringToBoolean(data.is_open_source),
    is_proxy: stringToBooleanOptional(data.is_proxy),
    is_mintable: stringToBooleanOptional(data.is_mintable),
    owner_address: data.owner_address !== '' ? data.owner_address : undefined,
    can_take_back_ownership: stringToBooleanOptional(data.can_take_back_ownership),
    owner_change_balance: stringToBooleanOptional(data.owner_change_balance),

    // Trading Security
    buy_tax: stringToBooleanOptional(data.buy_tax),
    sell_tax: stringToBooleanOptional(data.sell_tax),
    cannot_sell_all: stringToBooleanOptional(data.cannot_sell_all),
    slippage_modifiable: stringToBooleanOptional(data.slippage_modifiable),
    is_honeypot: stringToBooleanOptional(data.is_honeypot),
    transfer_pausable: stringToBooleanOptional(data.transfer_pausable),
    is_blacklisted: stringToBooleanOptional(data.is_blacklisted),
    is_whitelisted: stringToBooleanOptional(data.is_whitelisted),
    is_in_dex: stringToBoolean(data.is_open_source),
    anti_whale: stringToBooleanOptional(data.anti_whale),

    // Info Security
    is_true_token: stringToBooleanOptional(data.is_true_token),
    is_airdrop_scam: stringToBooleanOptional(data.is_airdrop_scam),
    trust_list: stringToBooleanOptional(data.trust_list),
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

  if (data.is_airdrop_scam === true || data.is_true_token === false) {
    return false // clearly scam
  }
  if (data.trust_list === true || data.is_true_token === true) {
    return true // trusted
  }

  if (data.sell_tax === true || data.buy_tax === true) {
    return false // can't be used and potential scam
  }
  if (data.owner_change_balance === true) {
    return false // owner can steal funds
  }
  if (data.is_honeypot === true) {
    return false
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
