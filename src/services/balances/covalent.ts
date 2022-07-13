import { ChainId, CoinKey, findTokenByChainIdAndAddress, TokenAmount } from '@lifi/sdk'
import axios from 'axios'
import BigNumber from 'bignumber.js'

// Documentation: https://www.covalenthq.com/docs/api/#/0/Class-A/Get-token-balances-for-address/lng=en
type CovalentResultItem = {
  contract_address: string
  contract_name: string
  contract_ticker_symbol: string
  contract_decimals: number
  logo_url: string
  balance: number
  quote_rate: number
}

type CovalentResult = {
  data: {
    items: CovalentResultItem[]
  }
}

const COVALENT_API_KEY = 'ckey_538ec97ac4594396bda51a91df1'
const COVALENT_API_URI = 'https://api.covalenthq.com/v1'
const COVALENT_SUPPORTED_CHAINS = [
  ChainId.ETH, // Ethereum Mainnet
  ChainId.POL, // Polygon/Matic Mainnet
  ChainId.BSC, // Binance Smart Chain
  ChainId.AVA, // Avalanche C-Chain Mainnet
  ChainId.FTM, // Fantom Opera Mainnet

  // Testnets
  ChainId.MUM, // Polygon/Matic Mumbai Testnet
  //43113,  // Fuji C-Chain Testnet
]

const getBalanceOnChain = async (walletAdress: string, chainId: number): Promise<TokenAmount[]> => {
  const url = `${COVALENT_API_URI}/${chainId}/address/${walletAdress}/balances_v2/?key=${COVALENT_API_KEY}`
  let result

  try {
    result = await axios.get<CovalentResult>(url)
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error(e)
    return []
  }

  const tokenAmounts: TokenAmount[] = []
  for (const covalentResult of result.data.data.items) {
    const localToken = findTokenByChainIdAndAddress(chainId, covalentResult.contract_address)
    const amount = new BigNumber(covalentResult.balance)
      .shiftedBy(-covalentResult.contract_decimals)
      .toString()
    const priceUSD = new BigNumber(covalentResult.quote_rate || 0).toString()

    if (localToken) {
      tokenAmounts.push({
        ...localToken,
        priceUSD,
        amount,
      })
    } else {
      tokenAmounts.push({
        address: covalentResult.contract_address,
        name: covalentResult.contract_name,
        coinKey: covalentResult.contract_ticker_symbol as CoinKey,
        chainId,
        symbol: covalentResult.contract_ticker_symbol,
        logoURI: covalentResult.logo_url,
        decimals: covalentResult.contract_decimals,
        priceUSD,
        amount,
      })
    }
  }

  return tokenAmounts
}

const getBalances = async (walletAdress: string, onChains?: ChainId[]): Promise<TokenAmount[]> => {
  let requestedChains: ChainId[]
  if (onChains) {
    requestedChains = onChains.filter((chainId) => {
      if (COVALENT_SUPPORTED_CHAINS.indexOf(chainId) !== -1) {
        return true
      } else {
        // eslint-disable-next-line no-console
        console.warn(`Trying to request unsupported chain ${chainId} from Covalent.`)
        return false
      }
    })
  } else {
    requestedChains = COVALENT_SUPPORTED_CHAINS
  }

  const promises: Promise<TokenAmount[]>[] = requestedChains.map((chainId) =>
    getBalanceOnChain(walletAdress, chainId),
  )

  const result = await Promise.all(promises)

  return result.flat()
}

export default {
  getBalances,
}
